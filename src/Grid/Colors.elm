module Grid.Colors exposing (black, darkGrey, darkGrey2, lightGreen, lightGrey, lightGrey2, slightlyTransparentBlack, white, white2)

import Css exposing (Color, hex, rgba)


black : Color
black =
    hex "000"


darkGrey : Color
darkGrey =
    hex "666"


darkGrey2 : Color
darkGrey2 =
    hex "888"


lightGreen : Color
lightGreen =
    hex "4d4"


lightGrey : Color
lightGrey =
    hex "CCC"


lightGrey2 : Color
lightGrey2 =
    hex "BBB"


slightlyTransparentBlack : Color
slightlyTransparentBlack =
    rgba 0 0 0 0.75


white2 : Color
white2 =
    hex "EEE"


white : Color
white =
    hex "FFF"
