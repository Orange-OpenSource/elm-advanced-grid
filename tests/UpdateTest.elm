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
    [ describe "when receiving"
        [ test "HeaderClicked scoreColumn message once should set data in ascending score order" <|
            \_ ->
                let
                    visibleData =
                        simulateHeaderClick model
                            |> Grid.visibleData
                in
                Expect.equalLists dataOrderedByAscendingScore visibleData
        , test "HeaderClicked scoreColumn message twice should order data by descending score" <|
            \_ ->
                let
                    visibleData =
                        model
                            |> simulateHeaderClick
                            |> simulateHeaderClick
                            |> Grid.visibleData
                in
                Expect.equalLists dataOrderedByDescendingScore visibleData
        , test "HeaderClicked scoreColumn message three times should order items by ascending score" <|
            \_ ->
                let
                    visibleData =
                        model
                            |> simulateHeaderClick
                            |> simulateHeaderClick
                            |> simulateHeaderClick
                            |> Grid.visibleData
                in
                Expect.equalLists dataOrderedByAscendingScore visibleData
        ]
    , describe "when receiving FilterModified message"
        [ test "should filter items" <|
            \_ ->
                let
                    ( filteredModel, _ ) =
                        update (FilterModified scoreColumn "< 3.0") model
                in
                Expect.equal 2 (List.length (visibleData filteredModel))
        ]
    , describe "when receiving UserToggledColumnVisibility message"
        [ test "should remove filters" <|
            \_ ->
                let
                    ( filteredModel, _ ) =
                        update (FilterModified scoreColumn "< 3.0") model

                    ( newModel, _ ) =
                        update (UserToggledColumnVisibility scoreColumn) filteredModel
                in
                Expect.equalLists data (Grid.visibleData newModel)
        ]
    , describe "when receiving UserToggledAllItemSelection message"
        [ test "should select visible rows only" <|
            \_ ->
                let
                    ( filteredModel, _ ) =
                        update (FilterModified scoreColumn "> 2.0") model

                    ( updatedModel, _ ) =
                        update UserToggledAllItemSelection filteredModel
                in
                Expect.equalLists dataWithScoreGreaterThan2 (visibleData updatedModel)
        ]
    ]


simulateHeaderClick model =
    let
        ( newModel, _ ) =
            update (UserClickedHeader scoreColumn) model
    in
    newModel
