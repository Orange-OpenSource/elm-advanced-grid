module FiltersTest exposing (..)

import Fixtures exposing (columns, item1, item2)
import Grid.Filters exposing (Filter(..), Item, boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Expect
import Test exposing (..)


suite : Test
suite =
    describe "The Grid.Filters module" <|
        describeFilterParsing

intFilters =
    IntFilter <| intFilter (\item -> item.index)

describeFilterParsing =
    [ describe "parseFilteringString"
        [ test "should return no filter when there is no filtering string" <|
            \_ ->
                parseFilteringString Nothing intFilters
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
    ]


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