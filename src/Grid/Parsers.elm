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
