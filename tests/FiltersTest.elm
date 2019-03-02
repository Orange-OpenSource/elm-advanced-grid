module FiltersTest exposing (..)

import Fixtures exposing (columns, item1, item2)
import Fuzz exposing (string)
import Grid.Filters exposing (Filter(..), Item, boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Expect
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
        , fuzz string "should return no filter when filtering string for intFilter is not valid" <|
            \randomString ->
                parseFilteringString (Just (removeComparisonOperator randomString)) intFilters
                |> Expect.equal Nothing

        , test "should detect if a int is equal to another" <|
            \_ ->
                testIntComparisonParsingSucceeds  "=1" item2
        , test "should detect if a int is different than another" <|
            \_ ->
                testIntComparisonParsingFails  "=0" item2
        , test "should detect if a int is lesser than another" <|
            \_ ->
                testIntComparisonParsingSucceeds "<1" item1
        , test "should detect if a int is not lesser than another" <|
            \_ ->
                testIntComparisonParsingFails "<1" item2
        , test "should detect if a  int is greater than another" <|
            \_ ->
                testIntComparisonParsingSucceeds ">0" item2
        , test "should detect if a  int is not greater another" <|
            \_ ->
                testIntComparisonParsingFails ">2" item2
        ]
     , describe "parseFilteringString for float"
        [ test "should return no filter when there is no filtering string for floatFilter" <|
            \_ ->
                parseFilteringString Nothing floatFilters
                |> Expect.equal Nothing
        , fuzz string "should return no filter when filtering string for floatFilter is not valid" <|
            \randomString ->
                parseFilteringString (Just (removeComparisonOperator randomString)) floatFilters
                |> Expect.equal Nothing
        , test "should detect if a float is equal to another" <|
            \_ ->
                testFloatComparisonParsingSucceeds  "=2.0" item2
        , test "should detect if a float is different than another" <|
            \_ ->
                testFloatComparisonParsingFails  "=3.0" item2
        , test "should detect if a float is lesser than another" <|
            \_ ->
                testFloatComparisonParsingSucceeds "<1.1" item1
        , test "should detect if a float is not lesser than another" <|
            \_ ->
                testFloatComparisonParsingFails "<1.5" item2
        , test "should detect if a  float is greater than another" <|
            \_ ->
                testFloatComparisonParsingSucceeds ">1.8" item2
        , test "should detect if a  float is not greater another" <|
            \_ ->
                testFloatComparisonParsingFails ">2.5" item2
        ]
     , describe "parseFilteringString for bool"
        [ test "should return no filter when there is no filtering string for boolFilter" <|
            \_ ->
                parseFilteringString Nothing boolFilters
                |> Expect.equal Nothing
        , fuzz string "should return no filter when filtering string for boolFilter is not valid" <|
            \randomString ->
                parseFilteringString (Just (removeComparisonOperator randomString)) boolFilters
                |> Expect.equal Nothing
        , test "should detect if a bool is equal to another" <|
            \_ ->
                testBoolComparisonParsingSucceeds  "=true" item1
        , test "should detect if a bool is different than another" <|
            \_ ->
                testBoolComparisonParsingFails  "=false" item1
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
        , fuzz string "should return no filter when filtering string for StringFilter is not valid" <|
            \randomString ->
                parseFilteringString (Just (removeComparisonOperator randomString)) stringFilters
                |> Expect.equal Nothing
        , test "should detect if a String is equal to another" <|
            \_ ->
                testStringComparisonParsingSucceeds  "=ITEM 2" item2
        , test "should detect if a String is different than another" <|
            \_ ->
                testStringComparisonParsingFails  "=ABCD" item2
        , test "should detect if a String is lesser than another" <|
            \_ ->
                testStringComparisonParsingSucceeds "<ITEM 42" item1
        , test "should detect if a String is not lesser than another" <|
            \_ ->
                testStringComparisonParsingFails "<ITEM 1" item2
        , test "should detect if a String is greater than another" <|
            \_ ->
                testStringComparisonParsingSucceeds ">ITEM 1" item2
        , test "should detect if a String is not greater than another" <|
            \_ ->
                testStringComparisonParsingFails ">ITEM 3" item2
        ]
    ]

-- removes the comparison operator if it's the first char
removeComparisonOperator : String -> String
removeComparisonOperator str =
    let
        trimmedString = String.trimLeft str
    in
    if String.startsWith "=" trimmedString
        || String.startsWith "<" trimmedString
        || String.startsWith ">" trimmedString then
            removeComparisonOperator <| String.dropLeft 1 trimmedString
    else
        str

intFilters =
    IntFilter <| intFilter (\item -> item.index)

floatFilters =
    FloatFilter <| floatFilter (\item -> item.score)

boolFilters =
    BoolFilter <| boolFilter (\item -> item.isValid)

stringFilters =
    StringFilter <| stringFilter (\item -> item.title)

testIntComparisonParsingSucceeds filteringString item =
    let
        filter = parseFilteringString (Just filteringString) intFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.true "The int comparison should have succeeded" result

testIntComparisonParsingFails filteringString item =
    let
        filter = parseFilteringString (Just filteringString) intFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.false "The int comparison should have failed" result

testFloatComparisonParsingSucceeds filteringString item =
    let
        filter = parseFilteringString (Just filteringString) floatFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.true "The float comparison should have succeeded" result

testFloatComparisonParsingFails filteringString item =
    let
        filter = parseFilteringString (Just filteringString) floatFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.false "The float comparison should have failed" result

testBoolComparisonParsingSucceeds filteringString item =
    let
        filter = parseFilteringString (Just filteringString) boolFilters
        result = case filter of
            Just predicate ->
                    predicate item
            Nothing ->
                False
    in
    Expect.true "The bool comparison should have succeeded" result

testBoolComparisonParsingFails filteringString item =
    let
        filter = parseFilteringString (Just filteringString) boolFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.false "The bool comparison should have failed" result

testStringComparisonParsingSucceeds filteringString item =
    let
        filter = parseFilteringString (Just filteringString) stringFilters
        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.true "The string comparison should have succeeded" result

testStringComparisonParsingFails filteringString item =
    let
        filter = parseFilteringString (Just filteringString) stringFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.false "The string comparison should have failed" result