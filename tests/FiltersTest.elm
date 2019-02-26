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

intFilters =
    IntFilter <| intFilter (\item -> item.index)

floatFilters =
    FloatFilter <| floatFilter (\item -> item.score)

describeFilterParsing =
    [ describe "parseFilteringString for int"
        [ test "should return no filter when there is no filtering string" <|
            \_ ->
                parseFilteringString Nothing intFilters
                |> Expect.equal Nothing
        , fuzz string "should return no filter when there filtering string for intFilter is not valid" <|
            \randomString ->
                parseFilteringString (Just (removeComparisonOperator randomString)) intFilters
                |> Expect.equal Nothing

        , test "should return a filter detecting int equality when the filtering string is an int equality" <|
            \_ ->
                testIntComparisonParsingSucceeds  "=1" item2
        , test "should return a filter detecting int inequality when the filtering string is an int equality" <|
            \_ ->
                testIntComparisonParsingFails  "=0" item2
        , test "should return a filter detecting int is lesser than when the filtering string is a lesser than int comparison" <|
            \_ ->
                testIntComparisonParsingSucceeds "<1" item1
        , test "should return a filter detecting int is not lesser than when the filtering string is a lesser than int comparison" <|
            \_ ->
                testIntComparisonParsingFails "<1" item2
        , test "should return filter detecting an int is greater than when the filtering string is a greater than int comparison" <|
            \_ ->
                testIntComparisonParsingSucceeds ">0" item2
        , test "should return filter detecting an int is not greater than when the filtering string is a greater than int comparison" <|
            \_ ->
                testIntComparisonParsingFails ">2" item2
        ]
     , describe "parseFilteringString for float"
        [ test "should return no filter when there is no filtering string for floatFilter" <|
            \_ ->
                parseFilteringString Nothing floatFilters
                |> Expect.equal Nothing
        , fuzz string "should return no filter when there filtering string for floatFilter is not valid" <|
            \randomString ->
                parseFilteringString (Just (removeComparisonOperator randomString)) floatFilters
                |> Expect.equal Nothing
        , test "should return a filter detecting float equality when the filtering string is an float equality" <|
            \_ ->
                testFloatComparisonParsingSucceeds  "=2.0" item2
        , test "should return a filter detecting float inequality when the filtering string is an float equality" <|
            \_ ->
                testFloatComparisonParsingFails  "=3.0" item2
        , test "should return a filter detecting float is lesser than when the filtering string is a lesser than float comparison" <|
            \_ ->
                testFloatComparisonParsingSucceeds "<1.1" item1
        , test "should return a filter detecting float is not lesser than when the filtering string is a lesser than float comparison" <|
            \_ ->
                testFloatComparisonParsingFails "<1.5" item2
        , test "should return filter detecting an float is greater than when the filtering string is a greater than float comparison" <|
            \_ ->
                testFloatComparisonParsingSucceeds ">1.8" item2
        , test "should return filter detecting an float is not greater than when the filtering string is a greater than float comparison" <|
            \_ ->
                testFloatComparisonParsingFails ">2.5" item2
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
            String.dropLeft 1 trimmedString
    else
        str


testIntComparisonParsingSucceeds filteringString item =
    let
        filter = parseFilteringString (Just filteringString) intFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.true "The int comparison succeeded" result

testIntComparisonParsingFails filteringString item =
    let
        filter = parseFilteringString (Just filteringString) intFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.false "The int comparison succeeded" result

testFloatComparisonParsingSucceeds filteringString item =
    let
        filter = parseFilteringString (Just filteringString) floatFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.true "The float comparison succeeded" result

testFloatComparisonParsingFails filteringString item =
    let
        filter = parseFilteringString (Just filteringString) floatFilters

        result = case filter of
            Just predicate ->
                predicate item
            Nothing ->
                False
    in
    Expect.false "The float comparison succeeded" result