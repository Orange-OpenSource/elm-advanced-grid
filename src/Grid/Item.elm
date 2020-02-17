module Grid.Item exposing (Item, create, withData)

{-| The data to be displayed in the grid
You should only read them

    items =
        [ { index = 0
          , selected = False
          , isEdited = False
          , data = { name = "item0" }
          }
        , { index = 1
          , selected = False
          , isEdited = False
          , data = { name = "item1" }
          }
        ]

TODO: make Item private?

-}


type alias Item a =
    { data : a
    , editedColumnId : Maybe String
    , editedValue : String
    , index : Int
    , selected : Bool
    }


withData : Item a -> a -> Item a
withData item value =
    { item | data = value }


create : a -> Int -> Item a
create data index =
    { data = data
    , editedColumnId = Nothing
    , editedValue = ""
    , index = index
    , selected = False
    }
