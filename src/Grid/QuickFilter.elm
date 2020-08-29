module Grid.QuickFilter exposing (..)

import Css exposing (..)
import Dict exposing (Dict)
import Grid.Colors exposing (white)
import Grid.Html exposing (focusOn, noContent)
import Grid.Icons as Icons exposing (checkIcon, drawDarkSvg)
import Grid.Labels as Label exposing (localize)
import Grid.List exposing (appendIf)
import Grid.Parsers as Parsers exposing (orKeyword)
import Html.Styled exposing (Attribute, Html, button, div, span, text)
import Html.Styled.Attributes exposing (attribute, class, css, id, tabindex)
import Html.Styled.Events exposing (onBlur, onClick)
import List exposing (take)
import Parser exposing ((|.), (|=), succeed)
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
    | UserClickedClear
    | UserClosedQuickFilter
    | UserOpenedQuickFilter
    | UserToggledEntry String


type alias Position =
    { x : Float
    , y : Float
    }



-- INIT --


maxQuickFilterPropositions =
    1000


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
    filteringValue
        |> Maybe.withDefault ""
        |> String.split (orKeyword labels)
        |> List.filter (not << String.isEmpty)
        |> List.map (removeEqualSign labels)
        |> Set.fromList


removeEqualSign : Dict String String -> String -> String
removeEqualSign labels inputString =
    let
        parser =
            succeed identity
                |. Parsers.equalityParser
                |= Parsers.stringParser labels

        parsedValue =
            Parser.run parser inputString
    in
    case parsedValue of
        Ok value ->
            value

        Err _ ->
            inputString



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

        UserClickedClear ->
            ( { model | outputStrings = Set.empty }
            , Cmd.none
            )



-- VIEW --


view : Model -> Html Msg
view model =
    let
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
        viewClearButton model
            ++ viewEntries model
            ++ viewEllipsis (List.length model.propositions) maxQuickFilterPropositions


viewClearButton : Model -> List (Html Msg)
viewClearButton model =
    [ if Set.isEmpty model.filteringValues then
        noContent

      else
        button
            [ attribute "data-testid" "clearQuickFilterButton"
            , class "eag-primary-button"
            , onClick UserClickedClear
            ]
            [ text <| localize Label.clear model.labels
            ]
    ]


viewEntries model =
    let
        params value =
            { selectedValues = model.filteringValues
            , emptyLabel = localize Label.empty model.labels
            , outputStrings = model.outputStrings
            , isCommand = False
            , label = value
            }
    in
    List.map
        (\value -> viewQuickFilterEntry (params value))
        model.propositions


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
        , width <| px <| max columnWidth 115
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
                noContent
    in
    div
        ([ attribute "data-testid" "quickFilterEntry"
         , class className
         , onClick <| UserToggledEntry params.label
         ]
            |> appendIf (not isSelected) [ css [ paddingLeft (px 15) ] ]
        )
        [ selectionSymbol
        , text params.label
        ]


openedQuickFilterHtmlId : String
openedQuickFilterHtmlId =
    "openedQuickFilter"
