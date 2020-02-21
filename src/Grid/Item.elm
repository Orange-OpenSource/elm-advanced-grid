module Grid.Item exposing (Item, create, withData)

{-| The data to be displayed in the grid
You should only read them

    items =
        [ { contentIndex = 0
          , index = 0
          , selected = False
          , isEdited = False
          , editedColumnId = Nothing
          , editedValue = ""
          , data = { name = "item0" }
          }
        , { contentIndex = 1
          , index = 1
          , selected = False
          , isEdited = False
          , editedColumnId = Nothing
          , editedValue = ""
          , data = { name = "item1" }
          }
        ]

-}


type alias Item a =
    { contentIndex : Int -- the index of the data in the raw data list
    , data : a -- the wrapped data
    , visibleIndex : Int -- the index of the Item in the visible items list
    , selected : Bool
    }


withData : Item a -> a -> Item a
withData item value =
    { item | data = value }


create : a -> Int -> Item a
create data contentIndex =
    { contentIndex = contentIndex
    , data = data
    , selected = False
    , visibleIndex = contentIndex
    }
