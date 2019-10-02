module Grid.Filters exposing
    ( Item
    , boolFilter, floatFilter, intFilter, stringFilter
    , Filter(..), parseFilteringString
    )

{-| Helper functions for filtering the grid content


# Data type

@docs Item


# Helpers

@docs boolFilter, floatFilter, intFilter, stringFilter

-}

import Grid.Parsers exposing (boolParser, containsParser, equalityParser, greaterThanParser, lessThanParser, stringParser)
import Parser exposing ((|=), DeadEnd, Parser)


{-| The data to be displayed in the grid
It must be records with at least two fields: selected and index

    items =
        [ { index = 0
          , name = "item0"
          , selected = False
          }
        , { index = 1
          , name = "item1"
          , selected = False
          }
        ]

-}
type alias Item a =
    { a
        | selected : Bool
        , index : Int
    }


{-| Filter for a given column
-}
type Filter a
    = StringFilter (TypedFilter a String)
    | IntFilter (TypedFilter a Int)
    | FloatFilter (TypedFilter a Float)
    | BoolFilter (TypedFilter a Bool)


type alias TypedFilter a b =
    { equal :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    , lessThan :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    , greaterThan :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    , contains :
        { filter : b -> Item a -> Bool
        , parser : Parser b
        }
    }


parseFilteringString : Maybe String -> Filter a -> Maybe (Item a -> Bool)
parseFilteringString filteringValue filter =
    let
        filteringString =
            Maybe.withDefault "" filteringValue
    in
    if filteringString == "" then
        Nothing

    else
        case filter of
            StringFilter stringTypedFilter ->
                validateFilter filteringString stringTypedFilter

            IntFilter intTypedFilter ->
                validateFilter filteringString intTypedFilter

            FloatFilter floatTypedFilter ->
                validateFilter filteringString floatTypedFilter

            BoolFilter boolTypedFilter ->
                validateFilter filteringString boolTypedFilter


validateFilter : String -> TypedFilter a b -> Maybe (Item a -> Bool)
validateFilter filteringString filters =
    let
        validators =
            [ validateEqualFilter, validateLessThanFilter, validateGreaterThanFilter, validateContainsFilter ]

        -- validateContainsFilter must be tested last because it accepts any string
    in
    -- find first OK value returned by a validator, change it into a Maybe
    findFirstOK <| List.map (\validator -> validator filters filteringString) validators


findFirstOK : List (Result (List DeadEnd) (Item a -> Bool)) -> Maybe (Item a -> Bool)
findFirstOK results =
    case results of
        [] ->
            Nothing

        (Ok result) :: _ ->
            Just result

        (Err _) :: tail ->
            findFirstOK tail


validateEqualFilter : TypedFilter a b -> String -> Result (List DeadEnd) (Item a -> Bool)
validateEqualFilter filters filteringString =
    Result.map filters.equal.filter (Parser.run filters.equal.parser filteringString)


validateLessThanFilter : TypedFilter a b -> String -> Result (List DeadEnd) (Item a -> Bool)
validateLessThanFilter filters filteringString =
    Result.map filters.lessThan.filter (Parser.run filters.lessThan.parser filteringString)


validateGreaterThanFilter : TypedFilter a b -> String -> Result (List DeadEnd) (Item a -> Bool)
validateGreaterThanFilter filters filteringString =
    Result.map filters.greaterThan.filter (Parser.run filters.greaterThan.parser filteringString)


validateContainsFilter : TypedFilter a b -> String -> Result (List DeadEnd) (Item a -> Bool)
validateContainsFilter filters filteringString =
    Result.map filters.contains.filter (Parser.run filters.contains.parser filteringString)


{-| Filters strings.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        StringFilter <| stringFilter (\item -> item.name)

-}
stringFilter : (Item a -> String) -> TypedFilter a String
stringFilter getter =
    makeFilter
        { getter = getter
        , equal = \a b -> String.toLower a == String.toLower b
        , lessThan = \a b -> String.toLower a < String.toLower b
        , greaterThan = \a b -> String.toLower a > String.toLower b
        , contains = \a b -> String.contains (String.toLower b) (String.toLower a)
        , typedParser = stringParser
        }


{-| Filters integers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        IntFilter <| intFilter (\\item -> item.id)

-}
intFilter : (Item a -> Int) -> TypedFilter a Int
intFilter getter =
    makeFilter
        { getter = getter
        , equal = (==)
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , contains = \a b -> String.contains (String.fromInt b) (String.fromInt a)
        , typedParser = Parser.int
        }


{-| Filters floating point numbers.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        FloatFilter <| floatFilter (\item -> item.value)

-}
floatFilter : (Item a -> Float) -> TypedFilter a Float
floatFilter getter =
    makeFilter
        { getter = getter
        , equal = (==)
        , lessThan = \a b -> a < b
        , greaterThan = \a b -> a > b
        , contains = \a b -> String.contains (String.fromFloat b) (String.fromFloat a)
        , typedParser = Parser.float
        }


{-| Filters booleans.
The lambda function to be provided as a parameter returns
the value of the field to be filtered.

    filters =
        BoolFilter <| boolFilter (\item -> item.even)

-}
boolFilter : (Item a -> Bool) -> TypedFilter a Bool
boolFilter getter =
    makeFilter
        { getter = getter
        , equal = (==)
        , lessThan = boolLessThan
        , greaterThan = boolGreaterThan
        , contains = (==)
        , typedParser = boolParser
        }


boolLessThan : Bool -> Bool -> Bool
boolLessThan a b =
    (not <| a) && b


boolGreaterThan : Bool -> Bool -> Bool
boolGreaterThan a b =
    a && not b


makeFilter :
    { getter : Item a -> b
    , equal : b -> b -> Bool
    , lessThan : b -> b -> Bool
    , greaterThan : b -> b -> Bool
    , contains : b -> b -> Bool
    , typedParser : Parser b
    }
    -> TypedFilter a b
makeFilter { getter, equal, lessThan, greaterThan, contains, typedParser } =
    { equal =
        { filter = \value item -> equal (getter item) value
        , parser = equalityParser |= typedParser
        }
    , lessThan =
        { filter = \value item -> lessThan (getter item) value
        , parser = lessThanParser |= typedParser
        }
    , greaterThan =
        { filter = \value item -> greaterThan (getter item) value
        , parser = greaterThanParser |= typedParser
        }
    , contains =
        { filter = \value item -> contains (getter item) value
        , parser = containsParser |= typedParser
        }
    }
