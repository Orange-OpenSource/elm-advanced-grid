module Grid.Labels exposing (..)

import Dict exposing (Dict)
import List.Extra


{-| Translates a given text using the provided dictionary of translations
If no translation is found, the text itself is returned

The keys of the translation dictionary must be the ones defined in the "keys" variable

-}
localize : String -> Dict String String -> String
localize key translations =
    Dict.get key translations
        |> Maybe.withDefault key


{-| The list of string used to identify the labels to be displayed
-}
keys : List String
keys =
    [ cancel
    , clear
    , empty
    , openQuickFilter
    , submit
    ]


cancel : String
cancel =
    "cancel"


clear : String
clear =
    "Clear"


empty : String
empty =
    "Empty"


openQuickFilter : String
openQuickFilter =
    "Open quick filter"


submit : String
submit =
    "Submit"
