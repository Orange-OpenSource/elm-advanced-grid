module Grid.Filters exposing
    ( Item
    , boolFilter, floatFilter, intFilter, stringFilter
    , Filter(..), parseFilteringString
    )

{-| Helper functions for filtering the grid content


# Data type

@docs Item


# Helpers

@docs boolFilter, floatFilter, intFilter, stringFilter

-}

import Grid.Parsers exposing (..)
import Parser exposing ((|=), Parser)


{-| The data to be displayed in the grid
It must be records with at least two fields: selected and index

    items =
        [ { index = 0
          , name = "item0"
          , selected = False
          }
        , { index = 1
          , name = "item1"
          , selected = False
          }
        ]

-}
type alias Item a =
    { a
        | selected : Bool
        , index : Int
    }


{-| Filter for a given column
-}
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
parseFilteringString filteringValue filter =
    let
        filteringString =
            Maybe.withDefault "" filteringValue
    in
    if filteringString == "" then
        Nothing

    else
        case filter of
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
    case ( parsedLessThan, parsedGreaterThan, parsedEqual ) of
        ( Ok lessThanOperand, _, _ ) ->
            Just (filters.lessThan.filter lessThanOperand)

        ( _, Ok greaterThanOperand, _ ) ->
            Just (filters.greaterThan.filter greaterThanOperand)

        ( _, _, Ok equalityOperand ) ->
            -- must be tested after lessThanOperand and greaterThanOperand because it accepts any string
            Just (filters.equal.filter equalityOperand)

        _ ->
            Nothing


{-| Filters strings.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        StringFilter <| stringFilter (\item -> item.name)

-}
stringFilter : (Item a -> String) -> TypedFilter a String
stringFilter getter =
    makeFilter
        { getter = getter
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , typedParser = stringParser
        }


{-| Filters integers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        IntFilter <| intFilter (\\item -> item.id)

-}
intFilter : (Item a -> Int) -> TypedFilter a Int
intFilter getter =
    makeFilter
        { getter = getter
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , typedParser = Parser.int
        }


{-| Filters floating point numbers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        FloatFilter <| floatFilter (\item -> item.value)

-}
floatFilter : (Item a -> Float) -> TypedFilter a Float
floatFilter getter =
    makeFilter
        { getter = getter
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , typedParser = Parser.float
        }


{-| Filters booleans.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        BoolFilter <| boolFilter (\item -> item.even)

-}
boolFilter : (Item a -> Bool) -> TypedFilter a Bool
boolFilter getter =
    makeFilter
        { getter = getter
        , lessThan = boolLessThan
        , greaterThan = boolGreaterThan
        , typedParser = boolParser
        }


boolLessThan : Bool -> Bool -> Bool
boolLessThan a b =
    (not <| b) && a


boolGreaterThan : Bool -> Bool -> Bool
boolGreaterThan a b =
    b && not a


makeFilter :
    { getter : Item a -> b
    , lessThan : b -> b -> Bool
    , greaterThan : b -> b -> Bool
    , typedParser : Parser b
    }
    -> TypedFilter a b
makeFilter { getter, lessThan, greaterThan, typedParser } =
    { equal =
        { filter = \value item -> value == getter item
        , parser = equalityParser |= typedParser
        }
    , lessThan =
        { filter = \value item -> lessThan (getter item) value
        , parser = lessThanParser |= typedParser
        }
    , greaterThan =
        { filter = \value item -> greaterThan (getter item) value
        , parser = greaterThanParser |= typedParser
        }
    }
