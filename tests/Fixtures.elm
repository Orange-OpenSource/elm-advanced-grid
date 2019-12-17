module Fixtures exposing (Data, columns, data, dataOrderedByAscendingScore, dataOrderedByDescendingScore, dataWithScoreGreaterThan2, gridConfig, isValidColumn, item1, item2, item3, item4, item5, model, scoreColumn, titleColumn)

{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}

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
    , title = "ITEM 1"
    }


item1 : Item Data
item1 =
    Item.create data1 1


data2 : Data
data2 =
    { count = 2
    , isValid = False
    , score = 2.0
    , title = "ITEM 2"
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


item3 : Item Data
item3 =
    Item.create data3 3


data4 : Data
data4 =
    { count = 4
    , isValid = True
    , score = 3.0
    , title = "ITEM 4"
    }


item4 : Item Data
item4 =
    Item.create data4 4


data5 : Data
data5 =
    { count = 520
    , isValid = True
    , score = 3.1415926
    , title = "ITEM 5"
    }


item5 : Item Data
item5 =
    Item.create data5 5


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


scoreColumn =
    floatColumnConfig
        { id = "score"
        , getter = .score
        , localize = identity
        , title = "Score"
        , tooltip = "Some text"
        , width = 50
        }


titleColumn =
    stringColumnConfig
        { id = "title"
        , getter = .title
        , localize = identity
        , title = "Title"
        , tooltip = "Some text"
        , width = 100
        }


isValidColumn =
    boolColumnConfig
        { id = "isValid"
        , getter = .isValid
        , localize = identity
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
    , containerHeight = 500
    , containerWidth = 700
    , hasFilters = True
    , headerHeight = 60
    , lineHeight = 20
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
    Grid.init gridConfig data
