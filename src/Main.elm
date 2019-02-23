module Main exposing (main)

import Browser
import Css exposing (Style, backgroundColor, hex, transparent)
import Grid exposing (..)
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, intFilter, stringFilter)
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

items : List Item
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
    , hasFilters = True
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
            { id = "Selected"
            , order = Unsorted
            , title = "Selected"
            , visible = True
            , width = 100
            }
      , filters = BoolFilter <| boolFilter (\item -> item.even)
      , filteringValue = Nothing
      , renderer = viewBool (\item -> item.even)
      , comparator = compareBoolField (\item -> item.even)
      }
    , { properties =
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
    , { properties =
            { id = "Name"
            , order = Unsorted
            , title = "Name"
            , visible = True
            , width = 100
            }
      , filters = StringFilter <| stringFilter (\item -> item.name)
      , filteringValue = Nothing
      , renderer = viewString (\item -> item.name)
      , comparator = compareStringField (\item -> item.name)
      }
    , { properties =
            { id = "Progress"
            , order = Unsorted
            , title = "Progress"
            , visible = True
            , width = 100
            }
      , filters = FloatFilter <| floatFilter (\item -> item.value)
      , filteringValue = Nothing
      , renderer = viewProgressBar 8 (\item -> item.value)
      , comparator = compareFloatField (\item -> item.value)
      }
    , { properties =
            { id = "Value"
            , order = Unsorted
            , title = "Value"
            , visible = True
            , width = 100
            }
      , filters = FloatFilter <| floatFilter (\item -> item.value)
      , filteringValue = Nothing
      , renderer = viewFloat (\item -> item.value)
      , comparator = compareFloatField (\item -> item.value)
      }
    , { properties =
            { id = "Selected2"
            , order = Unsorted
            , title = "Selected2"
            , visible = True
            , width = 100
            }
      , filters = BoolFilter <| boolFilter (\item -> item.even)
      , filteringValue = Nothing
      , renderer = viewBool (\item -> item.even)
      , comparator = compareBoolField (\item -> item.even)
      }
    , { properties =
            { id = "Id2"
            , order = Unsorted
            , title = "Id2"
            , visible = True
            , width = 100
            }
      , filters = IntFilter <| intFilter (\item -> item.id)
      , filteringValue = Nothing
      , renderer = viewInt (\item -> item.id)
      , comparator = compareIntField (\item -> item.id)
      }
    , { properties =
            { id = "Name2"
            , order = Unsorted
            , title = "Name2"
            , visible = True
            , width = 100
            }
      , filters = StringFilter <| stringFilter (\item -> item.name)
      , filteringValue = Nothing
      , renderer = viewString (\item -> item.name)
      , comparator = compareStringField (\item -> item.name)
      }
    , { properties =
            { id = "Progres2s"
            , order = Unsorted
            , title = "Progres2s"
            , visible = True
            , width = 100
            }
      , filters = FloatFilter <| floatFilter (\item -> item.value)
      , filteringValue = Nothing
      , renderer = viewProgressBar 8 (\item -> item.value)
      , comparator = compareFloatField (\item -> item.value)
      }
    , { properties =
            { id = "Valu2e"
            , order = Unsorted
            , title = "Valu2e"
            , visible = True
            , width = 100
            }
      , filters = FloatFilter <| floatFilter (\item -> item.value)
      , filteringValue = Nothing
      , renderer = viewFloat (\item -> item.value)
      , comparator = compareFloatField (\item -> item.value)
      }
    ]
