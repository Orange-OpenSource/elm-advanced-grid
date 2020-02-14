{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid.Filters exposing
    ( boolFilter, floatFilter, intFilter, stringFilter
    , Filter(..), parseFilteringString
    )

{-| Helper functions for filtering the grid content


# Data type

@docs Item


# Helpers

@docs boolFilter, floatFilter, intFilter, stringFilter

-}

import Dict exposing (Dict)
import Grid.Labels as Label
import Grid.Parsers exposing (boolParser, containsParser, equalityParser, greaterThanParser, lessThanParser, stringParser)
import Parser exposing ((|=), DeadEnd, Parser)


{-| Filter for a given column
-}
type Filter a
    = StringFilter (TypedFilter a String)
    | IntFilter (TypedFilter a Int)
    | FloatFilter (TypedFilter a Float)
    | BoolFilter (TypedFilter a Bool)
    | NoFilter


type alias TypedFilter a b =
    { equal :
        { filter : b -> a -> Bool
        , parser : Parser b
        }
    , lessThan :
        { filter : b -> a -> Bool
        , parser : Parser b
        }
    , greaterThan :
        { filter : b -> a -> Bool
        , parser : Parser b
        }
    , contains :
        { filter : b -> a -> Bool
        , parser : Parser b
        }
    }


parseFilteringString : Maybe String -> Filter a -> Maybe (a -> Bool)
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

            NoFilter ->
                Nothing


validateFilter : String -> TypedFilter a b -> Maybe (a -> Bool)
validateFilter filteringString filters =
    let
        validators =
            [ validateEqualFilter, validateLessThanFilter, validateGreaterThanFilter, validateContainsFilter ]

        -- validateContainsFilter must be tested last because it accepts any string
    in
    -- find first OK value returned by a validator, change it into a Maybe
    findFirstOK <| List.map (\validator -> validator filters filteringString) validators


findFirstOK : List (Result (List DeadEnd) (a -> Bool)) -> Maybe (a -> Bool)
findFirstOK results =
    case results of
        [] ->
            Nothing

        (Ok result) :: _ ->
            Just result

        (Err _) :: tail ->
            findFirstOK tail


validateEqualFilter : TypedFilter a b -> String -> Result (List DeadEnd) (a -> Bool)
validateEqualFilter filters filteringString =
    Result.map filters.equal.filter (Parser.run filters.equal.parser filteringString)


validateLessThanFilter : TypedFilter a b -> String -> Result (List DeadEnd) (a -> Bool)
validateLessThanFilter filters filteringString =
    Result.map filters.lessThan.filter (Parser.run filters.lessThan.parser filteringString)


validateGreaterThanFilter : TypedFilter a b -> String -> Result (List DeadEnd) (a -> Bool)
validateGreaterThanFilter filters filteringString =
    Result.map filters.greaterThan.filter (Parser.run filters.greaterThan.parser filteringString)


validateContainsFilter : TypedFilter a b -> String -> Result (List DeadEnd) (a -> Bool)
validateContainsFilter filters filteringString =
    Result.map filters.contains.filter (Parser.run filters.contains.parser filteringString)


{-| Filters strings.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        StringFilter <| stringFilter (\item -> item.name) localize

The localize function must return the translation in the current language for the "Empty" label displayed in the quick filter
A default implementation, if the grid is used in English, is the "identity" function

-}
stringFilter : (a -> String) -> Dict String String -> TypedFilter a String
stringFilter getter labels =
    makeFilter
        { getter = getter
        , equal = stringEquals labels
        , lessThan = \a b -> String.toLower a < String.toLower b
        , greaterThan = \a b -> String.toLower a > String.toLower b
        , contains = \a b -> String.contains (String.toLower b) (String.toLower a)
        , typedParser = stringParser
        }


{-| Returns true when the given string are the same
or when the first one is empty and the second one is the quick filter label for selecting empty cells
-}
stringEquals : Dict String String -> String -> String -> Bool
stringEquals labels valueInCell valueInFilter =
    (String.toLower valueInCell == String.toLower valueInFilter)
        || (valueInCell == "" && valueInFilter == Label.localize Label.empty labels)


{-| Filters integers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        IntFilter <| intFilter (\\item -> item.id)

-}
intFilter : (a -> Int) -> TypedFilter a Int
intFilter getter =
    makeFilter
        { getter = getter
        , equal = (==)
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , contains = \a b -> String.contains (String.fromInt b) (String.fromInt a)
        , typedParser = Parser.int
        }


{-| Filters floating point numbers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        FloatFilter <| floatFilter (\item -> item.value)

-}
floatFilter : (a -> Float) -> TypedFilter a Float
floatFilter getter =
    makeFilter
        { getter = getter
        , equal = (==)
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , contains = \a b -> String.contains (String.fromFloat b) (String.fromFloat a)
        , typedParser = Parser.float
        }


{-| Filters booleans.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        BoolFilter <| boolFilter (\item -> item.even)

-}
boolFilter : (a -> Bool) -> TypedFilter a Bool
boolFilter getter =
    makeFilter
        { getter = getter
        , equal = (==)
        , lessThan = boolLessThan
        , greaterThan = boolGreaterThan
        , contains = (==)
        , typedParser = boolParser
        }


boolLessThan : Bool -> Bool -> Bool
boolLessThan a b =
    (not <| a) && b


boolGreaterThan : Bool -> Bool -> Bool
boolGreaterThan a b =
    a && not b


makeFilter :
    { getter : a -> b
    , equal : b -> b -> Bool
    , lessThan : b -> b -> Bool
    , greaterThan : b -> b -> Bool
    , contains : b -> b -> Bool
    , typedParser : Parser b
    }
    -> TypedFilter a b
makeFilter { getter, equal, lessThan, greaterThan, contains, typedParser } =
    { equal =
        { filter = \value item -> equal (getter item) value
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
    , contains =
        { filter = \value item -> contains (getter item) value
        , parser = containsParser |= typedParser
        }
    }
