module Grid.Filters exposing
    ( Filter(..)
    , Item
    , boolFilter
    , floatFilter
    , intFilter
    , parseFilteringString
    , stringFilter
    )

import Grid.Parsers exposing (..)
import Parser exposing (Parser)


type alias Item a =
    { a
        | selected : Bool
        , index : Int
    }


type Filter a
    = StringFilter (TypedFilter a String)
    | IntFilter (TypedFilter a Int)
    | FloatFilter (TypedFilter a Float)
    | BoolFilter (TypedFilter a Bool)


type alias TypedFilter a b =
    { equal :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    , lessThan :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    , greaterThan :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    }


parseFilteringString : Maybe String -> Filter a -> Maybe (Item a -> Bool)
parseFilteringString filteringValue filters =
    let
        filteringString =
            Maybe.withDefault "" filteringValue
    in
    case filters of
        StringFilter stringTypedFilter ->
            validateFilter filteringString stringTypedFilter

        IntFilter intTypedFilter ->
            validateFilter filteringString intTypedFilter

        FloatFilter floatTypedFilter ->
            validateFilter filteringString floatTypedFilter

        BoolFilter boolTypedFilter ->
            validateFilter filteringString boolTypedFilter


validateFilter : String -> TypedFilter a b -> Maybe (Item a -> Bool)
validateFilter filteringString filters =
    let
        parsedEqual =
            Parser.run filters.equal.parser filteringString

        parsedLessThan =
            Parser.run filters.lessThan.parser filteringString

        parsedGreaterThan =
            Parser.run filters.greaterThan.parser filteringString
    in
    case parsedEqual of
        Ok equalityOperand ->
            Just (filters.equal.filter equalityOperand)

        _ ->
            case parsedLessThan of
                Ok lessThanOperand ->
                    Just (filters.lessThan.filter lessThanOperand)

                _ ->
                    case parsedGreaterThan of
                        Ok greaterThanOperand ->
                            Just (filters.greaterThan.filter greaterThanOperand)

                        _ ->
                            Nothing


stringFilter : (Item a -> String) -> TypedFilter a String
stringFilter getter =
    { equal =
        { filter = filterStringFieldEqualTo getter
        , parser = stringEqualityParser
        }
    , lessThan =
        { filter = filterStringFieldLesserThan getter
        , parser = lessThanStringParser
        }
    , greaterThan =
        { filter = filterStringFieldGreaterThan getter
        , parser = greaterThanStringParser
        }
    }


filterStringFieldEqualTo : (Item a -> String) -> String -> Item a -> Bool
filterStringFieldEqualTo getter value item =
    String.contains value <| getter item


filterStringFieldLesserThan : (Item a -> String) -> String -> Item a -> Bool
filterStringFieldLesserThan getter value item =
    getter item < value


filterStringFieldGreaterThan : (Item a -> String) -> String -> Item a -> Bool
filterStringFieldGreaterThan getter value item =
    getter item > value


intFilter : (Item a -> Int) -> TypedFilter a Int
intFilter getter =
    { equal =
        { filter = filterIntFieldEqualTo getter
        , parser = intEqualityParser
        }
    , lessThan =
        { filter = filterIntFieldLesserThan getter
        , parser = lessThanIntParser
        }
    , greaterThan =
        { filter = filterIntFieldGreaterThan getter
        , parser = greaterThanIntParser
        }
    }


filterIntFieldEqualTo : (Item a -> Int) -> Int -> Item a -> Bool
filterIntFieldEqualTo getter value item =
    getter item == value


filterIntFieldLesserThan : (Item a -> Int) -> Int -> Item a -> Bool
filterIntFieldLesserThan getter value item =
    getter item < value


filterIntFieldGreaterThan : (Item a -> Int) -> Int -> Item a -> Bool
filterIntFieldGreaterThan getter value item =
    getter item > value


floatFilter : (Item a -> Float) -> TypedFilter a Float
floatFilter getter =
    { equal =
        { filter = filterFloatFieldEqualTo getter
        , parser = floatEqualityParser
        }
    , lessThan =
        { filter = filterFloatFieldLesserThan getter
        , parser = lessThanFloatParser
        }
    , greaterThan =
        { filter = filterFloatFieldGreaterThan getter
        , parser = greaterThanFloatParser
        }
    }


filterFloatFieldEqualTo : (Item a -> Float) -> Float -> Item a -> Bool
filterFloatFieldEqualTo getter value item =
    getter item == value


filterFloatFieldLesserThan : (Item a -> Float) -> Float -> Item a -> Bool
filterFloatFieldLesserThan getter value item =
    getter item < value


filterFloatFieldGreaterThan : (Item a -> Float) -> Float -> Item a -> Bool
filterFloatFieldGreaterThan getter value item =
    getter item > value


boolFilter : (Item a -> Bool) -> TypedFilter a Bool
boolFilter getter =
    { equal =
        { filter = filterBoolFieldEqualTo getter
        , parser = boolEqualityParser
        }
    , lessThan =
        { filter = filterBoolFieldLesserThan getter
        , parser = lessThanBoolParser
        }
    , greaterThan =
        { filter = filterBoolFieldGreaterThan getter
        , parser = greaterThanBoolParser
        }
    }


filterBoolFieldEqualTo : (Item a -> Bool) -> Bool -> Item a -> Bool
filterBoolFieldEqualTo getter value item =
    getter item == value


filterBoolFieldLesserThan : (Item a -> Bool) -> Bool -> Item a -> Bool
filterBoolFieldLesserThan getter value item =
    getter item && not value


filterBoolFieldGreaterThan : (Item a -> Bool) -> Bool -> Item a -> Bool
filterBoolFieldGreaterThan getter value item =
    (not <| getter item) && value
