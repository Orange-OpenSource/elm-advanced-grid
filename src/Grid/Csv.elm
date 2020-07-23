{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

       Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

       The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid.Csv exposing
    ( visibleItemsToCsv
    , bom, csvEndOfLine
    )

{-| The CSV module provides a function to export the visible rows and columns as CSV.


# Configure the grid

@docs visibleItemsToCsv

-}

import Grid exposing (ColumnConfig, Model, isAnyItemSelected, isSelectionColumn, selectedAndVisibleItems, visibleColumns, visibleData)
import Grid.Item exposing (Item)
import List.Extra


csvEndOfLine : String
csvEndOfLine =
    "\u{000D}\n"



--Prepend the csv content with a Byte Order Mark (BOM) specifying that encoding is UTF-8.


bom =
    "\u{FEFF}"


{-| Converts the list of visible items and properties to a Comma Separated Values string
-}
visibleItemsToCsv : String -> Model a -> String
visibleItemsToCsv separator model =
    let
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

        data =
            if isAnyItemSelected model then
                selectedAndVisibleItems model
                    |> List.map .data

            else
                visibleData model

        dataLines =
            data
                |> List.map (dataToCsv columnsToBeExported separator)
                |> String.join csvEndOfLine
    in
    bom ++ headerLine ++ dataLines


dataToCsv : List (ColumnConfig a) -> String -> a -> String
dataToCsv columnConfigs separator data =
    columnConfigs
        |> List.indexedMap (\index column -> columnToString data index column)
        |> String.join separator


columnToString : a -> Int -> ColumnConfig a -> String
columnToString data index columnConfig =
    columnConfig.toString <| Grid.Item.create data index
