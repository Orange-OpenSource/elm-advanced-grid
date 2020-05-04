{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid.StringEditor exposing (Model, Msg(..), init, update, view, withMaxLength)

import Browser.Dom
import Css exposing (absolute, backgroundColor, bold, border3, borderColor, borderRadius, bottom, column, cursor, displayFlex, flexDirection, flexEnd, flexGrow, fontSize, fontWeight, height, hex, justifyContent, left, margin, marginBottom, marginLeft, marginRight, marginTop, num, padding, paddingLeft, paddingRight, pointer, position, px, rem, row, solid, top, width)
import Dict exposing (Dict)
import Grid.Colors exposing (darkGrey, lightGrey, lightGrey2, white, white2)
import Grid.Html exposing (focusOn, getElementInfo)
import Grid.Item exposing (Item)
import Grid.Labels as Labels exposing (localize)
import Html.Styled exposing (Attribute, Html, button, div, form, input, text, textarea)
import Html.Styled.Attributes exposing (class, css, id, maxlength, rows, type_, value)
import Html.Styled.Events exposing (keyCode, on, onBlur, onClick, onInput, onSubmit)
import Json.Decode


type alias Model =
    { cellDimensions : Dimensions
    , labels : Dict String String
    , maxLength : Int
    , maxY : Float
    , origin : Position
    , position : Position
    , textareaDimensions : Dimensions
    , value : String
    }


init : Dict String String -> Model
init labels =
    { cellDimensions = { width = 0, height = 0 }
    , labels = labels
    , maxLength = 0
    , maxY = 0
    , origin = { x = 0, y = 0 }
    , position = { x = 0, y = 0 }
    , textareaDimensions = { width = 0, height = 0 }
    , value = ""
    }


withMaxLength : Int -> Model -> Model
withMaxLength maxLength model =
    { model | maxLength = maxLength }


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
    | GotTextareaInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | NoOp
    | OnKeyUp Int -- the param is the key code
    | SetEditedValue String
    | SetOrigin Position
    | SetPositionAndDimensions Position Dimensions Float
    | UserChangedValue String
    | UserSubmittedForm (Item a)
    | UserClickedCancel


update : Msg a -> Model -> ( Model, Cmd (Msg a) )
update msg model =
    case msg of
        GotTextareaInfo (Ok info) ->
            let
                textareaDimension =
                    { width = info.element.width
                    , height = info.element.height
                    }
            in
            ( { model | textareaDimensions = textareaDimension }, Cmd.none )

        SetPositionAndDimensions position dimensions maxY ->
            ( { model
                | position = position
                , maxY = maxY
                , cellDimensions = dimensions
              }
            , Cmd.batch
                [ focusOn editorId NoOp
                , getElementInfo textareaId GotTextareaInfo
                ]
            )

        SetEditedValue value ->
            ( { model | value = value }
            , Cmd.none
            )

        SetOrigin position ->
            ( { model | origin = position }
            , focusOn editorId NoOp
            )

        UserChangedValue editedValue ->
            ( { model | value = editedValue }
            , Cmd.none
            )

        _ ->
            ( model
            , Cmd.none
            )


view : Model -> Item a -> Html (Msg a)
view model item =
    form
        [ onSubmit <| UserSubmittedForm item
        ]
        [ if shouldDisplayTextarea model then
            viewTextarea model item

          else
            viewInput model item
        ]


{-| Use a textarea for long texts to be edited, an input field of the size of the cell otherwise
-}
shouldDisplayTextarea : Model -> Bool
shouldDisplayTextarea model =
    model.maxLength > 50


{-| Displays a single line input with the same dimensions as the edited cell
-}
viewInput : Model -> Item a -> Html (Msg a)
viewInput model item =
    let
        x =
            model.position.x - model.origin.x

        y =
            model.position.y - model.origin.y
    in
    input
        [ css
            -- TODO move static styles into stylesheet
            [ height (px <| model.cellDimensions.height)
            , left (px x)
            , margin (px 0)
            , padding (px 0)
            , position absolute
            , top (px y)
            , width (px <| model.cellDimensions.width)
            ]
        , id editorId
        , onBlur (EditorLostFocus item)
        , onInput <| UserChangedValue
        , onKeyUp OnKeyUp
        , maxlength model.maxLength
        , value model.value
        ]
        []


{-| Displays a multi line input
-}
viewTextarea : Model -> Item a -> Html (Msg a)
viewTextarea model item =
    let
        cellX =
            model.position.x - model.origin.x

        cellY =
            model.position.y - model.origin.y

        y =
            if cellY + model.textareaDimensions.height > model.maxY then
                cellY - model.textareaDimensions.height + model.cellDimensions.height

            else
                cellY
    in
    div
        [ css
            [ backgroundColor white
            , border3 (px 1) solid darkGrey
            , displayFlex
            , flexDirection column
            , left (px cellX)
            , position absolute
            , top (px y)
            ]
        , id textareaId
        ]
        [ textarea
            [ css
                [ width (px <| model.cellDimensions.width - 40)
                , margin (px 10)
                , padding (px 3)
                ]
            , id editorId
            , onInput <| UserChangedValue
            , onKeyUp OnKeyUp
            , maxlength model.maxLength
            , rows (visibleLines model)
            , value model.value
            ]
            []
        , viewButtons model
        ]


textareaId =
    "eag-textarea"


visibleLines : Model -> Int
visibleLines model =
    let
        maxLineOfText =
            round (toFloat model.maxLength / wrapAtColumn)
    in
    min maxLineOfText maxTextareaRows


viewButtons : Model -> Html (Msg a)
viewButtons model =
    div
        [ css
            [ displayFlex
            , flexDirection row
            , flexGrow (num 1)
            , justifyContent flexEnd
            , marginLeft (px 10)
            , marginRight (px 20)
            , marginTop (px 5)
            , marginBottom (px 5)
            ]
        ]
        [ button
            [ type_ "button"
            , class "eag-button"
            , onClick UserClickedCancel
            ]
            [ text <| localize Labels.cancel model.labels ]
        , button
            [ type_ "submit"
            , class "eag-primary-button"
            ]
            [ text <| localize Labels.submit model.labels ]
        ]


wrapAtColumn =
    50


maxTextareaRows =
    10


onKeyUp : (Int -> msg) -> Attribute msg
onKeyUp msgConstructor =
    on "keyup" (Json.Decode.map msgConstructor keyCode)
