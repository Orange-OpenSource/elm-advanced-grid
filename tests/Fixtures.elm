module Fixtures exposing (..)

import Grid exposing (ColumnConfig, Sorting(..), compareBoolField, compareFloatField, compareStringField, viewBool, viewFloat, viewString)
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, stringFilter)
import Css exposing (Style, backgroundColor, hex, transparent)

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


items =
    [ item1, item2 ]


columns : List (ColumnConfig Item)
columns =
    [ { properties =
            { id = "score"
            , order = Unsorted
            , title = "Score"
            , visible = True
            , width = 50
            }
      , filters = FloatFilter <| floatFilter (\item -> item.score)
      , filteringValue = Nothing
      , renderer = viewFloat (\item -> item.score)
      , comparator = compareFloatField (\item -> item.score)
      }
    , { properties =
            { id = "title"
            , order = Unsorted
            , title = "Title"
            , visible = True
            , width = 100
            }
      , filters = StringFilter <| stringFilter (\item -> item.title)
      , filteringValue = Nothing
      , renderer = viewString (\item -> item.title)
      , comparator = compareStringField (\item -> item.title)
      }
    , { properties =
            { id = "isValid"
            , order = Unsorted
            , title = "is Valid?"
            , visible = True
            , width = 100
            }
      , filters = BoolFilter <| boolFilter (\item -> item.isValid)
      , filteringValue = Nothing
      , renderer = viewBool (\item -> item.isValid)
      , comparator = compareBoolField (\item -> item.isValid)
      }
    ]


gridConfig : Grid.Config Item
gridConfig =
    { canSelectRows = True
    , columns = columns
    , containerHeight = 500
    , containerWidth = 700
    , hasFilters = True
    , lineHeight = 20
    , rowStyle = rowColor
    }


rowColor : Item -> Style
rowColor item =
    if item.selected then
        backgroundColor (hex "FFE3AA")

    else
        backgroundColor transparent


model =
    Grid.init gridConfig items