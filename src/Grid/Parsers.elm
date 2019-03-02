module Grid.Parsers exposing
    ( boolEqualityParser
    , boolParser
    , floatEqualityParser
    , greaterThanBoolParser
    , greaterThanFloatParser
    , greaterThanIntParser
    , greaterThanStringParser
    , intEqualityParser
    , lessThanBoolParser
    , lessThanFloatParser
    , lessThanIntParser
    , lessThanStringParser
    , stringEqualityParser
    )

import Parser exposing ((|.), (|=), Parser, chompUntilEndOr, getChompedString, keyword, oneOf, spaces, succeed, symbol)


stringParser : Parser String
stringParser =
    -- the input string cannot contain "\t"
    -- another implemntation is:
    -- getChompedString <| chompWhile (\c -> True)
    getChompedString <| chompUntilEndOr "\u{0000}"

stringEqualityParser : Parser String
stringEqualityParser =
    succeed identity
        |. spaces
        |. symbol "="
        |. spaces
        |= stringParser


lessThanStringParser : Parser String
lessThanStringParser =
    succeed identity
        |. spaces
        |. symbol "<"
        |. spaces
        |= stringParser


greaterThanStringParser : Parser String
greaterThanStringParser =
    succeed identity
        |. spaces
        |. symbol ">"
        |. spaces
        |= stringParser


intEqualityParser : Parser Int
intEqualityParser =
    succeed identity
        |. spaces
        |. symbol "="
        |. spaces
        |= Parser.int


lessThanIntParser : Parser Int
lessThanIntParser =
    succeed identity
        |. spaces
        |. symbol "<"
        |. spaces
        |= Parser.int


greaterThanIntParser : Parser Int
greaterThanIntParser =
    succeed identity
        |. spaces
        |. symbol ">"
        |. spaces
        |= Parser.int


floatEqualityParser : Parser Float
floatEqualityParser =
    succeed identity
        |. spaces
        |. symbol "="
        |. spaces
        |= Parser.float


lessThanFloatParser : Parser Float
lessThanFloatParser =
    succeed identity
        |. spaces
        |. symbol "<"
        |. spaces
        |= Parser.float


greaterThanFloatParser : Parser Float
greaterThanFloatParser =
    succeed identity
        |. spaces
        |. symbol ">"
        |. spaces
        |= Parser.float


boolParser : Parser Bool
boolParser =
    oneOf
        [ succeed True
            |. keyword "true"
        , succeed False
            |. keyword "false"
        ]


boolEqualityParser : Parser Bool
boolEqualityParser =
    succeed identity
        |. spaces
        |. symbol "="
        |. spaces
        |= boolParser


lessThanBoolParser : Parser Bool
lessThanBoolParser =
    succeed identity
        |. spaces
        |. symbol "<"
        |. spaces
        |= boolParser


greaterThanBoolParser : Parser Bool
greaterThanBoolParser =
    succeed identity
        |. spaces
        |. symbol ">"
        |. spaces
        |= boolParser
