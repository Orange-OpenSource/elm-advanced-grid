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
    , currentOrder, getEditedValue, isAnyItemSelected, sortedBy, stringWithTooltipColumnConfig
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
import Dict exposing (Dict)
import Grid.Colors exposing (black)
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Grid.Html exposing (getElementInfo, noContent, stopPropagationOnClick, viewIf)
import Grid.Icons as Icons exposing (checkIcon, drawClickableDarkSvg, drawClickableLightSvg, drawDarkSvg, filterIcon, informationIcon)
import Grid.Item as Item exposing (Item)
import Grid.Labels as Label exposing (localize)
import Grid.List exposing (appendIf)
import Grid.Parsers exposing (orKeyword)
import Grid.QuickFilter as QuickFilter
import Grid.Scroll exposing (HorizontalScrollInfo, VerticalScrollInfo, onVerticalScroll)
import Grid.StringEditor as StringEditor
import Grid.Stylesheet as Stylesheet exposing (resizingHandleWidth)
import Html
import Html.Events.Extra.Mouse as Mouse
import Html.Styled exposing (Attribute, Html, div, i, input, label, span, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css, for, fromUnstyled, id, title, type_, value)
import Html.Styled.Events exposing (onBlur, onClick, onDoubleClick, onInput, onMouseUp)
import Html.Styled.Lazy exposing (lazy, lazy2, lazy3)
import InfiniteList as IL
import List
import List.Extra exposing (findIndex, unique)
import Set exposing (Set)
import String


{-| The configuration for the grid. The grid content is described
using a list of ColumnConfig.
You should define the css classes, if you want to use some.
By example you could add to all rows a "cursor: pointer" style,
if you define some behaviour to be triggered when the user clicks a line.

    gridConfig =
        { canSelectRows = True
        , columns = columnList
        , containerId = "my-main-container"
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
    , containerId : String
    , footerHeight : Int
    , hasFilters : Bool
    , headerHeight : Int
    , labels : Dict String String
    , lineHeight : Int
    , rowAttributes : Item a -> List (Attribute (Msg a))
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
    | GotCellInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | GotHeaderContainerInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | GotParentContainerInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | GotQuickFilterButtonInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | GotRowsContainerInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | NoOp
    | QuickFilterMsg QuickFilter.Msg
    | SetFilters (Dict String String) -- column ID, filter value
    | SetSorting String Sorting -- column ID, Ascending or Descending
    | ScrollTo (Item a -> Bool) -- scroll to the first item for which the function returns True
    | ShowPreferences
    | StringEditorMsg (StringEditor.Msg a)
    | UpdateContent (a -> a)
    | UpdateContentPreservingSelection (a -> a)
    | UserClickedCell String (Item a) -- column ID and item
    | UserClickedHeader (ColumnConfig a)
    | UserClickedQuickFilterButton (ColumnConfig a)
    | UserClickedFilter
    | UserClickedDragHandle (ColumnConfig a) Position
    | UserClickedLine (Item a)
    | UserClickedOutsideOfQuickFilter
    | UserClickedPreferenceCloseButton
    | UserClickedResizeHandle (ColumnConfig a) Position
    | UserDoubleClickedEditableCell (Item a) (Item a -> String) String String
    | UserDraggedColumn Position
    | UserEndedMouseInteraction
    | UserHoveredDragHandle
    | UserMovedResizeHandle Position
    | UserResizedWindow
    | UserScrolledRowsVertically VerticalScrollInfo
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
    { properties : ColumnProperties a
    , hasQuickFilter : Bool
    , comparator : Item a -> Item a -> Order
    , filteringValue : Maybe String
    , filters : Filter a
    , toString : Item a -> String
    , renderer : ColumnProperties a -> (Item a -> Html (Msg a))
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
type alias ColumnProperties a =
    { id : String
    , editor : Maybe (EditorConfig a)
    , order : Sorting
    , title : String
    , tooltip : String
    , visible : Bool
    , width : Int
    }


type alias EditorConfig a =
    { fromString : Item a -> String -> Item a
    , maxLength : Int
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
    = Model (State a) StringEditor.Model QuickFilter.Model


type alias State a =
    { areFilterVisible : Bool
    , clickedItem : Maybe (Item a)
    , config : Config a
    , containerHeight : Float
    , containerWidth : Float
    , content : List a -- all data, visible or not
    , draggedColumn : Maybe (DraggedColumn a)
    , dragStartX : Float
    , editedCellId : String
    , editedColumnId : String
    , editedItem : Maybe (Item a)
    , editorHasFocus : Bool -- Avoids selecting a row when clicking in an cell editor
    , filterHasFocus : Bool -- Avoids triggering a sort when clicking in an input field or a quick filter
    , headerContainerPosition : Position
    , hoveredColumn : Maybe (ColumnConfig a)
    , infList : IL.Model
    , isAllSelected : Bool
    , labels : Dict String String
    , quickFilteredColumn : Maybe (ColumnConfig a)

    -- TODO: order and sortedBy can have incompatible values. It would be better to join them in a single Maybe
    , order : Sorting
    , resizedColumn : Maybe (ColumnConfig a)
    , showPreferences : Bool
    , sortedBy : Maybe (ColumnConfig a)
    , visibleItems : List (Item a) -- the subset of items remaining visible after applying filters
    }


{-| The current configuration of the grid
-}
currentConfig : Model a -> Config a
currentConfig (Model state _ _) =
    state.config


{-| The column according to which the grid content is sorted, if any
-}
sortedBy : Model a -> Maybe (ColumnConfig a)
sortedBy (Model state _ _) =
    state.sortedBy


{-| The order used if the grid is sorted using the value of a given column}
-}
currentOrder : Model a -> Sorting
currentOrder (Model state _ _) =
    state.order


{-| Sets the grid configuration
-}
withConfig : Config a -> Model a -> Model a
withConfig config (Model state stringEditorModel quickFilterModel) =
    Model (withConfigState config state) stringEditorModel quickFilterModel


withConfigState : Config a -> State a -> State a
withConfigState config state =
    { state | config = config }


{-| Sets the column definitions into the configuration
-}
withColumns : List (ColumnConfig a) -> Model a -> Model a
withColumns columns (Model state stringEditorModel quickFilterModel) =
    Model (withColumnsState columns state) stringEditorModel quickFilterModel


withColumnsState : List (ColumnConfig a) -> State a -> State a
withColumnsState columns state =
    let
        config =
            state.config
    in
    state
        |> withConfigState { config | columns = sanitizedColumns columns }


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


{-| Sets the identifier of the cell which is being edited
-}
withEditedCellId : String -> State a -> State a
withEditedCellId id state =
    { state | editedCellId = id }


{-| Sets the identifier of the column in which a cell is being edited
-}
withEditedColumnId : String -> State a -> State a
withEditedColumnId id state =
    { state | editedColumnId = id }


withEditedItem : Maybe (Item a) -> State a -> State a
withEditedItem maybeItem state =
    { state | editedItem = maybeItem }


withIsAllSelected : Bool -> State a -> State a
withIsAllSelected isAllSelected state =
    { state | isAllSelected = isAllSelected }


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
        properties : ColumnProperties a
        properties =
            { id = "_MultipleSelection_"
            , editor = Nothing
            , order = Unsorted
            , title = ""
            , tooltip = ""
            , visible = True
            , width = 40
            }
    in
    { properties = properties
    , comparator = compareBoolField .selected
    , filters = NoFilter
    , filteringValue = Nothing
    , hasQuickFilter = False
    , renderer = viewBool .selected
    , toString = .selected >> boolToString
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
init : Config a -> List a -> ( Model a, Cmd (Msg a) )
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
            { areFilterVisible = config.hasFilters
            , clickedItem = Nothing
            , config = sanitizedConfig
            , containerHeight = 0
            , containerWidth = 0
            , content = data
            , draggedColumn = Nothing
            , dragStartX = 0
            , editedCellId = ""
            , editedColumnId = ""
            , editedItem = Nothing
            , filterHasFocus = False
            , headerContainerPosition = { x = 0, y = 0 }
            , hoveredColumn = Nothing
            , infList = IL.init
            , isAllSelected = False
            , editorHasFocus = False
            , labels = config.labels
            , quickFilteredColumn = Nothing
            , order = Unsorted
            , resizedColumn = Nothing
            , showPreferences = False
            , sortedBy = Nothing
            , visibleItems = indexedItems
            }

        stringEditorModel =
            StringEditor.init config.labels

        quickFilterModel =
            QuickFilter.init [] Nothing config.labels 0
    in
    ( Model initialState stringEditorModel quickFilterModel
    , getElementInfo config.containerId GotParentContainerInfo
    )


{-| Updates the grid model
-}
update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
update msg model =
    let
        (Model state stringEditorModel quickFilterModel) =
            model
    in
    case msg of
        GotCellInfo (Ok info) ->
            let
                cellPosition =
                    { x = info.element.x, y = info.element.y }

                cellDimensions =
                    { width = info.element.width, height = info.element.height }

                containerHeight =
                    state.containerHeight

                ( updatedStringEditorModel, cmd ) =
                    StringEditor.update (StringEditor.SetPositionAndDimensions cellPosition cellDimensions containerHeight) stringEditorModel
            in
            ( Model state updatedStringEditorModel quickFilterModel, Cmd.map StringEditorMsg cmd )

        GotCellInfo (Err _) ->
            ( model, Cmd.none )

        GotQuickFilterButtonInfo (Ok info) ->
            let
                position =
                    { x = info.element.x
                    , y = info.element.y
                    }

                ( updatedQuickFilterModel, cmd ) =
                    QuickFilter.update (QuickFilter.SetPosition position) quickFilterModel
            in
            ( Model state stringEditorModel updatedQuickFilterModel
            , Cmd.map QuickFilterMsg cmd
            )

        GotQuickFilterButtonInfo (Err _) ->
            ( model, Cmd.none )

        GotRowsContainerInfo (Ok info) ->
            let
                position =
                    { x = info.element.x
                    , y = info.element.y - toFloat state.config.headerHeight
                    }

                quickFilterMaxX =
                    state.containerWidth - position.x

                ( updatedStringEditorModel, stringEditorCmd ) =
                    StringEditor.update (StringEditor.SetOrigin position) stringEditorModel

                ( updatedQuickFilterModel, quickFilterCommand ) =
                    QuickFilter.update (QuickFilter.SetOrigin position quickFilterMaxX) quickFilterModel
            in
            ( Model state updatedStringEditorModel updatedQuickFilterModel
            , Cmd.batch
                [ Cmd.map StringEditorMsg stringEditorCmd
                , Cmd.map QuickFilterMsg quickFilterCommand
                ]
            )

        GotRowsContainerInfo (Err _) ->
            ( model, Cmd.none )

        UserScrolledRowsVertically _ ->
            ( model, getElementInfo state.editedCellId GotCellInfo )

        QuickFilterMsg quickFilterMsg ->
            updateQuickFilter quickFilterMsg model

        ScrollTo isTargetItem ->
            let
                targetItemIndex =
                    Maybe.withDefault 0 <| findIndex isTargetItem state.visibleItems
            in
            ( Model state stringEditorModel quickFilterModel
            , IL.scrollToNthItem
                { postScrollMessage = NoOp
                , listHtmlId = rowsHtmlId
                , itemIndex = targetItemIndex
                , configValue = infiniteListConfig state
                , items = state.visibleItems
                }
            )

        StringEditorMsg stringEditorMsg ->
            updateStringEditor stringEditorMsg model

        UserClickedQuickFilterButton columnConfig ->
            -- the focus must be put on opened filter div, so that the blur event will be launched when we leave it
            let
                allValuesInColumn =
                    columnValues columnConfig state

                columnWidth =
                    toFloat columnConfig.properties.width

                updatedQuickFilterModel =
                    QuickFilter.init allValuesInColumn columnConfig.filteringValue state.labels columnWidth
            in
            ( Model
                { state
                    | quickFilteredColumn = Just columnConfig
                    , filterHasFocus = True
                }
                stringEditorModel
                updatedQuickFilterModel
            , Cmd.batch
                [ getElementInfo rowsHtmlId GotRowsContainerInfo
                , getElementInfo (quickFilterButtonId columnConfig) GotQuickFilterButtonInfo
                ]
            )

        UserDoubleClickedEditableCell itemToBeEdited fieldToString columnId editableCellId ->
            let
                ( updatedStringEditorModel, cmd ) =
                    openEditor model columnId editableCellId itemToBeEdited fieldToString
            in
            ( updatedStringEditorModel
            , Cmd.batch
                [ getElementInfo rowsHtmlId GotRowsContainerInfo
                , getElementInfo editableCellId GotCellInfo
                , cmd
                ]
            )

        UserHoveredDragHandle ->
            ( Model state stringEditorModel quickFilterModel
              -- get the position of the header container, in order to fix the ghost header position
            , getElementInfo headerContainerId GotHeaderContainerInfo
            )

        UserResizedWindow ->
            ( model
            , getElementInfo state.config.containerId GotParentContainerInfo
            )

        _ ->
            ( Model (updateState msg state) stringEditorModel quickFilterModel
            , Cmd.none
            )


closeQuickFilter : State a -> State a
closeQuickFilter state =
    { state
        | quickFilteredColumn = Nothing
        , filterHasFocus = False
    }


escapeKeyCode =
    27


{-| Updates the grid state for messages which won't generate any command
-}
updateState : Msg a -> State a -> State a
updateState msg state =
    case msg of
        ColumnsModificationRequested columns ->
            state |> withColumnsState columns

        FilterLostFocus ->
            { state | filterHasFocus = False } |> closeQuickFilter

        FilterModified columnConfig maybeString ->
            let
                filterString =
                    case maybeString of
                        Just "" ->
                            -- the content of the input field was just deleted by the user
                            Nothing

                        _ ->
                            maybeString
            in
            applyFilter state columnConfig filterString

        -- processed by update
        GotCellInfo _ ->
            state

        GotHeaderContainerInfo (Ok info) ->
            { state | headerContainerPosition = { x = info.element.x, y = info.element.y } }

        GotHeaderContainerInfo (Err _) ->
            state

        GotParentContainerInfo (Ok info) ->
            { state
                | containerWidth = info.element.width
                , containerHeight = info.viewport.height - info.element.y - toFloat state.config.footerHeight
            }

        GotParentContainerInfo (Err _) ->
            state

        GotQuickFilterButtonInfo _ ->
            state

        -- processed by update
        GotRowsContainerInfo _ ->
            state

        InfiniteListMsg infList ->
            { state | infList = infList }

        NoOp ->
            state

        QuickFilterMsg _ ->
            state

        SetFilters filterValues ->
            let
                newColumns =
                    List.map (setFilter filterValues) state.config.columns

                newState =
                    state
                        |> withColumnsState newColumns
                        |> withIsAllSelected False
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

        ScrollTo _ ->
            -- This message is handled in the `update` function
            state

        ShowPreferences ->
            { state | showPreferences = True }

        StringEditorMsg _ ->
            state

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

        UserClickedCell columnId item ->
            state

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

        UserClickedFilter ->
            { state | filterHasFocus = True }

        UserClickedOutsideOfQuickFilter ->
            { state | quickFilteredColumn = Nothing }

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

        UserResizedWindow ->
            -- This message is handled in the `update` function
            state

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

        UserScrolledRowsVertically _ ->
            state


applyFilter : State a -> ColumnConfig a -> Maybe String -> State a
applyFilter state columnConfig filteringValue =
    let
        newColumnconfig =
            { columnConfig | filteringValue = filteringValue }

        newColumns =
            List.Extra.setIf (isColumn columnConfig) newColumnconfig state.config.columns

        newState =
            state
                |> withColumnsState newColumns
                |> withIsAllSelected False
    in
    updateVisibleItems newState |> closeQuickFilter


updateQuickFilter : QuickFilter.Msg -> Model a -> ( Model a, Cmd (Msg a) )
updateQuickFilter msg model =
    let
        (Model state stringEditorModel quickFilterModel) =
            model

        ( updatedQuickFilterModel, cmd ) =
            QuickFilter.update msg quickFilterModel
    in
    case msg of
        QuickFilter.UserClickedClear ->
            let
                updatedState =
                    applyQuickFilter state updatedQuickFilterModel
            in
            ( Model updatedState stringEditorModel quickFilterModel
            , Cmd.map QuickFilterMsg cmd
            )

        QuickFilter.UserToggledEntry _ ->
            let
                updatedState =
                    applyQuickFilter state updatedQuickFilterModel
            in
            ( Model updatedState stringEditorModel quickFilterModel
            , Cmd.map QuickFilterMsg cmd
            )

        _ ->
            ( Model state stringEditorModel updatedQuickFilterModel
            , Cmd.map QuickFilterMsg cmd
            )


applyQuickFilter : State a -> QuickFilter.Model -> State a
applyQuickFilter state quickFilterModel =
    let
        selectedEntries =
            quickFilterModel.outputStrings
                |> Set.toList

        concatenatedEntries =
            if List.length selectedEntries > 1 then
                selectedEntries
                    |> List.map prependEqualOperator
                    |> String.join (orKeyword state.config.labels)

            else
                List.head selectedEntries
                    |> Maybe.map prependEqualOperator
                    |> Maybe.withDefault ""

        newFilteringValue =
            if concatenatedEntries == "" then
                Nothing

            else
                Just concatenatedEntries
    in
    case state.quickFilteredColumn of
        Just column ->
            applyFilter state column newFilteringValue
                |> withIsAllSelected False

        Nothing ->
            state
                |> withIsAllSelected False


prependEqualOperator : String -> String
prependEqualOperator operandValue =
    let
        firstChar =
            String.left 1 operandValue
    in
    case firstChar of
        ">" ->
            operandValue

        "<" ->
            operandValue

        "=" ->
            operandValue

        _ ->
            "=" ++ operandValue


updateStringEditor : StringEditor.Msg a -> Model a -> ( Model a, Cmd (Msg a) )
updateStringEditor msg model =
    let
        (Model state stringEditorModel quickFilterModel) =
            model
    in
    case msg of
        StringEditor.EditorLostFocus editedItem ->
            ( applyStringEdition editedItem model
            , Cmd.none
            )

        StringEditor.UserClickedCancel ->
            ( Model (closeEditor state) (StringEditor.init state.labels) quickFilterModel
            , Cmd.none
            )

        StringEditor.OnKeyUp keyCode ->
            if keyCode == escapeKeyCode then
                ( Model (closeEditor state) (StringEditor.init state.labels) quickFilterModel
                , Cmd.none
                )

            else
                ( model
                , Cmd.none
                )

        StringEditor.UserSubmittedForm editedItem ->
            ( applyStringEdition editedItem model
            , Cmd.none
            )

        stringEditorMsg ->
            let
                ( updatedStringEditorModel, cmd ) =
                    StringEditor.update stringEditorMsg stringEditorModel
            in
            ( Model state updatedStringEditorModel quickFilterModel
            , Cmd.map StringEditorMsg cmd
            )


applyStringEdition : Item a -> Model a -> Model a
applyStringEdition editedItem model =
    let
        (Model state stringEditorModel quickFilterModel) =
            model

        updatedContent =
            List.indexedMap updateEditedValue state.content

        updateEditedValue : Int -> a -> a
        updateEditedValue index item =
            if index == editedItem.contentIndex then
                let
                    editedColumn : ColumnConfig a
                    editedColumn =
                        editedColumnConfig state
                in
                case editedColumn.properties.editor of
                    Just editor ->
                        editor.fromString editedItem stringEditorModel.value
                            |> .data

                    Nothing ->
                        -- this case should never occur
                        item

            else
                item

        updatedState =
            state
                |> closeEditor
                |> withContent updatedContent
                |> updateVisibleItems
    in
    Model updatedState (StringEditor.init state.labels) quickFilterModel


openEditor : Model a -> String -> String -> Item a -> (Item a -> String) -> ( Model a, Cmd (Msg a) )
openEditor model columnId editedCellId itemToBeEdited fieldToString =
    let
        (Model state stringEditorModel quickFilterModel) =
            model

        updatedState =
            state
                |> withEditorHasFocus True
                |> withEditedCellId editedCellId
                |> withEditedColumnId columnId
                |> withEditedItem (Just itemToBeEdited)

        editedColumn =
            editedColumnConfig updatedState

        maxLength =
            case editedColumn.properties.editor of
                Just editor ->
                    editor.maxLength

                Nothing ->
                    0

        ( updatedStringEditorModel, cmd ) =
            stringEditorModel
                |> StringEditor.withMaxLength maxLength
                |> StringEditor.update (StringEditor.SetEditedValue (fieldToString itemToBeEdited))
    in
    ( Model updatedState updatedStringEditorModel quickFilterModel
    , Cmd.map StringEditorMsg cmd
    )


editedColumnConfig : State a -> ColumnConfig a
editedColumnConfig state =
    state.config.columns
        |> List.filter (\col -> state.editedColumnId == col.properties.id)
        |> List.head
        --the selectionColumn is the only column we know for sure it exists; however in practice it should never be this one
        |> Maybe.withDefault selectionColumn



--|> withStringEditorModel updatedStringEditor


closeEditor : State a -> State a
closeEditor state =
    state
        |> withEditorHasFocus False
        |> withEditedColumnId ""
        |> withEditedItem Nothing


getEditedValue : Model a -> String
getEditedValue (Model _ stringEditorModel _) =
    stringEditorModel.value


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
            in
            state |> withColumnsState newColumns

        _ ->
            state


updateColumnWidthProperty : State a -> ColumnConfig a -> Int -> List (ColumnConfig a)
updateColumnWidthProperty model columnConfig width =
    let
        setWidth properties =
            { properties | width = width }
    in
    updateColumnProperties setWidth model columnConfig.properties.id


updateColumnProperties : (ColumnProperties a -> ColumnProperties a) -> State a -> String -> List (ColumnConfig a)
updateColumnProperties updateFunction model columnId =
    List.Extra.updateIf (hasId columnId)
        (updatePropertiesInColumnConfig updateFunction)
        model.config.columns


updatePropertiesInColumnConfig : (ColumnProperties a -> ColumnProperties a) -> ColumnConfig a -> ColumnConfig a
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
selectedAndVisibleItems (Model state _ _) =
    List.filter .selected state.visibleItems


infiniteListConfig : State a -> IL.Config (Item a) (Msg a)
infiniteListConfig state =
    IL.config
        { itemView = viewRow state
        , itemHeight = IL.withConstantHeight state.config.lineHeight
        , containerHeight = Basics.round state.containerHeight
        }
        |> IL.withOffset 300


{-| Renders the whole grid, including headers, rows, preferences, filters, editor...
-}
view : Model a -> Html.Html (Msg a)
view model =
    let
        (Model state stringEditorModel quickFilterModel) =
            model
    in
    toUnstyled <|
        if state.showPreferences then
            viewPreferences state

        else
            div
                [ id rootContainerId
                , class "eag-root"
                , css
                    [ width (px state.containerWidth)
                    , height (px state.containerHeight)
                    ]
                ]
                [ Stylesheet.grid
                , lazy viewGrid state
                , lazy2 viewStringEditor state.editedItem stringEditorModel
                , lazy2 viewQuickFilter state.quickFilteredColumn quickFilterModel
                ]


rootContainerId : String.String
rootContainerId =
    "eag-root-container"


{-| the id of the Html node containing the rows
-}
rowsHtmlId : String
rowsHtmlId =
    "eag-rows"


{-| Renders headers and rows
-}
viewGrid : State a -> Html (Msg a)
viewGrid state =
    let
        columnIsResizedOrDragged =
            state.resizedColumn /= Nothing || state.draggedColumn /= Nothing

        editionInProgress =
            state.editedItem /= Nothing
    in
    div
        ([ class "eag-grid"
         , css
            [ width (px <| (state.containerWidth + toFloat cumulatedBorderWidth))
            ]
         ]
            |> appendIf columnIsResizedOrDragged
                [ onMouseUp UserEndedMouseInteraction
                , fromUnstyled <| Mouse.onLeave (\_ -> UserEndedMouseInteraction)
                ]
            |> appendIf editionInProgress [ onVerticalScroll UserScrolledRowsVertically ]
            |> appendIf (state.quickFilteredColumn /= Nothing) [ onClick UserClickedOutsideOfQuickFilter ]
        )
        [ viewHeaderContainer state
        , viewRows state
        , viewGhostHeader state
        ]


viewStringEditor : Maybe (Item a) -> StringEditor.Model -> Html (Msg a)
viewStringEditor editedItem stringEditorModel =
    case editedItem of
        Just item ->
            let
                updatedStringEditorView : Html (StringEditor.Msg a)
                updatedStringEditorView =
                    StringEditor.view stringEditorModel item
            in
            Html.Styled.map StringEditorMsg updatedStringEditorView

        Nothing ->
            noContent


viewQuickFilter : Maybe (ColumnConfig a) -> QuickFilter.Model -> Html (Msg a)
viewQuickFilter filteredColumn quickFilterModel =
    case filteredColumn of
        Just _ ->
            let
                updatedQuickFilterView : Html QuickFilter.Msg
                updatedQuickFilterView =
                    QuickFilter.view quickFilterModel
            in
            Html.Styled.map QuickFilterMsg updatedQuickFilterView

        Nothing ->
            noContent


viewRows : State a -> Html (Msg a)
viewRows state =
    let
        editionInProgress =
            state.editedItem /= Nothing
    in
    div
        ([ class "eag-rows"
         , css
            [ height (px <| state.containerHeight - toFloat state.config.headerHeight - horizontalScrollbarHeight)
            , width (px <| toFloat <| gridWidth state)
            ]
         , fromUnstyled <| IL.onScroll InfiniteListMsg
         , id rowsHtmlId
         ]
            |> appendIf editionInProgress [ onVerticalScroll UserScrolledRowsVertically ]
        )
        [ Html.Styled.fromUnstyled <| IL.view (infiniteListConfig state) state.infList state.visibleItems ]


horizontalScrollbarHeight : Float
horizontalScrollbarHeight =
    20


{-| Valid filters
-}
columnFilters : State a -> List (a -> Bool)
columnFilters model =
    model.config.columns
        |> List.filterMap (\col -> parseFilteringString col.filteringValue col.filters)


{-| The list of raw data satisfying the current filtering values
-}
visibleData : Model a -> List a
visibleData (Model state _ _) =
    state.visibleItems
        |> List.map .data


{-| Renders the row for a given item
idx is the index of the visible line;
For 25 visible lines, 0 <= idx < 25
listIdx is the index in the data source;
For 1000 items, 0 <= listidx < 1000
-}
viewRow : State a -> Int -> Int -> Item a -> Html.Html (Msg a)
viewRow state idx listIdx item =
    let
        editedRowClass =
            case state.editedItem of
                Just editedItem ->
                    if item.visibleIndex == editedItem.visibleIndex then
                        "eag-edited-row-class"

                    else
                        ""

                Nothing ->
                    ""
    in
    toUnstyled
        << div
            ([ class editedRowClass
             , class "eag-row"
             , css
                [ height (px <| toFloat state.config.lineHeight)
                , width (px <| toFloat <| gridWidth state)
                , Css.property "display" "grid"
                , Css.property "grid-template-columns" <| gridTemplateColumns state
                ]
             ]
                ++ state.config.rowAttributes item
            )
    <|
        List.map (\columnConfig -> viewCell columnConfig item) (visibleColumns_ state)


gridWidth : State a -> Int
gridWidth state =
    List.foldl (\columnConfig -> (+) columnConfig.properties.width) 0 (visibleColumns_ state)


{-| the value of the CSS grid property defining column widths
-}
gridTemplateColumns : State a -> String
gridTemplateColumns state =
    visibleColumns_ state
        |> List.map (\columnConfig -> String.fromInt columnConfig.properties.width ++ "px")
        |> String.join " "


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
viewInt : (Item a -> Int) -> ColumnProperties a -> Item a -> Html (Msg a)
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
viewBool : (Item a -> Bool) -> ColumnProperties a -> Item a -> Html (Msg a)
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


{-| Create a ColumnConfig for a column containing a string value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
stringColumnConfig :
    { id : String
    , editor : Maybe (EditorConfig a)
    , title : String
    , tooltip : String
    , width : Int
    , getter : a -> String
    , setter : Item a -> String -> Item a
    , localize : String -> String
    }
    -> Dict String String
    -> ColumnConfig a
stringColumnConfig properties labels =
    let
        columnProperties =
            { id = properties.id
            , editor = properties.editor
            , order = Unsorted
            , title = properties.localize properties.title
            , tooltip = properties.localize properties.tooltip
            , visible = True
            , width = properties.width
            }

        nestedDataGetter =
            .data >> properties.getter
    in
    { properties = columnProperties
    , filters = StringFilter <| stringFilter properties.getter labels
    , filteringValue = Nothing
    , toString = nestedDataGetter
    , renderer = viewString nestedDataGetter
    , comparator = compareFields nestedDataGetter
    , hasQuickFilter = True
    }


{-| Create a ColumnConfig for a column containing a string value, and a tooltip for each cell

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
stringWithTooltipColumnConfig :
    { id : String
    , editor : Maybe (EditorConfig a)
    , title : String
    , tooltip : String
    , width : Int
    , getter : a -> ( String, String )
    , setter : Item a -> String -> Item a
    , localize : String -> String
    }
    -> Dict String String
    -> ColumnConfig a
stringWithTooltipColumnConfig properties labels =
    let
        columnProperties =
            { id = properties.id
            , editor = properties.editor
            , order = Unsorted
            , title = properties.localize properties.title
            , tooltip = properties.localize properties.tooltip
            , visible = True
            , width = properties.width
            }

        nestedDataGetter =
            .data >> properties.getter
    in
    { properties = columnProperties
    , filters = StringFilter <| stringFilter (properties.getter >> Tuple.first) labels
    , filteringValue = Nothing
    , toString = nestedDataGetter >> Tuple.first
    , renderer = viewStringWithInfo nestedDataGetter
    , comparator = compareFields (nestedDataGetter >> Tuple.first)
    , hasQuickFilter = True
    }


{-| Create a ColumnConfig for a column containing a float value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
floatColumnConfig :
    { id : String
    , title : String
    , tooltip : String
    , width : Int
    , getter : a -> Float
    , setter : Item a -> Float -> Item a
    , localize : String -> String
    }
    -> Dict String String
    -> ColumnConfig a
floatColumnConfig properties labels =
    let
        columnProperties =
            { id = properties.id
            , editor = Nothing
            , order = Unsorted
            , title = properties.localize properties.title
            , tooltip = properties.localize properties.tooltip
            , visible = True
            , width = properties.width
            }

        nestedDataGetter =
            .data >> properties.getter
    in
    { properties = columnProperties
    , filters = FloatFilter <| floatFilter properties.getter labels
    , filteringValue = Nothing
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
intColumnConfig :
    { id : String
    , title : String
    , tooltip : String
    , width : Int
    , getter : a -> Int
    , setter : Item a -> Int -> Item a
    , localize : String -> String
    }
    -> Dict String String
    -> ColumnConfig a
intColumnConfig properties labels =
    let
        columnProperties =
            { id = properties.id
            , editor = Nothing
            , order = Unsorted
            , title = properties.localize properties.title
            , tooltip = properties.localize properties.tooltip
            , visible = True
            , width = properties.width
            }

        nestedDataGetter =
            .data >> properties.getter
    in
    { properties = columnProperties
    , filters = IntFilter <| intFilter properties.getter labels
    , filteringValue = Nothing
    , toString = nestedDataGetter >> String.fromInt
    , renderer = viewInt nestedDataGetter
    , comparator = compareFields nestedDataGetter
    , hasQuickFilter = True
    }


{-| Create a ColumnConfig for a column containing a boolean value

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
boolColumnConfig :
    { id : String
    , title : String
    , tooltip : String
    , width : Int
    , getter : a -> Bool
    , setter : Item a -> Bool -> Item a
    , localize : String -> String
    }
    -> Dict String String
    -> ColumnConfig a
boolColumnConfig properties labels =
    let
        columnProperties =
            { id = properties.id
            , editor = Nothing
            , order = Unsorted
            , title = properties.localize properties.title
            , tooltip = properties.localize properties.tooltip
            , visible = True
            , width = properties.width
            }

        nestedDataGetter =
            .data >> properties.getter
    in
    { properties = columnProperties
    , filters = BoolFilter <| boolFilter properties.getter labels
    , filteringValue = Nothing
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


{-| Renders a cell containing a floating number. Use this function in a ColumnConfig
to define how the values in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewFloat (\item -> item.value)

-}
viewFloat : (Item a -> Float) -> ColumnProperties a -> Item a -> Html (Msg a)
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
viewString : (Item a -> String) -> ColumnProperties a -> Item a -> Html (Msg a)
viewString field properties item =
    div
        (cellAttributes properties item
            |> appendIf (properties.editor /= Nothing)
                [ onDoubleClick (UserDoubleClickedEditableCell item field properties.id (cellId properties item))
                , title (field item)
                ]
        )
        [ text <| field item
        ]


{-| Renders a cell containing a string, and having an info icon which displays a tooltip
when hovered. Use this function in a ColumnConfig
to define how the values in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewStringWithInfo (\item -> item.name)

-}
viewStringWithInfo : (Item a -> ( String, String )) -> ColumnProperties a -> Item a -> Html (Msg a)
viewStringWithInfo stringValues properties item =
    let
        ( cellContent, tooltipText ) =
            stringValues item
    in
    div
        (cellAttributes properties item)
        [ text cellContent
        , viewIf (cellContent /= "" && tooltipText /= "")
            (span
                [ title tooltipText
                , class "eag-cell-icon"
                ]
                [ drawDarkSvg 200 Icons.width informationIcon ]
            )
        ]


{-| Renders a progress bar in a a cell containing a integer.
Use this function in a ColumnConfig to define how the values
in a given column should be rendered.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    renderer =
        viewProgressBar 8 (\item -> item.value)

-}
viewProgressBar : Int -> (a -> Float) -> ColumnProperties a -> Item a -> Html (Msg a)
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
        [ class "eag-progress-bar-container"
        ]
        [ div
            [ class "eag-progress-bar-background"
            , css [ width (px <| toFloat maxWidth) ]
            ]
            [ div
                [ class "eag-progress-bar-foreground"
                , css
                    [ width (px actualWidth)
                    , height (px <| toFloat barHeight)
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
        [ class "eag-bordered"
        , css
            [ width (px <| state.containerWidth * 0.6) ]
        ]
    <|
        [ Stylesheet.preferences
        , viewClosebutton
        ]
            ++ List.map viewColumnVisibilitySelector dataColumns


viewClosebutton : Html (Msg a)
viewClosebutton =
    div
        [ attribute "data-testid" "configureDisplayCloseCross"
        , class "eag-close-button"
        , onClick UserClickedPreferenceCloseButton
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
            [ class "eag-margin-Left-XS"
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
visibleColumns (Model state _ _) =
    visibleColumns_ state


visibleColumns_ : State a -> List (ColumnConfig a)
visibleColumns_ state =
    List.filter (\column -> column.properties.visible) state.config.columns


viewHeaderContainer : State a -> Html (Msg a)
viewHeaderContainer state =
    let
        isResizing =
            state.resizedColumn /= Nothing

        attributes =
            [ class "eag-header-container"
            , css
                [ height (px <| toFloat state.config.headerHeight)
                , Css.property "grid-template-columns" <| gridTemplateColumns state
                ]
            , id headerContainerId
            ]
                |> appendIf isResizing [ fromUnstyled <| Mouse.onMove (\event -> UserMovedResizeHandle (event |> toPosition)) ]
    in
    div
        attributes
        (viewHeaders state)


viewHeaders : State a -> List (Html (Msg a))
viewHeaders state =
    List.indexedMap (\index column -> viewHeader state column index) <| visibleColumns_ state


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
            , class "eag-header"
            , id headerId
            , headerStyles state
            , title columnConfig.properties.tooltip
            ]

        headerIsClickable =
            state.resizedColumn == Nothing && not state.filterHasFocus
    in
    div
        (attributes
            |> appendIf headerIsClickable [ onClick (UserClickedHeader columnConfig) ]
        )
        [ if isSelectionColumn columnConfig then
            lazy2 viewSelectionHeader state columnConfig

          else
            lazy3 viewDataHeader state columnConfig (draggingAttributes state columnConfig)
        ]


headerStyles : State a -> Attribute (Msg a)
headerStyles state =
    css
        [ height (px <| toFloat <| state.config.headerHeight - cumulatedBorderWidth)
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
        [ class "eag-selection-header"
        , css
            [ width <| px <| toFloat <| selectionColumn.properties.width - cumulatedBorderWidth
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
    div
        [ class "eag-flex-row"
        ]
        [ div
            ([ class "eag-flex-column"
             , css
                [ width <| px <| (toFloat <| columnConfig.properties.width - cumulatedBorderWidth) - resizingHandleWidth
                ]
             ]
                ++ conditionalAttributes
            )
            [ div
                [ class "eag-flex-row"
                ]
                [ lazy viewDragHandle columnConfig
                , lazy2 viewTitle state columnConfig
                , lazy2 viewSortingSymbol state columnConfig
                ]
            , viewIf state.areFilterVisible (lazy2 viewFilter state columnConfig)
            ]
        , lazy viewResizeHandle columnConfig
        ]


draggingAttributes : State a -> ColumnConfig a -> List (Attribute (Msg a))
draggingAttributes state currentColumn =
    case state.draggedColumn of
        Just draggedColumn ->
            [ fromUnstyled <| Mouse.onMove (\event -> UserDraggedColumn (event |> toPosition)) ]
                ++ (if isColumn currentColumn draggedColumn.column then
                        [ class "eag-invisible" ]

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
                    :: [ class "eag-header eag-ghost-header"
                       , css
                            [ left (px <| draggedColumn.x - state.headerContainerPosition.x)
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
        classIfSorted =
            case state.sortedBy of
                Just column ->
                    if column.properties.id == columnConfig.properties.id then
                        "eag-header-title-sorted"

                    else
                        ""

                Nothing ->
                    ""

        classIfFiltered =
            case columnConfig.filteringValue of
                Just _ ->
                    "eag-header-title-filtered"

                Nothing ->
                    ""
    in
    span
        [ attribute "data-testid" "columnTitle"
        , class "eag-header-title"
        , class classIfSorted
        , class classIfFiltered
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
        [ class "eag-drag-handle"
        , fromUnstyled <| Mouse.onOver (\_ -> UserHoveredDragHandle)
        , fromUnstyled <| Mouse.onDown (\event -> UserClickedDragHandle columnConfig (event |> toPosition))
        , fromUnstyled <| Mouse.onUp (\_ -> UserEndedMouseInteraction)
        , attribute "data-testid" <| "dragHandle-" ++ columnConfig.properties.id
        ]
        -- TODO replace with SVG
        (List.repeat 2 <|
            div [] <|
                List.repeat 4 <|
                    div
                        [ class "eag-small-square"
                        ]
                        []
        )


toPosition : { a | clientPos : ( Float, Float ) } -> Position
toPosition event =
    { x = Tuple.first event.clientPos, y = Tuple.second event.clientPos }


viewResizeHandle : ColumnConfig a -> Html (Msg a)
viewResizeHandle columnConfig =
    div
        [ class "eag-resize-handle"
        , fromUnstyled <| Mouse.onDown (\event -> UserClickedResizeHandle columnConfig (event |> toPosition))
        , onBlur UserEndedMouseInteraction
        ]
        [ viewVerticalBar, viewVerticalBar ]


viewVerticalBar : Html msg
viewVerticalBar =
    div
        [ class "eag-vertical-bar" ]
        []


viewArrowUp : Html (Msg a)
viewArrowUp =
    viewArrow borderBottom3


viewArrowDown : Html (Msg a)
viewArrowDown =
    viewArrow borderTop3


viewArrow : (Px -> BorderStyle (TextDecorationStyle {}) -> Color -> Style) -> Html msg
viewArrow horizontalBorder =
    div
        [ class "eag-arrow-head"
        , css [ horizontalBorder (px 5) solid black ]
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
        [ class "eag-input-filter-container"
        ]
        [ input
            [ attribute "data-testid" <| "filter-" ++ columnConfig.properties.id
            , class "eag-input-filter"
            , css
                [ height (px <| toFloat <| state.config.lineHeight)
                , width <| filterInputWidth columnConfig
                ]
            , onClick UserClickedFilter
            , onBlur FilterLostFocus
            , onInput <| FilterModified columnConfig << Just
            , title ""
            , value <| Maybe.withDefault "" columnConfig.filteringValue
            ]
            []
        , viewQuickFilterButton state columnConfig
        ]


viewQuickFilterButton : State a -> ColumnConfig a -> Html (Msg a)
viewQuickFilterButton state columnConfig =
    let
        htmlId =
            quickFilterButtonId columnConfig

        draw =
            case columnConfig.filteringValue of
                Nothing ->
                    drawClickableLightSvg

                _ ->
                    drawClickableDarkSvg
    in
    div
        [ attribute "data-testid" htmlId
        , class "eag-quick-filter-button"
        , id htmlId
        , onClick UserClickedFilter
        , title <| localize Label.openQuickFilter state.labels
        ]
        [ draw Icons.width Icons.width filterIcon (UserClickedQuickFilterButton columnConfig)
        ]


quickFilterButtonId : ColumnConfig a -> String
quickFilterButtonId columnConfig =
    "quickFilter-" ++ columnConfig.properties.id


{-| Left + right cell border width, including padding, in px.
Useful to take into account the borders when calculating the total grid width
-}
cumulatedBorderWidth : Int
cumulatedBorderWidth =
    1


{-| Common attributes for cell renderers
-}
cellAttributes : ColumnProperties a -> Item a -> List (Html.Styled.Attribute (Msg a))
cellAttributes properties item =
    [ id (cellId properties item)
    , attribute "data-testid" properties.id
    , class "eag-cell"

    --, css
    --    [ width (px <| toFloat (properties.width - cumulatedBorderWidth))
    --    ]
    ]
        |> appendIf (properties.editor == Nothing)
            [ onClick (UserClickedLine item)
            ]


cellId : ColumnProperties a -> Item a -> String
cellId columnProperties item =
    columnProperties.id ++ String.fromInt item.visibleIndex


{-| TODO use or drop
The horizontal position of the quick filtering menu, relative to the column left border
-}
contextualMenuPosition : ColumnConfig a -> Float
contextualMenuPosition columnConfig =
    toFloat columnConfig.properties.width - Icons.width - resizingHandleWidth - 10


{-| The unique values in a column
-}
columnValues : ColumnConfig a -> State a -> List String
columnValues columnConfig state =
    state.content
        |> List.indexedMap (\index data -> Item.create data index)
        |> List.sortWith columnConfig.comparator
        |> List.map columnConfig.toString
        |> unique


isAnyItemSelected : Model a -> Bool
isAnyItemSelected model =
    model
        |> selectedAndVisibleItems
        |> List.isEmpty
        |> not
