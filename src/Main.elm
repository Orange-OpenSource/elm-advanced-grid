module Main exposing (main)

import Browser
import Css exposing (Style, backgroundColor, hex, transparent)
import Grid exposing (..)
import Html exposing (Html)
import Html.Styled exposing (toUnstyled)


type alias Model =
    Grid.Model Item


type alias Item =
    { id : Int
    , name : String
    , value : Float
    , even : Bool
    , selected : Bool
    }


type Msg
    = GridMsg (Grid.Msg Item)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }


view : Model -> Html Msg
view model =
    Html.map GridMsg <| (Grid.view >> toUnstyled) model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GridMsg gridMessage ->
            let
                ( newModel, cmd ) =
                    Grid.update gridMessage model
            in
            ( newModel, Cmd.map GridMsg cmd )


itemCount : Int
itemCount =
    2500


items =
    List.range 0 itemCount
        |> List.map
            (\i ->
                { id = i
                , name = "name" ++ String.fromInt i
                , value = (toFloat i / toFloat itemCount) * 100
                , even = toFloat i / 2 == toFloat (i // 2)
                , selected = False
                }
            )


init : () -> ( Model, Cmd Msg )
init _ =
    ( Grid.init gridConfig items
    , Cmd.none
    )


gridConfig : Grid.Config Item
gridConfig =
    { columns = columns
    , containerHeight = 500
    , containerWidth = 700
    , lineHeight = 20
    , rowStyle = rowColor
    }


rowColor : Item -> Style
rowColor item =
    if item.value > 50 then
        backgroundColor (hex "3182A9")

    else if item.even then
        backgroundColor (hex "EEE")

    else
        backgroundColor transparent


columns : List (ColumnConfig Item)
columns =
    [ { properties =
            { order = Unsorted
            , title = "Selected"
            , visible = True
            , width = 100
            }
      , renderer = viewBool (\item -> item.even)
      , sorter = sortBool (\item -> item.even)
      }
    , { properties =
            { order = Unsorted
            , title = "Id"
            , visible = True
            , width = 100
            }
      , renderer = viewInt (\item -> item.id)
      , sorter = sortInt (\item -> item.id)
      }
    , { properties =
            { order = Unsorted
            , title = "Name"
            , visible = True
            , width = 100
            }
      , renderer = viewString (\item -> item.name)
      , sorter = sortString (\item -> item.name)
      }
    , { properties =
            { order = Unsorted
            , title = "Progress"
            , visible = True
            , width = 100
            }
      , renderer = viewProgressBar 8 (\item -> item.value)
      , sorter = sortFloat (\item -> item.value)
      }
    , { properties =
            { order = Unsorted
            , title = "Value"
            , visible = True
            , width = 100
            }
      , renderer = viewFloat (\item -> item.value)
      , sorter = sortFloat (\item -> item.value)
      }
    , { properties =
            { order = Unsorted
            , title = "Selected2"
            , visible = True
            , width = 100
            }
      , renderer = viewBool (\item -> item.even)
      , sorter = sortBool (\item -> item.even)
      }
    , { properties =
            { order = Unsorted
            , title = "Id2"
            , visible = True
            , width = 100
            }
      , renderer = viewInt (\item -> item.id)
      , sorter = sortInt (\item -> item.id)
      }
    , { properties =
            { order = Unsorted
            , title = "Name2"
            , visible = True
            , width = 100
            }
      , renderer = viewString (\item -> item.name)
      , sorter = sortString (\item -> item.name)
      }
    , { properties =
            { order = Unsorted
            , title = "Progres2s"
            , visible = True
            , width = 100
            }
      , renderer = viewProgressBar 8 (\item -> item.value)
      , sorter = sortFloat (\item -> item.value)
      }
    , { properties =
            { order = Unsorted
            , title = "Valu2e"
            , visible = True
            , width = 100
            }
      , renderer = viewFloat (\item -> item.value)
      , sorter = sortFloat (\item -> item.value)
      }
    ]
