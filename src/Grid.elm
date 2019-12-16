{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid exposing
    ( Config, withColumns, withConfig
    , ColumnConfig, ColumnProperties, stringColumnConfig, intColumnConfig, floatColumnConfig, boolColumnConfig
    , Sorting(..), compareFields, compareBoolField
    , viewBool, viewFloat, viewInt, viewProgressBar, viewString, cumulatedBorderWidth, cellAttributes
    , Model, Msg(..), init, update, view
    , selectedAndVisibleItems
    , visibleColumns, isColumn, isSelectionColumn, isSelectionColumnProperties
    , filteredData
    )

{-| This module allows to create dynamically configurable data grid.


# Configure the grid

A grid is defined using a `Config`

@docs Config, withColumns, withConfig


# Configure a column

@docs ColumnConfig, ColumnProperties, stringColumnConfig, intColumnConfig, floatColumnConfig, boolColumnConfig


# Configure the column sorting

@docs Sorting, compareFields, compareBoolField


# Configure the rendering when a custom one is needed

@docs viewBool, viewFloat, viewInt, viewProgressBar, viewString, cumulatedBorderWidth, cellAttributes


# Boilerplate

@docs Model, Msg, init, update, view


# Get data

@docs filteredItems, selectedAndVisibleItems


# Get grid config

@docs visibleColumns, isColumn, isSelectionColumn, isSelectionColumnProperties

-}

import Array
import Browser.Dom
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector)
import Dict exposing (Dict)
import Grid.Colors exposing (black, darkGrey, darkGrey2, darkGrey3, lightGreen, lightGrey, lightGrey2, white, white2)
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Grid.Item as Item exposing (Item)
import Html
import Html.Events.Extra.Mouse as Mouse
import Html.Styled exposing (Attribute, Html, div, input, label, span, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css, for, fromUnstyled, id, title, type_, value)
import Html.Styled.Events exposing (onBlur, onClick, onInput, onMouseUp, stopPropagationOn)
import InfiniteList as IL
import Json.Decode
import List.Extra exposing (findIndex)
import String
import Task


{-| The configuration for the grid. The grid content is described
using a list of ColumnConfig.
You should define the css classes, if you want to use some.
By example you could add to all rows a "cursor: pointer" style,
if you define some behaviour to be triggered when the user clicks a line.

    gridConfig =
        { canSelectRows = True
        , columns = columnList
        , containerHeight = 500
        , containerWidth = 700
        , hasFilters = True
        , lineHeight = 20
        , rowClass = cssClassname
        }

    cssClassname : Item -> String
    cssClassname item =
        if item.selected then
            "selected"

        else
            ""

-}
type alias Config a =
    { canSelectRows : Bool
    , columns : List (ColumnConfig a)
    , containerHeight : Int
    , containerWidth : Int
    , hasFilters : Bool
    , headerHeight : Int
    , lineHeight : Int
    , rowClass : Item a -> String
    }


{-| The messages the grid view can emit.

The messages constructed with UserClickedLine (Item a)
are emitted when an item is clicked, so you can update the model of your app.
If you use this message, you'll probably want to define a cursor of type pointer for the rows
(see the rowClass property of the Config type )

The messages using the UserToggledSelection constructor let you know a line selection status changed,
so you can update the list of selected items if you use it.

The ShowPreferences message constructor is to be used when you want to trigger the display of the column visibility panel.
It must be sent by the parent module. There is no way to trigger it from Grid.

UserToggledColumnVisibility, and UserEndedMouseInteraction may be used in the parent module to save the grid configuration
(if you want to make persistant the changes of columns' width, position and/or visibility by example).

If you want to trigger a scrolling of the grid from your program, you can call Grid's update function with ScrollTo message.
ScrollTo takes one argument: a selection function. The row diplayed on top after the scrolling is the first one for which
the selection function returns True.

You probably should not use the other constructors.

    case msg of
        GridMsg (UserClickedLine item) ->
            let
                ( newGridModel, cmd ) =
                    Grid.update (UserClickedLine item) model.gridModel
            in
            ( { model
                | gridModel = newGridModel
                , clickedItem = Just item
              }
            , Cmd.map GridMsg cmd
            )

        GridMsg (UserToggledSelection item status) ->
            let
                ( newGridModel, cmd ) =
                    Grid.update (UserToggledSelection item status) model.gridModel

                selectedItems =
                    List.filter .selected newGridModel.content
            in
            ( { model
                | gridModel = newGridModel
                , selectedItems = selectedItems
              }
            , Cmd.map GridMsg cmd
            )

-}
type Msg a
    = ColumnsModificationRequested (List (ColumnConfig a))
    | InfiniteListMsg IL.Model
    | FilterLostFocus
    | FilterModified (ColumnConfig a) String
    | SetFilters (Dict String String) -- column ID, filter value
    | SetSorting String Sorting -- column ID, Ascending or Descending
    | NoOp
    | GotHeaderContainerInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | ScrollTo (Item a -> Bool) -- scroll to the first item for which the function returns True
    | ShowPreferences
    | UpdateContent (a -> a)
    | UserClickedHeader (ColumnConfig a)
    | UserClickedFilter
    | UserClickedLine (Item a)
    | UserClickedDragHandle (ColumnConfig a) Position
    | UserHoveredDragHandle
    | UserClickedPreferenceCloseButton
    | UserClickedResizeHandle (ColumnConfig a) Position
    | UserDraggedColumn Position
    | UserEndedMouseInteraction
    | UserMovedResizeHandle Position
    | UserSwappedColumns (ColumnConfig a) (ColumnConfig a)
    | UserToggledAllItemSelection
    | UserToggledColumnVisibility (ColumnConfig a)
    | UserToggledSelection (Item a)


{-| The sorting options for a column, to be used in the properties of a ColumnConfig.

NB: This type is useful to define custom column types. You wont need it for common usages.

By default you probably should use "Unsorted" as the value for the order field.
If you give any other value (Ascending or Descending), it must match the order
of the data provided to initialize the grid model.

        { properties =
            { id = "Id"
            , order = Unsorted
            , title = "Id"
            , visible = True
            , width = 50
            }

-}
type Sorting
    = Unsorted
    | Ascending
    | Descending


{-| The configuration for a column. The grid content is described
using a list of ColumnConfigs.

NB: This is a "low level API", useful to define custom column types.
In order to define common column types, you may want to use the higher level API,
i.e. stringColumnConfig, intColumnConfig, floatColumnConfig,
boolColumnConfig

    idColumnConfig =
        { properties =
            { id = "Id"
            , order = Unsorted
            , title = "Id"
            , visible = True
            , width = 50
            }
        , comparator = compareIntField .id
        , filters = IntFilter <| intFilter .id
        , filteringValue = Nothing
        , toString = String.fromInt .id
        , renderer = viewInt .id
        }

-}
type alias ColumnConfig a =
    { properties : ColumnProperties
    , comparator : Item a -> Item a -> Order
    , filteringValue : Maybe String
    , filters : Filter a
    , toString : Item a -> String
    , renderer : ColumnProperties -> (Item a -> Html (Msg a))
    }


{-| ColumnProperties are a part of the configuration for a column.

NB: This is a "low level API", useful to define custom column types.
In order to define common column types, you may want to use the higher level API,
i.e. stringColumnConfig, intColumnConfig, floatColumnConfig,
boolColumnConfig

    properties =
        { id = "name"
        , order = Unsorted
        , title = "Name"
        , visible = True
        , width = 100
        }

-}
type alias ColumnProperties =
    { id : String
    , order : Sorting
    , title : String
    , tooltip : String
    , visible : Bool
    , width : Int
    }


type alias DraggedColumn a =
    { x : Float
    , column : ColumnConfig a
    , dragStartX : Float
    , lastSwappedColumnId : String
    }


type alias Position =
    { x : Float
    , y : Float
    }


{-| The grid model. You'll use it but should not have to access its fields,
and definitely should not modify them directly
-}
type alias Model a =
    { clickedItem : Maybe (Item a)
    , config : Config a
    , columnsX : List Int
    , content : List a -- all data, visible or not
    , draggedColumn : Maybe (DraggedColumn a)
    , dragStartX : Float
    , filterHasFocus : Bool -- Prevents clicking in an input field to trigger a sort
    , hoveredColumn : Maybe (ColumnConfig a)
    , infList : IL.Model
    , isAllSelected : Bool
    , headerContainerPosition : Position

    -- TODO: order and sortedBy can have incompatible values. It would be better to join them in a single Maybe
    , order : Sorting
    , resizedColumn : Maybe (ColumnConfig a)
    , showPreferences : Bool
    , sortedBy : Maybe (ColumnConfig a)
    , visibleItems : List (Item a) -- the subset of items remaining visible after applying filters
    }


{-| Sets the grid configuration
-}
withConfig : Config a -> Model a -> Model a
withConfig config model =
    { model | config = config }


{-| Sets the column definitions into the configuration
-}
withColumns : List (ColumnConfig a) -> Model a -> Model a
withColumns columns model =
    let
        config =
            model.config
    in
    model
        |> withConfig { config | columns = sanitizedColumns columns }
        |> withColumnsX


withColumnsX : Model a -> Model a
withColumnsX model =
    { model | columnsX = columnsX model }


{-| Sets the data in the grid
-}
withContent : List a -> Model a -> Model a
withContent data model =
    { model | content = data }


{-| Sets the column being moved by the user
-}
withDraggedColumn : Maybe (DraggedColumn a) -> Model a -> Model a
withDraggedColumn draggedColumn model =
    { model | draggedColumn = draggedColumn }


{-| Sets the filtered data
-}
withVisibleItems : List (Item a) -> Model a -> Model a
withVisibleItems visibleItems model =
    { model | visibleItems = visibleItems }


{-| Clears the filter of hidden columns to avoid filtering with an invisible criteria
-}
sanitizedColumns : List (ColumnConfig a) -> List (ColumnConfig a)
sanitizedColumns columns =
    List.Extra.updateIf (not << .visible << .properties) (\c -> { c | filteringValue = Nothing }) columns


{-| Definition for the row selection column,
used when canSelectRows is True in grid config.
-}
selectionColumn =
    let
        properties =
            { id = "_MultipleSelection_"
            , getter = .selected
            , title = ""
            , tooltip = ""
            , width = 40
            , localize = \_ -> ""
            }
    in
    { properties =
        columnConfigProperties properties
    , filters = NoFilter
    , filteringValue = Nothing
    , toString = .selected >> boolToString
    , renderer = viewBool .selected
    , comparator = compareBoolField .selected
    }


{-| Initializes the grid model, according to the given grid configuration
and content.

      init : () -> ( Model, Cmd Msg )
      init _ =
         ( { gridModel = Grid.init gridConfig data
           }
         , Cmd.none
         )

-}
init : Config a -> List a -> Model a
init config data =
    let
        hasSelectionColumn : List (ColumnConfig a) -> Bool
        hasSelectionColumn columns =
            case List.head columns of
                Just firstColumn ->
                    isSelectionColumn firstColumn

                Nothing ->
                    False

        shouldAddSelectionColumn =
            config.canSelectRows && not (hasSelectionColumn config.columns)

        newConfig =
            if shouldAddSelectionColumn then
                { config | columns = selectionColumn :: config.columns }

            else
                config

        sanitizedConfig =
            { newConfig | columns = sanitizedColumns newConfig.columns }

        -- ensure indexes are set to prevent systematic selection of the first item when clicking a checkbox
        indexedItems =
            List.indexedMap (\index value -> Item.create value index) data

        initialModel =
            { clickedItem = Nothing
            , config = sanitizedConfig
            , columnsX = []
            , content = data
            , dragStartX = 0
            , filterHasFocus = False
            , hoveredColumn = Nothing
            , infList = IL.init
            , isAllSelected = False
            , draggedColumn = Nothing
            , order = Unsorted
            , headerContainerPosition = { x = 0, y = 0 }
            , resizedColumn = Nothing
            , showPreferences = False
            , sortedBy = Nothing
            , visibleItems = indexedItems
            }
    in
    { initialModel | columnsX = columnsX initialModel }


{-| The list of X coordinates of columns; coordinates are expressed in pixels. The first one is at 0.
-}
columnsX : Model a -> List Int
columnsX model =
    visibleColumns model
        |> List.Extra.scanl (\col x -> x + col.properties.width) 0


{-| Updates the grid model
-}
update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
update msg model =
    case msg of
        UserHoveredDragHandle ->
            ( model
              -- get the position of the header container, in order to fix the ghost header position
            , Browser.Dom.getElement headerContainerId
                |> Task.attempt GotHeaderContainerInfo
            )

        ScrollTo isTargetItem ->
            let
                targetItemIndex =
                    Maybe.withDefault 0 <| findIndex isTargetItem model.visibleItems
            in
            ( model
            , IL.scrollToNthItem
                { postScrollMessage = NoOp
                , listHtmlId = gridHtmlId
                , itemIndex = targetItemIndex
                , configValue = infiniteListConfig model
                , items = model.visibleItems
                }
            )

        _ ->
            ( modelUpdate msg model, Cmd.none )


{-| Updates the grid model for messages which won't generate any command
-}
modelUpdate : Msg a -> Model a -> Model a
modelUpdate msg model =
    case msg of
        ColumnsModificationRequested columns ->
            model |> withColumns columns

        FilterLostFocus ->
            { model | filterHasFocus = False }

        FilterModified columnConfig string ->
            let
                newColumnconfig =
                    { columnConfig | filteringValue = Just string }

                newColumns =
                    List.Extra.setIf (isColumn columnConfig) newColumnconfig model.config.columns

                newModel =
                    model |> withColumns newColumns
            in
            updateVisibleItems newModel

        GotHeaderContainerInfo (Ok info) ->
            { model | headerContainerPosition = { x = info.element.x, y = info.element.y } }

        GotHeaderContainerInfo (Err _) ->
            model

        InfiniteListMsg infList ->
            { model | infList = infList }

        SetFilters filterValues ->
            let
                newColumns =
                    List.map (setFilter filterValues) model.config.columns

                newModel =
                    model |> withColumns newColumns
            in
            updateVisibleItems newModel

        SetSorting columnId sorting ->
            let
                sortedColumnConfig =
                    List.Extra.find (hasId columnId) model.config.columns
            in
            case sortedColumnConfig of
                Just columnConfig ->
                    sort model columnConfig sorting orderBy

                Nothing ->
                    model

        NoOp ->
            model

        ScrollTo _ ->
            -- This message is handled in the `update` function
            model

        ShowPreferences ->
            { model | showPreferences = True }

        UserClickedDragHandle columnConfig mousePosition ->
            let
                draggedColumn =
                    { x = mousePosition.x
                    , column = columnConfig
                    , dragStartX = mousePosition.x
                    , lastSwappedColumnId = ""
                    }
            in
            model
                |> withDraggedColumn (Just draggedColumn)

        UserClickedFilter ->
            { model | filterHasFocus = True }

        UserClickedHeader columnConfig ->
            if model.filterHasFocus then
                model

            else
                sort model columnConfig model.order toggleOrder

        UserClickedLine item ->
            { model | clickedItem = Just item }

        UserClickedPreferenceCloseButton ->
            { model | showPreferences = False }

        UserClickedResizeHandle columnConfig position ->
            { model
                | resizedColumn = Just columnConfig
                , dragStartX = position.x
            }

        UserDraggedColumn mousePosition ->
            let
                newDraggedColumn =
                    case model.draggedColumn of
                        Just draggedColumn ->
                            Just
                                { draggedColumn | x = mousePosition.x }

                        Nothing ->
                            Nothing
            in
            { model | draggedColumn = newDraggedColumn }

        UserEndedMouseInteraction ->
            { model
                | resizedColumn = Nothing
                , draggedColumn = Nothing
            }

        UserHoveredDragHandle ->
            -- This message is handled in the `update` function
            model

        UserMovedResizeHandle position ->
            resizeColumn model position.x

        UserSwappedColumns columnConfig draggedColumnConfig ->
            case model.draggedColumn of
                Just draggedColumn ->
                    if columnConfig.properties.id == draggedColumn.lastSwappedColumnId then
                        model

                    else
                        let
                            newColumns =
                                moveColumn columnConfig draggedColumnConfig model.config.columns
                        in
                        model
                            |> withColumns newColumns
                            |> withDraggedColumn (Just { draggedColumn | lastSwappedColumnId = columnConfig.properties.id })

                Nothing ->
                    model

        UserToggledAllItemSelection ->
            let
                updatedVisibleItems =
                    List.map setSelectionStatus model.visibleItems

                setSelectionStatus item =
                    { item | selected = newStatus }

                newStatus =
                    not model.isAllSelected
            in
            { model
                | isAllSelected = newStatus
                , visibleItems = updatedVisibleItems
            }

        UserToggledColumnVisibility columnConfig ->
            let
                toggleVisibility properties =
                    { properties | visible = not properties.visible }

                newColumns =
                    updateColumnProperties toggleVisibility model columnConfig.properties.id
                        |> List.Extra.updateIf (isColumn columnConfig) (\col -> { col | filteringValue = Nothing })

                updatedModel =
                    model |> withColumns newColumns
            in
            { updatedModel | columnsX = columnsX updatedModel }

        UserToggledSelection item ->
            let
                newItems =
                    List.Extra.updateAt item.index (\it -> toggleSelection it) model.visibleItems
            in
            { model | visibleItems = newItems }

        UpdateContent updateContent ->
            let
                updatedData =
                    List.map updateContent model.content
            in
            model
                |> withContent updatedData
                |> updateVisibleItems


{-| Apply the current filters to the whole data
-}
updateVisibleItems : Model a -> Model a
updateVisibleItems model =
    let
        filteredContent =
            filteredData model

        visibleItems =
            List.indexedMap (\index value -> Item.create value index) filteredContent
    in
    model |> withVisibleItems visibleItems


{-| Updates the filter for a given column
-}
setFilter : Dict String String -> ColumnConfig a -> ColumnConfig a
setFilter filterValues columnConfig =
    let
        value =
            Dict.get columnConfig.properties.id filterValues
    in
    { columnConfig | filteringValue = value }


{-| Sorts visible items according the the content of a given column, in a given order
-}
sort : Model a -> ColumnConfig a -> Sorting -> (Model a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )) -> Model a
sort model columnConfig order sorter =
    let
        ( sortedItems, newOrder ) =
            sorter model columnConfig order

        updatedItems =
            updateIndexes sortedItems
    in
    { model
        | order = newOrder
        , sortedBy = Just columnConfig
        , visibleItems = updatedItems
    }


{-| Reverse the sorting order -or define it as Ascending if the data were not sorted according to the content of the given column
-}
toggleOrder : Model a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )
toggleOrder model columnConfig order =
    case order of
        Ascending ->
            ( List.sortWith columnConfig.comparator model.visibleItems |> List.reverse, Descending )

        _ ->
            ( List.sortWith columnConfig.comparator model.visibleItems, Ascending )


orderBy : Model a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )
orderBy model columnConfig order =
    case order of
        Descending ->
            ( List.sortWith columnConfig.comparator model.visibleItems |> List.reverse, Descending )

        Ascending ->
            ( List.sortWith columnConfig.comparator model.visibleItems, Ascending )

        Unsorted ->
            ( model.visibleItems, Unsorted )


hasId : String -> ColumnConfig a -> Bool
hasId id columnConfig =
    columnConfig.properties.id == id


{-| Compares the identity of two columns
-}
isColumn : ColumnConfig a -> ColumnConfig a -> Bool
isColumn firstColumnConfig secondColumnConfig =
    firstColumnConfig.properties.id == secondColumnConfig.properties.id


minColumnWidth : Int
minColumnWidth =
    25


{-| Sets the width, in pixels, of the column whose resize handle is being dragged by the user
-}
resizeColumn : Model a -> Float -> Model a
resizeColumn model x =
    case model.resizedColumn of
        Just columnConfig ->
            let
                deltaX =
                    x - model.dragStartX

                newWidth =
                    columnConfig.properties.width
                        + Basics.round deltaX

                newColumns =
                    if newWidth > minColumnWidth then
                        updateColumnWidthProperty model columnConfig newWidth

                    else
                        model.config.columns

                newModel =
                    model |> withColumns newColumns
            in
            { newModel
                | columnsX = columnsX model
            }

        _ ->
            model


updateColumnWidthProperty : Model a -> ColumnConfig a -> Int -> List (ColumnConfig a)
updateColumnWidthProperty model columnConfig width =
    let
        setWidth properties =
            { properties | width = width }
    in
    updateColumnProperties setWidth model columnConfig.properties.id


updateColumnProperties : (ColumnProperties -> ColumnProperties) -> Model a -> String -> List (ColumnConfig a)
updateColumnProperties updateFunction model columnId =
    List.Extra.updateIf (hasId columnId)
        (updatePropertiesInColumnConfig updateFunction)
        model.config.columns


updatePropertiesInColumnConfig : (ColumnProperties -> ColumnProperties) -> ColumnConfig a -> ColumnConfig a
updatePropertiesInColumnConfig updateFunction columnConfig =
    { columnConfig | properties = updateFunction columnConfig.properties }


updateIndexes : List (Item a) -> List (Item a)
updateIndexes items =
    List.indexedMap (\i item -> { item | index = i }) items


toggleSelection : Item a -> Item a
toggleSelection item =
    { item | selected = not item.selected }


moveColumn : ColumnConfig a -> ColumnConfig a -> List (ColumnConfig a) -> List (ColumnConfig a)
moveColumn destinationColumn originColumn list =
    let
        originColumnIndex =
            List.Extra.findIndex (isColumn originColumn) list
                |> Maybe.withDefault -1

        destinationColumnIndex =
            List.Extra.findIndex (isColumn destinationColumn) list
                |> Maybe.withDefault -1
    in
    if originColumnIndex < destinationColumnIndex then
        -- move originColumn after destinationColumn
        moveItemRight list originColumnIndex (destinationColumnIndex - originColumnIndex)

    else
        -- move originColumn before destinationColumn
        moveItemLeft list originColumnIndex (originColumnIndex - destinationColumnIndex)


moveItemLeft : List a -> Int -> Int -> List a
moveItemLeft list originIndex indexDelta =
    let
        array =
            Array.fromList list

        beforeDestination =
            Array.slice 0 (originIndex - indexDelta) array

        betweenDestinationAndOrigin =
            Array.slice (originIndex - indexDelta) originIndex array

        origin =
            Array.slice originIndex (originIndex + 1) array

        afterOrigin =
            Array.slice (originIndex + 1) (Array.length array) array
    in
    List.foldr Array.append
        Array.empty
        [ beforeDestination, origin, betweenDestinationAndOrigin, afterOrigin ]
        |> Array.toList


moveItemRight : List a -> Int -> Int -> List a
moveItemRight list originIndex indexDelta =
    let
        array =
            Array.fromList list

        beforeOrigin =
            Array.slice 0 originIndex array

        origin =
            Array.slice originIndex (originIndex + 1) array

        betweenOriginAndDestination =
            Array.slice (originIndex + 1) (originIndex + indexDelta + 1) array

        afterDestination =
            Array.slice (originIndex + indexDelta + 1) (Array.length array) array
    in
    List.foldr Array.append
        Array.empty
        [ beforeOrigin, betweenOriginAndDestination, origin, afterDestination ]
        |> Array.toList


{-| the list of items selected by the user, after filters were applied
-}
selectedAndVisibleItems : Model a -> List (Item a)
selectedAndVisibleItems model =
    List.filter .selected model.visibleItems


infiniteListConfig : Model a -> IL.Config (Item a) (Msg a)
infiniteListConfig model =
    IL.config
        { itemView = viewRow model
        , itemHeight = IL.withConstantHeight model.config.lineHeight
        , containerHeight = model.config.containerHeight
        }
        |> IL.withOffset 300


{-| Renders the grid
-}
view : Model a -> Html.Html (Msg a)
view model =
    toUnstyled <|
        if model.showPreferences then
            viewPreferences model

        else
            viewGrid model


{-| the id of the Html node containing the grid
-}
gridHtmlId : String
gridHtmlId =
    "_grid_"


{-| Renders the grid
-}
viewGrid : Model a -> Html (Msg a)
viewGrid model =
    let
        attributes =
            [ css
                [ width (px <| toFloat (model.config.containerWidth + cumulatedBorderWidth))
                , overflow auto
                , margin auto
                , position relative
                ]
            ]

        conditionalAttributes =
            if model.resizedColumn /= Nothing || model.draggedColumn /= Nothing then
                [ onMouseUp UserEndedMouseInteraction
                , fromUnstyled <| Mouse.onLeave (\_ -> UserEndedMouseInteraction)
                ]

            else
                []
    in
    div
        (attributes ++ conditionalAttributes)
    <|
        if model.config.hasFilters then
            [ div
                [ css
                    [ borderLeft3 (px 1) solid lightGrey2
                    , borderRight3 (px 1) solid lightGrey2
                    , width (px <| toFloat <| gridWidth model)
                    ]
                ]
                [ viewHeaderContainer model
                ]
            , viewGhostHeader model
            , viewRows model
            ]

        else
            [ viewHeaderContainer model
            , viewRows model
            , viewGhostHeader model
            ]


viewRows : Model a -> Html (Msg a)
viewRows model =
    div []
        [ div
            [ css
                [ height (px <| toFloat model.config.containerHeight)
                , width (px <| toFloat <| gridWidth model)
                , overflowX hidden
                , overflowY auto
                , border3 (px 1) solid lightGrey

                -- displays the vertical scrollbar to the left. https://stackoverflow.com/questions/7347532/how-to-position-a-div-scrollbar-on-the-left-hand-side
                , property "direction" "rtl"
                ]
            , fromUnstyled <| IL.onScroll InfiniteListMsg
            , id gridHtmlId
            ]
            [ Html.Styled.fromUnstyled <| IL.view (infiniteListConfig model) model.infList model.visibleItems ]
        ]


columnFilters : Model a -> List (a -> Bool)
columnFilters model =
    model.config.columns
        |> List.filterMap (\c -> parseFilteringString c.filteringValue c.filters)


{-| The list of items satisfying the current filtering values
-}
filteredData : Model a -> List a
filteredData model =
    columnFilters model
        |> List.foldl (\filter remainingValues -> List.filter filter remainingValues) model.content


{-| Renders the row for a given item
idx is the index of the visible line; if there are 25 visible lines, 0 <= idx < 25
listIdx is the index in the data source; if the total number of items is 1000, 0<= listidx < 1000
-}
viewRow : Model a -> Int -> Int -> Item a -> Html.Html (Msg a)
viewRow model idx listIdx item =
    toUnstyled
        << div
            [ attribute "data-testid" "row"
            , class (model.config.rowClass item)
            , css
                [ displayFlex
                , height (px <| toFloat model.config.lineHeight)
                , width (px <| toFloat <| gridWidth model)

                -- restore reading order, while preserving the left position of the scrollbar
                , property "direction" "ltr"
                ]
            , onClick (UserClickedLine item)
            ]
    <|
        List.map (\columnConfig -> viewColumn columnConfig item) (visibleColumns model)


gridWidth : Model a -> Int
gridWidth model =
    List.foldl (\columnConfig -> (+) columnConfig.properties.width) 0 (visibleColumns model)


viewColumn : ColumnConfig a -> Item a -> Html (Msg a)
viewColumn config item =
    config.renderer config.properties item


{-| Renders a cell containing an int value. Use this function in a ColumnConfig
to define how the values in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewInt (\item -> item.id)

-}
viewInt : (Item a -> Int) -> ColumnProperties -> Item a -> Html (Msg a)
viewInt field properties item =
    div
        (cellAttributes properties)
        [ text <| String.fromInt (field item) ]


{-| Renders a cell containing a boolean value. Use this function in a ColumnConfig
to define how the values in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewBool (\item -> item.even)

-}
viewBool : (Item a -> Bool) -> ColumnProperties -> Item a -> Html (Msg a)
viewBool field properties item =
    div
        (cellAttributes properties ++ [ css [ justifyContent flexEnd ] ])
        [ input
            [ type_ "checkbox"
            , Html.Styled.Attributes.checked (field item)
            , stopPropagationOnClick (UserToggledSelection item)
            ]
            []
        ]


{-| Prevents the click on the line to be detected when interacting with the checkbox
-}
stopPropagationOnClick : Msg a -> Attribute (Msg a)
stopPropagationOnClick msg =
    stopPropagationOn "click" (Json.Decode.map alwaysPreventDefault (Json.Decode.succeed msg))


alwaysPreventDefault : Msg a -> ( Msg a, Bool )
alwaysPreventDefault msg =
    ( msg, True )


{-| Create a ColumnConfig for a column containing a string value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
stringColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : a -> String, localize : String -> String } -> ColumnConfig a
stringColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = StringFilter <| stringFilter getter
    , filteringValue = Nothing
    , toString = nestedDataGetter
    , renderer = viewString nestedDataGetter
    , comparator = compareFields nestedDataGetter
    }


{-| Create a ColumnConfig for a column containing a float value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
floatColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : a -> Float, localize : String -> String } -> ColumnConfig a
floatColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = FloatFilter <| floatFilter getter
    , filteringValue = Nothing
    , toString = nestedDataGetter >> String.fromFloat
    , renderer = viewFloat nestedDataGetter
    , comparator = compareFields nestedDataGetter
    }


{-| Create a ColumnConfig for a column containing an integer value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
intColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : a -> Int, localize : String -> String } -> ColumnConfig a
intColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = IntFilter <| intFilter getter
    , filteringValue = Nothing
    , toString = nestedDataGetter >> String.fromInt
    , renderer = viewInt nestedDataGetter
    , comparator = compareFields nestedDataGetter
    }


{-| Create a ColumnConfig for a column containing a boolean value

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
boolColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : a -> Bool, localize : String -> String } -> ColumnConfig a
boolColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = BoolFilter <| boolFilter getter
    , filteringValue = Nothing
    , toString = nestedDataGetter >> boolToString
    , renderer = viewBool nestedDataGetter
    , comparator = compareBoolField nestedDataGetter
    }


boolToString : Bool -> String
boolToString value =
    if value then
        "true"

    else
        "false"


columnConfigProperties : { a | id : String, title : String, tooltip : String, width : Int, localize : String -> String } -> ColumnProperties
columnConfigProperties { id, title, tooltip, width, localize } =
    { id = id
    , order = Unsorted
    , title = localize title
    , tooltip = localize tooltip
    , visible = True
    , width = width
    }


{-| Renders a cell containing a floating number. Use this function in a ColumnConfig
to define how the values in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewFloat (\item -> item.value)

-}
viewFloat : (Item a -> Float) -> ColumnProperties -> Item a -> Html (Msg a)
viewFloat field properties item =
    div
        (cellAttributes properties)
        [ text <| String.fromFloat (field item) ]


{-| Renders a cell containing a string. Use this function in a ColumnConfig
to define how the values in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewString (\item -> item.name)

-}
viewString : (Item a -> String) -> ColumnProperties -> Item a -> Html (Msg a)
viewString field properties item =
    div
        (cellAttributes properties)
        [ text <| field item ]


{-| Renders a progress bar in a a cell containing a integer.
Use this function in a ColumnConfig to define how the values
in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewProgressBar 8 (\item -> item.value)

-}
viewProgressBar : Int -> (a -> Float) -> ColumnProperties -> Item a -> Html (Msg a)
viewProgressBar barHeight getter properties item =
    let
        maxWidth =
            properties.width - 8 - cumulatedBorderWidth

        nestedDataGetter =
            .data >> getter

        actualWidth =
            (nestedDataGetter item / toFloat 100) * toFloat maxWidth
    in
    div
        [ css
            [ displayFlex
            , alignItems center
            , border3 (px 1) solid lightGrey
            , boxSizing contentBox
            , height (pct 100)
            , paddingLeft (px 5)
            , paddingRight (px 5)
            ]
        ]
        [ div
            [ css
                [ displayFlex
                , backgroundColor white
                , borderRadius (px 5)
                , border3 (px 1) solid lightGrey
                , width (px <| toFloat maxWidth)
                ]
            ]
            [ div
                [ css
                    [ backgroundColor lightGreen
                    , width (px actualWidth)
                    , height (px <| toFloat barHeight)
                    , borderRadius (px 5)
                    , overflow visible
                    ]
                ]
                []
            ]
        ]


{-| Renders the column visibility panel
-}
viewPreferences : Model a -> Html (Msg a)
viewPreferences model =
    let
        dataColumns =
            List.filter (not << isSelectionColumn) model.config.columns
    in
    div
        [ css
            [ border3 (px 1) solid lightGrey2
            , margin auto
            , padding (px 5)
            , width (px <| toFloat model.config.containerWidth * 0.6)
            ]
        ]
    <|
        (viewClosebutton
            :: List.map viewColumnVisibilitySelector dataColumns
        )


viewClosebutton : Html (Msg a)
viewClosebutton =
    div
        [ css
            [ cursor pointer
            , position relative
            , float right
            , width (px 16)
            , height (px 16)
            , opacity (num 0.3)
            , hover
                [ opacity (num 1) ]
            , before
                [ position absolute
                , left (px 7)
                , property "content" "' '"
                , height (px 17)
                , width (px 2)
                , backgroundColor black
                , transform (rotate (deg 45))
                ]
            , after
                [ position absolute
                , left (px 7)
                , property "content" "' '"
                , height (px 17)
                , width (px 2)
                , backgroundColor black
                , transform (rotate (deg -45))
                ]
            ]
        , onClick UserClickedPreferenceCloseButton
        , attribute "data-testid" "configureDisplayCloseCross"
        ]
        []


viewColumnVisibilitySelector : ColumnConfig a -> Html (Msg a)
viewColumnVisibilitySelector columnConfig =
    div
        []
        [ input
            [ id columnConfig.properties.id
            , type_ "checkbox"
            , Html.Styled.Attributes.checked columnConfig.properties.visible
            , onClick (UserToggledColumnVisibility columnConfig)
            ]
            []
        , label
            [ css
                [ marginLeft (px 5)
                ]
            , for columnConfig.properties.id
            ]
            [ text columnConfig.properties.title ]
        ]


{-| Compares two integers, two floats or two strings.
Use this function in a ColumnConfig
to define how the values in a given column should be compared.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    comparator =
        compareFields (\item -> item.id)

-}
compareFields : (Item a -> comparable) -> Item a -> Item a -> Order
compareFields dataValue item1 item2 =
    compare (dataValue item1) (dataValue item2)


{-| Compares two booleans. Use this function in a ColumnConfig
to define how the values in a given column should be compared.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    comparator =
        compareBoolField (\item -> item.even)

-}
compareBoolField : (Item a -> Bool) -> Item a -> Item a -> Order
compareBoolField dataValue item1 item2 =
    case ( dataValue item1, dataValue item2 ) of
        ( True, True ) ->
            EQ

        ( False, False ) ->
            EQ

        ( True, False ) ->
            GT

        ( False, True ) ->
            LT


{-| The list of visible columns according to their current configuration.
This list ignores the actual position of the columns; some of them may require
an horizontal scrolling to be seen
-}
visibleColumns : Model a -> List (ColumnConfig a)
visibleColumns model =
    List.filter (\column -> column.properties.visible) model.config.columns


viewHeaderContainer : Model a -> Html (Msg a)
viewHeaderContainer model =
    let
        attributes =
            [ css
                [ backgroundColor darkGrey
                , displayFlex
                , height (px <| toFloat model.config.headerHeight)
                ]
            , id headerContainerId
            ]

        conditionalAttributes =
            if model.resizedColumn /= Nothing then
                [ fromUnstyled <| Mouse.onMove (\event -> UserMovedResizeHandle (event |> toPosition)) ]

            else
                []
    in
    div
        (attributes ++ conditionalAttributes)
        (viewHeaders model)


viewHeaders : Model a -> List (Html (Msg a))
viewHeaders model =
    List.indexedMap (\index column -> viewHeader model column index) <| visibleColumns model


headerContainerId : String
headerContainerId =
    "_header_-_container_"


viewHeader : Model a -> ColumnConfig a -> Int -> Html (Msg a)
viewHeader model columnConfig index =
    let
        headerId =
            "header-" ++ columnConfig.properties.id

        attributes =
            [ attribute "data-testid" headerId
            , id headerId
            , headerStyles model
            , title columnConfig.properties.tooltip
            ]

        conditionalAttributes =
            if model.resizedColumn == Nothing then
                [ onClick (UserClickedHeader columnConfig) ]

            else
                []
    in
    div
        (attributes ++ conditionalAttributes)
        [ if isSelectionColumn columnConfig then
            viewSelectionHeader model columnConfig

          else
            viewDataHeader model columnConfig (draggingAttributes model columnConfig)
        ]


headerStyles : Model a -> Attribute (Msg a)
headerStyles model =
    css
        [ backgroundImage <| linearGradient (stop white2) (stop lightGrey) []
        , display inlineFlex
        , flexDirection row
        , border3 (px 1) solid lightGrey2
        , boxSizing contentBox
        , height (px <| toFloat <| model.config.headerHeight - cumulatedBorderWidth)
        , hover
            [ descendants
                [ typeSelector "div"
                    [ visibility visible -- makes the move handle visible when hover the column
                    ]
                ]
            ]
        , padding (px 2)
        ]


{-| Specific header content for the selection column
-}
viewSelectionHeader : Model a -> ColumnConfig a -> Html (Msg a)
viewSelectionHeader model _ =
    let
        areAllItemsChecked =
            List.all .selected model.visibleItems
    in
    div
        [ css
            [ width <| px <| toFloat <| selectionColumn.properties.width - cumulatedBorderWidth
            , displayFlex
            , justifyContent center
            , alignItems center
            ]
        ]
        [ input
            [ attribute "data-testid" "allItemSelection"
            , type_ "checkbox"
            , Html.Styled.Attributes.checked areAllItemsChecked
            , stopPropagationOnClick UserToggledAllItemSelection
            ]
            []
        ]


{-| Header content for data columns
-}
viewDataHeader : Model a -> ColumnConfig a -> List (Attribute (Msg a)) -> Html (Msg a)
viewDataHeader model columnConfig conditionalAttributes =
    let
        attributes =
            [ css
                [ displayFlex
                , flexDirection row
                ]
            ]
    in
    div
        attributes
        [ div
            ([ css
                [ displayFlex
                , flexDirection column
                , alignItems flexStart
                , overflow hidden
                , width <| px <| (toFloat <| columnConfig.properties.width - cumulatedBorderWidth) - resizingHandleWidth
                ]
             ]
                ++ conditionalAttributes
            )
            [ div
                [ css
                    [ displayFlex
                    , flexDirection row
                    , flexGrow (num 1)
                    , justifyContent flexStart
                    ]
                ]
                [ viewDragHandle columnConfig
                , viewTitle model columnConfig
                , viewSortingSymbol model columnConfig
                ]
            , viewFilter model columnConfig
            ]
        , viewResizeHandle columnConfig
        ]


draggingAttributes : Model a -> ColumnConfig a -> List (Attribute (Msg a))
draggingAttributes model currentColumn =
    case model.draggedColumn of
        Just draggedColumn ->
            [ fromUnstyled <| Mouse.onMove (\event -> UserDraggedColumn (event |> toPosition)) ]
                ++ (if isColumn currentColumn draggedColumn.column then
                        [ css [ opacity (num 0) ] ]

                    else
                        [ fromUnstyled <|
                            Mouse.onEnter (\_ -> UserSwappedColumns currentColumn draggedColumn.column)
                        ]
                   )

        Nothing ->
            []


{-| Renders the dragged header
-}
viewGhostHeader : Model a -> Html (Msg a)
viewGhostHeader model =
    case model.draggedColumn of
        Just draggedColumn ->
            div
                (headerStyles model
                    :: [ css
                            [ position absolute
                            , left (px <| draggedColumn.x - model.headerContainerPosition.x)
                            , top (px 2)
                            , pointerEvents none
                            ]
                       ]
                )
                [ viewDataHeader model draggedColumn.column [] ]

        Nothing ->
            noContent


{-| Returns true when the given ColumnConfig is the multiple selection column
(column added by Grid when row selection is activated)
-}
isSelectionColumn : ColumnConfig a -> Bool
isSelectionColumn columnConfig =
    isSelectionColumnProperties columnConfig.properties


{-| Returns true when the given Properties are the one of the multiple selection column,
provided by Grid when row selection is activated
-}
isSelectionColumnProperties : { a | id : String } -> Bool
isSelectionColumnProperties columnProperties =
    columnProperties.id == selectionColumn.properties.id


{-| Renders a column title
-}
viewTitle : Model a -> ColumnConfig a -> Html (Msg a)
viewTitle model columnConfig =
    let
        titleFontStyle =
            case model.sortedBy of
                Just column ->
                    if column.properties.id == columnConfig.properties.id then
                        fontStyle italic

                    else
                        fontStyle normal

                Nothing ->
                    fontStyle normal
    in
    span
        [ css
            [ titleFontStyle
            ]
        ]
        [ text <| columnConfig.properties.title
        ]


viewSortingSymbol : Model a -> ColumnConfig a -> Html (Msg a)
viewSortingSymbol model columnConfig =
    case model.sortedBy of
        Just config ->
            if config.properties.id == columnConfig.properties.id then
                if model.order == Descending then
                    viewArrowUp

                else
                    viewArrowDown

            else
                noContent

        _ ->
            noContent


viewDragHandle : ColumnConfig a -> Html (Msg a)
viewDragHandle columnConfig =
    div
        [ css
            [ displayFlex
            , flexDirection row
            , cursor move
            , fontSize (px 0.1)
            , height (pct 100)
            , visibility hidden
            , width (px 10)
            , zIndex (int 5)
            ]
        , fromUnstyled <| Mouse.onOver (\_ -> UserHoveredDragHandle)
        , fromUnstyled <| Mouse.onDown (\event -> UserClickedDragHandle columnConfig (event |> toPosition))
        , fromUnstyled <| Mouse.onUp (\_ -> UserEndedMouseInteraction)
        , attribute "data-testid" <| "dragHandle-" ++ columnConfig.properties.id
        ]
        (List.repeat 2 <|
            div [] <|
                List.repeat 4 <|
                    div
                        [ css
                            [ backgroundColor darkGrey2
                            , borderRadius (pct 50)
                            , height (px 3)
                            , width (px 3)
                            , marginRight (px 1)
                            , marginBottom (px 2)
                            ]
                        ]
                        []
        )


toPosition : { a | clientPos : ( Float, Float ) } -> Position
toPosition event =
    { x = Tuple.first event.clientPos, y = Tuple.second event.clientPos }


viewResizeHandle : ColumnConfig a -> Html (Msg a)
viewResizeHandle columnConfig =
    div
        [ css
            [ cursor colResize
            , displayFlex
            , justifyContent spaceAround
            , height (pct 100)
            , visibility hidden
            , width (px resizingHandleWidth)
            ]
        , fromUnstyled <| Mouse.onDown (\event -> UserClickedResizeHandle columnConfig (event |> toPosition))
        , onBlur UserEndedMouseInteraction
        ]
        [ viewVerticalBar, viewVerticalBar ]


viewVerticalBar : Html msg
viewVerticalBar =
    div
        [ css
            [ width (px 1)
            , height (px 10)
            , backgroundColor darkGrey3
            ]
        ]
        []


resizingHandleWidth : Float
resizingHandleWidth =
    5


noContent : Html msg
noContent =
    text ""


viewArrowUp : Html (Msg a)
viewArrowUp =
    viewArrow borderBottom3


viewArrowDown : Html (Msg a)
viewArrowDown =
    viewArrow borderTop3


viewArrow : (Px -> BorderStyle (TextDecorationStyle {}) -> Color -> Style) -> Html msg
viewArrow horizontalBorder =
    div
        [ css
            [ width (px 0)
            , height (px 0)
            , borderLeft3 (px 5) solid transparent
            , borderRight3 (px 5) solid transparent
            , horizontalBorder (px 5) solid black
            , margin (px 5)
            ]
        ]
        []


viewFilter : Model a -> ColumnConfig a -> Html (Msg a)
viewFilter model columnConfig =
    input
        [ attribute "data-testid" <| "filter-" ++ columnConfig.properties.id
        , css
            [ border (px 0)
            , height (px <| toFloat <| model.config.lineHeight)
            , paddingLeft (px 2)
            , paddingRight (px 2)
            , marginLeft (px resizingHandleWidth) -- for visual centering in the header
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth * 2))
            ]
        , onClick UserClickedFilter
        , onBlur FilterLostFocus
        , onInput <| FilterModified columnConfig
        , value <| Maybe.withDefault "" columnConfig.filteringValue
        ]
        []


{-| Left + right cell border width, including padding, in px.
Useful to take into account the borders when calculating the total grid width
-}
cumulatedBorderWidth : Int
cumulatedBorderWidth =
    6


{-| Common attributes for cell renderers
-}
cellAttributes : ColumnProperties -> List (Html.Styled.Attribute (Msg a))
cellAttributes properties =
    [ attribute "data-testid" properties.id
    , css
        [ alignItems center
        , display inlineFlex
        , border3 (px 1) solid lightGrey
        , boxSizing contentBox
        , minHeight (pct 100) -- 100% min height forces empty divs to be correctly rendered
        , paddingLeft (px 2)
        , paddingRight (px 2)
        , overflow hidden
        , whiteSpace noWrap
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]
