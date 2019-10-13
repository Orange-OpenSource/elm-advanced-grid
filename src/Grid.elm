{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

   Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Grid exposing
    ( Config
    , ColumnConfig, ColumnProperties, stringColumnConfig, intColumnConfig, floatColumnConfig, boolColumnConfig
    , Sorting(..), compareFields, compareBoolField
    , viewBool, viewFloat, viewInt, viewProgressBar, viewString, cumulatedBorderWidth, cellAttributes
    , Model, Msg(..), init, update, view
    , filteredItems
    , visibleColumns, isSelectionColumn, isSelectionColumnProperties
    , subscriptions, withConfig
    )

{-| This module allows to create dynamically configurable data grid.


# Configure the grid

A grid is defined using a `Config`

@docs Config


# Configure a column

@docs ColumnConfig, ColumnProperties, stringColumnConfig, intColumnConfig, floatColumnConfig, boolColumnConfig


# Configure the column sorting

@docs Sorting, compareFields, compareBoolField


# Configure the rendering when a custom one is needed

@docs viewBool, viewFloat, viewInt, viewProgressBar, viewString, cumulatedBorderWidth, cellAttributes


# Boilerplate

@docs Model, Msg, init, update, view


# Get data

@docs filteredItems


# Get grid config

@docs visibleColumns, isSelectionColumn, isSelectionColumnProperties

-}

import Browser.Dom
import Css exposing (..)
import Css.Global exposing (descendants, typeSelector, withAttribute)
import Dict exposing (Dict)
import Grid.Colors exposing (black, darkGrey, darkGrey2, darkGrey3, lightGreen, lightGrey, lightGrey2, white, white2)
import Grid.Filters exposing (Filter(..), Item, boolFilter, floatFilter, intFilter, parseFilteringString, stringFilter)
import Html
import Html.Events.Extra.Mouse as Mouse
import Html.Styled exposing (Attribute, Html, div, input, label, span, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css, for, fromUnstyled, id, title, type_, value)
import Html.Styled.Events exposing (onBlur, onClick, onInput, onMouseLeave, onMouseUp, stopPropagationOn)
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
    | InfListMsg IL.Model
    | FilterLostFocus
    | FilterModified (ColumnConfig a) String
    | InitializeFilters (Dict String String) -- column ID, filter value
    | InitializeSorting String Sorting -- column ID, Ascending or Descending
    | NoOp
    | GotHeaderContainerInfo (Result Browser.Dom.Error Browser.Dom.Element)
    | ScrollTo (Item a -> Bool) -- scroll to the first item for which the function returns True
    | ShowPreferences
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

By default should use "Unsorted" as the value for the order field.
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
In order to define common column types, you may want to use higher level API,
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
        , comparator = compareIntField (\item -> item.id)
        , filters = IntFilter <| intFilter (\item -> item.id)
        , filteringValue = Nothing
        , toString = String.fromInt (\item -> item.id)
        , renderer = viewInt (\item -> item.id)
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
In order to define common column types, you may want to use higher level API,
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
    , content : List (Item a)
    , draggedColumn : Maybe (DraggedColumn a)
    , dragStartX : Float
    , filterHasFocus : Bool -- Prevents clicking in an input field to trigger a sort
    , hoveredColumn : Maybe (ColumnConfig a)
    , infList : IL.Model
    , isAllSelected : Bool
    , headerContainerPosition : Position
    , order : Sorting
    , resizedColumn : Maybe (ColumnConfig a)
    , showPreferences : Bool
    , sortedBy : Maybe (ColumnConfig a)
    }


withConfig : Config a -> Model a -> Model a
withConfig config model =
    { model | config = config }


withColumnsX : Model a -> Model a
withColumnsX model =
    { model | columnsX = columnsX model }


withColumns : List (ColumnConfig a) -> Model a -> Model a
withColumns columns model =
    let
        config =
            model.config
    in
    model
        |> withConfig { config | columns = columns }
        |> withColumnsX


{-| Definition for the row selection column,
used when canSelectRows is True in grid config.
-}
selectionColumn : ColumnConfig a
selectionColumn =
    boolColumnConfig
        { id = "_MultipleSelection_"
        , getter = .selected
        , title = ""
        , tooltip = ""
        , width = 30
        , localize = \_ -> ""
        }


{-| Initializes the grid model, according to the given grid configuration
and content.

      init : () -> ( Model, Cmd Msg )
      init _ =
         ( { gridModel = Grid.init gridConfig items
           }
         , Cmd.none
         )

-}
init : Config a -> List (Item a) -> Model a
init config items =
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

        -- ensure indexes are set to prevent systematic selection of the first item when clicking a checkbox
        indexedItems =
            List.indexedMap (\index item -> { item | index = index }) items

        initialModel =
            { clickedItem = Nothing
            , config = newConfig
            , columnsX = []
            , content = indexedItems
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
            }
    in
    { initialModel | columnsX = columnsX initialModel }


subscriptions : Model a -> Sub (Msg a)
subscriptions model =
    Sub.none


{-| the list of X coordinates of columns; coordinates are expressed in pixel. The first one is at 0.
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
                filteredContent =
                    filteredItems model

                targetItemIndex =
                    Maybe.withDefault 0 <| findIndex isTargetItem filteredContent
            in
            ( model
            , IL.scrollToNthItem
                { postScrollMessage = NoOp
                , listHtmlId = gridHtmlId
                , itemIndex = targetItemIndex
                , configValue = gridConfig model
                , items = filteredContent
                }
            )

        _ ->
            ( modelUpdate msg model, Cmd.none )



{- update for messages for which no command is generated -}


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
            in
            model |> withColumns newColumns

        GotHeaderContainerInfo (Ok info) ->
            { model | headerContainerPosition = { x = info.element.x, y = info.element.y } }

        GotHeaderContainerInfo (Err _) ->
            model

        InfListMsg infList ->
            { model | infList = infList }

        InitializeFilters filterValues ->
            let
                newColumns =
                    List.map (initializeFilter filterValues) model.config.columns
            in
            model |> withColumns newColumns

        InitializeSorting columnId sorting ->
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

        -- The ScrollTo message is handled in the `update` function
        ScrollTo int ->
            model

        ShowPreferences ->
            { model | showPreferences = True }

        UserClickedFilter ->
            { model | filterHasFocus = True }

        UserClickedHeader columnConfig ->
            if model.filterHasFocus then
                model

            else
                sort model columnConfig model.order toggleOrder

        UserClickedLine item ->
            { model | clickedItem = Just item }

        UserClickedDragHandle columnConfig position ->
            let
                columnIndex =
                    List.Extra.findIndex (isColumn columnConfig) model.config.columns
                        -- the default value will never be used
                        |> Maybe.withDefault -1

                draggedColumnX : Float
                draggedColumnX =
                    columnsX model
                        |> List.Extra.getAt columnIndex
                        |> Maybe.withDefault -1
                        -- the default value will never be used
                        |> toFloat

                draggedColumn : DraggedColumn a
                draggedColumn =
                    { x = draggedColumnX
                    , column = columnConfig
                    , dragStartX = position.x
                    }
            in
            { model
                | draggedColumn = Just draggedColumn
            }

        UserClickedResizeHandle columnConfig position ->
            { model
                | resizedColumn = Just columnConfig
                , dragStartX = position.x
            }

        UserClickedPreferenceCloseButton ->
            { model | showPreferences = False }

        UserEndedMouseInteraction ->
            { model
                | resizedColumn = Nothing
                , draggedColumn = Nothing
            }

        UserHoveredDragHandle ->
            -- The UserHoveredDragHandle message is handled in the `update` function
            model

        UserMovedResizeHandle position ->
            resizeColumn model position.x

        UserToggledAllItemSelection ->
            let
                newStatus =
                    not model.isAllSelected

                newContent =
                    List.map (\item -> { item | selected = newStatus }) model.content
            in
            { model
                | isAllSelected = newStatus
                , content = newContent
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
                newContent =
                    List.Extra.updateAt item.index (\it -> toggleSelection it) model.content
            in
            { model | content = newContent }

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

        UserSwappedColumns columnConfig draggedColumnConfig ->
            let
                newColumns =
                    swapColumns columnConfig draggedColumnConfig model.config.columns
            in
            model |> withColumns newColumns


initializeFilter : Dict String String -> ColumnConfig a -> ColumnConfig a
initializeFilter filterValues columnConfig =
    let
        value =
            Dict.get columnConfig.properties.id filterValues
    in
    { columnConfig | filteringValue = value }


sort : Model a -> ColumnConfig a -> Sorting -> (Model a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )) -> Model a
sort model columnConfig order sorter =
    let
        ( sortedContent, newOrder ) =
            sorter model columnConfig order

        updatedContent =
            updateIndexes sortedContent
    in
    { model
        | content = updatedContent
        , order = newOrder
        , sortedBy = Just columnConfig
    }


toggleOrder : Model a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )
toggleOrder model columnConfig order =
    case order of
        Ascending ->
            ( List.sortWith columnConfig.comparator model.content |> List.reverse, Descending )

        _ ->
            ( List.sortWith columnConfig.comparator model.content, Ascending )


orderBy : Model a -> ColumnConfig a -> Sorting -> ( List (Item a), Sorting )
orderBy model columnConfig order =
    case order of
        Descending ->
            ( List.sortWith columnConfig.comparator model.content |> List.reverse, Descending )

        Ascending ->
            ( List.sortWith columnConfig.comparator model.content, Ascending )

        Unsorted ->
            ( model.content, Unsorted )


hasId : String -> ColumnConfig a -> Bool
hasId id columnConfig =
    columnConfig.properties.id == id


isColumn : ColumnConfig a -> ColumnConfig a -> Bool
isColumn firstColumnConfig secondColumnConfig =
    firstColumnConfig.properties.id == secondColumnConfig.properties.id


minColumnWidth : Int
minColumnWidth =
    25


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
updateIndexes content =
    List.indexedMap (\i item -> { item | index = i }) content


toggleSelection : Item a -> Item a
toggleSelection item =
    { item | selected = not item.selected }


swapColumns : ColumnConfig a -> ColumnConfig a -> List (ColumnConfig a) -> List (ColumnConfig a)
swapColumns column1 column2 list =
    let
        column1Index =
            List.Extra.findIndex (isColumn column1) list
                |> Maybe.withDefault -1

        column2Index =
            List.Extra.findIndex (isColumn column2) list
                |> Maybe.withDefault -1
    in
    List.Extra.swapAt column1Index column2Index list


gridConfig : Model a -> IL.Config (Item a) (Msg a)
gridConfig model =
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


gridHtmlId : String
gridHtmlId =
    "grid"


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
            if model.resizedColumn /= Nothing then
                [ onMouseUp UserEndedMouseInteraction ]

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
                    , width (px <| toFloat <| totalWidth model)
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
                , width (px <| toFloat <| totalWidth model)
                , overflowX hidden
                , overflowY auto
                , border3 (px 1) solid lightGrey
                ]
            , fromUnstyled <| IL.onScroll InfListMsg
            , id gridHtmlId
            ]
            [ Html.Styled.fromUnstyled <| IL.view (gridConfig model) model.infList (filteredItems model) ]
        ]


columnFilters : Model a -> List (Item a -> Bool)
columnFilters model =
    model.config.columns
        |> List.filterMap (\c -> parseFilteringString c.filteringValue c.filters)


{-| The list of items satisfying the current filtering values
-}
filteredItems : Model a -> List (Item a)
filteredItems model =
    columnFilters model
        |> List.foldl (\filter remainingValues -> List.filter filter remainingValues) model.content


{-| idx is the index of the visible line; if there are 25 visible lines, 0 <= idx < 25
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
                , width (px <| toFloat <| totalWidth model)
                ]
            , onClick (UserClickedLine item)
            ]
    <|
        List.map (\columnConfig -> viewColumn columnConfig item) (visibleColumns model)


totalWidth : Model a -> Int
totalWidth model =
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
        (cellAttributes properties)
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
stringColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : Item a -> String, localize : String -> String } -> ColumnConfig a
stringColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    { properties =
        columnConfigProperties properties
    , filters = StringFilter <| stringFilter getter
    , filteringValue = Nothing
    , toString = getter
    , renderer = viewString getter
    , comparator = compareFields getter
    }


{-| Create a ColumnConfig for a column containing a float value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
floatColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : Item a -> Float, localize : String -> String } -> ColumnConfig a
floatColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    { properties =
        columnConfigProperties properties
    , filters = FloatFilter <| floatFilter getter
    , filteringValue = Nothing
    , toString = getter >> String.fromFloat
    , renderer = viewFloat getter
    , comparator = compareFields getter
    }


{-| Create a ColumnConfig for a column containing an integer value

getter is usually a simple field access function, like ".age" to get the age field of a Person record.

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
intColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : Item a -> Int, localize : String -> String } -> ColumnConfig a
intColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    { properties =
        columnConfigProperties properties
    , filters = IntFilter <| intFilter getter
    , filteringValue = Nothing
    , toString = getter >> String.fromInt
    , renderer = viewInt getter
    , comparator = compareFields getter
    }


{-| Create a ColumnConfig for a column containing a boolean value

localize takes the title or the tooltip of the column as a parameter, and returns its translation, if you need internationalization.
If you don't need it, just use [identity](https://package.elm-lang.org/packages/elm/core/latest/Basics#identity).

-}
boolColumnConfig : { id : String, title : String, tooltip : String, width : Int, getter : Item a -> Bool, localize : String -> String } -> ColumnConfig a
boolColumnConfig ({ id, title, tooltip, width, getter, localize } as properties) =
    { properties =
        columnConfigProperties properties
    , filters = BoolFilter <| boolFilter getter
    , filteringValue = Nothing
    , toString = getter >> boolToString
    , renderer = viewBool getter
    , comparator = compareBoolField getter
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
viewProgressBar : Int -> (Item a -> Float) -> ColumnProperties -> Item a -> Html (Msg a)
viewProgressBar barHeight field properties item =
    let
        maxWidth =
            properties.width - 8 - cumulatedBorderWidth

        actualWidth =
            (field item / toFloat 100) * toFloat maxWidth
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
                , backgroundColor darkGrey2
                , transform (rotate (deg 45))
                ]
            , after
                [ position absolute
                , left (px 7)
                , property "content" "' '"
                , height (px 17)
                , width (px 2)
                , backgroundColor darkGrey2
                , transform (rotate (deg -45))
                ]
            ]
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
compareFields field item1 item2 =
    compare (field item1) (field item2)


{-| Compares two booleans. Use this function in a ColumnConfig
to define how the values in a given column should be compared.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    comparator =
        compareBoolField (\item -> item.even)

-}
compareBoolField : (Item a -> Bool) -> Item a -> Item a -> Order
compareBoolField field item1 item2 =
    case ( field item1, field item2 ) of
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

            else if model.draggedColumn /= Nothing then
                [ fromUnstyled <| Mouse.onMove (\event -> UserDraggedColumn (event |> toPosition)) ]

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
            , headerStyles model columnConfig
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
            viewDataHeader model columnConfig index headerId
        ]


headerStyles : Model a -> ColumnConfig a -> Attribute (Msg a)
headerStyles model columnConfig =
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


{-| specific header content for the selection column
-}
viewSelectionHeader : Model a -> ColumnConfig a -> Html (Msg a)
viewSelectionHeader _ columnConfig =
    div
        [ css
            [ width (px <| (toFloat <| selectionColumn.properties.width - cumulatedBorderWidth))
            ]
        ]
        [ input
            [ type_ "checkbox"
            , Html.Styled.Attributes.checked False
            , stopPropagationOnClick UserToggledAllItemSelection
            ]
            []
        ]


{-| header content for data columns
-}
viewDataHeader : Model a -> ColumnConfig a -> Int -> String -> Html (Msg a)
viewDataHeader model columnConfig index columnId =
    let
        attributes =
            [ css
                [ displayFlex
                , flexDirection row
                ]
            ]

        conditionalAttributes =
            case model.draggedColumn of
                Just draggedColumn ->
                    if isColumn columnConfig draggedColumn.column then
                        hiddenHeaderStyles

                    else
                        [ fromUnstyled <| Mouse.onEnter (\_ -> Debug.log "onEnter" UserSwappedColumns columnConfig draggedColumn.column)
                        , fromUnstyled <| Mouse.onLeave (\_ -> Debug.log "onLeave" NoOp)
                        ]

                Nothing ->
                    []
    in
    div
        (attributes ++ conditionalAttributes)
        [ div
            [ css
                [ displayFlex
                , flexDirection column
                , alignItems flexStart
                , overflow hidden
                , width (px <| (toFloat <| columnConfig.properties.width - cumulatedBorderWidth) - resizeHandleWidth)
                ]
            ]
            [ div
                [ css
                    [ displayFlex
                    , flexDirection row
                    , flexGrow (num 1)
                    , justifyContent flexStart
                    ]
                ]
                [ viewDragHandle model index columnConfig
                , viewTitle model columnConfig
                , viewSortingSymbol model columnConfig
                ]
            , viewFilter model columnConfig
            ]
        , viewResizeHandle columnConfig
        ]


hiddenHeaderStyles : List (Attribute msg)
hiddenHeaderStyles =
    [ css [ opacity (num 0) ] ]


{-| Renders the dragged header
-}
viewGhostHeader : Model a -> Html (Msg a)
viewGhostHeader model =
        Just draggedColumn ->
            div
                (headerStyles model draggedColumn.column
                    :: [ css
                            [ position absolute
                            , left (px <| draggedColumn.x - model.headerContainerPosition.x)
                            , top (px 2)
                            ]
                       ]
                )
                [ viewDataHeader model draggedColumn.column -1 "" ]

        Nothing ->
            noContent


{-| Returns true when the given ColumnConfig corresponds to the multiple selection column
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
                    arrowUp

                else
                    arrowDown

            else
                noContent

        _ ->
            noContent


viewDragHandle : Model a -> Int -> ColumnConfig a -> Html (Msg a)
viewDragHandle model index columnConfig =
    let
        conditionnalAttributes =
            --            if index >= 0 then
            --                -- TODO extract in subfunction for readability?
            --                case dndSystem.info model.dnd of
            --                    Just { dragIndex } ->
            --                        []
            --
            --                    Nothing ->
            --                        List.map fromUnstyled (dndSystem.dragEvents index columnConfig.properties.id)
            --
            --            else
            []
    in
    div
        ([ css
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
         , fromUnstyled <| Mouse.onUp (\event -> UserEndedMouseInteraction)
         ]
            ++ conditionnalAttributes
        )
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
            , fontSize (px 0.1)
            , height (pct 100)
            , visibility hidden
            , width (px resizeHandleWidth)
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


resizeHandleWidth : Float
resizeHandleWidth =
    5


noContent : Html msg
noContent =
    text ""


arrowUp : Html (Msg a)
arrowUp =
    arrow borderBottom3


arrowDown : Html (Msg a)
arrowDown =
    arrow borderTop3


arrow : (Px -> BorderStyle (TextDecorationStyle {}) -> Color -> Style) -> Html msg
arrow horizontalBorder =
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
