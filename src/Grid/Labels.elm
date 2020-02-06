module Grid.Labels exposing (..)

import Dict exposing (Dict)
import List.Extra


{-| a dictionary of texts to be displayed in GUI
English being the default language, keys are the english text to be displayed
That's why keys and values are identical in the default labels dictionary
For other language, Just give the Grid.init a Dict <english key> <translation>
-}
labels : Dict String String
labels =
    List.Extra.zip keys keys
        |> Dict.fromList


localize : String -> Dict String String -> String
localize key translations =
    Dict.get key translations
        |> Maybe.withDefault key


{-| The list of string used to identify the labels to be displayed
-}
keys =
    [ clear
    , empty
    , openQuickFilter
    ]


empty : String
empty =
    "Empty"


clear : String
clear =
    "Effacer"


openQuickFilter : String
openQuickFilter =
    "Open quick filter"
