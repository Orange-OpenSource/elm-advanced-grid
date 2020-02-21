module Grid.StringEditor exposing (..)

import Css exposing (absolute, flexGrow, height, left, num, position, px, top, width)
import Grid.Item exposing (Item)
import Html.Styled exposing (Html, div, form, input)
import Html.Styled.Attributes exposing (css, id, value)
import Html.Styled.Events exposing (onBlur, onInput, onSubmit)


type alias Model =
    { value : String
    , position : Position
    , dimensions : Dimensions
    }


init : Model
init =
    { value = ""
    , position = { x = 0, y = 0 }
    , dimensions = { width = 0, height = 0 }
    }


editorId : String
editorId =
    "cell-editor"


type alias Position =
    { x : Float
    , y : Float
    }


type alias Dimensions =
    { width : Float
    , height : Float
    }


type Msg a
    = EditorLostFocus
    | SetEditedValue String
    | SetPositionAndDimensions Position Dimensions
    | UserChangedValue String
    | UserSubmittedForm (Item a)


update : Msg a -> Model -> Model
update msg model =
    case msg of
        SetPositionAndDimensions position dimensions ->
            { model | position = position, dimensions = dimensions }

        SetEditedValue value ->
            { model | value = value }

        UserChangedValue editedValue ->
            { model | value = editedValue }

        _ ->
            model


view : Model -> Item a -> Html (Msg a)
view model item =
    div []
        [ form
            [ css
                [ position absolute
                , left (px model.position.x)
                , top (px model.position.y)
                , width (px model.dimensions.width)
                , height (px model.dimensions.height)
                ]
            , onSubmit <| UserSubmittedForm item
            ]
            [ input
                [ css [ flexGrow (num 1) ]
                , id editorId
                , onBlur EditorLostFocus
                , onInput <| UserChangedValue
                , value model.value
                ]
                []
            ]
        ]
