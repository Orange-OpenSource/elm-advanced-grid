module Grid.List exposing (..)

{-| Concatenates too list when a given condition is verified
-}


appendIf : Bool -> List a -> List a -> List a
appendIf condition conditionalAttributes attributeList =
    if condition then
        attributeList ++ conditionalAttributes

    else
        attributeList
