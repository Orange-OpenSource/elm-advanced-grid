module Main exposing (main)

import Browser
import Html exposing (Html, div, input, li, text, ul)
import Html.Attributes exposing (checked, style, type_)
import InfiniteList as IL


type Msg
    = InfListMsg IL.Model


type alias Item =
    { id : Int
    , name : String
    , value : Float
    , even : Bool
    }

type alias ColumnConfig =
    { properties : ColumnProperties
    , renderer: ColumnProperties -> (Item -> Html Msg)
    }

type alias ColumnProperties =
    { width : Int
    , visible: Bool
    }




type alias Model =
    { infList : IL.Model
    , content : List Item
    }


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
        }


init : Model
init =
    { infList = IL.init
    , content =
        List.range 0 25000
            |> List.map
                (\i ->
                    { id = i
                    , name = "name" ++ String.fromInt i
                    , value = toFloat i / 100
                    , even = toFloat i / 2 == toFloat (i // 2)
                    }
                )
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        InfListMsg infList ->
            { model | infList = infList }


itemHeight : Int
itemHeight =
    20


containerHeight : Int
containerHeight =
    500


gridConfig : IL.Config Item Msg
gridConfig =
    IL.config
        { itemView = itemView
        , itemHeight = IL.withConstantHeight itemHeight
        , containerHeight = containerHeight
        }
        |> IL.withOffset 300


itemView : Int -> Int -> Item -> Html Msg
itemView idx listIdx item =
    div
        []
    <|
        List.map (\config -> viewColumn config item) columns


viewColumn : ColumnConfig -> Item -> Html Msg
viewColumn config item =
    config.renderer config.properties item

columns : List ColumnConfig
columns =
    [ { properties = { visible = True
                     , width = 100
                     }
       , renderer= viewBool .even
       }
    , { properties = { visible = True
                     , width = 100
                     }
       , renderer= viewInt .id
       }
    , { properties = { visible = True
                     , width = 100
                     }
       , renderer= viewString .name
       }
    , { properties = { visible = False
                     , width = 100
                     }
       , renderer= viewFloat .value
       }
    , { properties = { visible = True
                     , width = 50
                     }
       , renderer= viewProgressBar .value
       }
    ]


viewInt : (Item -> Int) -> ColumnProperties -> Item -> Html Msg
viewInt field properties item =
    div
        [ style "display" "inline-block"
        , style "margin" "5px"
        , style "width" <| String.fromInt properties.width ++ "px"
        ]
        [ text <| String.fromInt (field item) ]


viewBool : (Item -> Bool) -> ColumnProperties -> Item -> Html Msg
viewBool field properties item =
    div
        [ style "display" "inline-block"
        , style "margin" "5px"
        ]
        [ input
            [ type_ "checkbox"
            , checked (field item)
            ]
            []
        ]


viewFloat : (Item -> Float) -> ColumnProperties -> Item -> Html Msg
viewFloat field properties item =
    div
        [ style "display" "inline-block"
        , style "margin" "5px"
        , style "width" <| String.fromInt properties.width ++ "px"
        ]
        [ text <| String.fromFloat (field item) ]


viewString : (Item -> String) -> ColumnProperties -> Item -> Html Msg
viewString field properties item =
    div
        [ style "display" "inline-block"
        , style "margin" "5px"
        , style "width" <| String.fromInt properties.width ++ "px"
        ]
        [ text <| field item ]


viewProgressBar : (Item -> Float) -> ColumnProperties -> Item -> Html Msg
viewProgressBar field properties item =
    div
        [ style "display" "inline-block"
        , style "background-color" "white"
        , style "border-radius" "5px"
        , style "border" "1px solid #CCC"
        , style "width" <| String.fromInt properties.width ++ "px"
        ]
        [ div
            [ style "background-color" "#4d4"
            , style "width" <| String.fromFloat (field item / 2) ++ "px"
            , style "height" "10px"
            , style "border-radius" "4px"
            ]
            []
        ]


view : Model -> Html Msg
view model =
    div
        [ style "height" (String.fromInt containerHeight ++ "px")
        , style "width" "500px"
        , style "overflow" "auto"
        , style "border" "1px solid #000"
        , style "margin" "auto"
        , IL.onScroll InfListMsg
        ]
        [ IL.view gridConfig model.infList model.content ]
