module Grid.Icons exposing (checkIcon, drawClickableDarkSvg, drawClickableLightSvg, drawDarkSvg, drawLightSvg, filterIcon, placeHolder, width)

import Color exposing (Color)
import Grid.Colors exposing (darkGreyRgb, lightGreyRgb)
import Html.Styled exposing (Html, div, text)
import Html.Styled.Attributes exposing (class)
import Svg.Styled exposing (fromUnstyled, styled)
import TypedSvg exposing (g, path, svg)
import TypedSvg.Attributes exposing (fill, transform, viewBox)
import TypedSvg.Attributes.InPx as InPx
import TypedSvg.Events exposing (onClick)
import TypedSvg.Types exposing (Fill(..), Transform(..))


drawDarkSvg : Float -> String -> Html.Styled.Html msg
drawDarkSvg size svgPath =
    drawSvg darkGreyRgb size svgPath


drawLightSvg : Float -> String -> Html.Styled.Html msg
drawLightSvg size svgPath =
    drawSvg lightGreyRgb size svgPath


drawSvg : Color.Color -> Float -> String -> Html.Styled.Html msg
drawSvg color size svgPath =
    svg
        [ viewBox 0 0 size size
        , InPx.width size
        , InPx.height size
        ]
        [ g []
            [ path
                [ TypedSvg.Attributes.d svgPath
                , fill <| Fill color
                ]
                []
            ]
        ]
        |> fromUnstyled


drawClickableDarkSvg : Float -> String -> msg -> Html.Styled.Html msg
drawClickableDarkSvg size svgPath message =
    drawClickableSvg (Color.rgb 0.2 0.2 0.2) size svgPath message


drawClickableLightSvg : Float -> String -> msg -> Html.Styled.Html msg
drawClickableLightSvg size svgPath message =
    drawClickableSvg (Color.rgb 0.6 0.6 0.6) size svgPath message


drawClickableSvg : Color.Color -> Float -> String -> msg -> Html.Styled.Html msg
drawClickableSvg color size svgPath message =
    svg
        [ viewBox 0 0 size size
        , InPx.width size
        , InPx.height size
        , onClick message
        ]
        [ g []
            [ path
                [ TypedSvg.Attributes.d svgPath
                , fill <| Fill color
                ]
                []
            ]
        ]
        |> fromUnstyled


filterIcon : String
filterIcon =
    "M 0 0 L 15 0 L 9 6 L 9 12 L 6 12 L 6 6 Z"


checkIcon : String
checkIcon =
    "M 0 5 L 6 10 L 12 0 L14 0 L 6 14 L 0 7 Z"


width : Float
width =
    15


placeHolder : Html msg
placeHolder =
    div
        [ class "eag-placeHolder" ]
        [ text " " ]
