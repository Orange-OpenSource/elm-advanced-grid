module Grid exposing (ColumnConfig, Config, Model, Msg, Sorting(..), init, sortBool, sortFloat, sortInt, sortString, update, view, viewBool, viewColumn, viewFloat, viewInt, viewProgressBar, viewString, visibleColumns)

import Css exposing (..)
import Html
import Html.Styled exposing (Html, div, input, span, styled, text, toUnstyled)
import Html.Styled.Attributes exposing (css, fromUnstyled, style, type_)
import Html.Styled.Events exposing (onClick)
import InfiniteList as IL


type alias Item a =
    { a
        | selected : Bool
    }


type alias Config a =
    { columns : List (ColumnConfig a)
    , containerHeight : Int
    , containerWidth : Int
    , lineHeight : Int
    , rowStyle : Item a -> Style
    }


type Msg a
    = InfListMsg IL.Model
    | HeaderClicked (ColumnConfig a)


type Sorting
    = Unsorted
    | Ascending
    | Descending


type alias ColumnConfig a =
    { properties : ColumnProperties
    , renderer : ColumnProperties -> (Item a -> Html (Msg a))
    , sorter : Item a -> Item a -> Order
    }


type alias ColumnProperties =
    { order : Sorting
    , title : String
    , visible : Bool
    , width : Int
    }


type alias Model a =
    { config : Config a
    , content : List (Item a)
    , infList : IL.Model
    , order : Sorting
    , sortedBy : Maybe (ColumnConfig a)
    }


init : Config a -> List (Item a) -> Model a
init config items =
    { config = config
    , content = items
    , infList = IL.init
    , order = Unsorted
    , sortedBy = Nothing
    }


update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
update msg model =
    case msg of
        InfListMsg infList ->
            ( { model | infList = infList }, Cmd.none )

        HeaderClicked columnConfig ->
            let
                ( sortedContent, newOrder ) =
                    case model.order of
                        Descending ->
                            ( List.sortWith columnConfig.sorter model.content |> List.reverse, Ascending )

                        _ ->
                            ( List.sortWith columnConfig.sorter model.content, Descending )
            in
            ( { model
                | content = sortedContent
                , order = newOrder
                , sortedBy = Just columnConfig
              }
            , Cmd.none
            )


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
        [ viewHeaders model model.config.columns
        , viewRows model
        ]


viewRows : Model a -> Html (Msg a)
viewRows model =
    div
        [ css
            [ height (px <| toFloat model.config.containerHeight)
            , width (px <| toFloat <| totalWidth model)
            , overflow auto
            , border3 (px 1) solid (hex "CCC")
            , margin auto
            ]
        , fromUnstyled <| IL.onScroll InfListMsg
        ]
        [ Html.Styled.fromUnstyled <| IL.view (gridConfig model) model.infList model.content ]



{--
idx is the index of the visible line
listIdx is the index in the data source
--}


viewRow : Model a -> Int -> Int -> Item a -> Html.Html (Msg a)
viewRow model idx listIdx item =
    toUnstyled
        << div
            [ css
                [ model.config.rowStyle item
                , height (px <| toFloat model.config.lineHeight)
                ]
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
            , border3 (px 1) solid (hex "CCC")
            , verticalAlign top
            , paddingLeft (px 3)
            , paddingRight (px 3)
            ]
        ]
        [ div
            [ css
                [ display inlineBlock
                , backgroundColor (hex "fff")
                , borderRadius (px 5)
                , border3 (px 1) solid (hex "CCC")
                , width (px <| toFloat maxWidth)
                ]
            ]
            [ div
                [ css
                    [ backgroundColor (hex "4d4")
                    , width (px actualWidth)
                    , height (px <| toFloat barHeight)
                    , borderRadius (px 5)
                    , overflow visible
                    ]
                ]
                []
            ]
        ]


visibleColumns : Model a -> List (ColumnConfig a)
visibleColumns model =
    List.filter (\column -> column.properties.visible) model.config.columns


viewHeaders : Model a -> List (ColumnConfig a) -> Html (Msg a)
viewHeaders model columnConfigs =
    div
        [ css
            [ border3 (px 1) solid (hex "000")
            , width (px <| toFloat <| totalWidth model)
            , margin auto
            , height (px <| toFloat model.config.lineHeight)
            ]
        ]
        (columnConfigs
            |> List.filter (\column -> column.properties.visible)
            |> List.map (viewHeader model)
        )


viewHeader : Model a -> ColumnConfig a -> Html (Msg a)
viewHeader model columnConfig =
    let
        sortingSymbol =
            case model.sortedBy of
                Just config ->
                    if config == columnConfig then
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
            , backgroundColor (hex "CCC")
            , border3 (px 1) solid (hex "666")
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
            , horizontalBorder (px 5) solid (hex "000")
            , display inlineBlock
            , float right
            , margin (px 5)
            ]
        ]
        []


sortInt : (Item a -> Int) -> Item a -> Item a -> Order
sortInt field item1 item2 =
    compare (field item1) (field item2)


sortFloat : (Item a -> Float) -> Item a -> Item a -> Order
sortFloat field item1 item2 =
    compare (field item1) (field item2)


sortString : (Item a -> String) -> Item a -> Item a -> Order
sortString field item1 item2 =
    compare (field item1) (field item2)


sortBool : (Item a -> Bool) -> Item a -> Item a -> Order
sortBool field item1 item2 =
    case ( field item1, field item2 ) of
        ( True, True ) ->
            EQ

        ( False, False ) ->
            EQ

        ( True, False ) ->
            GT

        ( False, True ) ->
            LT


cumulatedBorderWidth : Int
cumulatedBorderWidth =
    2


cellStyles : ColumnProperties -> List (Html.Styled.Attribute (Msg a))
cellStyles properties =
    [ css
        [ display inlineBlock
        , border3 (px 1) solid (hex "CCC")
        , overflow hidden
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]
