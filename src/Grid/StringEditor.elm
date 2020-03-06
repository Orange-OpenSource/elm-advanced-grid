module Grid.StringEditor exposing (..)

import Css exposing (absolute, height, left, margin, padding, position, px, top, width)
import Grid.Item exposing (Item)
import Html.Styled exposing (Attribute, Html, form, input)
import Html.Styled.Attributes exposing (css, id, value)
import Html.Styled.Events exposing (keyCode, on, onBlur, onInput, onSubmit)
import Json.Decode


type alias Model =
    { dimensions : Dimensions
    , origin : Position
    , position : Position
    , value : String
    }


init : Model
init =
    { origin = { x = 0, y = 0 }
    , position = { x = 0, y = 0 }
    , dimensions = { width = 0, height = 0 }
    , value = ""
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
    = EditorLostFocus (Item a)
    | SetEditedValue String
    | SetOrigin Position
    | SetPositionAndDimensions Position Dimensions
    | UserChangedValue String
    | UserSubmittedForm (Item a)
    | OnKeyUp Int -- the param is the key code


update : Msg a -> Model -> Model
update msg model =
    case msg of
        SetPositionAndDimensions position dimensions ->
            { model | position = position, dimensions = dimensions }

        SetEditedValue value ->
            { model | value = value }

        SetOrigin position ->
            { model | origin = position }

        UserChangedValue editedValue ->
            { model | value = editedValue }

        _ ->
            model


view : Model -> Item a -> Html (Msg a)
view model item =
    form
        [ css
            [ position absolute
            , left (px <| model.position.x - model.origin.x)
            , top (px <| model.position.y - model.origin.y)
            ]
        , onSubmit <| UserSubmittedForm item
        ]
        [ input
            [ css
                [ height (px <| model.dimensions.height)
                , width (px <| model.dimensions.width)
                , margin (px 0)
                , padding (px 0)
                ]
            , id editorId
            , onBlur (EditorLostFocus item)
            , onInput <| UserChangedValue
            , onKeyUp OnKeyUp
            , value model.value
            ]
            []
        ]


onKeyUp : (Int -> msg) -> Attribute msg
onKeyUp msgConstructor =
    on "keyup" (Json.Decode.map msgConstructor keyCode)
