module Examples.Main exposing (main)

import Browser
import Dict
import Grid exposing (ColumnConfig, Msg(..), Sorting(..), floatColumnConfig, intColumnConfig, stringColumnConfig, viewProgressBar)
import Html exposing (Html, button, div, input, label, li, text, ul)
import Html.Attributes exposing (attribute, style)
import Html.Events exposing (onClick, onInput)
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
    | UserChangedScrollIndex String


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
        , div (centeredWithId "Preferences")
            [ button
                [ onClick DisplayPreferences
                , style "margin" "10px"
                ]
                [ text "Show Preferences" ]
            ]
        , div (centeredWithId "buttonBar")
            [ button [ onClick SetFilters, style "margin" "10px" ] [ text "Set Filters" ]
            , button [ onClick ResetFilters, style "margin" "10px" ] [ text "Reset Filters" ]
            , button [ onClick SetAscendingOrder, style "margin" "10px" ] [ text "Sort cities ascending" ]
            , button [ onClick SetDecendingOrder, style "margin" "10px" ] [ text "Sort cities descending" ]
            ]
        , div (centeredWithId "InputBar") [ viewInput ]
        ]


viewInput : Html Msg
viewInput =
    label []
        [ text "Scroll to item number:"
        , input [ onInput UserChangedScrollIndex ] []
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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DisplayPreferences ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update ShowPreferences model.gridModel
            in
            ( { model
                | gridModel = newGridModel
              }
            , Cmd.map GridMsg gridCmd
            )

        GridMsg (UserClickedLine item) ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update (UserClickedLine item) model.gridModel
            in
            ( { model
                | gridModel = newGridModel
                , clickedItem = Just item
              }
            , Cmd.map GridMsg gridCmd
            )

        GridMsg (UserToggledSelection item) ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update (UserToggledSelection item) model.gridModel

                selectedItems =
                    List.filter .selected newGridModel.content
            in
            ( { model
                | gridModel = newGridModel
                , selectedItems = selectedItems
              }
            , Cmd.map GridMsg gridCmd
            )

        GridMsg UserToggledAllItemSelection ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update UserToggledAllItemSelection model.gridModel

                selectedItems =
                    if newGridModel.isAllSelected then
                        newGridModel.content

                    else
                        []
            in
            ( { model
                | gridModel = newGridModel
                , selectedItems = selectedItems
              }
            , Cmd.map GridMsg gridCmd
            )

        GridMsg message ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        ResetFilters ->
            let
                message =
                    Grid.InitializeFilters Dict.empty

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        SetFilters ->
            let
                filters =
                    Dict.fromList [ ( "City", "o" ) ]

                message =
                    Grid.InitializeFilters filters

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        SetAscendingOrder ->
            let
                message =
                    Grid.InitializeSorting "City" Ascending

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        SetDecendingOrder ->
            let
                message =
                    Grid.InitializeSorting "City" Descending

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        UserChangedScrollIndex string ->
            case String.toInt string of
                Just idx ->
                    let
                        message =
                            Grid.ScrollTo idx

                        ( newGridModel, gridCmd ) =
                            Grid.update message model.gridModel
                    in
                    ( { model | gridModel = newGridModel }
                    , Cmd.map GridMsg gridCmd
                    )

                Nothing ->
                    ( model, Cmd.none )


itemCount : Int
itemCount =
    List.length cities


cities =
    [ "Paris", "London", "New York", "Moscow", "Roma", "Berlin", "Tokyo", "Delhi", "Shanghai", "Sao Paulo", "Mexico City", "Cairo", "Dhaka", "Mumbai", "Beijing", "Osaka", "Karachi", "Chongqing", "Buenos Aires", "Istanbul", "Kolkata", "Lagos", "Manila", "Tianjin", "Rio De Janeiro", "Guangzhou", "Moscow", "Lahore", "Shenzhen", "Bangalore", "Paris", "Bogota", "Chennai", "Jakarta", "Lima", "Bangkok", "Seoul", "Hyderabad", "London", "Tehran", "Chengdu", "New York", "Wuhan", "Ahmedabad", "Kuala Lumpur", "Riyadh", "Surat", "Santiago", "Madrid", "Pune", "Dar Es Salaam", "Toronto", "Johannesburg", "Barcelona", "St Petersburg", "Yangon", "Alexandria", "Guadalajara", "Ankara", "Melbourne", "Sydney", "Brasilia", "Nairobi", "Cape Town", "Rome", "Montreal", "Tel Aviv", "Los Angeles", "Medellin", "Jaipur", "Casablanca", "Lucknow", "Berlin", "Busan", "Athens", "Milan", "Kanpur", "Abuja", "Lisbon", "Surabaya", "Dubai", "Cali", "Manchester" ]


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
    , headerHeight = 60
    , lineHeight = 25
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
