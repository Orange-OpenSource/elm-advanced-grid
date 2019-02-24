module GridTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import Grid exposing(..)
import Grid.Filters exposing (Item)

type alias Item =
    { index: Int
    , isValid : Bool
    , score : Float
    , selected : Bool
    , title : String
    }


item1 : Item
item1 = {
    index = 0
    , isValid = True
    , score = 1.0
    , selected = False
    , title = "ITEM 1"
    }

item2 : Item
item2 = {
    index = 1
    , isValid = False
    , score = 2.0
    , selected = False
    , title = "ITEM 2"
    }


suite : Test
suite =
    describe "The Grid module"
            describeComparators
            


describeComparators =
     [ describe "compareBoolField"
        [ test "should return equal when both fields are true" <|
            \_ ->
                    Expect.equal EQ (compareBoolField (\item -> item.isValid) item1 item1)
        , test "should return equal when both fields are false" <|
            \_ ->
                    Expect.equal EQ (compareBoolField (\item -> item.selected) item1 item2)
        , test "should return LT when first field is false and second field is true" <|
            \_ ->
                    Expect.equal LT (compareBoolField (\item -> item.isValid) item2 item1)
        , test "should return GT when first field is true and second field is false" <|
            \_ ->
                    Expect.equal GT (compareBoolField (\item -> item.isValid) item1 item2)
        ]
     , describe "compareIntField"
        [ test "should return equal when both fields have the same value" <|
            \_ ->
                    Expect.equal EQ (compareIntField (\item -> item.index) item1 item1)
        , test "should return LT when first field value is smaller than second field's one" <|
            \_ ->
                    Expect.equal LT (compareIntField (\item -> item.index) item1 item2)
        , test "should return GT when first field value is greater than second field's one" <|
            \_ ->
                    Expect.equal GT (compareIntField (\item -> item.index) item2 item1)
        ]
     , describe "compareFloatField"
        [ test "should return equal when both fields have the same value" <|
            \_ ->
                    Expect.equal EQ (compareFloatField (\item -> item.score) item1 item1)
        , test "should return LT when first field value is smaller than second field's one" <|
            \_ ->
                    Expect.equal LT (compareFloatField (\item -> item.score) item1 item2)
        , test "should return GT when first field value is greater than second field's one" <|
            \_ ->
                    Expect.equal GT (compareFloatField (\item -> item.score) item2 item1)
        ]
     , describe "compareStringField"
        [ test "should return equal when both fields have the same value" <|
            \_ ->
                    Expect.equal EQ (compareStringField (\item -> item.title) item1 item1)
        , test "should return LT when first field value is before second field's one in lexicographic order" <|
            \_ ->
                    Expect.equal LT (compareStringField (\item -> item.title) item1 item2)
        , test "should return GT when first field value is after second field's one in lexicographic order" <|
            \_ ->
                    Expect.equal GT (compareStringField (\item -> item.title) item2 item1)
        ]
    ]