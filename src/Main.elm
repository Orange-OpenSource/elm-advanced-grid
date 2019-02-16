module Main exposing (main)

import Browser
import Html exposing (Html, div, input, text)
import Html.Attributes exposing (checked, style, type_)
import Html.Events exposing (onClick)
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
        , view = view
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
                (sortedContent, newOrder) =
                    case model.order of
                       Descending ->
                           (List.sortWith columnConfig.sorter model.content |> List.reverse, Ascending)
                       _ ->
                           (List.sortWith columnConfig.sorter model.content, Descending)
            in
            ( { model | content = sortedContent
              , order = newOrder
              , sortedBy = Just columnConfig
              }
              , Cmd.none )



        ShuffledList items ->
            ( { model | content = items }, Cmd.none )


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


viewRow : Int -> Int -> Item -> Html Msg
viewRow idx listIdx item =
    let
        visibleColumns =
            List.filter (\column -> column.properties.visible) columns

        color = if item.value > 50 then
                    "#3182A9"
                else
                    if item.even then
                        "#EEE"
                    else
                        "transparent"

    in
    div
        [ style "background-color" color ]
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
            , visible = False
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
            , checked (field item)
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
        maxWidth = properties.width - 8
        actualWidth = (field item / toFloat 100) * toFloat maxWidth

    in


    div
        [ style "display" "inline-block"
        , style "border" "1px solid #CCC"
        , style "vertical-align" "top"
        , style "padding-left" "3px"
        , style "padding-right" "3px"
        ]
        [ div
            [ style "display" "inline-block"
            , style "background-color" "white"
            , style "border-radius" "5px"
            , style "border" "1px solid #CCC"
            , style "width" <| String.fromInt maxWidth ++ "px"
            ]
            [ div
                [ style "background-color" "#4d4"
                , style "width" <| String.fromFloat actualWidth ++ "px"
                , style "height" <| String.fromInt (itemHeight - 12) ++ "px"
                , style "border-radius" "5px"
                , style "overflow" "visible"
                ]
                []
            ]
        ]

viewHeaders : Model -> List ColumnConfig -> Html Msg
viewHeaders model columnConfigs =
    div
        [ style "border" "1px solid #000"
        , style "width" "500px"
        , style "margin" "auto"
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
                            " ^"
                        else
                            " v"
                    else
                        ""
                _ ->
                    ""
    in
    div
        [ style "display" "inline-block"
        , style "background-color" "#CCC"
        , style "border" "1px solid #666"
        --, style "padding" "1px 2px 0px 1px"
        , style "overflow" "hidden"
        , style "width" <| String.fromInt columnConfig.properties.width ++ "px"
        , onClick (HeaderClicked columnConfig)
        ]
        [ text <| columnConfig.properties.title ++ sortingSymbol]


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

view : Model -> Html Msg
view model =
    div []
        [ viewHeaders model columns
        , viewRows model
        ]


cellStyles : ColumnProperties -> List (Html.Attribute Msg)
cellStyles properties =
    [ style "display" "inline-block"
    , style "border" "1px solid #CCC"
    , style "overflow" "hidden"

    , style "width" <| String.fromInt properties.width ++ "px"
    ]


viewRows : Model -> Html Msg
viewRows model =
    div
        [ style "height" (String.fromInt containerHeight ++ "px")
        , style "width" "500px"
        , style "overflow" "auto"
        , style "border" "1px solid #000"
        , style "margin" "auto"
        , IL.onScroll InfListMsg
        ]
        [ IL.view gridConfig model.infList model.content ]
