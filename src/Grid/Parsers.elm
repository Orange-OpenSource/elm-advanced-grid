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
    , orExpression
    , stringParser
    )

import Dict exposing (Dict)
import Grid.Labels as Labels exposing (localize)
import Parser exposing ((|.), (|=), Parser, Step(..), Trailing(..), andThen, chompIf, chompUntilEndOr, chompWhile, end, getChompedString, keyword, lazy, loop, map, oneOf, sequence, spaces, succeed, symbol)


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


orExpression : Dict String String -> Parser a -> Parser (List a)
orExpression labels valueParser =
    let
        orKeyword =
            " " ++ localize Labels.or labels ++ " "
    in
    Parser.sequence
        { start = ""
        , separator = orKeyword
        , end = ""
        , spaces = Parser.succeed ()
        , item = valueParser
        , trailing = Forbidden
        }


stringParser : Dict String String -> Parser String
stringParser labels =
    let
        orKeyword =
            " " ++ Labels.localize Labels.or labels ++ " "
    in
    succeed identity
        |= oneOrMoreWords orKeyword


oneOrMoreWords : String -> Parser String
oneOrMoreWords orKeyword =
    succeed identity
        |. chompUntilEndOr orKeyword
        |> getChompedString


boolParser : Parser Bool
boolParser =
    oneOf
        [ succeed True
            |. keyword "true"
        , succeed False
            |. keyword "false"
        ]
