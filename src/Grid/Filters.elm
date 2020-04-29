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
import Grid.Parsers as Parsers exposing (ParsedValue, boolParser, containsParser, equalityParser, greaterThanParser, lessThanParser, operandParser, orExpression, stringParser)
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
    { filter : List (ParsedValue b) -> a -> Bool
    , parser : Parser (List (ParsedValue b))
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
    case validateExpressionFilter filters filteringString of
        Ok value ->
            Just value

        Err _ ->
            Nothing


validateExpressionFilter : TypedFilter a b -> String -> Result (List DeadEnd) (a -> Bool)
validateExpressionFilter filters filteringString =
    let
        lowerCaseFilteringString =
            String.toLower filteringString
    in
    Result.map filters.filter (Parser.run filters.parser lowerCaseFilteringString)


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
        , verifiesExpression = matchesOneStringOf labels
        , typedParser = stringParser labels
        , labels = labels
        }


matchesOneStringOf : Dict String String -> String -> List (ParsedValue String) -> Bool
matchesOneStringOf labels referenceString operands =
    List.any
        (\parsedValue ->
            case parsedValue of
                Parsers.Equals operandValue ->
                    stringEquals labels referenceString operandValue

                Parsers.Contains operandValue ->
                    containsString referenceString operandValue

                Parsers.GreaterThan operandValue ->
                    String.toLower referenceString > String.toLower operandValue

                Parsers.LessThan operandValue ->
                    String.toLower referenceString < String.toLower operandValue
        )
        operands


{-| Returns true when the given string are the same
or when the first one is empty and the second one is the quick filter label for selecting empty cells
-}
stringEquals : Dict String String -> String -> String -> Bool
stringEquals labels referenceString searchedValue =
    (String.toLower referenceString == String.toLower searchedValue)
        || (referenceString == "" && searchedValue == (String.toLower <| Label.localize Label.empty labels))


containsString : String -> String -> Bool
containsString referenceString searchedString =
    String.contains (String.toLower searchedString) (String.toLower referenceString)


{-| Filters integers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        IntFilter <| intFilter (\\item -> item.id)

-}
intFilter : (a -> Int) -> Dict String String -> TypedFilter a Int
intFilter getter labels =
    makeFilter
        { getter = getter
        , verifiesExpression = matchesOneIntOf
        , typedParser = Parser.int
        , labels = labels
        }


containsInt : Int -> Int -> Bool
containsInt referenceInt searchedInt =
    String.contains (String.fromInt searchedInt) (String.fromInt referenceInt)


matchesOneIntOf : Int -> List (ParsedValue Int) -> Bool
matchesOneIntOf referenceInt operands =
    List.any
        (\parsedValue ->
            case parsedValue of
                Parsers.Equals operandValue ->
                    referenceInt == operandValue

                Parsers.Contains operandValue ->
                    containsInt referenceInt operandValue

                Parsers.GreaterThan operandValue ->
                    referenceInt > operandValue

                Parsers.LessThan operandValue ->
                    referenceInt < operandValue
        )
        operands


{-| Filters floating point numbers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        FloatFilter <| floatFilter (\item -> item.value)

-}
floatFilter : (a -> Float) -> Dict String String -> TypedFilter a Float
floatFilter getter labels =
    makeFilter
        { getter = getter
        , verifiesExpression = matchesOneFloatOf
        , typedParser = Parser.float
        , labels = labels
        }


containsFloat : Float -> Float -> Bool
containsFloat referenceFloat searchedFloat =
    String.contains (String.fromFloat searchedFloat) (String.fromFloat referenceFloat)


matchesOneFloatOf : Float -> List (ParsedValue Float) -> Bool
matchesOneFloatOf referenceFloat operands =
    List.any
        (\parsedValue ->
            case parsedValue of
                Parsers.Equals operandValue ->
                    referenceFloat == operandValue

                Parsers.Contains operandValue ->
                    containsFloat referenceFloat operandValue

                Parsers.GreaterThan operandValue ->
                    referenceFloat > operandValue

                Parsers.LessThan operandValue ->
                    referenceFloat < operandValue
        )
        operands


{-| Filters booleans.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        BoolFilter <| boolFilter (\item -> item.even)

-}
boolFilter : (a -> Bool) -> Dict String String -> TypedFilter a Bool
boolFilter getter labels =
    makeFilter
        { getter = getter
        , verifiesExpression = matchesOneBoolOf
        , typedParser = boolParser
        , labels = labels
        }


matchesOneBoolOf : Bool -> List (ParsedValue Bool) -> Bool
matchesOneBoolOf referenceBool operands =
    List.any
        (\parsedValue ->
            case parsedValue of
                Parsers.Equals operandValue ->
                    referenceBool == operandValue

                Parsers.Contains operandValue ->
                    referenceBool == operandValue

                Parsers.GreaterThan operandValue ->
                    boolGreaterThan referenceBool operandValue

                Parsers.LessThan operandValue ->
                    boolLessThan referenceBool operandValue
        )
        operands


boolLessThan : Bool -> Bool -> Bool
boolLessThan referenceBool otherBool =
    (not <| referenceBool) && otherBool


boolGreaterThan : Bool -> Bool -> Bool
boolGreaterThan referenceBool otherBool =
    referenceBool && not otherBool


makeFilter :
    { getter : a -> b
    , verifiesExpression : b -> List (ParsedValue b) -> Bool
    , typedParser : Parser b
    , labels : Dict String String
    }
    -> TypedFilter a b
makeFilter { getter, verifiesExpression, typedParser, labels } =
    { filter =
        \value item ->
            verifiesExpression (getter item) value
    , parser = orExpression labels (operandParser typedParser)
    }
