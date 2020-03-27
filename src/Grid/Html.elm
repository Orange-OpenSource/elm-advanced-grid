module Grid.Html exposing (..)

import Browser.Dom
import Html.Styled exposing (Html, text)
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


{-| focus on an HTML element, and sends an msg when done (even if the element is not found)
-}
focusOn : String -> msg -> Cmd msg
focusOn elementId msg =
    Browser.Dom.focus elementId |> Task.attempt (\result -> msg)
