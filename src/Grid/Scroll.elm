module Grid.Scroll exposing (..)

import Html.Styled.Events exposing (on)
import Json.Decode as Decode


type alias VerticalScrollInfo =
    { scrollTop : Float
    }


type alias HorizontalScrollInfo =
    { scrollLeft : Float
    }


verticalScrollInfoDecoder =
    Decode.map VerticalScrollInfo
        (Decode.at [ "target", "scrollTop" ] Decode.float)


onVerticalScroll msg =
    on "scroll" (Decode.map msg verticalScrollInfoDecoder)


horizontalScrollInfoDecoder =
    Decode.map HorizontalScrollInfo
        (Decode.at [ "target", "scrollLeft" ] Decode.float)


onHorizontalScroll msg =
    on "scroll" (Decode.map msg horizontalScrollInfoDecoder)
