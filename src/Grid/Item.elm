module Grid.Item exposing (Item, create)

{-| The data to be displayed in the grid
You should only read them

    items =
        [ { index = 0
          , selected = False
          , data = { name = "item0" }
          }
        , { index = 1
          , selected = False
          , data = { name = "item1" }
          }
        ]

-}


type alias Item a =
    { data : a
    , index : Int
    , selected : Bool
    }


create : a -> Int -> Item a
create data index =
    { data = data
    , index = index
    , selected = False
    }
