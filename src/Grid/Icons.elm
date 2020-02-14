module Grid.Icons exposing (..)

import Color exposing (Color)
import Html.Styled exposing (Html)
import Svg.Styled exposing (fromUnstyled, styled)
import TypedSvg exposing (g, path, svg)
import TypedSvg.Attributes exposing (fill, transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Events exposing (onClick)
import TypedSvg.Types exposing (Fill(..), Transform(..))


drawSvg : Float -> String -> msg -> Html.Styled.Html msg
drawSvg size svgPath message =
    svg
        [ viewBox 0 0 size size
        , InPx.width size
        , InPx.height size
        , onClick message
        ]
        [ g []
            [ path
                [ TypedSvg.Attributes.d svgPath
                , fill <| Fill <| Color.rgb 0.6 0.6 0.6
                ]
                []
            ]
        ]
        |> fromUnstyled


filterIcon : String
filterIcon =
    "M 0 0 L 15 0 L 9 6 L 9 12 L 6 12 L 6 6 Z"


width : Float
width =
    15


penIcon : String
penIcon =
    "M 21 3 L 24 6 L 12 18 L 9 15 L 21 3 M 21.6 2.4 Q 27 0 24.6 5.4 M 8.4 15.6 L 6 21 L 11.6 18.4 L 8.4 15.6"
