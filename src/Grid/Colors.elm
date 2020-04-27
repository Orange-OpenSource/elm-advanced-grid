{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid.Colors exposing (black, darkGrey, darkGrey2, darkGrey3, darkGreyRgb, lightGreen, lightGrey, lightGrey2, lightGrey3, lightGreyRgb, white, white2)

import Color
import Css exposing (Color, hex)


black : Color
black =
    hex "000"


darkGrey : Color
darkGrey =
    hex "666"


darkGrey2 : Color
darkGrey2 =
    hex "888"


darkGrey3 : Color
darkGrey3 =
    hex "AAA"


lightGreen : Color
lightGreen =
    hex "4d4"


lightGrey : Color
lightGrey =
    hex "CCC"


lightGrey2 : Color
lightGrey2 =
    hex "BBB"


lightGrey3 : Color
lightGrey3 =
    hex "DDD"


white2 : Color
white2 =
    hex "EEE"


white : Color
white =
    hex "FFF"


darkGreyRgb : Color.Color
darkGreyRgb =
    Color.rgb 0.2 0.2 0.2


lightGreyRgb : Color.Color
lightGreyRgb =
    Color.rgb 0.6 0.6 0.6
