module GridTest exposing (suite)

import Expect exposing (Expectation)
import Grid exposing (..)
import Test exposing (..)
import Test.Html.Query as Query
import Test.Html.Selector exposing (class, id, tag, text)
import Fixtures exposing (..)

suite : Test
suite =
    describe "The Grid module" <|
        describeComparators



-- ++ describeHeaders


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



{-
   describeHeaders =
       [ describe "headers"
           [ test "should contain a container with three child divs" <|
               \() ->
                   view model
                       |> Query.fromHtml
                       |> Query.findAll [ class "header" ]
                       |> Query.index 0
                       |> Query.has [ text "Score" ]
           ]
       ]
-}
