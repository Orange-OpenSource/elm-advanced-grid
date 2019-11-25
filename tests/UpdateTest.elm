module UpdateTest exposing (describeHeaderClicked, suite)

{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}

import Expect
import Fixtures exposing (..)
import Grid exposing (..)
import List.Extra
import Test exposing (..)


suite : Test
suite =
    describe "The Grid update function" <|
        describeHeaderClicked


describeHeaderClicked =
    [ describe "receiving HeaderClicked"
        [ test "scoreColumn msg once should order items by ascending score and update indexes" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick model
                in
                Expect.equalLists modelSortedByAscendingScore.content newModel.content
        , test "scoreColumn msg once should set order to Ascending" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick model
                in
                Expect.equal Ascending newModel.order
        , test "scoreColumn msg once should set sortedBy to scoreColumn" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick model
                in
                Expect.equal (Just scoreColumn) newModel.sortedBy
        , test "scoreColumn msg twice should order items by descending score and update indexes" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick modelSortedByAscendingScore
                in
                Expect.equalLists modelSortedByDescendingScore.content newModel.content
        , test "scoreColumn msg twice should set order to Descending" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick modelSortedByAscendingScore
                in
                Expect.equal Descending newModel.order
        , test "scoreColumn msg twice should set sortedBy to scoreColumn" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick modelSortedByAscendingScore
                in
                Expect.equal (Just scoreColumn) newModel.sortedBy
        , test "scoreColumn msg three times should order items by ascending score and update indexes" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick <| simulateHeaderClick modelSortedByAscendingScore
                in
                Expect.equalLists modelSortedByAscendingScore.content newModel.content
        , test "scoreColumn msg three times should set order to Ascending" <|
            \_ ->
                let
                    newModel =
                        simulateHeaderClick <| simulateHeaderClick modelSortedByAscendingScore
                in
                Expect.equal Ascending newModel.order
        ]
    , describe "receiving UserToggledColumnVisibility msg"
        [ test "should clear the filtering value" <|
            \_ ->
                let
                    ( newModel, _ ) =
                        update (UserToggledColumnVisibility filteredScoreColumn) (withColumns filteredColumns model)

                    updatedScoreColumn =
                        List.Extra.find isScoreColumn newModel.config.columns
                            |> Maybe.withDefault filteredScoreColumn
                in
                Expect.equal Nothing updatedScoreColumn.filteringValue
        ]
    ]


simulateHeaderClick model =
    let
        ( newModel, _ ) =
            update (UserClickedHeader scoreColumn) model
    in
    newModel


modelSortedByAscendingScore =
    { model
        | content =
            [ { index = 0, selected = False, data = { count = 1, isValid = True, score = 1, title = "ITEM 1" } }
            , { index = 1, selected = False, data = { count = 2, isValid = False, score = 2, title = "ITEM 2" } }
            , { index = 2, selected = False, data = { count = 4, isValid = True, score = 3, title = "ITEM 4" } }
            , { index = 3, selected = False, data = { count = 3, isValid = True, score = 4, title = "ITEM 3" } }
            ]
        , order = Ascending
        , sortedBy = Just scoreColumn
    }


modelSortedByDescendingScore =
    { model
        | content =
            [ { index = 0, selected = False, data = { count = 3, isValid = True, score = 4, title = "ITEM 3" } }
            , { index = 1, selected = False, data = { count = 4, isValid = True, score = 3, title = "ITEM 4" } }
            , { index = 2, selected = False, data = { count = 2, isValid = False, score = 2, title = "ITEM 2" } }
            , { index = 3, selected = False, data = { count = 1, isValid = True, score = 1, title = "ITEM 1" } }
            ]
        , order = Descending
        , sortedBy = Just scoreColumn
    }


isScoreColumn : ColumnConfig Data -> Bool
isScoreColumn columnConfig =
    columnConfig.properties.id == scoreColumn.properties.id


filteredScoreColumn =
    { scoreColumn | filteringValue = Just "> 10" }


filteredColumns =
    model.config.columns
        |> List.Extra.updateIf isScoreColumn (\_ -> filteredScoreColumn)
