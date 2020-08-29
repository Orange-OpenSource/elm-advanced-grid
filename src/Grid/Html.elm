module Grid.Html exposing (..)

import Browser.Dom
import Html.Styled exposing (Attribute, Html, text)
import Html.Styled.Events exposing (stopPropagationOn)
import Json.Decode as Decode
import Task


viewIf : Bool -> Html msg -> Html msg
viewIf condition html =
    if condition then
        html

    else
        noContent


noContent : Html msg
noContent =
    text ""


{-| Sets focus on an HTML element, then sends a msg when done (even if the element is not found)
-}
focusOn : String -> msg -> Cmd msg
focusOn elementId msg =
    Browser.Dom.focus elementId |> Task.attempt (\result -> msg)


{-| Prevents the click on the line to be detected when interacting with the checkbox
-}
stopPropagationOnClick : msg -> Attribute msg
stopPropagationOnClick msg =
    stopPropagationOn "click" (Decode.map alwaysPreventDefault (Decode.succeed msg))


alwaysPreventDefault : msg -> ( msg, Bool )
alwaysPreventDefault msg =
    ( msg, True )


{-| creates a command to get the absolute position of a given dom element
-}
getElementInfo : String -> (Result Browser.Dom.Error Browser.Dom.Element -> msg) -> Cmd msg
getElementInfo elementId msg =
    Browser.Dom.getElement elementId |> Task.attempt (\result -> msg result)
