module Grid.QuickFilter exposing (..)

import Css exposing (..)
import Dict exposing (Dict)
import Grid.Colors exposing (darkGrey2, lightGrey3, white)
import Grid.Html exposing (focusOn)
import Grid.Icons
import Grid.Labels as Label exposing (localize)
import Html.Styled exposing (Attribute, Html, div, hr, span, text)
import Html.Styled.Attributes exposing (css, id, tabindex)
import Html.Styled.Events exposing (onBlur, onClick)
import List exposing (take)



-- TYPES --


type alias Model =
    { filteringValue : Maybe String
    , labels : Dict String String
    , maxX : Float
    , origin : Position
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
    | UserSelectedEntry (Maybe String)


type alias Position =
    { x : Float
    , y : Float
    }



-- INIT --


maxQuickFilterPropositions =
    100


init : List String -> Maybe String -> Dict String String -> Float -> Model
init allValuesInColumn filteringValue labels columnWidth =
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
    in
    { filteringValue = filteringValue
    , labels = labels -- state.labels
    , maxX = 0
    , origin = { x = 0, y = 0 }
    , position = { x = 0, y = 0 }
    , propositions = filterPropositions
    , state = Closed
    , width = columnWidth
    }



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

        UserSelectedEntry maybeString ->
            ( model
            , Cmd.none
            )



-- VIEW --


view : Model -> Html Msg
view model =
    let
        params value =
            { emptyLabel = localize Label.empty model.labels
            , filterString = Just ("=" ++ value)
            , isCommand = False
            , label = value
            }

        x =
            model.position.x - model.origin.x

        popupPosition =
            { x =
                if x + model.width > model.maxX then
                    -- prevents popup to be partially hidden when on last colmun
                    x - model.width + Grid.Icons.width

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
            ++ viewResetSelector model.filteringValue (localize Label.clear model.labels)


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


viewResetSelector : Maybe String -> String -> List (Html Msg)
viewResetSelector filteringValue label =
    let
        params =
            { emptyLabel = ""
            , filterString = Nothing
            , isCommand = True
            , label = label
            }
    in
    case filteringValue of
        Nothing ->
            []

        _ ->
            [ hr [ css [ color darkGrey2 ] ] []
            , viewQuickFilterEntry params
            ]


type alias ViewQuickFilterEntryParams =
    { emptyLabel : String
    , filterString : Maybe String
    , isCommand : Bool
    , label : String
    }


viewQuickFilterEntry : ViewQuickFilterEntryParams -> Html Msg
viewQuickFilterEntry params =
    let
        style =
            if params.isCommand || params.label == params.emptyLabel then
                fontStyle italic

            else
                fontStyle normal
    in
    div
        [ onClick <| UserSelectedEntry params.filterString
        , css
            [ cursor pointer
            , style
            , hover [ backgroundColor lightGrey3 ]
            ]
        ]
        [ text params.label ]


openedQuickFilterHtmlId : String
openedQuickFilterHtmlId =
    "openedQuickFilter"
