{- Copyright 2019 Orange SA

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid.Parsers exposing
    ( boolParser
    , containsParser
    , equalityParser
    , greaterThanParser
    , lessThanParser
    , stringParser
    )

import Parser exposing ((|.), Parser, chompUntilEndOr, getChompedString, keyword, oneOf, spaces, succeed, symbol)


equalityParser : Parser (a -> a)
equalityParser =
    succeed identity
        |. spaces
        |. symbol "="
        |. spaces


containsParser : Parser (a -> a)
containsParser =
    succeed identity


lessThanParser : Parser (a -> a)
lessThanParser =
    succeed identity
        |. spaces
        |. symbol "<"
        |. spaces


greaterThanParser : Parser (a -> a)
greaterThanParser =
    succeed identity
        |. spaces
        |. symbol ">"
        |. spaces


stringParser : Parser String
stringParser =
    -- the input string cannot contain "\t"
    -- another implementation is:
    -- getChompedString <| chompWhile (\c -> True)
    getChompedString <| chompUntilEndOr "\u{0000}"


boolParser : Parser Bool
boolParser =
    oneOf
        [ succeed True
            |. keyword "true"
        , succeed False
            |. keyword "false"
        ]
