module Examples.Main exposing (main)

import Browser
import Dict
import Grid exposing (ColumnConfig, Msg(..), Sorting(..), floatColumnConfig, intColumnConfig, stringColumnConfig, viewProgressBar)
import Html exposing (Html, button, div, li, text, ul)
import Html.Attributes exposing (attribute, style)
import Html.Events exposing (onClick)
import List.Extra


type alias Item =
    { id : Int
    , index : Int
    , city : String
    , name : String
    , value : Float
    , selected : Bool
    }


type alias Model =
    { gridModel : Grid.Model Item
    , clickedItem : Maybe Item
    , selectedItems : List Item
    }


type Msg
    = DisplayPreferences
    | GridMsg (Grid.Msg Item)
    | ResetFilters
    | SetFilters
    | SetAscendingOrder
    | SetDecendingOrder


main : Program () Model Msg
main =
    Browser.sandbox
        { init = init
        , view = view
        , update = update
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
        , div (centeredWithId "Preferences")
            [ button
                [ onClick DisplayPreferences
                , style "margin" "10px"
                ]
                [ text "Show Preferences" ]
            ]
        , div (centeredWithId "ButtonBar")
            [ button [ onClick SetFilters, style "margin" "10px" ] [ text "Set Filters" ]
            , button [ onClick ResetFilters, style "margin" "10px" ] [ text "Reset Filters" ]
            , button [ onClick SetAscendingOrder, style "margin" "10px" ] [ text "Sort cities ascending" ]
            , button [ onClick SetDecendingOrder, style "margin" "10px" ] [ text "Sort cities descending" ]
            ]
        ]


centeredWithId : String -> List (Html.Attribute msg)
centeredWithId id =
    [ attribute "data-testid" id
    , style "margin" "auto"
    , style "width" "700px"
    , style "padding-top" "10px"
    ]


viewItem : Item -> Html msg
viewItem item =
    text ("id:" ++ String.fromInt item.id ++ " - name: " ++ item.name ++ "")


update : Msg -> Model -> Model
update msg model =
    case msg of
        DisplayPreferences ->
            let
                newGridModel =
                    Grid.update ShowPreferences model.gridModel
            in
            { model
                | gridModel = newGridModel
            }

        GridMsg (UserClickedLine item) ->
            let
                newGridModel =
                    Grid.update (UserClickedLine item) model.gridModel
            in
            { model
                | gridModel = newGridModel
                , clickedItem = Just item
            }

        GridMsg (UserToggledSelection item) ->
            let
                newGridModel =
                    Grid.update (UserToggledSelection item) model.gridModel

                selectedItems =
                    List.filter .selected newGridModel.content
            in
            { model
                | gridModel = newGridModel
                , selectedItems = selectedItems
            }

        GridMsg UserToggledAllItemSelection ->
            let
                newGridModel =
                    Grid.update UserToggledAllItemSelection model.gridModel

                selectedItems =
                    if newGridModel.isAllSelected then
                        newGridModel.content

                    else
                        []
            in
            { model
                | gridModel = newGridModel
                , selectedItems = selectedItems
            }

        GridMsg message ->
            let
                newGridModel =
                    Grid.update message model.gridModel
            in
            { model | gridModel = newGridModel }

        ResetFilters ->
            let
                message =
                    Grid.InitializeFilters Dict.empty

                newGridModel =
                    Grid.update message model.gridModel
            in
            { model | gridModel = newGridModel }

        SetFilters ->
            let
                filters =
                    Dict.fromList [ ( "City", "o" ) ]

                message =
                    Grid.InitializeFilters filters

                newGridModel =
                    Grid.update message model.gridModel
            in
            { model | gridModel = newGridModel }

        SetAscendingOrder ->
            let
                message =
                    Grid.InitializeSorting "City" Ascending

                newGridModel =
                    Grid.update message model.gridModel
            in
            { model | gridModel = newGridModel }

        SetDecendingOrder ->
            let
                message =
                    Grid.InitializeSorting "City" Descending

                newGridModel =
                    Grid.update message model.gridModel
            in
            { model | gridModel = newGridModel }


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
                , selected = False
                }
            )


init : Model
init =
    { gridModel = Grid.init gridConfig items
    , clickedItem = Nothing
    , selectedItems = []
    }


gridConfig : Grid.Config Item
gridConfig =
    { canSelectRows = True
    , columns = columns
    , containerHeight = 500
    , containerWidth = 700
    , hasFilters = True
    , headerHeight = 60
    , lineHeight = 20
    , rowClass = rowClass
    }


rowClass : Item -> String
rowClass item =
    let
        even =
            toFloat item.index / 2 == toFloat (item.index // 2)
    in
    if item.selected then
        "selected-row"

    else if even then
        "even-row"

    else
        ""


{-| TODO implement
-}
localize : String -> String
localize string =
    string


columns : List (ColumnConfig Item)
columns =
    [ intColumnConfig
        { id = "Id"
        , getter = .id
        , localize = localize
        , title = "Id"
        , tooltip = "A hint for Id column"
        , width = 50
        }
    , stringColumnConfig
        { id = "Name"
        , getter = .name
        , localize = localize
        , title = "Name"
        , tooltip = "A hint for Name column"
        , width = 100
        }
    , let
        progressColumnConfig =
            floatColumnConfig
                { id = "Progress"
                , getter = .value
                , localize = localize
                , title = "Progress"
                , tooltip = "A hint for Progress column"
                , width = 100
                }
      in
      { progressColumnConfig | renderer = viewProgressBar 8 (\item -> item.value) }
    , floatColumnConfig
        { id = "Value"
        , getter = .value
        , localize = localize
        , title = "Value"
        , tooltip = "A hint for Value column"
        , width = 100
        }
    , stringColumnConfig
        { id = "City"
        , getter = .city
        , localize = localize
        , title = "City"
        , tooltip = "A hint for City column"
        , width = 300
        }
    ]
