module Grid.Csv exposing (visibleItemsToCsv)

{-| The CSV module provides a function to export the visible rows and columns as CSV.


# Configure the grid

@docs visibleItemsToCsv

-}

import Grid exposing (ColumnConfig, Model, filteredItems, isSelectionColumn, visibleColumns)
import Grid.Filters exposing (Item)


csvEndOfLine =
    "\u{000D}\n"


{-| Converts the visible items and properties to a Comma Separated Values UTF-8 string
-}
visibleItemsToCsv : String -> Model a -> String
visibleItemsToCsv separator model =
    let
        --Prepend the csv content with a Byte Order Mark (BOM) specifying that encoding is UTF-8.
        bom =
            "\u{FEFF}"

        headerLine =
            (visibleColumns model
                |> List.filter (\c -> not (isSelectionColumn c))
                |> List.map .properties
                |> List.map .title
                |> String.join separator
            )
                ++ csvEndOfLine

        columnsToBeExported =
            visibleColumns model

        dataLines =
            filteredItems model
                |> List.map (itemToCsv columnsToBeExported separator)
                |> String.join csvEndOfLine
    in
    bom ++ headerLine ++ dataLines


itemToCsv : List (ColumnConfig a) -> String -> Item a -> String
itemToCsv columnConfigs separator item =
    columnConfigs
        |> List.filter (\c -> not (isSelectionColumn c))
        |> List.map (columnToString item)
        |> String.join separator


columnToString : Item a -> ColumnConfig a -> String
columnToString item columnConfig =
    columnConfig.toString item
