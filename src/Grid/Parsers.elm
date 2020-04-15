{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

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
    , orExpressionParser
    , stringParser
    )

import Parser exposing ((|.), (|=), Parser, Step(..), chompIf, chompUntilEndOr, chompWhile, end, float, getChompedString, int, keyword, loop, map, oneOf, spaces, succeed, symbol)


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


{-| Parses expressions like "abc or d or yz"
-}
orExpressionParser : Parser a -> Parser (List a)
orExpressionParser valueParser =
    loop [] (orParser valueParser)


orParser : Parser a -> List a -> Parser (Step (List a) (List a))
orParser valueParser parsedValues =
    oneOf
        [ succeed (\value -> Loop (value :: parsedValues))
            |= valueParser
            |. spaces
            |. oneOf
                [ keyword "or"
                , end
                ]
            |. spaces
        , succeed ()
            |> map (\_ -> Done (List.reverse parsedValues))
        ]


stringParser : Parser String
stringParser =
    succeed ()
        |. chompIf Char.isAlphaNum
        -- chompIf id required ot ensure there is at least one character, as chompWhile returns always true
        |. chompWhile Char.isAlphaNum
        |> getChompedString


boolParser : Parser Bool
boolParser =
    oneOf
        [ succeed True
            |. keyword "true"
        , succeed False
            |. keyword "false"
        ]
