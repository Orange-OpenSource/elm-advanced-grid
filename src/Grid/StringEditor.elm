module Grid.StringEditor exposing (..)

import Css exposing (absolute, displayFlex, flexGrow, left, num, position, px, top)
import Grid.Item exposing (Item)
import Html.Styled exposing (Html, div, form, input)
import Html.Styled.Attributes exposing (css, id, value)
import Html.Styled.Events exposing (onBlur, onInput, onSubmit)


type alias Model =
    { value : String
    , x : Float
    , y : Float
    }


init : Model
init =
    { value = ""
    , x = 0
    , y = 0
    }


editorId : String
editorId =
    "cell-editor"


type Msg a
    = EditorLostFocus
    | SetEditedValue String
    | SetPosition Float Float
    | UserChangedValue String
    | UserSubmittedForm (Item a)


update : Msg a -> Model -> Model
update msg model =
    case msg of
        SetPosition x y ->
            { model | x = x, y = y }

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
                , left (px model.x)
                , top (px model.y)
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
