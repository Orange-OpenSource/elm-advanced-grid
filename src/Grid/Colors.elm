module Grid.Colors exposing (black, darkGrey, lightGreen, lightGrey, lightGrey2, nearlyTransparentBlack, slightlyTransparentBlack, white, white2)

import Css exposing (hex, rgb, rgba)


black =
    hex "000"


darkGrey =
    hex "666"


lightGreen =
    hex "4d4"


lightGrey =
    hex "CCC"


lightGrey2 =
    hex "BBB"


nearlyTransparentBlack =
    rgba 0 0 0 0.2


slightlyTransparentBlack =
    rgba 0 0 0 0.75


white2 =
    hex "EEE"


white =
    hex "FFF"
