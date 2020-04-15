module Fixtures exposing (Data, columns, data, dataOrderedByAscendingScore, dataOrderedByDescendingScore, dataWithScoreGreaterThan2, gridConfig, isValidColumn, item1, item2, item3SpaceInTitle, item4WithSymbols, item5WithAccentuatedChars, item6, model, modelWithOneEmptyTitle, scoreColumn, titleColumn)

{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}

import Dict
import Grid exposing (ColumnConfig, Model, Sorting(..), boolColumnConfig, floatColumnConfig, stringColumnConfig)
import Grid.Item as Item exposing (Item)


type alias Data =
    { count : Int
    , isValid : Bool
    , score : Float
    , title : String
    }


data1 : Data
data1 =
    { count = 1
    , isValid = True
    , score = 1.0
    , title = "ITEM1"
    }


item1 : Item Data
item1 =
    Item.create data1 1


data2 : Data
data2 =
    { count = 2
    , isValid = False
    , score = 2.0
    , title = "ITEM2"
    }


item2 : Item Data
item2 =
    Item.create data2 2


data3 : Data
data3 =
    { count = 3
    , isValid = True
    , score = 4.0
    , title = "ITEM 3"
    }


item3SpaceInTitle : Item Data
item3SpaceInTitle =
    Item.create data3 3


data4 : Data
data4 =
    { count = 4
    , isValid = True
    , score = 3.0
    , title = ",.$£:;(){}[]!?"
    }


item4WithSymbols : Item Data
item4WithSymbols =
    Item.create data4 4


data5 : Data
data5 =
    { count = 520
    , isValid = True
    , score = 3.1415926
    , title = "éàèêùÉÈÊ5"
    }


item5WithAccentuatedChars : Item Data
item5WithAccentuatedChars =
    Item.create data5 5


data6 : Data
data6 =
    { count = 42
    , isValid = True
    , score = 1
    , title = ""
    }


item6 : Item Data
item6 =
    Item.create data6 6


data : List Data
data =
    [ data1, data2, data3, data4 ]


dataOrderedByAscendingScore : List Data
dataOrderedByAscendingScore =
    [ data1, data2, data4, data3 ]


dataOrderedByDescendingScore : List Data
dataOrderedByDescendingScore =
    [ data3, data4, data2, data1 ]


dataWithScoreGreaterThan2 : List Data
dataWithScoreGreaterThan2 =
    [ data3, data4 ]


dataWithOneEmptyCell : List Data
dataWithOneEmptyCell =
    data6 :: data


scoreColumn =
    floatColumnConfig
        { id = "score"
        , getter = .score
        , localize = identity
        , setter = \item _ -> item
        , title = "Score"
        , tooltip = "Some text"
        , width = 50
        }


titleColumn =
    stringColumnConfig
        { id = "title"
        , editor = Nothing
        , getter = .title
        , localize = identity
        , setter = \item _ -> item
        , title = "Title"
        , tooltip = "Some text"
        , width = 100
        }
        Dict.empty


isValidColumn =
    boolColumnConfig
        { id = "isValid"
        , getter = .isValid
        , localize = identity
        , setter = \item _ -> item
        , title = "is Valid?"
        , tooltip = "Some text"
        , width = 100
        }


columns : List (ColumnConfig Data)
columns =
    [ scoreColumn
    , titleColumn
    , isValidColumn
    ]


gridConfig : Grid.Config Data
gridConfig =
    { canSelectRows = True
    , columns = columns
    , containerId = "grid-container"
    , footerHeight = 20
    , hasFilters = True
    , headerHeight = 60
    , lineHeight = 20
    , labels = Dict.empty
    , rowClass = rowClass
    }


rowClass : Item Data -> String
rowClass item =
    if item.selected then
        "selected-item"

    else
        ""


model : Model Data
model =
    let
        ( gridModel, _ ) =
            Grid.init gridConfig data
    in
    gridModel


modelWithOneEmptyTitle : Model Data
modelWithOneEmptyTitle =
    let
        ( gridModel, _ ) =
            Grid.init gridConfig dataWithOneEmptyCell
    in
    gridModel
