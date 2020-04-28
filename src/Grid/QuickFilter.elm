module Grid.QuickFilter exposing (..)

import Css exposing (..)
import Dict exposing (Dict)
import Grid.Colors exposing (white)
import Grid.Html exposing (focusOn)
import Grid.Icons as Icons exposing (checkIcon, drawDarkSvg)
import Grid.Labels as Label exposing (localize)
import Html.Styled exposing (Attribute, Html, div, span, text)
import Html.Styled.Attributes exposing (class, css, id, tabindex)
import Html.Styled.Events exposing (onBlur, onClick)
import List exposing (take)
import Set exposing (Set)



-- TYPES --


type alias Model =
    { filteringValues : Set String
    , labels : Dict String String
    , maxX : Float
    , origin : Position
    , outputStrings : Set String
    , position : Position
    , propositions : List String
    , state : QuickFilterState
    , width : Float
    }


type QuickFilterState
    = Open
    | Closed


type Msg
    = FocusLost
    | NoOp
    | SetOrigin Position Float -- the second parameter is the X value above which the quick filter view would be outside of the grid container
    | SetPosition Position
    | UserClosedQuickFilter
    | UserOpenedQuickFilter
    | UserToggledEntry String


type alias Position =
    { x : Float
    , y : Float
    }



-- INIT --


maxQuickFilterPropositions =
    100


init : List String -> Maybe String -> Dict String String -> Float -> Model
init allValuesInColumn filteringString labels columnWidth =
    let
        values =
            allValuesInColumn
                |> take maxQuickFilterPropositions

        firstItem =
            List.head values
                |> Maybe.withDefault ""

        emptyLabel =
            localize Label.empty labels

        filterPropositions =
            if firstItem == "" then
                values
                    |> List.drop 1
                    |> (::) emptyLabel

            else
                values

        filteringValues =
            inputValues labels filteringString
    in
    { filteringValues = filteringValues
    , labels = labels
    , maxX = 0
    , origin = { x = 0, y = 0 }
    , outputStrings = filteringValues
    , position = { x = 0, y = 0 }
    , propositions = filterPropositions
    , state = Closed
    , width = columnWidth
    }


{-| Extract the values in an input filter as a list of strings
-}
inputValues : Dict String String -> Maybe String -> Set String
inputValues labels filteringValue =
    let
        orKeyword =
            --TODO mutualize
            " " ++ Label.localize Label.or labels ++ " "
    in
    filteringValue
        |> Maybe.withDefault ""
        |> String.split orKeyword
        |> List.filter (not << String.isEmpty)
        |> Set.fromList



-- UPDATE --


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UserClosedQuickFilter ->
            ( { model | state = Closed }
            , Cmd.none
            )

        FocusLost ->
            ( { model | state = Closed }
            , Cmd.none
            )

        NoOp ->
            ( model
            , Cmd.none
            )

        SetOrigin position maxX ->
            ( { model | origin = position, maxX = maxX }
            , focusOn openedQuickFilterHtmlId NoOp
            )

        SetPosition position ->
            ( { model | position = position }
            , focusOn openedQuickFilterHtmlId NoOp
            )

        UserOpenedQuickFilter ->
            ( { model | state = Open }
            , Cmd.none
            )

        UserToggledEntry entry ->
            let
                outputEntries =
                    if Set.member entry model.outputStrings then
                        Set.remove entry model.outputStrings

                    else
                        Set.insert entry model.outputStrings
            in
            ( { model | outputStrings = outputEntries }
            , Cmd.none
            )



-- VIEW --


view : Model -> Html Msg
view model =
    let
        params value =
            { selectedValues = model.filteringValues
            , emptyLabel = localize Label.empty model.labels
            , outputStrings = model.outputStrings
            , isCommand = False
            , label = value
            }

        x =
            model.position.x - model.origin.x

        popupPosition =
            { x =
                if x + model.width > model.maxX then
                    -- prevents popup to be partially hidden when on last colmun
                    x - model.width + Icons.width

                else
                    x
            , y = model.position.y - model.origin.y
            }
    in
    div
        [ quickFilterPopupStyles popupPosition model.width

        -- allow this div to receive focus (necessary to receive blur event)
        , tabindex 0
        , onBlur FocusLost
        , id openedQuickFilterHtmlId
        ]
    <|
        List.map (\value -> viewQuickFilterEntry (params value))
            model.propositions
            ++ viewEllipsis (List.length model.propositions) maxQuickFilterPropositions


quickFilterPopupStyles : Position -> Float -> Attribute Msg
quickFilterPopupStyles popupPosition columnWidth =
    css
        [ position absolute
        , left <| px popupPosition.x
        , top <| px popupPosition.y
        , zIndex (int 1000)
        , border3 (px 1) solid Grid.Colors.lightGrey2
        , margin auto
        , padding (px 5)
        , opacity (int 1)
        , width <| px <| max columnWidth 100
        , maxHeight <| px <| toFloat 400
        , backgroundColor white
        , overflowX hidden
        , overflowY auto
        , whiteSpace noWrap
        ]


viewEllipsis : Int -> Int -> List (Html msg)
viewEllipsis totalNumber actualNumber =
    if totalNumber > actualNumber then
        [ span [ css [ cursor auto ] ] [ text "..." ] ]

    else
        []


type alias ViewQuickFilterEntryParams =
    { emptyLabel : String
    , outputStrings : Set String
    , selectedValues : Set String
    , isCommand : Bool
    , label : String
    }


viewQuickFilterEntry : ViewQuickFilterEntryParams -> Html Msg
viewQuickFilterEntry params =
    let
        className =
            if params.isCommand || params.label == params.emptyLabel then
                "eag-quick-filter-control eag-quick-filter-entry"

            else
                "eag-quick-filter-entry"

        isSelected =
            Set.member params.label params.selectedValues

        selectionSymbol =
            if isSelected then
                drawDarkSvg Icons.width checkIcon

            else
                Icons.placeHolder
    in
    div
        [ class className
        , onClick <| UserToggledEntry params.label
        ]
        [ selectionSymbol
        , text params.label
        ]


openedQuickFilterHtmlId : String
openedQuickFilterHtmlId =
    "openedQuickFilter"
