module FiltersTest exposing (boolFilters, describeFilterParsing, floatFilters, intFilters, removeComparisonOperator, stringFilters, suite, testBoolComparisonParsingFails, testBoolComparisonParsingSucceeds, testFloatComparisonParsingFails, testFloatComparisonParsingSucceeds, testIntComparisonParsingFails, testIntComparisonParsingSucceeds, testStringComparisonParsingFails, testStringComparisonParsingSucceeds)

{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}

import Dict
import Expect
import Fixtures exposing (item1, item2, item3SpaceInTitle, item4WithSymbols, item5WithAccentuatedChars, item6)
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Grid.Labels as Label
import Test exposing (..)


suite : Test
suite =
    describe "The Grid.Filters module" <|
        describeFilterParsing


describeFilterParsing =
    [ describe "parseFilteringString for int"
        [ test "should return no filter when there is no filtering string" <|
            \_ ->
                parseFilteringString Nothing intFilters
                    |> Expect.equal Nothing
        , test "should detect if an int is equal to another" <|
            \_ ->
                testIntComparisonParsingSucceeds "=2" item2
        , test "should detect if an int is different of another" <|
            \_ ->
                testIntComparisonParsingFails "=0" item2
        , test "should detect if an int contains another" <|
            \_ ->
                testIntComparisonParsingSucceeds "52" item5WithAccentuatedChars
        , test "should detect if an int does not contain another" <|
            \_ ->
                testIntComparisonParsingFails "53" item5WithAccentuatedChars
        , test "should detect if an int is lesser than another" <|
            \_ ->
                testIntComparisonParsingSucceeds "<2" item1
        , test "should detect if an int is not lesser than another" <|
            \_ ->
                testIntComparisonParsingFails "<1" item2
        , test "should detect if an int is greater than another" <|
            \_ ->
                testIntComparisonParsingSucceeds ">0" item2
        , test "should detect if an int is not greater another" <|
            \_ ->
                testIntComparisonParsingFails ">2" item2
        ]
    , describe "parseFilteringString for float"
        [ test "should return no filter when there is no filtering string for floatFilter" <|
            \_ ->
                parseFilteringString Nothing floatFilters
                    |> Expect.equal Nothing
        , test "should detect if a float is equal to another" <|
            \_ ->
                testFloatComparisonParsingSucceeds "=2.0" item2
        , test "should detect if a float is different of another" <|
            \_ ->
                testFloatComparisonParsingFails "=3.0" item2
        , test "should detect if a float contains another" <|
            \_ ->
                testFloatComparisonParsingSucceeds "3" item5WithAccentuatedChars

        -- TODO : not implemented
        --        , test "should detect if a float contains another one beginning by a dot" <|
        --            \_ ->
        --                testFloatComparisonParsingSucceeds ".14" item5
        , test "should detect if a float does not contain another" <|
            \_ ->
                testFloatComparisonParsingFails "42" item5WithAccentuatedChars
        , test "should detect if a float is lesser than another" <|
            \_ ->
                testFloatComparisonParsingSucceeds "<1.1" item1
        , test "should detect if a float is not lesser than another" <|
            \_ ->
                testFloatComparisonParsingFails "<1.5" item2
        , test "should detect if a float is greater than another" <|
            \_ ->
                testFloatComparisonParsingSucceeds ">1.8" item2
        , test "should detect if a float is not greater another" <|
            \_ ->
                testFloatComparisonParsingFails ">2.5" item2
        ]
    , describe "parseFilteringString for bool"
        [ test "should return no filter when there is no filtering string for boolFilter" <|
            \_ ->
                parseFilteringString Nothing boolFilters
                    |> Expect.equal Nothing
        , test "should detect if a bool is equal to another" <|
            \_ ->
                testBoolComparisonParsingSucceeds "=true" item1
        , test "should detect if a bool is different of another" <|
            \_ ->
                testBoolComparisonParsingFails "=false" item1
        , test "should detect if a bool contains another" <|
            \_ ->
                testBoolComparisonParsingSucceeds "true" item1
        , test "should detect if a bool does not contain another" <|
            \_ ->
                testBoolComparisonParsingFails "false" item1

        -- TODO : not implemented
        --        , test "should detect if a bool contains a substring" <|
        --            \_ ->
        --                testBoolComparisonParsingSucceeds "tr" item1
        --        , test "should detect if a bool contains a substring with capital letters" <|
        --            \_ ->
        --                testBoolComparisonParsingSucceeds "TR" item1
        , test "should detect if a bool is lesser than another" <|
            \_ ->
                testBoolComparisonParsingSucceeds "< true" item2
        , test "should detect if a bool is not lesser than another" <|
            \_ ->
                testBoolComparisonParsingFails "< true" item1
        , test "should detect if a boolean is greater than another" <|
            \_ ->
                testBoolComparisonParsingSucceeds "> false" item1
        , test "should detect if a boolean is not greater than another" <|
            \_ ->
                testBoolComparisonParsingFails "> false" item2
        ]
    , describe "parseFilteringString for String"
        [ test "should return no filter when there is no filtering string for StringFilter" <|
            \_ ->
                parseFilteringString Nothing stringFilters
                    |> Expect.equal Nothing
        , test "should detect if a String is equal to another" <|
            \_ ->
                testStringComparisonParsingSucceeds "=ITEM2" item2
        , test "should detect if a String including a space is equal to another" <|
            \_ ->
                testStringComparisonParsingSucceeds "=ITEM 3" item3SpaceInTitle
        , test "should detect if a String including a comma is equal to another" <|
            \_ ->
                testStringComparisonParsingSucceeds "=,.$£:;(){}[]!?" item4WithSymbols
        , test "should detect if a String including accentuated chars is equal to another" <|
            \_ ->
                testStringComparisonParsingSucceeds "=ÉàèêùéÈÊ5" item5WithAccentuatedChars
        , test "should detect if a String is equal to another, doing a case-insensitive comparison" <|
            \_ ->
                testStringComparisonParsingSucceeds "=itEM2" item2
        , test "should detect if a String is different to another" <|
            \_ ->
                testStringComparisonParsingFails "=ITEM" item2
        , test "should detect if a String contains another" <|
            \_ ->
                testStringComparisonParsingSucceeds "ITEM" item2
        , test "should detect if a String contains another, doing a case-insensitive comparison" <|
            \_ ->
                testStringComparisonParsingSucceeds "tem" item2
        , test "should detect if a String does not contain another" <|
            \_ ->
                testStringComparisonParsingFails "ITEM5" item2
        , test "should detect if a String is lesser than another" <|
            \_ ->
                testStringComparisonParsingSucceeds "<ITEM42" item1
        , test "should detect if a String is not lesser than another, doing a case-insensitive comparison" <|
            \_ ->
                testStringComparisonParsingFails "<a" item1
        , test "should detect if a String is not lesser than another" <|
            \_ ->
                testStringComparisonParsingFails "<ITEM1" item2
        , test "should detect if a String is greater than another" <|
            \_ ->
                testStringComparisonParsingSucceeds ">ITEM1" item2
        , test "should detect if a String is greater than another, doing a case-insensitive comparison" <|
            \_ ->
                testStringComparisonParsingSucceeds ">item1" item2
        , test "should detect if a String is empty" <|
            \_ ->
                testStringComparisonParsingSucceeds ("=" ++ Label.empty) item6
        , test "should detect if a String is not empty" <|
            \_ ->
                testStringComparisonParsingFails ("=" ++ Label.empty) item1
        , test "should detect if a String is not greater than another" <|
            \_ ->
                testStringComparisonParsingFails ">ITEM3" item2
        , test "should detect if one of two sub-strings is contained in a reference string" <|
            \_ ->
                testStringComparisonParsingSucceeds "IT or FOO" item2
        , test "should detect if one of several sub-strings is contained in a reference string" <|
            \_ ->
                testStringComparisonParsingSucceeds "BAR or FOO or BAZ or EM" item2
        , test "should detect strict equality in or expression" <|
            \_ ->
                testStringComparisonParsingSucceeds "=ZIG or =ITEM2" item2
        , test "should detect strict inequality in or expression" <|
            \_ ->
                testStringComparisonParsingFails "=Baz or =ITEM" item2
        , test "should detect a string contains an or expression operand" <|
            \_ ->
                testStringComparisonParsingSucceeds "=Baz or ITEM" item2
        ]
    ]



-- removes the comparison operator if it's the first char


removeComparisonOperator : String -> String
removeComparisonOperator str =
    let
        trimmedString =
            String.trimLeft str
    in
    if
        String.startsWith "=" trimmedString
            || String.startsWith "<" trimmedString
            || String.startsWith ">" trimmedString
    then
        removeComparisonOperator <| String.dropLeft 1 trimmedString

    else
        str


intFilters =
    IntFilter <| intFilter (.data >> .count) Dict.empty


floatFilters =
    FloatFilter <| floatFilter (.data >> .score) Dict.empty


boolFilters =
    BoolFilter <| boolFilter (.data >> .isValid) Dict.empty


stringFilters =
    StringFilter <| stringFilter (.data >> .title) Dict.empty


testIntComparisonParsingSucceeds filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) intFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.true "The int comparison should have succeeded" result


testIntComparisonParsingFails filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) intFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.false "The int comparison should have failed" result


testFloatComparisonParsingSucceeds filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) floatFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.true "The float comparison should have succeeded" result


testFloatComparisonParsingFails filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) floatFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.false "The float comparison should have failed" result


testBoolComparisonParsingSucceeds filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) boolFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.true "The bool comparison should have succeeded" result


testBoolComparisonParsingFails filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) boolFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.false "The bool comparison should have failed" result


testStringComparisonParsingSucceeds filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) stringFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.true "The string comparison should have succeeded" result


testStringComparisonParsingFails filteringString item =
    let
        filter =
            parseFilteringString (Just filteringString) stringFilters

        result =
            case filter of
                Just predicate ->
                    predicate item

                Nothing ->
                    False
    in
    Expect.false "The string comparison should have failed" result
