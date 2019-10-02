module Fixtures exposing (Item, columns, gridConfig, isValidColumn, item1, item2, item3, item4, item5, items, model, scoreColumn, titleColumn)

{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}

import Grid exposing (ColumnConfig, Model, Sorting(..), boolColumnConfig, floatColumnConfig, stringColumnConfig)


type alias Item =
    { index : Int
    , isValid : Bool
    , score : Float
    , selected : Bool
    , title : String
    }


item1 : Item
item1 =
    { index = 0
    , isValid = True
    , score = 1.0
    , selected = False
    , title = "ITEM 1"
    }


item2 : Item
item2 =
    { index = 1
    , isValid = False
    , score = 2.0
    , selected = False
    , title = "ITEM 2"
    }


item3 : Item
item3 =
    { index = 2
    , isValid = True
    , score = 4.0
    , selected = False
    , title = "ITEM 3"
    }


item4 : Item
item4 =
    { index = 3
    , isValid = True
    , score = 3.0
    , selected = False
    , title = "ITEM 4"
    }


item5 : Item
item5 =
    { index = 3526
    , isValid = True
    , score = 3.1415926
    , selected = False
    , title = "ITEM 5"
    }


items : List Item
items =
    [ item1, item2, item3, item4 ]


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


columns : List (ColumnConfig Item)
columns =
    [ scoreColumn
    , titleColumn
    , isValidColumn
    ]


gridConfig : Grid.Config Item
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


rowClass : Item -> String
rowClass item =
    if item.selected then
        "selected-item"

    else
        ""


model : Model Item
model =
    Grid.init gridConfig items
