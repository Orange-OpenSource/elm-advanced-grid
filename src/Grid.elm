module Grid exposing
    ( ColumnConfig
    , Config
    , Model
    , Msg
    , Sorting(..)
    , compareBoolField
    , compareFloatField
    , compareIntField
    , compareStringField
    , init
    , update
    , view
    , viewBool
    , viewFloat
    , viewInt
    , viewProgressBar
    , viewString
    )

import Css exposing (..)
import Grid.Colors exposing (black, darkGrey, lightGreen, lightGrey, white)
import Grid.Filters exposing (Filter(..), Item, boolFilter, parseFilteringString)
import Html
import Html.Styled exposing (Html, div, input, span, text, toUnstyled)
import Html.Styled.Attributes exposing (css, fromUnstyled, type_)
import Html.Styled.Events exposing (onClick, onInput)
import InfiniteList as IL
import List.Extra


type alias Config a =
    { canSelectRows : Bool
    , columns : List (ColumnConfig a)
    , containerHeight : Int
    , containerWidth : Int
    , hasFilters : Bool
    , lineHeight : Int
    , rowStyle : Item a -> Style
    }


type Msg a
    = InfListMsg IL.Model
    | HeaderClicked (ColumnConfig a)
    | FilterModified (ColumnConfig a) String
    | LineClicked (Item a)
    | SelectionToggled (Item a) String


type Sorting
    = Unsorted
    | Ascending
    | Descending


type alias ColumnConfig a =
    { properties : ColumnProperties
    , comparator : Item a -> Item a -> Order
    , filteringValue : Maybe String
    , filters : Filter a
    , renderer : ColumnProperties -> (Item a -> Html (Msg a))
    }


type alias ColumnProperties =
    { id : String
    , order : Sorting
    , title : String
    , visible : Bool
    , width : Int
    }


type alias Model a =
    { clickedItem : Maybe (Item a)
    , config : Config a
    , content : List (Item a)
    , infList : IL.Model
    , order : Sorting
    , sortedBy : Maybe (ColumnConfig a)
    }


selectionColumn : ColumnConfig a
selectionColumn =
    { properties =
            { id = "MultipleSelection"
            , order = Unsorted
            , title = "Select"
            , visible = True
            , width = 100
            }
      , filters = BoolFilter <| boolFilter (\item -> item.selected)
      , filteringValue = Nothing
      , renderer = viewBool (\item -> item.selected)
      , comparator = compareBoolField (\item -> item.selected)
      }

init : Config a -> List (Item a) -> Model a
init config items =
    let
        newConfig = if config.canSelectRows then
                { config | columns = selectionColumn :: config.columns }
            else
                config

    in
    { clickedItem = Nothing
    , config = newConfig
    , content = items
    , infList = IL.init
    , order = Unsorted
    , sortedBy = Nothing
    }



update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
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
            ( { model | config = newConfig }, Cmd.none )


        HeaderClicked columnConfig ->
            let
                ( sortedContent, newOrder ) =
                    case model.order of
                        Descending ->
                            ( List.sortWith columnConfig.comparator model.content |> List.reverse, Ascending )

                        _ ->
                            ( List.sortWith columnConfig.comparator model.content, Descending )
            in
            ( { model
                | content = sortedContent
                , order = newOrder
                , sortedBy = Just columnConfig
              }
            , Cmd.none
            )

        InfListMsg infList ->
            ( { model | infList = infList }, Cmd.none )

        LineClicked item ->
            ({ model | clickedItem = Just item }, Cmd.none )

        SelectionToggled item _ ->
            let
                newContent = List.Extra.updateAt item.index (\it -> toggleSelection it) model.content
            in
            ( { model | content = newContent }, Cmd.none )

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


view : Model a -> Html (Msg a)
view model =
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
                    [ border3 (px 1) solid darkGrey
                    , paddingBottom (px 3)
                    ]
                ]
                [ viewHeaders model
                , viewFilters model
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
                , overflow auto
                , border3 (px 1) solid lightGrey
                , margin auto
                ]
            , fromUnstyled <| IL.onScroll InfListMsg
            ]
            [ Html.Styled.fromUnstyled <| IL.view (gridConfig model) model.infList filteredItems ]
        ]



{--
idx is the index of the visible line; if there are 25 visible lines, 0 <= idx < 25
listIdx is the index in the data source; if the total number of items is 1000, 0<= listidx < 1000
--}


viewRow : Model a -> Int -> Int -> Item a -> Html.Html (Msg a)
viewRow model idx listIdx item =
    toUnstyled
        << div
            [ css
                [ model.config.rowStyle item
                , height (px <| toFloat model.config.lineHeight)
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


viewInt : (Item a -> Int) -> ColumnProperties -> Item a -> Html (Msg a)
viewInt field properties item =
    div
        (cellStyles properties)
        [ text <| String.fromInt (field item) ]

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


viewFloat : (Item a -> Float) -> ColumnProperties -> Item a -> Html (Msg a)
viewFloat field properties item =
    div
        (cellStyles properties)
        [ text <| String.fromFloat (field item) ]


viewString : (Item a -> String) -> ColumnProperties -> Item a -> Html (Msg a)
viewString field properties item =
    div
        (cellStyles properties)
        [ text <| field item ]


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
            , paddingLeft (px 3)
            , paddingRight (px 3)
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


compareIntField : (Item a -> Int) -> Item a -> Item a -> Order
compareIntField field item1 item2 =
    compare (field item1) (field item2)


compareFloatField : (Item a -> Float) -> Item a -> Item a -> Order
compareFloatField field item1 item2 =
    compare (field item1) (field item2)


compareStringField : (Item a -> String) -> Item a -> Item a -> Order
compareStringField field item1 item2 =
    compare (field item1) (field item2)


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
        [ css
            [ width (px <| toFloat <| totalWidth model)
            , margin auto
            , height (px <| toFloat model.config.lineHeight)
            ]
        ]
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
                        span [] []

                _ ->
                    span [] []
    in
    div
        [ css
            [ display inlineBlock
            , backgroundColor lightGrey
            , border3 (px 1) solid darkGrey
            , overflow hidden
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            ]
        , onClick (HeaderClicked columnConfig)
        ]
        [ text <| columnConfig.properties.title
        , sortingSymbol
        ]


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


viewFilters : Model a -> Html (Msg a)
viewFilters model =
    div
        [ css
            [ width (px <| toFloat <| totalWidth model)
            , height (px <| toFloat model.config.lineHeight)
            , marginBottom (px 3)
            ]
        ]
        (visibleColumns model
            |> List.map (viewFilter model)
        )


viewFilter : Model a -> ColumnConfig a -> Html (Msg a)
viewFilter model columnConfig =
    div
        [ css
            [ display inlineBlock
            , backgroundColor lightGrey
            , border3 (px 1) solid darkGrey
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            ]
        ]
        [ input
            [ css
                [ margin (px 3)
                , width (px (toFloat <| columnConfig.properties.width - 13))
                , height (px <| toFloat <| model.config.lineHeight - 10)
                ]
            , onInput <| FilterModified columnConfig
            ]
            []
        ]



-- Left + right cell border width, in px. Useful to take in account the borders when calculating the total grid     width


cumulatedBorderWidth : Int
cumulatedBorderWidth =
    2


cellStyles : ColumnProperties -> List (Html.Styled.Attribute (Msg a))
cellStyles properties =
    [ css
        [ display inlineBlock
        , border3 (px 1) solid lightGrey
        , overflow hidden
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]
