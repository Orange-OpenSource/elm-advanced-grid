module Grid.Item exposing (Item, create)

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

TODO: make Item private

-}


type alias Item a =
    { data : a
    , editedColumnId : Maybe String
    , index : Int
    , selected : Bool
    }


create : a -> Int -> Item a
create data index =
    { data = data
    , editedColumnId = Nothing
    , index = index
    , selected = False
    }
