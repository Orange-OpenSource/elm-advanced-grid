module Grid exposing
    ( Config
    , ColumnConfig
    , compareBoolField, compareFloatField, compareIntField, compareStringField
    , viewBool, viewFloat, viewInt, viewProgressBar, viewString
    , Model, init, update, view
    , ColumnProperties, Msg(..), Sorting(..), cellStyles, cumulatedBorderWidth
    )

{-| This library displays a grid of data.
It offers filtering, sorting, multiple selection, click event listener and
customizable rendering of the lines, cells and columns.

A grid is defined using a `Config`

The list of data can be very long, thanks to the use of [FabienHenon/elm-infinite-list-view](https://package.elm-lang.org/packages/FabienHenon/elm-infinite-list-view/latest/) under the hood.


# Configure the grid

@docs Config


# Configure a column

@docs ColumnConfig


# Configure the column sorting

@docs Sorting(..), compareBoolField, compareFloatField, compareIntField, compareStringField


# Configure the column rendering

@docs viewBool, viewFloat, viewInt, viewProgressBar, viewString


# Boilerplate

@docs Model, Msg(..), init, update, view

-}

import Css exposing (..)
import Css.Global exposing (descendants, typeSelector, withAttribute)
import Grid.Colors exposing (black, darkGrey, darkGrey2, lightGreen, lightGrey, lightGrey2, white, white2)
import Grid.Filters exposing (Filter(..), Item, boolFilter, parseFilteringString)
import Html
import Html.Events.Extra.Mouse as Mouse
import Html.Styled exposing (Attribute, Html, div, input, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css, fromUnstyled, title, type_)
import Html.Styled.Events exposing (onBlur, onCheck, onClick, onInput, onMouseUp, preventDefaultOn, stopPropagationOn)
import InfiniteList as IL
import Json.Decode
import List.Extra exposing (findIndex, getAt, swapAt)
import String


{-| The configuration for the grid. You should define the css classes, if you want to use some.

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

The messages constructed with LineClicked (Item a)
are emitted when an item is clicked, so you can update the model of your app.

The messages using the SelectionToggled constructor let you know a line selection status changed,
so you can update the list of selected items if you use it.

You probably should not use the other constructors.

    case msg of
        GridMsg (LineClicked item) ->
            let
                ( newGridModel, cmd ) =
                    Grid.update (LineClicked item) model.gridModel
            in
            ( { model
                | gridModel = newGridModel
                , clickedItem = Just item
              }
            , Cmd.map GridMsg cmd
            )

        GridMsg (SelectionToggled item status) ->
            let
                ( newGridModel, cmd ) =
                    Grid.update (SelectionToggled item status) model.gridModel

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
    = CursorEnteredDropZone (ColumnConfig a) ( Float, Float ) -- second param is clienttPos
    | InfListMsg IL.Model
    | FilterLoseFocus
    | FilterModified (ColumnConfig a) String
    | UserClickedHeader (ColumnConfig a)
    | LineClicked (Item a)
    | SelectionToggled (Item a)
    | UserClickedFilter
    | UserClickedMoveHandle (ColumnConfig a) ( Float, Float ) -- second param is clienttPos
    | UserClickedResizeHandle (ColumnConfig a) ( Float, Float ) -- second param is clienttPos
    | UserEndedMouseInteraction
    | UserMovedColumn ( Float, Float ) -- param is clienttPos
    | UserMovedResizeHandle ( Float, Float ) -- param is clienttPos
    | UserToggledAllItemSelection


{-| The sorting options for a column, to be used in the properties of a ColumnConfig.
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

    idColumn =
        { properties =
            { id = "Id"
            , order = Unsorted
            , title = "Id"
            , visible = True
            , width = 50
            }
        , filters = IntFilter <| intFilter (\item -> item.id)
        , filteringValue = Nothing
        , renderer = viewInt (\item -> item.id)
        , comparator = compareIntField (\item -> item.id)
        }

-}
type alias ColumnConfig a =
    { properties : ColumnProperties
    , comparator : Item a -> Item a -> Order
    , filteringValue : Maybe String
    , filters : Filter a
    , renderer : ColumnProperties -> (Item a -> Html (Msg a))
    }


{-| ColumnProperties are a part of the configuration for a column.

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


{-| The grid model. You'll use it but should not have to access its fields,
and definitely should not modify them directly
-}
type alias Model a =
    { clickedItem : Maybe (Item a)
    , config : Config a
    , columnsX : List Int
    , content : List (Item a)
    , dragStartX : Float
    , filterHasFocus : Bool -- Prevents click in filter to trigger a sort
    , hoveredColumn : Maybe (ColumnConfig a)
    , infList : IL.Model
    , isAllSelected : Bool
    , movingColumn : Maybe (ColumnConfig a)
    , movingColumnDeltaX : Float
    , order : Sorting
    , resizingColumn : Maybe (ColumnConfig a)
    , sortedBy : Maybe (ColumnConfig a)
    }


{-| Definition for the row selection column,
used when canSelectRows is True in grid config.
-}
selectionColumn : ColumnConfig a
selectionColumn =
    { properties =
        { id = "_MultipleSelection_"
        , order = Unsorted
        , title = ""
        , tooltip = ""
        , visible = True
        , width = 30
        }
    , filters = BoolFilter <| boolFilter (\item -> item.selected)
    , filteringValue = Nothing
    , renderer = viewBool (\item -> item.selected)
    , comparator = compareBoolField (\item -> item.selected)
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
        newConfig =
            if config.canSelectRows then
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
            , movingColumn = Nothing
            , movingColumnDeltaX = 0
            , order = Unsorted
            , resizingColumn = Nothing
            , sortedBy = Nothing
            }
    in
    { initialModel | columnsX = columnsX initialModel }


{-| the X coordinate of each column
-}
columnsX : Model a -> List Int
columnsX model =
    visibleColumns model
        |> List.Extra.scanl (\col x -> x + col.properties.width) 0


{-| Updates the grid model
-}
update : Msg a -> Model a -> Model a
update msg model =
    case msg of
        FilterModified columnConfig string ->
            let
                newColumnconfig =
                    { columnConfig | filteringValue = Just string }

                newColumns =
                    List.Extra.setIf (\item -> item.properties.id == columnConfig.properties.id) newColumnconfig model.config.columns

                oldConfig =
                    model.config

                newConfig =
                    { oldConfig | columns = newColumns }
            in
            { model | config = newConfig }

        UserClickedHeader columnConfig ->
            if model.filterHasFocus then
                model

            else
                let
                    ( sortedContent, newOrder ) =
                        case model.order of
                            Ascending ->
                                ( List.sortWith columnConfig.comparator model.content |> List.reverse, Descending )

                            _ ->
                                ( List.sortWith columnConfig.comparator model.content, Ascending )

                    updatedContent =
                        updateIndexes sortedContent
                in
                { model
                    | content = updatedContent
                    , order = newOrder
                    , sortedBy = Just columnConfig
                }

        InfListMsg infList ->
            { model | infList = infList }

        LineClicked item ->
            { model | clickedItem = Just item }

        SelectionToggled item ->
            let
                newContent =
                    List.Extra.updateAt item.index (\it -> toggleSelection it) model.content
            in
            { model | content = newContent }

        FilterLoseFocus ->
            { model | filterHasFocus = False }

        UserClickedFilter ->
            { model | filterHasFocus = True }

        UserClickedResizeHandle columnConfig ( x, _ ) ->
            { model
                | resizingColumn = Just columnConfig
                , dragStartX = x
            }

        UserEndedMouseInteraction ->
            { model
                | resizingColumn = Nothing
                , movingColumn = Nothing
            }

        UserMovedColumn ( x, _ ) ->
            moveColumnTo model x

        UserMovedResizeHandle ( x, _ ) ->
            resizeColumn model x

        UserClickedMoveHandle columnConfig ( x, _ ) ->
            { model
                | movingColumn = Just columnConfig
                , dragStartX = x
            }

        CursorEnteredDropZone columnConfig ( x, _ ) ->
            case model.movingColumn of
                Just movingColumn ->
                    if columnConfig.properties.id == movingColumn.properties.id then
                        model

                    else
                        let
                            maybeSrcIndex =
                                indexOfColumn movingColumn model

                            maybeDestIndex =
                                indexOfColumn columnConfig model

                            newColumns =
                                case ( maybeSrcIndex, maybeDestIndex ) of
                                    ( Just srcIndex, Just destIndex ) ->
                                        swapAt srcIndex destIndex model.config.columns

                                    _ ->
                                        model.config.columns

                            currentConfig =
                                model.config

                            newConfig =
                                { currentConfig | columns = newColumns }

                            updatedModel =
                                { model
                                    | config = newConfig
                                    , movingColumnDeltaX = 0
                                    , dragStartX = x
                                }
                        in
                        { updatedModel | columnsX = columnsX updatedModel }

                Nothing ->
                    model

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


indexOfColumn : ColumnConfig a -> Model a -> Maybe Int
indexOfColumn columnConfig model =
    findIndex (\col -> col.properties.id == columnConfig.properties.id) model.config.columns


moveColumnTo : Model a -> Float -> Model a
moveColumnTo model x =
    { model | movingColumnDeltaX = x - model.dragStartX }


resizeColumn : Model a -> Float -> Model a
resizeColumn model x =
    case model.resizingColumn of
        Just columnConfig ->
            let
                deltaX =
                    x - model.dragStartX

                newWidth =
                    columnConfig.properties.width
                        + Basics.round deltaX

                newColumns =
                    updateColumnProperties model columnConfig newWidth

                config =
                    model.config
            in
            { model
                | config = { config | columns = newColumns }
                , columnsX = columnsX model
            }

        _ ->
            model


updateColumnProperties : Model a -> ColumnConfig a -> Int -> List (ColumnConfig a)
updateColumnProperties model columnConfig width =
    List.Extra.updateIf (\col -> col.properties.id == columnConfig.properties.id)
        (updateColumnWidth width)
        model.config.columns


updateColumnWidth : Int -> ColumnConfig a -> ColumnConfig a
updateColumnWidth newWidth columnConfig =
    let
        properties =
            columnConfig.properties

        newProperties =
            { properties | width = newWidth }
    in
    { columnConfig | properties = newProperties }


updateIndexes : List (Item a) -> List (Item a)
updateIndexes content =
    List.indexedMap (\i item -> { item | index = i }) content


toggleSelection : Item a -> Item a
toggleSelection item =
    { item | selected = not item.selected }


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
    let
        conditionalAttributes =
            if model.resizingColumn == Nothing && model.movingColumn == Nothing then
                []

            else
                [ onMouseUp UserEndedMouseInteraction
                ]
    in
    toUnstyled <|
        div
            ([ css
                [ width (px <| toFloat (model.config.containerWidth + cumulatedBorderWidth))
                , overflow auto
                , margin auto
                ]
             ]
                ++ conditionalAttributes
            )
        <|
            if model.config.hasFilters then
                [ div
                    [ css
                        [ borderLeft3 (px 1) solid lightGrey2
                        , borderRight3 (px 1) solid lightGrey2
                        ]
                    ]
                    [ viewHeaders model
                    ]
                , viewRows model
                ]

            else
                [ viewHeaders model
                , viewRows model
                ]


viewRows : Model a -> Html (Msg a)
viewRows model =
    let
        columnFilters : List (Item a -> Bool)
        columnFilters =
            model.config.columns
                |> List.filterMap (\c -> parseFilteringString c.filteringValue c.filters)

        filteredItems =
            List.foldl (\filter remainingValues -> List.filter filter remainingValues) model.content columnFilters
    in
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
            ]
            [ Html.Styled.fromUnstyled <| IL.view (gridConfig model) model.infList filteredItems ]
        ]


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
                [ height (px <| toFloat model.config.lineHeight)
                , width (px <| toFloat <| totalWidth model)
                ]
            , onClick (LineClicked item)
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
        (cellStyles properties)
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
        (cellStyles properties)
        [ input
            [ type_ "checkbox"
            , Html.Styled.Attributes.checked (field item)
            , stopPropagationOnClick (SelectionToggled item)
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
        (cellStyles properties)
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
        (cellStyles properties)
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
            [ display inlineBlock
            , border3 (px 1) solid lightGrey
            , boxSizing contentBox
            , verticalAlign top
            , paddingLeft (px 5)
            , paddingRight (px 5)
            ]
        ]
        [ div
            [ css
                [ display inlineBlock
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


{-| Compares two integers. Use this function in a ColumnConfig
to define how the values in a given column should be compared.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    comparator =
        compareIntField (\item -> item.id)

-}
compareIntField : (Item a -> Int) -> Item a -> Item a -> Order
compareIntField field item1 item2 =
    compare (field item1) (field item2)


{-| Compares two floating point numbers. Use this function in a ColumnConfig
to define how the values in a given column should be compared.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    comparator =
        compareFloatField (\item -> item.value)

-}
compareFloatField : (Item a -> Float) -> Item a -> Item a -> Order
compareFloatField field item1 item2 =
    compare (field item1) (field item2)


{-| Compares two strings. Use this function in a ColumnConfig
to define how the values in a given column should be compared.
The unique parameter to be provided is a lambda which
returns the field to be displayed in this column.

    comparator =
        compareStringField (\item -> item.name)

-}
compareStringField : (Item a -> String) -> Item a -> Item a -> Order
compareStringField field item1 item2 =
    compare (field item1) (field item2)


{-| Compares two boolean. Use this function in a ColumnConfig
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


visibleColumns : Model a -> List (ColumnConfig a)
visibleColumns model =
    List.filter (\column -> column.properties.visible) model.config.columns


viewHeaders : Model a -> Html (Msg a)
viewHeaders model =
    let
        conditionalAttributes =
            if model.resizingColumn /= Nothing then
                [ fromUnstyled <| Mouse.onMove (\event -> UserMovedResizeHandle event.clientPos)
                ]

            else if model.movingColumn /= Nothing then
                [ fromUnstyled <| Mouse.onMove (\event -> UserMovedColumn event.clientPos)
                ]

            else
                []
    in
    div
        ([ css
            [ width (px <| toFloat <| totalWidth model)
            , backgroundImage <| linearGradient (stop white2) (stop lightGrey) []
            , height (px <| toFloat model.config.headerHeight)
            , position relative
            ]
         ]
            ++ conditionalAttributes
        )
    <|
        (visibleColumns model
            |> List.indexedMap (\index column -> viewHeader model column index)
        )


viewHeader : Model a -> ColumnConfig a -> Int -> Html (Msg a)
viewHeader model columnConfig index =
    let
        conditionalAttributes =
            if model.resizingColumn == Nothing && model.movingColumn == Nothing then
                [ onClick (UserClickedHeader columnConfig) ]

            else
                []

        x =
            columnX model columnConfig index
    in
    div
        ([ attribute "data-testid" <| "header-" ++ columnConfig.properties.id
         , css
            [ display inlineBlock
            , border3 (px 1) solid lightGrey2
            , boxSizing contentBox
            , height (px <| toFloat <| model.config.headerHeight - cumulatedBorderWidth)
            , padding (px 2)
            , cursor pointer
            , position absolute
            , left (px x)
            , overflow hidden
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            , hover
                [ descendants
                    [ typeSelector "div"
                        [ visibility visible -- makes the move handle visible when hover the column
                        , withAttribute "data-handle"
                            [ display inlineBlock ]
                        ]
                    ]
                ]
            ]
         , title columnConfig.properties.tooltip
         ]
            ++ conditionalAttributes
        )
        (if isSelectionColumn columnConfig then
            [ viewMultiSelectionCheckbox model columnConfig ]

         else
            [ viewMoveHandle columnConfig
            , viewTitle columnConfig
            , viewDropZone model columnConfig
            , viewSortingSymbol model columnConfig
            , viewFilter model columnConfig
            , viewResizeHandle columnConfig
            ]
        )


{-| specific header content for the selection column
-}
viewMultiSelectionCheckbox : Model a -> ColumnConfig a -> Html (Msg a)
viewMultiSelectionCheckbox model columnConfig =
    input
        [ type_ "checkbox"
        , Html.Styled.Attributes.checked False
        , stopPropagationOnClick UserToggledAllItemSelection
        ]
        []


isSelectionColumn : ColumnConfig a -> Bool
isSelectionColumn columnConfig =
    columnConfig.properties.id == selectionColumn.properties.id


columnX : Model a -> ColumnConfig a -> Int -> Float
columnX model columnConfig index =
    let
        initialX =
            toFloat <| Maybe.withDefault 0 <| getAt index model.columnsX
    in
    case model.movingColumn of
        Just movingColumn ->
            if movingColumn.properties.id == columnConfig.properties.id then
                initialX + model.movingColumnDeltaX

            else
                initialX

        Nothing ->
            initialX


viewDropZone : Model a -> ColumnConfig a -> Html (Msg a)
viewDropZone model columnConfig =
    case model.movingColumn of
        Just movingColumn ->
            div
                [ css
                    [ display block
                    , fontSize (px 0.1)
                    , height (pct 100)
                    , position absolute
                    , left (px -5)
                    , top (px 0)
                    , width (px 9)
                    , zIndex (int 2)
                    ]
                , fromUnstyled <| Mouse.onEnter (\event -> CursorEnteredDropZone columnConfig event.clientPos)
                ]
                []

        Nothing ->
            noContent


viewTitle : ColumnConfig a -> Html (Msg a)
viewTitle columnConfig =
    text <| columnConfig.properties.title


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


viewMoveHandle : ColumnConfig a -> Html (Msg a)
viewMoveHandle columnConfig =
    div
        [ css
            [ cursor move
            , display block
            , fontSize (px 0.1)
            , height (px 20)
            , float left
            , visibility hidden
            , width (px 10)
            , zIndex (int 5)
            ]
        , fromUnstyled <| Mouse.onDown (\event -> UserClickedMoveHandle columnConfig event.clientPos)
        , onBlur UserEndedMouseInteraction
        ]
        (List.repeat 2 <|
            div [ css [ display inlineBlock ] ] <|
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


viewResizeHandle : ColumnConfig a -> Html (Msg a)
viewResizeHandle columnConfig =
    div
        [ attribute "data-handle" ""
        , css
            [ cursor colResize
            , display block
            , fontSize (px 0.1)
            , height (pct 100)
            , position absolute
            , right (px -5)
            , top (px 0)
            , width (px 9)
            , zIndex (int 1)
            ]
        , fromUnstyled <| Mouse.onDown (\event -> UserClickedResizeHandle columnConfig event.clientPos)
        , onBlur UserEndedMouseInteraction
        ]
        []


noContent : Html msg
noContent =
    text ""


arrowUp : Html (Msg a)
arrowUp =
    arrow borderBottom3


arrowDown : Html (Msg a)
arrowDown =
    arrow borderTop3


arrow horizontalBorder =
    div
        [ css
            [ width (px 0)
            , height (px 0)
            , borderLeft3 (px 5) solid transparent
            , borderRight3 (px 5) solid transparent
            , horizontalBorder (px 5) solid black
            , display inlineBlock
            , float right
            , margin (px 5)
            ]
        ]
        []


viewFilter : Model a -> ColumnConfig a -> Html (Msg a)
viewFilter model columnConfig =
    input
        [ attribute "data-testid" <| "filter-" ++ columnConfig.properties.id
        , css
            [ position absolute
            , bottom (px 4)
            , left (px 2)
            , border (px 0)
            , padding (px 0)
            , height (px <| toFloat <| model.config.lineHeight)
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            ]
        , onClick UserClickedFilter
        , onBlur FilterLoseFocus
        , onInput <| FilterModified columnConfig
        ]
        []


{-| Left + right cell border width, including padding, in px.
Useful to take in account the borders when calculating the total grid width
-}
cumulatedBorderWidth : Int
cumulatedBorderWidth =
    6


cellStyles : ColumnProperties -> List (Html.Styled.Attribute (Msg a))
cellStyles properties =
    [ attribute "data-testid" properties.id
    , css
        [ display inlineBlock
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
