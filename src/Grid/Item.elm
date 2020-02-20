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

TODO: make Item private?

-}


type alias Item a =
    { contentIndex : Int -- the index of the data in the raw data list
    , data : a -- the wrapped data
    , editedColumnId : Maybe String
    , editedValue : String
    , index : Int
    , selected : Bool
    }


withData : Item a -> a -> Item a
withData item value =
    { item | data = value }


create : a -> Int -> Item a
create data contentIndex =
    { contentIndex = contentIndex
    , data = data
    , editedColumnId = Nothing
    , editedValue = ""
    , index = contentIndex
    , selected = False
    }
