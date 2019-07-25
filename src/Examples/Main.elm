module Examples.Main exposing (main)

import Browser
import Css exposing (Style, backgroundColor, hex, transparent)
import Grid
    exposing
        ( ColumnConfig
        , Msg(..)
        , Sorting(..)
        , compareFloatField
        , compareIntField
        , compareStringField
        , viewFloat
        , viewInt
        , viewProgressBar
        , viewString
        )
import Grid.Filters exposing (Filter(..), boolFilter, floatFilter, intFilter, stringFilter)
import Html exposing (Html, div, li, text, ul)
import Html.Attributes exposing (attribute, style)
import List.Extra


type alias Item =
    { id : Int
    , index : Int
    , city : String
    , name : String
    , value : Float
    , even : Bool
    , selected : Bool
    }


type alias Model =
    { gridModel : Grid.Model Item
    , clickedItem : Maybe Item
    , selectedItems : List Item
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
    let
        selectedItem =
            case model.clickedItem of
                Just item ->
                    viewItem item

                Nothing ->
                    text "None."
    in
    div []
        [ Html.map GridMsg <| Grid.view model.gridModel
        , div (centeredWithId "clickedItem") [ text "Clicked Item = ", selectedItem ]
        , div (centeredWithId "label")
            [ text <|
                if not <| List.isEmpty model.selectedItems then
                    "SelectedItems:"

                else
                    "Use checkboxes to select items."
            ]
        , ul (centeredWithId "selectedItems") <| List.map (\it -> li [] [ viewItem it ]) model.selectedItems
        ]


centeredWithId : String -> List (Html.Attribute msg)
centeredWithId id =
    [ attribute "data-testid" id
    , style "margin" "auto"
    , style "width" "500px"
    , style "padding-top" "10px"
    ]


viewItem : Item -> Html msg
viewItem item =
    text ("id:" ++ String.fromInt item.id ++ " - name: " ++ item.name ++ "")


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
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

        GridMsg message ->
            let
                ( newGridModel, cmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }, Cmd.map GridMsg cmd )


itemCount : Int
itemCount =
    4


cities =
    [ "Paris", "London", "New York", "Moscow", "Roma", "Berlin" ]


items : List Item
items =
    List.range 0 (itemCount - 1)
        |> List.map
            (\i ->
                { id = i
                , index = i
                , city = Maybe.withDefault "None" (List.Extra.getAt (modBy (List.length cities) i) cities)
                , name = "name" ++ String.fromInt i
                , value = (toFloat i / toFloat itemCount) * 100
                , even = toFloat i / 2 == toFloat (i // 2)
                , selected = False
                }
            )


init : () -> ( Model, Cmd Msg )
init _ =
    ( { gridModel = Grid.init gridConfig items
      , clickedItem = Nothing
      , selectedItems = []
      }
    , Cmd.none
    )


gridConfig : Grid.Config Item
gridConfig =
    { canSelectRows = True
    , columns = columns
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

    else if item.even then
        backgroundColor (hex "EEE")

    else
        backgroundColor transparent


columns : List (ColumnConfig Item)
columns =
    [ { properties =
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
            { id = "City"
            , order = Unsorted
            , title = "City"
            , visible = True
            , width = 300
            }
      , filters = StringFilter <| stringFilter (\item -> item.city)
      , filteringValue = Nothing
      , renderer = viewString (\item -> item.city)
      , comparator = compareStringField (\item -> item.city)
      }
    ]
