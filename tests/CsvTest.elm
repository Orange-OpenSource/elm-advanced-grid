module CsvTest exposing (..)

import Expect exposing (Expectation)
import Fixtures exposing (Data, item1, item3SpaceInTitle, model)
import Grid exposing (Model)
import Grid.Csv as Csv exposing (csvEndOfLine, visibleItemsToCsv)
import Test exposing (..)


headerLine : String
headerLine =
    Csv.bom ++ "Score;Title;is Valid?"


modelWithSelectedItems : Model Data
modelWithSelectedItems =
    let
        ( modelWithOneSelectedItem, _ ) =
            Grid.update (Grid.UserToggledSelection item1) model

        ( modelWithTwoSelectedItem, _ ) =
            Grid.update (Grid.UserToggledSelection item3SpaceInTitle) modelWithOneSelectedItem
    in
    modelWithTwoSelectedItem


suite : Test
suite =
    describe "The CSV module"
        [ describe "visibleItemsToCsv"
            [ test "should return title line containing column names" <|
                \_ ->
                    model
                        |> visibleItemsToCsv ";"
                        |> String.split csvEndOfLine
                        |> List.head
                        |> Maybe.withDefault ""
                        |> Expect.equal headerLine
            ]
        , test "should return data for all lines when no item is selected" <|
            \_ ->
                model
                    |> visibleItemsToCsv ";"
                    |> String.split csvEndOfLine
                    -- drop the title line
                    |> List.drop 1
                    |> Expect.equal
                        [ "1;ITEM1;true"
                        , "2;ITEM2;false"
                        , "4;ITEM 3;true"
                        , "3;,.$£:;(){}[]!?;true"
                        ]
        , test "should return data lines for selected lines only if any" <|
            \_ ->
                modelWithSelectedItems
                    |> visibleItemsToCsv ";"
                    |> String.split csvEndOfLine
                    -- drop the title line
                    |> List.drop 1
                    |> Expect.equal
                        [ "1;ITEM1;true"
                        , "4;ITEM 3;true"
                        ]
        ]
