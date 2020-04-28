module QuickFilterTest exposing (..)

import Dict
import Expect
import Grid.QuickFilter exposing (inputValues)
import Set
import Test exposing (Test, describe, test)


suite : Test
suite =
    describe "The quick filter module" <|
        describeQuickFilter


describeQuickFilter =
    [ describe "inputValues"
        [ test "should return a set containing one item if the input string contains one word" <|
            \_ ->
                inputValues Dict.empty (Just "Paris")
                    |> Expect.equal (Set.fromList [ "Paris" ])
        , test "should return a set containing operands if the input string contains an or expression" <|
            \_ ->
                inputValues Dict.empty (Just "Paris or Bangalore or New York")
                    |> Expect.equal (Set.fromList [ "Paris", "Bangalore", "New York" ])
        , test "should return a set containing one item if the input string contains one word prefixed with =" <|
            \_ ->
                inputValues Dict.empty (Just "=Paris")
                    |> Expect.equal (Set.fromList [ "Paris" ])
        , test "should return a set containing operands if the input string contains an or expression with values prefixed with equals" <|
            \_ ->
                inputValues Dict.empty (Just "=Paris or =Bangalore or New York")
                    |> Expect.equal (Set.fromList [ "Paris", "Bangalore", "New York" ])
        ]
    ]
