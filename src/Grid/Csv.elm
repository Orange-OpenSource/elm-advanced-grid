{- Copyright (c) 2019 Orange
    This code is released under the MIT license.

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid.Csv exposing (visibleItemsToCsv)

{-| The CSV module provides a function to export the visible rows and columns as CSV.


# Configure the grid

@docs visibleItemsToCsv

-}

import Grid exposing (ColumnConfig, Model, filteredItems, isSelectionColumn, visibleColumns)
import Grid.Item exposing (Item)
import List.Extra


csvEndOfLine : String
csvEndOfLine =
    "\u{000D}\n"


{-| Converts the list of visible items and properties to a Comma Separated Values string
-}
visibleItemsToCsv : String -> Model a -> String
visibleItemsToCsv separator model =
    let
        --Prepend the csv content with a Byte Order Mark (BOM) specifying that encoding is UTF-8.
        bom =
            "\u{FEFF}"

        columnsToBeExported =
            visibleColumns model
                |> List.Extra.filterNot isSelectionColumn

        headerLine =
            (columnsToBeExported
                |> List.map .properties
                |> List.map .title
                |> String.join separator
            )
                ++ csvEndOfLine

        dataLines =
            filteredItems model
                |> List.map (itemToCsv columnsToBeExported separator)
                |> String.join csvEndOfLine
    in
    bom ++ headerLine ++ dataLines


itemToCsv : List (ColumnConfig a) -> String -> Item a -> String
itemToCsv columnConfigs separator item =
    columnConfigs
        |> List.map (columnToString item)
        |> String.join separator


columnToString : Item a -> ColumnConfig a -> String
columnToString item columnConfig =
    columnConfig.toString item
