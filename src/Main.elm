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
        List.range 0 100000
            |> List.map
                (\i ->
                    { id = i
                    , name = "name" ++ String.fromInt i
                    , value = toFloat i / 1000
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


config : IL.Config Item Msg
config =
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
        List.map (\fn -> fn item) viewColumns


viewColumns : List (Item -> Html Msg)
viewColumns =
    [ viewBool .even 100
    , viewInt .id 100
    , viewString .name 100
    , viewFloat .value 100
    , viewProgressBar .value 100
    ]


viewInt : (Item -> Int) -> Int -> Item -> Html Msg
viewInt render width item =
    div
        [ style "display" "inline-block"
        , style "background-color" "red"
        , style "margin" "5px"
        , style "width" <| String.fromInt width ++ "px"
        ]
        [ text <| String.fromInt (render item) ]


viewBool : (Item -> Bool) -> Int -> Item -> Html Msg
viewBool render width item =
    div
        [ style "display" "inline-block"
        , style "background-color" "red"
        , style "margin" "5px"
        ]
        [ input
            [ type_ "checkbox"
            , checked (render item)
            ]
            []
        ]


viewFloat : (Item -> Float) -> Int -> Item -> Html Msg
viewFloat render width item =
    div
        [ style "display" "inline-block"
        , style "background-color" "green"
        , style "margin" "5px"
        , style "width" <| Debug.log "width" <| String.fromInt width ++ "px"
        ]
        [ text <| String.fromFloat (render item) ]


viewString : (Item -> String) -> Int -> Item -> Html Msg
viewString render width item =
    div
        [ style "display" "inline-block"
        , style "background-color" "yellow"
        , style "margin" "5px"
        , style "width" <| Debug.log "width" <| String.fromInt width ++ "px"
        ]
        [ text <| render item ]


viewProgressBar : (Item -> Float) -> Int -> Item -> Html Msg
viewProgressBar render width item =
    div
        [ style "display" "inline-block"
        , style "background-color" "white"
        , style "border-radius" "5px"
        , style "border" "1px solid #CCC"
        , style "width" "50px"
        ]
        [ div
            [ style "background-color" "#4d4"
            , style "width" <| String.fromFloat (render item / 2) ++ "px"
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
        [ IL.view config model.infList model.content ]
