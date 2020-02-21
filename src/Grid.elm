{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid exposing
    ( Config, withColumns, withConfig, currentConfig
    , ColumnConfig, ColumnProperties, stringColumnConfig, intColumnConfig, floatColumnConfig, boolColumnConfig
    , Sorting(..), compareFields, compareBoolField
    , viewBool, viewFloat, viewInt, viewProgressBar, viewString, cumulatedBorderWidth, cellAttributes
    , Model, Msg(..), init, update, view
    , selectedAndVisibleItems, visibleData
    , visibleColumns, isColumn, isSelectionColumn, isSelectionColumnProperties
    , currentOrder, sortedBy
    )

{-| This module allows to create dynamically configurable data grid.


# Configure the grid

A grid is defined using a `Config`

@docs Config, withColumns, withConfig, currentConfig


# Configure a column

@docs ColumnConfig, ColumnProperties, stringColumnConfig, intColumnConfig, floatColumnConfig, boolColumnConfig


# Configure the column sorting

@docs Sorting, compareFields, compareBoolField


# Configure the rendering when a custom one is needed

@docs viewBool, viewFloat, viewInt, viewProgressBar, viewString, cumulatedBorderWidth, cellAttributes


# Boilerplate

@docs Model, Msg, init, update, view


# Get data

@docs selectedAndVisibleItems, visibleData


# Get grid config

@docs visibleColumns, isColumn, isSelectionColumn, isSelectionColumnProperties

-}

import Array
import Browser.Dom
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector)
import Dict exposing (Dict)
import Grid.Colors exposing (black, darkGrey, darkGrey2, darkGrey3, lightGreen, lightGrey, lightGrey2, lightGrey3, white, white2)
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Grid.Icons as Icons exposing (drawSvg, filterIcon)
import Grid.Item as Item exposing (Item)
import Grid.Labels as Label exposing (localize)
import Grid.StringEditor as StringEditor
import Html
import Html.Events.Extra.Mouse as Mouse
import Html.Styled exposing (Attribute, Html, div, hr, i, input, label, span, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css, for, fromUnstyled, id, tabindex, title, type_, value)
import Html.Styled.Events exposing (onBlur, onClick, onDoubleClick, onInput, onMouseUp, stopPropagationOn)
import InfiniteList as IL
import Json.Decode
import List exposing (take)
import List.Extra exposing (findIndex, unique)
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
    , labels : Dict String String
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
    | FilterModified (ColumnConfig a) (Maybe String)
    | NoOp
    | GotCellInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | GotHeaderContainerInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | SetFilters (Dict String String) -- column ID, filter value
    | SetSorting String Sorting -- column ID, Ascending or Descending
    | ScrollTo (Item a -> Bool) -- scroll to the first item for which the function returns True
    | ShowPreferences
    | StringEditorMsg (StringEditor.Msg a)
    | UpdateContent (a -> a)
    | UpdateContentPreservingSelection (a -> a)
    | UserClickedHeader (ColumnConfig a)
    | UserClickedQuickFilterButton (ColumnConfig a)
    | UserClickedFilter
    | UserClickedLine (Item a)
    | UserClickedDragHandle (ColumnConfig a) Position
    | UserClickedPreferenceCloseButton
    | UserClickedResizeHandle (ColumnConfig a) Position
    | UserDoubleClickedEditableCell (Item a) (Item a -> String) String String
    | UserDraggedColumn Position
    | UserEndedMouseInteraction
    | UserHoveredDragHandle
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
            , isEditable = False
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
            , isEditable = False
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
    , hasQuickFilter : Bool
    , comparator : Item a -> Item a -> Order
    , filteringValue : Maybe String
    , filters : Filter a
    , fromString : Item a -> String -> Item a
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
        , isEditable = False
        , order = Unsorted
        , title = "Name"
        , visible = True
        , width = 100
        }

-}
type alias ColumnProperties =
    { id : String
    , isEditable : Bool
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


{-| The internal grid model
-}
type Model a
    = Model (State a)


type alias State a =
    { clickedItem : Maybe (Item a)
    , config : Config a
    , columnsX : List Int
    , content : List a -- all data, visible or not
    , draggedColumn : Maybe (DraggedColumn a)
    , dragStartX : Float
    , editedColumnId : String
    , editedItem : Maybe (Item a)
    , editorHasFocus : Bool -- Avoids selecting a row when clicking in an cell editor
    , filterHasFocus : Bool -- Avoids triggering a sort when clicking in an input field or a quick filter
    , headerContainerPosition : Position
    , hoveredColumn : Maybe (ColumnConfig a)
    , infList : IL.Model
    , isAllSelected : Bool
    , labels : Dict String String
    , openedQuickFilter : Maybe (ColumnConfig a)

    -- TODO: order and sortedBy can have incompatible values. It would be better to join them in a single Maybe
    , order : Sorting
    , resizedColumn : Maybe (ColumnConfig a)
    , showPreferences : Bool
    , sortedBy : Maybe (ColumnConfig a)
    , stringEditorModel : StringEditor.Model
    , visibleItems : List (Item a) -- the subset of items remaining visible after applying filters
    }


{-| The current configuration of the grid
-}
currentConfig : Model a -> Config a
currentConfig (Model state) =
    state.config


{-| The column according to which the grid content is sorted, if any
-}
sortedBy : Model a -> Maybe (ColumnConfig a)
sortedBy (Model state) =
    state.sortedBy


{-| The order used if the grid is sorted using the value of a given column}
-}
currentOrder : Model a -> Sorting
currentOrder (Model state) =
    state.order


{-| Sets the grid configuration
-}
withConfig : Config a -> Model a -> Model a
withConfig config (Model state) =
    Model (withConfigState config state)


withConfigState : Config a -> State a -> State a
withConfigState config state =
    { state | config = config }


{-| Sets the column definitions into the configuration
-}
withColumns : List (ColumnConfig a) -> Model a -> Model a
withColumns columns (Model state) =
    Model (withColumnsState columns state)


withColumnsState : List (ColumnConfig a) -> State a -> State a
withColumnsState columns state =
    let
        config =
            state.config
    in
    state
        |> withConfigState { config | columns = sanitizedColumns columns }
        |> withColumnsXState


withColumnsXState : State a -> State a
withColumnsXState state =
    { state | columnsX = columnsX state }


{-| Sets the data in the grid
-}
withContent : List a -> State a -> State a
withContent data state =
    { state | content = data }


{-| Sets the column being moved by the user
-}
withDraggedColumn : Maybe (DraggedColumn a) -> State a -> State a
withDraggedColumn draggedColumn state =
    { state | draggedColumn = draggedColumn }


{-| Memorize if the editor has focus or not
-}
withEditorHasFocus : Bool -> State a -> State a
withEditorHasFocus isEditing state =
    { state | editorHasFocus = isEditing }


{-| Sets the identifier of the column in which a cell is being edited
-}
withEditedColumnId : String -> State a -> State a
withEditedColumnId id state =
    { state | editedColumnId = id }


withEditedItem : Maybe (Item a) -> State a -> State a
withEditedItem maybeItem state =
    { state | editedItem = maybeItem }


withStringEditorModel : StringEditor.Model -> State a -> State a
withStringEditorModel model state =
    { state | stringEditorModel = model }


{-| Sets the filtered data
-}
withVisibleItems : List (Item a) -> State a -> State a
withVisibleItems visibleItems state =
    { state | visibleItems = visibleItems }


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
            , isEditable = False
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
    , fromString = \item value -> { item | selected = stringToBool value }
    , toString = .selected >> boolToString
    , renderer = viewBool .selected
    , comparator = compareBoolField .selected
    , hasQuickFilter = False
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

        initialState =
            { clickedItem = Nothing
            , columnsX = []
            , config = sanitizedConfig
            , content = data
            , draggedColumn = Nothing
            , dragStartX = 0
            , editedColumnId = ""
            , editedItem = Nothing
            , filterHasFocus = False
            , headerContainerPosition = { x = 0, y = 0 }
            , hoveredColumn = Nothing
            , infList = IL.init
            , isAllSelected = False
            , editorHasFocus = False
            , labels = config.labels
            , openedQuickFilter = Nothing
            , order = Unsorted
            , resizedColumn = Nothing
            , showPreferences = False
            , sortedBy = Nothing
            , stringEditorModel = StringEditor.init
            , visibleItems = indexedItems
            }
    in
    Model { initialState | columnsX = columnsX initialState }


{-| The list of X coordinates of columns; coordinates are expressed in pixels. The first one is at 0.
-}
columnsX : State a -> List Int
columnsX model =
    visibleColumns (Model model)
        |> List.Extra.scanl (\col x -> x + col.properties.width) 0


{-| Updates the grid model
-}
update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
update msg (Model state) =
    case msg of
        UserHoveredDragHandle ->
            ( Model state
              -- get the position of the header container, in order to fix the ghost header position
            , getElementInfo headerContainerId GotHeaderContainerInfo
            )

        ScrollTo isTargetItem ->
            let
                targetItemIndex =
                    Maybe.withDefault 0 <| findIndex isTargetItem state.visibleItems
            in
            ( Model state
            , IL.scrollToNthItem
                { postScrollMessage = NoOp
                , listHtmlId = gridHtmlId
                , itemIndex = targetItemIndex
                , configValue = infiniteListConfig state
                , items = state.visibleItems
                }
            )

        UserClickedQuickFilterButton columnConfig ->
            -- the focus must be put on opened filter div, so that the blur event will be launched when we leave it
            ( Model
                { state
                    | openedQuickFilter = Just columnConfig
                    , filterHasFocus = True
                }
            , focusOn openedQuickFilterHtmlId
            )

        UserDoubleClickedEditableCell itemToBeEdited toString columnId editableCellId ->
            let
                updatedStringEditor =
                    StringEditor.update (StringEditor.SetEditedValue (toString itemToBeEdited)) state.stringEditorModel
            in
            ( Model
                (state
                    |> withEditorHasFocus True
                    |> withEditedColumnId columnId
                    |> withEditedItem (Just itemToBeEdited)
                    |> withStringEditorModel updatedStringEditor
                )
            , Cmd.batch
                [ focusOn StringEditor.editorId
                , getElementInfo editableCellId GotCellInfo
                ]
            )

        _ ->
            ( updateState msg state |> Model, Cmd.none )


{-| focus on an HTML element.
No callback is called (even if focus fails)
-}
focusOn : String -> Cmd (Msg a)
focusOn elementId =
    Browser.Dom.focus elementId |> Task.attempt (\result -> NoOp)


{-| creates a command to get the absolute position of a given dom element
-}
getElementInfo : String -> (Result Browser.Dom.Error Browser.Dom.Element -> Msg a) -> Cmd (Msg a)
getElementInfo elementId msg =
    Browser.Dom.getElement elementId |> Task.attempt (\result -> msg result)


closeQuickFilter : State a -> State a
closeQuickFilter state =
    { state
        | openedQuickFilter = Nothing
        , filterHasFocus = False
    }


{-| Updates the grid state for messages which won't generate any command
-}
updateState : Msg a -> State a -> State a
updateState msg state =
    case msg of
        ColumnsModificationRequested columns ->
            state |> withColumnsState columns

        StringEditorMsg StringEditor.EditorLostFocus ->
            state |> withEditorHasFocus False

        FilterLostFocus ->
            { state | filterHasFocus = False } |> closeQuickFilter

        FilterModified columnConfig maybeString ->
            let
                newColumnconfig =
                    { columnConfig | filteringValue = maybeString }

                newColumns =
                    List.Extra.setIf (isColumn columnConfig) newColumnconfig state.config.columns

                newState =
                    state |> withColumnsState newColumns
            in
            updateVisibleItems newState |> closeQuickFilter

        GotCellInfo (Ok info) ->
            let
                x =
                    info.element.x

                y =
                    info.element.y

                updatedStringEditor =
                    StringEditor.update (StringEditor.SetPosition x y) state.stringEditorModel
            in
            state |> withStringEditorModel updatedStringEditor

        GotCellInfo (Err _) ->
            state

        GotHeaderContainerInfo (Ok info) ->
            { state | headerContainerPosition = { x = info.element.x, y = info.element.y } }

        GotHeaderContainerInfo (Err _) ->
            state

        InfiniteListMsg infList ->
            { state | infList = infList }

        SetFilters filterValues ->
            let
                newColumns =
                    List.map (setFilter filterValues) state.config.columns

                newState =
                    state |> withColumnsState newColumns
            in
            updateVisibleItems newState

        SetSorting columnId sorting ->
            let
                sortedColumnConfig =
                    List.Extra.find (hasId columnId) state.config.columns
            in
            case sortedColumnConfig of
                Just columnConfig ->
                    sort columnConfig sorting orderBy state

                Nothing ->
                    state

        NoOp ->
            state

        ScrollTo _ ->
            -- This message is handled in the `update` function
            state

        ShowPreferences ->
            { state | showPreferences = True }

        UpdateContent updateContent ->
            let
                updatedData =
                    List.map updateContent state.content
            in
            state
                |> withContent updatedData
                |> updateVisibleItems

        -- updates the content, but does not apply filters. WARNING: the data modification function must not modify any value affected by the current filters
        UpdateContentPreservingSelection updateContent ->
            let
                updatedData =
                    List.map updateContent state.content

                updateVisibleItem : Item a -> Item a
                updateVisibleItem item =
                    { item | data = updateContent item.data }

                updatedVisibleItems =
                    List.map updateVisibleItem state.visibleItems
            in
            state
                |> withContent updatedData
                |> withVisibleItems updatedVisibleItems

        UserClickedDragHandle columnConfig mousePosition ->
            let
                draggedColumn =
                    { x = mousePosition.x
                    , column = columnConfig
                    , dragStartX = mousePosition.x
                    , lastSwappedColumnId = ""
                    }
            in
            state
                |> withDraggedColumn (Just draggedColumn)

        -- TODO remove edited item from msg, as it is stored into state
        StringEditorMsg (StringEditor.UserSubmittedForm editedItem) ->
            let
                updatedContent =
                    List.indexedMap updateEditedValue state.content

                editedColumn =
                    state.config.columns
                        |> List.filter (\col -> state.editedColumnId == col.properties.id)
                        |> List.head
                        --the selectionColumn is the only column we know for sure it exists; however in practice it should never be this one
                        |> Maybe.withDefault selectionColumn

                updateEditedValue : Int -> a -> a
                updateEditedValue index item =
                    if index == editedItem.contentIndex then
                        editedColumn.fromString editedItem state.stringEditorModel.value |> .data

                    else
                        item
            in
            state
                |> withEditorHasFocus False
                |> withEditedColumnId ""
                |> withStringEditorModel StringEditor.init
                |> withEditedItem Nothing
                |> withContent updatedContent
                |> updateVisibleItems

        StringEditorMsg stringEditorMsg ->
            state |> withStringEditorModel (StringEditor.update stringEditorMsg state.stringEditorModel)

        UserClickedFilter ->
            { state | filterHasFocus = True }

        UserClickedQuickFilterButton _ ->
            -- This message is handled in the `update` function
            state

        UserClickedHeader columnConfig ->
            -- useful when user clicks in filter input
            if state.filterHasFocus then
                state

            else
                sort columnConfig state.order toggleOrder state

        UserClickedLine item ->
            if state.editorHasFocus then
                state

            else
                { state | clickedItem = Just item }

        UserClickedPreferenceCloseButton ->
            { state | showPreferences = False }

        UserClickedResizeHandle columnConfig position ->
            { state
                | resizedColumn = Just columnConfig
                , dragStartX = position.x
            }

        UserDraggedColumn mousePosition ->
            let
                newDraggedColumn =
                    case state.draggedColumn of
                        Just draggedColumn ->
                            Just
                                { draggedColumn | x = mousePosition.x }

                        Nothing ->
                            Nothing
            in
            { state | draggedColumn = newDraggedColumn }

        UserDoubleClickedEditableCell _ _ _ _ ->
            -- This message is handled in the `update` function
            state

        UserEndedMouseInteraction ->
            { state
                | resizedColumn = Nothing
                , draggedColumn = Nothing
            }

        UserHoveredDragHandle ->
            -- This message is handled in the `update` function
            state

        UserMovedResizeHandle position ->
            resizeColumn state position.x

        UserSwappedColumns columnConfig draggedColumnConfig ->
            case state.draggedColumn of
                Just draggedColumn ->
                    if columnConfig.properties.id == draggedColumn.lastSwappedColumnId then
                        state

                    else
                        let
                            newColumns =
                                moveColumn columnConfig draggedColumnConfig state.config.columns
                        in
                        state
                            |> withColumnsState newColumns
                            |> withDraggedColumn (Just { draggedColumn | lastSwappedColumnId = columnConfig.properties.id })

                Nothing ->
                    state

        UserToggledAllItemSelection ->
            let
                updatedVisibleItems =
                    List.map setSelectionStatus state.visibleItems

                setSelectionStatus item =
                    { item | selected = newStatus }

                newStatus =
                    not state.isAllSelected
            in
            { state
                | isAllSelected = newStatus
                , visibleItems = updatedVisibleItems
            }

        UserToggledColumnVisibility columnConfig ->
            let
                toggleVisibility properties =
                    { properties | visible = not properties.visible }

                newColumns =
                    updateColumnProperties toggleVisibility state columnConfig.properties.id
                        |> List.Extra.updateIf (isColumn columnConfig) (\col -> { col | filteringValue = Nothing })

                stateWithNewColumns =
                    state |> withColumnsState newColumns
            in
            updateVisibleItems stateWithNewColumns

        UserToggledSelection item ->
            let
                newItems =
                    List.Extra.updateAt item.visibleIndex (\it -> toggleSelection it) state.visibleItems
            in
            { state | visibleItems = newItems }


{-| Apply the current filters to the whole data
-}
updateVisibleItems : State a -> State a
updateVisibleItems state =
    let
        allItems =
            List.indexedMap (\contentIndex value -> Item.create value contentIndex) state.content

        visibleItems =
            columnFilters state
                |> List.foldl (\filter remainingValues -> List.filter (.data >> filter) remainingValues) allItems
                |> List.indexedMap (\index item -> { item | visibleIndex = index })
    in
    case state.sortedBy of
        Just columnConfig ->
            state
                |> withVisibleItems visibleItems
                |> sort columnConfig state.order orderBy

        Nothing ->
            state
                |> withVisibleItems visibleItems


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
sort : ColumnConfig a -> Sorting -> (State a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )) -> State a -> State a
sort columnConfig order sorter state =
    let
        ( sortedItems, newOrder ) =
            sorter state columnConfig order

        updatedItems =
            updateIndexes sortedItems
    in
    { state
        | order = newOrder
        , sortedBy = Just columnConfig
        , visibleItems = updatedItems
    }


{-| Reverse the sorting order -or define it as Ascending if the data were not sorted according to the content of the given column
-}
toggleOrder : State a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )
toggleOrder model columnConfig order =
    case order of
        Ascending ->
            ( List.sortWith columnConfig.comparator model.visibleItems |> List.reverse, Descending )

        _ ->
            ( List.sortWith columnConfig.comparator model.visibleItems, Ascending )


orderBy : State a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )
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
resizeColumn : State a -> Float -> State a
resizeColumn state x =
    case state.resizedColumn of
        Just columnConfig ->
            let
                deltaX =
                    x - state.dragStartX

                newWidth =
                    columnConfig.properties.width
                        + Basics.round deltaX

                newColumns =
                    if newWidth > minColumnWidth then
                        updateColumnWidthProperty state columnConfig newWidth

                    else
                        state.config.columns

                newState =
                    state |> withColumnsState newColumns
            in
            { newState
                | columnsX = columnsX state
            }

        _ ->
            state


updateColumnWidthProperty : State a -> ColumnConfig a -> Int -> List (ColumnConfig a)
updateColumnWidthProperty model columnConfig width =
    let
        setWidth properties =
            { properties | width = width }
    in
    updateColumnProperties setWidth model columnConfig.properties.id


updateColumnProperties : (ColumnProperties -> ColumnProperties) -> State a -> String -> List (ColumnConfig a)
updateColumnProperties updateFunction model columnId =
    List.Extra.updateIf (hasId columnId)
        (updatePropertiesInColumnConfig updateFunction)
        model.config.columns


updatePropertiesInColumnConfig : (ColumnProperties -> ColumnProperties) -> ColumnConfig a -> ColumnConfig a
updatePropertiesInColumnConfig updateFunction columnConfig =
    { columnConfig | properties = updateFunction columnConfig.properties }


updateIndexes : List (Item a) -> List (Item a)
updateIndexes items =
    List.indexedMap (\i item -> { item | visibleIndex = i }) items


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
selectedAndVisibleItems (Model state) =
    List.filter .selected state.visibleItems


infiniteListConfig : State a -> IL.Config (Item a) (Msg a)
infiniteListConfig state =
    IL.config
        { itemView = viewRow state
        , itemHeight = IL.withConstantHeight state.config.lineHeight
        , containerHeight = state.config.containerHeight
        }
        |> IL.withOffset 300


{-| Renders the grid
-}
view : Model a -> Html.Html (Msg a)
view (Model state) =
    toUnstyled <|
        if state.showPreferences then
            viewPreferences state

        else
            div []
                [ viewGrid state
                , viewStringEditor state
                ]


{-| the id of the Html node containing the grid
-}
gridHtmlId : String
gridHtmlId =
    "_grid_"


openedQuickFilterHtmlId : String
openedQuickFilterHtmlId =
    "openedQuickFilter"


{-| Renders the grid
-}
viewGrid : State a -> Html (Msg a)
viewGrid state =
    let
        attributes =
            [ css
                [ width (px <| toFloat (state.config.containerWidth + cumulatedBorderWidth))
                , overflow auto
                , margin auto
                , position relative
                ]
            ]

        conditionalAttributes =
            if state.resizedColumn /= Nothing || state.draggedColumn /= Nothing then
                [ onMouseUp UserEndedMouseInteraction
                , fromUnstyled <| Mouse.onLeave (\_ -> UserEndedMouseInteraction)
                ]

            else
                []
    in
    div
        (attributes ++ conditionalAttributes)
    <|
        if state.config.hasFilters then
            [ div
                [ css
                    [ width (px <| toFloat <| gridWidth state)
                    ]
                ]
                [ viewHeaderContainer state
                ]
            , viewGhostHeader state
            , viewRows state
            ]

        else
            [ viewHeaderContainer state
            , viewRows state
            , viewGhostHeader state
            ]


viewStringEditor : State a -> Html (Msg a)
viewStringEditor state =
    case state.editedItem of
        Just editedItem ->
            let
                updatedStringEditorView : Html (StringEditor.Msg a)
                updatedStringEditorView =
                    StringEditor.view state.stringEditorModel editedItem
            in
            Html.Styled.map StringEditorMsg updatedStringEditorView

        Nothing ->
            noContent


viewRows : State a -> Html (Msg a)
viewRows state =
    div
        [ css
            [ height (px <| toFloat state.config.containerHeight)
            , width (px <| toFloat <| gridWidth state)
            , overflowX hidden
            , overflowY auto

            -- displays the vertical scrollbar to the left. https://stackoverflow.com/questions/7347532/how-to-position-a-div-scrollbar-on-the-left-hand-side
            , property "direction" "rtl"
            ]
        , fromUnstyled <| IL.onScroll InfiniteListMsg
        , id gridHtmlId
        ]
        [ Html.Styled.fromUnstyled <| IL.view (infiniteListConfig state) state.infList state.visibleItems ]


{-| Valid filters
-}
columnFilters : State a -> List (a -> Bool)
columnFilters model =
    model.config.columns
        |> List.filterMap (\col -> parseFilteringString col.filteringValue col.filters)


{-| The list of raw data satisfying the current filtering values
-}
visibleData : Model a -> List a
visibleData (Model state) =
    state.visibleItems
        |> List.map .data


{-| Renders the row for a given item
idx is the index of the visible line; if there are 25 visible lines, 0 <= idx < 25
listIdx is the index in the data source; if the total number of items is 1000, 0 <= listidx < 1000
-}
viewRow : State a -> Int -> Int -> Item a -> Html.Html (Msg a)
viewRow state idx listIdx item =
    toUnstyled
        << div
            [ attribute "data-testid" "row"
            , class (state.config.rowClass item)
            , css
                [ displayFlex
                , height (px <| toFloat state.config.lineHeight)
                , width (px <| toFloat <| gridWidth state)
                , borderBottom3 (px 1) solid lightGrey

                -- restore reading order, while preserving the left position of the scrollbar
                , property "direction" "ltr"
                ]
            , onClick
                (if state.editorHasFocus then
                    NoOp

                 else
                    UserClickedLine item
                )
            ]
    <|
        List.map (\columnConfig -> viewCell columnConfig item) (visibleColumns (Model state))


gridWidth : State a -> Int
gridWidth state =
    List.foldl (\columnConfig -> (+) columnConfig.properties.width) 0 (visibleColumns (Model state))


viewCell : ColumnConfig a -> Item a -> Html (Msg a)
viewCell config item =
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
        (cellAttributes properties item)
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
        (cellAttributes properties item)
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
stringColumnConfig : { id : String, isEditable : Bool, title : String, tooltip : String, width : Int, getter : a -> String, setter : Item a -> String -> Item a, localize : String -> String } -> Dict String String -> ColumnConfig a
stringColumnConfig ({ id, isEditable, title, tooltip, width, getter, setter, localize } as properties) labels =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = StringFilter <| stringFilter getter labels
    , filteringValue = Nothing
    , fromString = setter
    , toString = nestedDataGetter
    , renderer = viewString nestedDataGetter
    , comparator = compareFields nestedDataGetter
    , hasQuickFilter = True
    }


{-| Create a ColumnConfig for a column containing a float value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
floatColumnConfig : { id : String, isEditable : Bool, title : String, tooltip : String, width : Int, getter : a -> Float, setter : Item a -> Float -> Item a, localize : String -> String } -> ColumnConfig a
floatColumnConfig ({ id, isEditable, title, tooltip, width, getter, setter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = FloatFilter <| floatFilter getter
    , filteringValue = Nothing
    , fromString = \item value -> String.toFloat value |> Maybe.withDefault 0 |> setter item
    , toString = nestedDataGetter >> String.fromFloat
    , renderer = viewFloat nestedDataGetter
    , comparator = compareFields nestedDataGetter
    , hasQuickFilter = True
    }


{-| Create a ColumnConfig for a column containing an integer value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
intColumnConfig : { id : String, isEditable : Bool, title : String, tooltip : String, width : Int, getter : a -> Int, setter : Item a -> Int -> Item a, localize : String -> String } -> ColumnConfig a
intColumnConfig ({ id, title, isEditable, tooltip, width, getter, setter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = IntFilter <| intFilter getter
    , filteringValue = Nothing
    , fromString = \item value -> String.toInt value |> Maybe.withDefault 0 |> setter item
    , toString = nestedDataGetter >> String.fromInt
    , renderer = viewInt nestedDataGetter
    , comparator = compareFields nestedDataGetter
    , hasQuickFilter = True
    }


{-| Create a ColumnConfig for a column containing a boolean value

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
boolColumnConfig : { id : String, isEditable : Bool, title : String, tooltip : String, width : Int, getter : a -> Bool, setter : Item a -> Bool -> Item a, localize : String -> String } -> ColumnConfig a
boolColumnConfig ({ id, isEditable, title, tooltip, width, getter, setter, localize } as properties) =
    let
        nestedDataGetter =
            .data >> getter
    in
    { properties =
        columnConfigProperties properties
    , filters = BoolFilter <| boolFilter getter
    , filteringValue = Nothing
    , fromString = \item value -> setter item (stringToBool value)
    , toString = nestedDataGetter >> boolToString
    , renderer = viewBool nestedDataGetter
    , comparator = compareBoolField nestedDataGetter
    , hasQuickFilter = True
    }


boolToString : Bool -> String
boolToString value =
    if value then
        "true"

    else
        "false"


stringToBool : String -> Bool
stringToBool string =
    String.toLower string == "true"


columnConfigProperties : { a | id : String, isEditable : Bool, title : String, tooltip : String, width : Int, localize : String -> String } -> ColumnProperties
columnConfigProperties { id, isEditable, title, tooltip, width, localize } =
    { id = id
    , isEditable = isEditable
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
        (cellAttributes properties item)
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
    let
        conditionalAttributes =
            if properties.isEditable then
                [ onDoubleClick (UserDoubleClickedEditableCell item field properties.id (cellId properties item)) ]

            else
                []
    in
    div
        (conditionalAttributes
            ++ cellAttributes properties item
        )
        [ text <| field item
        ]


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
viewPreferences : State a -> Html (Msg a)
viewPreferences state =
    let
        dataColumns =
            List.filter (not << isSelectionColumn) state.config.columns
    in
    div
        [ css
            [ border3 (px 1) solid lightGrey2
            , margin auto
            , padding (px 5)
            , width (px <| toFloat state.config.containerWidth * 0.6)
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
visibleColumns (Model state) =
    List.filter (\column -> column.properties.visible) state.config.columns


viewHeaderContainer : State a -> Html (Msg a)
viewHeaderContainer state =
    let
        attributes =
            [ css
                [ backgroundColor darkGrey
                , displayFlex
                , noShrink
                , height (px <| toFloat state.config.headerHeight)
                ]
            , id headerContainerId
            ]

        conditionalAttributes =
            if state.resizedColumn /= Nothing then
                [ fromUnstyled <| Mouse.onMove (\event -> UserMovedResizeHandle (event |> toPosition)) ]

            else
                []
    in
    div
        (attributes ++ conditionalAttributes)
        (viewHeaders state)


viewHeaders : State a -> List (Html (Msg a))
viewHeaders state =
    List.indexedMap (\index column -> viewHeader state column index) <| visibleColumns (Model state)


headerContainerId : String
headerContainerId =
    "_header_-_container_"


viewHeader : State a -> ColumnConfig a -> Int -> Html (Msg a)
viewHeader state columnConfig index =
    let
        headerId =
            "header-" ++ columnConfig.properties.id

        attributes =
            [ attribute "data-testid" headerId
            , id headerId
            , headerStyles state
            , title columnConfig.properties.tooltip
            ]

        conditionalAttributes =
            if state.resizedColumn == Nothing && not state.filterHasFocus then
                [ onClick (UserClickedHeader columnConfig) ]

            else
                []
    in
    div
        (attributes ++ conditionalAttributes)
        [ if isSelectionColumn columnConfig then
            viewSelectionHeader state columnConfig

          else
            viewDataHeader state columnConfig (draggingAttributes state columnConfig)
        ]


headerStyles : State a -> Attribute (Msg a)
headerStyles state =
    css
        [ backgroundImage <| linearGradient (stop white2) (stop lightGrey) []
        , display inlineFlex
        , noShrink
        , flexDirection row
        , border3 (px 1) solid lightGrey2
        , boxSizing contentBox
        , height (px <| toFloat <| state.config.headerHeight - cumulatedBorderWidth)
        , descendantsVisibleOnHover
        , padding (px 2)
        ]


descendantsVisibleOnHover : Style
descendantsVisibleOnHover =
    hover
        [ descendants
            [ typeSelector "div"
                [ visibility visible -- makes the move handle visible when hover the column
                ]
            ]
        ]


{-| Specific header content for the selection column
-}
viewSelectionHeader : State a -> ColumnConfig a -> Html (Msg a)
viewSelectionHeader state _ =
    let
        areAllItemsChecked =
            List.all .selected state.visibleItems
    in
    div
        [ css
            [ width <| px <| toFloat <| selectionColumn.properties.width - cumulatedBorderWidth
            , displayFlex
            , noShrink
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
viewDataHeader : State a -> ColumnConfig a -> List (Attribute (Msg a)) -> Html (Msg a)
viewDataHeader state columnConfig conditionalAttributes =
    let
        attributes =
            [ css
                [ displayFlex
                , noShrink
                , flexDirection row
                ]
            ]
    in
    div
        attributes
        [ div
            ([ css
                [ displayFlex
                , noShrink
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
                    , noShrink
                    , flexDirection row
                    , flexGrow (num 1)
                    , justifyContent flexStart
                    ]
                ]
                [ viewDragHandle columnConfig
                , viewTitle state columnConfig
                , viewSortingSymbol state columnConfig
                ]
            , viewFilter state columnConfig
            ]
        , viewResizeHandle columnConfig
        ]


draggingAttributes : State a -> ColumnConfig a -> List (Attribute (Msg a))
draggingAttributes state currentColumn =
    case state.draggedColumn of
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
viewGhostHeader : State a -> Html (Msg a)
viewGhostHeader state =
    case state.draggedColumn of
        Just draggedColumn ->
            div
                (headerStyles state
                    :: [ css
                            [ position absolute
                            , left (px <| draggedColumn.x - state.headerContainerPosition.x)
                            , top (px 2)
                            , pointerEvents none
                            ]
                       ]
                )
                [ viewDataHeader state draggedColumn.column [] ]

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
viewTitle : State a -> ColumnConfig a -> Html (Msg a)
viewTitle state columnConfig =
    let
        titleFontStyle =
            case state.sortedBy of
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
            , lineHeight (num 1.2)
            ]
        ]
        [ text <| columnConfig.properties.title
        ]


viewSortingSymbol : State a -> ColumnConfig a -> Html (Msg a)
viewSortingSymbol state columnConfig =
    case state.sortedBy of
        Just config ->
            if config.properties.id == columnConfig.properties.id then
                if state.order == Descending then
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


filterInputWidth : ColumnConfig a -> Px
filterInputWidth columnConfig =
    px
        (toFloat <|
            columnConfig.properties.width
                - cumulatedBorderWidth
                * 2
                - (if columnConfig.hasQuickFilter then
                    30

                   else
                    0
                  )
        )


viewFilter : State a -> ColumnConfig a -> Html (Msg a)
viewFilter state columnConfig =
    div
        [ css
            [ displayFlex
            , flexDirection row
            , justifyContent spaceBetween
            , alignItems center
            , alignSelf stretch
            , backgroundColor white
            , borderRadius (px 3)
            , marginLeft (px 4)
            ]
        ]
        [ input
            [ attribute "data-testid" <| "filter-" ++ columnConfig.properties.id
            , css
                [ border (px 0)
                , height (px <| toFloat <| state.config.lineHeight)
                , paddingLeft (px 2)
                , paddingRight (px 2)
                , marginLeft (px resizingHandleWidth) -- for visual centering in the header
                , width <| filterInputWidth columnConfig
                ]
            , onClick UserClickedFilter
            , onBlur FilterLostFocus
            , onInput <| FilterModified columnConfig << Just
            , title ""
            , value <| Maybe.withDefault "" columnConfig.filteringValue
            ]
            []
        , viewQuickFilter state columnConfig
        ]


type QuickFilterState
    = Open
    | Closed
    | None


viewQuickFilter : State a -> ColumnConfig a -> Html (Msg a)
viewQuickFilter state columnConfig =
    let
        isQuickFilterOpen =
            Maybe.map (isColumn columnConfig) state.openedQuickFilter |> Maybe.withDefault False

        quickFilterState =
            if not columnConfig.hasQuickFilter then
                None

            else if isQuickFilterOpen then
                Open

            else
                Closed
    in
    case quickFilterState of
        None ->
            noContent

        Open ->
            div [ css [ position absolute ] ]
                [ viewOpenedQuickFilter state columnConfig ]

        Closed ->
            div
                [ css
                    [ cursor pointer
                    , displayFlex
                    , justifyContent center
                    , flexDirection row
                    , padding (px 2)
                    , paddingTop (px 6)
                    ]
                , attribute "data-testid" <| "quickFilter-" ++ columnConfig.properties.id
                , onClick UserClickedFilter
                , title <| localize Label.openQuickFilter state.labels
                ]
                [ drawSvg Icons.width filterIcon (UserClickedQuickFilterButton columnConfig)
                ]


viewOpenedQuickFilter : State a -> ColumnConfig a -> Html (Msg a)
viewOpenedQuickFilter state columnConfig =
    let
        maxQuickFilterPropositions =
            100

        values =
            columnVisibleValues columnConfig state
                |> take maxQuickFilterPropositions

        firstItem =
            List.head values
                |> Maybe.withDefault ""

        emptyLabel =
            localize Label.empty state.labels

        filterPropositions =
            if firstItem == "" then
                values
                    |> List.drop 1
                    |> (::) emptyLabel

            else
                values

        params value =
            { columnConfig = columnConfig
            , emptyLabel = emptyLabel
            , filterString = Just ("=" ++ value)
            , isCommand = False
            , label = value
            }
    in
    div
        [ quickFilterPopupStyles columnConfig

        -- allow this div to receive focus (necessary to receive blur event)
        , tabindex 0
        , onBlur FilterLostFocus
        , id openedQuickFilterHtmlId
        ]
    <|
        List.map (\value -> viewQuickFilterEntry (params value))
            filterPropositions
            ++ viewEllipsis (List.length filterPropositions) maxQuickFilterPropositions
            ++ viewResetSelector columnConfig (localize Label.clear state.labels)


quickFilterPopupStyles : ColumnConfig a -> Attribute msg
quickFilterPopupStyles columnConfig =
    css
        [ position absolute
        , left (px <| contextualMenuPosition columnConfig)
        , top (px -10)
        , zIndex (int 1000)
        , border3 (px 1) solid lightGrey2
        , margin auto
        , padding (px 5)
        , opacity (int 1)
        , width (px <| toFloat <| max columnConfig.properties.width 100)
        , maxHeight <| px <| toFloat 400
        , backgroundColor white
        , overflowX hidden
        , overflowY auto
        , whiteSpace noWrap
        ]


{-| The horizontal position of the quick filtering menu, relative to the column left border
-}
contextualMenuPosition : ColumnConfig a -> Float
contextualMenuPosition columnConfig =
    toFloat columnConfig.properties.width - Icons.width - resizingHandleWidth - 10


viewEllipsis : Int -> Int -> List (Html (Msg a))
viewEllipsis totalNumber actualNumber =
    if totalNumber > actualNumber then
        [ span [ css [ cursor auto ] ] [ text "..." ] ]

    else
        []


viewResetSelector : ColumnConfig a -> String -> List (Html (Msg a))
viewResetSelector columnConfig label =
    let
        params =
            { columnConfig = columnConfig
            , emptyLabel = ""
            , filterString = Nothing
            , isCommand = True
            , label = label
            }
    in
    if columnConfig.filteringValue == Nothing then
        []

    else
        [ hr [ css [ color darkGrey2 ] ] []
        , viewQuickFilterEntry params
        ]


type alias ViewQuickFilterEntryParams a =
    { columnConfig : ColumnConfig a
    , emptyLabel : String
    , filterString : Maybe String
    , isCommand : Bool
    , label : String
    }


viewQuickFilterEntry : ViewQuickFilterEntryParams a -> Html (Msg a)
viewQuickFilterEntry params =
    let
        style =
            if params.isCommand || params.label == params.emptyLabel then
                fontStyle italic

            else
                fontStyle normal
    in
    div
        [ onClick <| FilterModified params.columnConfig params.filterString
        , css
            [ cursor pointer
            , style
            , hover [ backgroundColor lightGrey3 ]
            ]
        ]
        [ text params.label ]


{-| Left + right cell border width, including padding, in px.
Useful to take into account the borders when calculating the total grid width
-}
cumulatedBorderWidth : Int
cumulatedBorderWidth =
    6


{-| Common attributes for cell renderers
-}
cellAttributes : ColumnProperties -> Item a -> List (Html.Styled.Attribute (Msg a))
cellAttributes properties item =
    [ id (cellId properties item)
    , attribute "data-testid" properties.id
    , css
        [ alignItems center
        , display inlineFlex
        , noShrink
        , justifyContent spaceBetween
        , borderLeft3 (px 1) solid lightGrey
        , borderRight3 (px 1) solid lightGrey
        , firstOfType [ justifyContent flexEnd ] -- justifies on right the first column to avoid it being partially hidden by vertical scrollbar
        , boxSizing contentBox
        , minHeight (pct 100) -- 100% min height forces empty divs to be correctly rendered
        , paddingLeft (px 2)
        , paddingRight (px 2)
        , descendantsVisibleOnHover
        , overflow hidden
        , whiteSpace noWrap
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]


cellId : ColumnProperties -> Item a -> String
cellId columnProperties item =
    columnProperties.id ++ String.fromInt item.visibleIndex


{-| The unique values in a column
-}
columnVisibleValues : ColumnConfig a -> State a -> List String
columnVisibleValues columnConfig state =
    state.visibleItems
        |> List.sortWith columnConfig.comparator
        |> List.map columnConfig.toString
        |> unique


{-| prevents header width to be automatically reduced
-}
noShrink : Style
noShrink =
    flexShrink (num 0)
