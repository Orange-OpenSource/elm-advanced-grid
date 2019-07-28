module Grid exposing
    ( Config
    , ColumnConfig
    , compareBoolField, compareFloatField, compareIntField, compareStringField
    , viewBool, viewFloat, viewInt, viewProgressBar, viewString
    , Model, init, update, view
    , ColumnProperties, Msg(..), Sorting(..)
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
import Css.Transitions exposing (background, easeOut, transition)
import Grid.Colors exposing (black, darkGrey, lightGreen, lightGrey, lightGrey2, slightlyTransparentBlack, white, white2)
import Grid.Filters exposing (Filter(..), Item, boolFilter, parseFilteringString)
import Html
import Html.Styled exposing (Html, div, input, text, toUnstyled)
import Html.Styled.Attributes exposing (attribute, class, css, fromUnstyled, id, type_)
import Html.Styled.Events exposing (onBlur, onClick, onInput)
import InfiniteList as IL
import List.Extra


{-| The configuration for the grid

    gridConfig =
        { canSelectRows = True
        , columns = columnList
        , containerHeight = 500
        , containerWidth = 700
        , hasFilters = True
        , lineHeight = 20
        , rowStyle = rowColor
        }

    rowColor : Item -> Style
    rowColor item =
        if item.selected then
            backgroundColor (hex "FFE3AA")

        else
            backgroundColor transparent

-}
type alias Config a =
    { canSelectRows : Bool
    , columns : List (ColumnConfig a)
    , containerHeight : Int
    , containerWidth : Int
    , hasFilters : Bool
    , headerHeight : Int
    , lineHeight : Int
    , rowStyle : Item a -> Style
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
    = InfListMsg IL.Model
    | FilterLoseFocus
    | FilterModified (ColumnConfig a) String
    | HeaderClicked (ColumnConfig a)
    | LineClicked (Item a)
    | SelectionToggled (Item a) String
    | UserClickedFilter


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
    , content : List (Item a)
    , filterHasFocus : Bool -- Prevents click in filter to trigger a sort
    , infList : IL.Model
    , order : Sorting
    , sortedBy : Maybe (ColumnConfig a)
    }


{-| Definition for the row selection column,
used when canSelectRows is True in grid config.
-}
selectionColumn : ColumnConfig a
selectionColumn =
    { properties =
        { id = "MultipleSelection"
        , order = Unsorted
        , title = "Select"
        , tooltip = ""
        , visible = True
        , width = 100
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
    in
    { clickedItem = Nothing
    , config = newConfig
    , content = items
    , filterHasFocus = False
    , infList = IL.init
    , order = Unsorted
    , sortedBy = Nothing
    }


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

        HeaderClicked columnConfig ->
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

        SelectionToggled item _ ->
            let
                newContent =
                    List.Extra.updateAt item.index (\it -> toggleSelection it) model.content
            in
            { model | content = newContent }

        FilterLoseFocus ->
            { model | filterHasFocus = False }

        UserClickedFilter ->
            { model | filterHasFocus = True }


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
    toUnstyled <|
        div
            [ css
                [ width (px <| toFloat (model.config.containerWidth + cumulatedBorderWidth))
                , overflow auto
                , margin auto
                ]
            ]
        <|
            if model.config.hasFilters then
                [ div
                    [ css
                        [ borderLeft3 (px 1) solid darkGrey
                        , borderRight3 (px 1) solid darkGrey
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
            , css
                [ model.config.rowStyle item
                , height (px <| toFloat model.config.lineHeight)
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
            , Html.Styled.Events.onInput (SelectionToggled item)
            ]
            []
        ]


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
    div
        [ id "Headers"
        , css
            [ width (px <| toFloat <| totalWidth model)
            , backgroundImage <| linearGradient (stop white2) (stop lightGrey2) []
            , height (px <| toFloat model.config.headerHeight)
            ]
        ]
    <|
        (visibleColumns model
            |> List.map (viewHeader model)
        )


viewHeader : Model a -> ColumnConfig a -> Html (Msg a)
viewHeader model columnConfig =
    let
        sortingSymbol =
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
    in
    div
        [ attribute "data-testid" <| "header-" ++ columnConfig.properties.id
        , css
            [ display inlineBlock
            , border3 (px 1) solid darkGrey
            , height (px <| toFloat <| model.config.headerHeight - cumulatedBorderWidth)
            , padding (px 2)
            , cursor pointer
            , position relative
            , overflow hidden
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            , hover
                [ descendants
                    [ typeSelector "div"
                        [ visibility visible -- makes the tooltip visible on hover
                        ]
                    ]
                ]
            ]
        , onClick (HeaderClicked columnConfig)
        ]
        [ text <| columnConfig.properties.title
        , sortingSymbol
        , viewFilter model columnConfig
        , div
            [ css tooltipStyles
            ]
            [ text columnConfig.properties.tooltip ]
        ]


tooltipStyles =
    [ backgroundColor slightlyTransparentBlack
    , borderRadius (px 3)
    , color white2
    , fontSize (px 12)
    , lineHeight (pct 110)
    , opacity (num 0.7)
    , padding (px 5)
    , position absolute
    , textShadow4 (px -1) (px 1) (px 0) slightlyTransparentBlack
    , transition
        [ Css.Transitions.visibility3 0 0.5 easeOut -- delay the visibility change
        ]
    , visibility hidden
    , zIndex (int 1000)
    ]


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
        , minHeight (pct 100) -- 100% min height forces empty divs to be correctly rendered
        , paddingLeft (px 2)
        , paddingRight (px 2)
        , overflow hidden
        , whiteSpace noWrap
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]
