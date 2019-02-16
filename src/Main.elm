module Main exposing (main)

import Browser
import Css exposing (..)
import Html
import Html.Styled exposing (Html, div, input, span, styled, text, toUnstyled)
import Html.Styled.Attributes exposing (css, fromUnstyled, style, type_)
import Html.Styled.Events exposing (onClick)
import InfiniteList as IL
import Random exposing (generate)
import Random.List exposing (shuffle)


type Msg
    = InfListMsg IL.Model
    | HeaderClicked ColumnConfig
    | ShuffledList (List Item)


type alias Item =
    { id : Int
    , name : String
    , value : Float
    , even : Bool
    }


type Sorting
    = Unsorted
    | Ascending
    | Descending


type alias ColumnConfig =
    { properties : ColumnProperties
    , renderer : ColumnProperties -> (Item -> Html Msg)
    , sorter : Item -> Item -> Order
    }


type alias ColumnProperties =
    { order : Sorting
    , title : String
    , visible : Bool
    , width : Int
    }


type alias Model =
    { infList : IL.Model
    , content : List Item
    , sortedBy : Maybe ColumnConfig
    , order : Sorting
    }


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view >> toUnstyled
        , update = update
        , subscriptions = \_ -> Sub.none
        }


itemCount : Int
itemCount =
    2500


init : () -> ( Model, Cmd Msg )
init _ =
    let
        model =
            { infList = IL.init
            , content =
                List.range 0 itemCount
                    |> List.map
                        (\i ->
                            { id = i
                            , name = "name" ++ String.fromInt i
                            , value = (toFloat i / toFloat itemCount) * 100
                            , even = toFloat i / 2 == toFloat (i // 2)
                            }
                        )
            , sortedBy = Nothing
            , order = Unsorted
            }
    in
    ( model
    , generate ShuffledList (shuffle model.content)
    )


update : Msg -> Model -> ( Model, Cmd Msg )
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

        ShuffledList items ->
            ( { model | content = items }, Cmd.none )




view : Model -> Html Msg
view model =
    div []
        [ viewHeaders model columns
        , viewRows model
        ]


itemHeight : Int
itemHeight =
    20


containerHeight : Int
containerHeight =
    500


gridConfig : IL.Config Item Msg
gridConfig =
    IL.config
        { itemView = viewRow
        , itemHeight = IL.withConstantHeight itemHeight
        , containerHeight = containerHeight
        }
        |> IL.withOffset 300



{--
idx is the index of the visible line
listIdx is the index in the data source
--}


viewRow : Int -> Int -> Item -> Html.Html Msg
viewRow idx listIdx item =
    let
        rowColor =
            if item.value > 50 then
                backgroundColor (hex "3182A9")

            else if item.even then
                backgroundColor (hex "EEE")

            else
                backgroundColor transparent
    in
    toUnstyled << div
        [ css
            [ rowColor
            , height (px <| toFloat itemHeight)
            ]
        ]
    <|
        List.map (\config -> viewColumn config item) visibleColumns


viewColumn : ColumnConfig -> Item -> Html Msg
viewColumn config item =
    config.renderer config.properties item


columns : List ColumnConfig
columns =
    [ { properties =
            { order = Unsorted
            , title = "Selected"
            , visible = True
            , width = 100
            }
      , renderer = viewBool .even
      , sorter = sortBool .even
      }
    , { properties =
            { order = Unsorted
            , title = "Id"
            , visible = True
            , width = 100
            }
      , renderer = viewInt .id
      , sorter = sortInt .id
      }
    , { properties =
            { order = Unsorted
            , title = "Name"
            , visible = True
            , width = 100
            }
      , renderer = viewString .name
      , sorter = sortString .name
      }
    , { properties =
            { order = Unsorted
            , title = "Progress"
            , visible = True
            , width = 100
            }
      , renderer = viewProgressBar .value
      , sorter = sortFloat .value
      }
    , { properties =
            { order = Unsorted
            , title = "Value"
            , visible = True
            , width = 100
            }
      , renderer = viewFloat .value
      , sorter = sortFloat .value
      }
    ]


viewInt : (Item -> Int) -> ColumnProperties -> Item -> Html Msg
viewInt field properties item =
    div
        (cellStyles properties)
        [ text <| String.fromInt (field item) ]


viewBool : (Item -> Bool) -> ColumnProperties -> Item -> Html Msg
viewBool field properties item =
    div
        (cellStyles properties)
        [ input
            [ type_ "checkbox"
            , Html.Styled.Attributes.checked (field item)
            ]
            []
        ]


viewFloat : (Item -> Float) -> ColumnProperties -> Item -> Html Msg
viewFloat field properties item =
    div
        (cellStyles properties)
        [ text <| String.fromFloat (field item) ]


viewString : (Item -> String) -> ColumnProperties -> Item -> Html Msg
viewString field properties item =
    div
        (cellStyles properties)
        [ text <| field item ]


viewProgressBar : (Item -> Float) -> ColumnProperties -> Item -> Html Msg
viewProgressBar field properties item =
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
                    , height (px <| toFloat itemHeight - 12)
                    , borderRadius (px 5)
                    , overflow visible
                    ]
                ]
                []
            ]
        ]


visibleColumns : List ColumnConfig
visibleColumns =
    List.filter (\column -> column.properties.visible) columns


viewHeaders : Model -> List ColumnConfig -> Html Msg
viewHeaders model columnConfigs =
    div
        [ css
            [ border3 (px 1) solid (hex "000")
            , width (px <| toFloat totalWidth)
            , margin auto
            , height (px <| toFloat itemHeight)
            ]
        ]
        (columnConfigs
            |> List.filter (\column -> column.properties.visible)
            |> List.map (viewHeader model)
        )


viewHeader : Model -> ColumnConfig -> Html Msg
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


arrowUp : Html Msg
arrowUp =
    div
        [ css
            [ width (px 0)
            , height (px 0)
            , borderLeft3 (px 5) solid transparent
            , borderRight3 (px 5) solid transparent
            , borderBottom3 (px 5) solid (hex "000")
            ]
        ]
        []


arrowDown : Html Msg
arrowDown =
    div
        [ css
            [ width (px 0)
            , height (px 0)
            , borderLeft3 (px 5) solid transparent
            , borderRight3 (px 5) solid transparent
            , borderTop3 (px 5) solid (hex "000")
            ]
        ]
        []


sortInt : (Item -> Int) -> Item -> Item -> Order
sortInt field item1 item2 =
    compare (field item1) (field item2)


sortFloat : (Item -> Float) -> Item -> Item -> Order
sortFloat field item1 item2 =
    compare (field item1) (field item2)


sortString : (Item -> String) -> Item -> Item -> Order
sortString field item1 item2 =
    compare (field item1) (field item2)


sortBool : (Item -> Bool) -> Item -> Item -> Order
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


cellStyles : ColumnProperties -> List (Html.Styled.Attribute Msg)
cellStyles properties =
    [ css
        [ display inlineBlock
        , border3 (px 1) solid (hex "CCC")
        , overflow hidden
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]


viewRows : Model -> Html Msg
viewRows model =
    div
        [ css
            [ height (px <| toFloat containerHeight)
            , width (px <| toFloat totalWidth)
            , overflow auto
            , border3 (px 1) solid (hex "CCC")
            , margin auto
            ]
        , fromUnstyled <| IL.onScroll InfListMsg
        ]
        [ Html.Styled.fromUnstyled <| IL.view gridConfig model.infList model.content ]


totalWidth : Int
totalWidth =
    List.foldl (\columnConfig -> (+) columnConfig.properties.width) 0 visibleColumns
