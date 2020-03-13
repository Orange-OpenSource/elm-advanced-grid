module Grid.QuickFilter exposing (..)

import Css exposing (..)
import Dict exposing (Dict)
import Grid.Colors exposing (darkGrey2, lightGrey3, white)
import Grid.Labels as Label exposing (localize)
import Html.Styled exposing (Attribute, Html, div, hr, span, text)
import Html.Styled.Attributes exposing (css, id, tabindex)
import Html.Styled.Events exposing (onBlur, onClick)
import List exposing (take)



-- TYPES --


type alias Model =
    { filteringValue : Maybe String
    , labels : Dict String String
    , origin : Position
    , propositions : List String
    , state : QuickFilterState
    , width : Float
    , position : Position
    }


type QuickFilterState
    = Open
    | Closed


type Msg
    = UserClosedQuickFilter
    | FocusLost
    | SetOrigin Position
    | SetPosition Position
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
    , state = Closed
    , propositions = filterPropositions
    , width = columnWidth
    , origin = { x = 0, y = 0 }
    , position = { x = 0, y = 0 }
    }



-- UPDATE --


update : Msg -> Model -> Model
update msg model =
    case msg of
        UserClosedQuickFilter ->
            { model | state = Closed }

        FocusLost ->
            { model | state = Closed }

        SetOrigin position ->
            { model | origin = position }

        SetPosition position ->
            { model | position = position }

        UserOpenedQuickFilter ->
            { model | state = Open }

        UserSelectedEntry maybeString ->
            model



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
    in
    div
        [ quickFilterPopupStyles model.origin model.position model.width

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


quickFilterPopupStyles : Position -> Position -> Float -> Attribute Msg
quickFilterPopupStyles origin popupPosition columnWidth =
    css
        [ position absolute
        , left (px <| popupPosition.x - origin.x)
        , top (px <| popupPosition.y - origin.y)
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
