module Grid.Html exposing (..)

import Html.Styled exposing (Html, text)


viewIf : Bool -> Html msg -> Html msg
viewIf condition html =
    if condition then
        html

    else
        noContent


noContent : Html msg
noContent =
    text ""
