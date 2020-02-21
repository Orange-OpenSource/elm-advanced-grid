{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Examples.LargeList exposing (main)

import Browser
import Dict exposing (Dict)
import Grid exposing (ColumnConfig, Msg(..), Sorting(..), floatColumnConfig, intColumnConfig, selectedAndVisibleItems, stringColumnConfig, viewProgressBar)
import Grid.Item exposing (Item)
import Html exposing (Html, button, div, input, label, li, text, ul)
import Html.Attributes exposing (attribute, style)
import Html.Events exposing (onClick, onInput)
import List.Extra


type alias Data =
    { id : Int
    , city : String
    , name : String
    , value1 : Float
    , value2 : Float
    , value3 : Float
    , value4 : Float
    , value5 : Float
    , value6 : Float
    }


type alias Model =
    { gridModel : Grid.Model Data
    , clickedItem : Maybe (Item Data)
    , arePreferencesVisible : Bool
    }


type Msg
    = DisplayPreferences
    | GridMsg (Grid.Msg Data)
    | HidePreferences
    | ResetFilters
    | SetFilters
    | SetAscendingOrder
    | SetDecendingOrder
    | UserRequiredScrollingToCity String


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
    div
        [ style "display" "flex"
        , style "flex-direction" "row"
        , style "align-items" "flex-start"
        ]
        [ viewMenu model
        , viewGrid model
        ]


viewGrid : Model -> Html Msg
viewGrid model =
    div
        [ style "background-color" "white"
        , style "margin-left" "auto"
        , style "margin-right" "auto"
        , style "color" "#555555"
        ]
        [ Html.map GridMsg <| Grid.view model.gridModel ]


viewMenu : Model -> Html Msg
viewMenu model =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        ]
        [ if model.arePreferencesVisible then
            viewButton "Hide Preferences" HidePreferences

          else
            viewButton "Show Preferences" DisplayPreferences
        , viewButton "Set Filters" SetFilters
        , viewButton "Reset Filters" ResetFilters
        , viewButton "Sort cities ascending" SetAscendingOrder
        , viewButton "Sort cities descending" SetDecendingOrder
        , viewInput
        , viewClickedItem model
        , viewSelectedItems model
        ]


viewClickedItem : Model -> Html Msg
viewClickedItem model =
    let
        selectedItem =
            case model.clickedItem of
                Just item ->
                    viewItem item

                Nothing ->
                    text "None."
    in
    div (menuItemAttributes "clickedItem") [ text "Clicked Item = ", selectedItem ]


viewSelectedItems : Model -> Html Msg
viewSelectedItems model =
    let
        selectedItems =
            selectedAndVisibleItems model.gridModel
    in
    div (menuItemAttributes "label")
        [ text <|
            if not <| List.isEmpty selectedItems then
                "SelectedItems:"

            else
                "Use checkboxes to select items."
        , ul (menuItemAttributes "selectedItems") <| List.map (\it -> li [] [ viewItem it ]) selectedItems
        ]


viewButton : String -> Msg -> Html Msg
viewButton label msg =
    button
        [ onClick msg
        , style "margin" "10px"
        , style "background-color" "darkturquoise"
        , style "padding" "0.5rem"
        , style "border-radius" "8px"
        , style "border-color" "aqua"
        , style "font-size" "medium"
        ]
        [ text label ]


viewInput : Html Msg
viewInput =
    label (menuItemAttributes "input-label")
        [ text "Scroll to first city starting with:"
        , input
            (menuItemAttributes "input"
                ++ [ onInput UserRequiredScrollingToCity
                   , style "color" "black"
                   , style "vertical-align" "baseline"
                   , style "font-size" "medium"
                   ]
            )
            []
        ]


menuItemAttributes : String -> List (Html.Attribute msg)
menuItemAttributes id =
    [ attribute "data-testid" id
    , style "padding-top" "10px"
    , style "color" "#EEEEEE"
    , style "margin" "10px"
    ]


viewItem : Item Data -> Html msg
viewItem item =
    text ("id:" ++ String.fromInt item.data.id ++ " - name: " ++ item.data.name ++ "")


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
                , arePreferencesVisible = True
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
            in
            ( { model
                | gridModel = newGridModel
              }
            , Cmd.map GridMsg gridCmd
            )

        GridMsg UserToggledAllItemSelection ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update UserToggledAllItemSelection model.gridModel
            in
            ( { model
                | gridModel = newGridModel
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

        HidePreferences ->
            let
                ( newGridModel, gridCmd ) =
                    Grid.update UserClickedPreferenceCloseButton model.gridModel
            in
            ( { model
                | gridModel = newGridModel
                , arePreferencesVisible = False
              }
            , Cmd.map GridMsg gridCmd
            )

        ResetFilters ->
            let
                message =
                    Grid.SetFilters Dict.empty

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
                    Grid.SetFilters filters

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        SetAscendingOrder ->
            let
                message =
                    Grid.SetSorting "City" Ascending

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        SetDecendingOrder ->
            let
                message =
                    Grid.SetSorting "City" Descending

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )

        UserRequiredScrollingToCity city ->
            let
                message =
                    Grid.ScrollTo (\item -> String.startsWith (String.toLower city) (String.toLower item.data.city))

                ( newGridModel, gridCmd ) =
                    Grid.update message model.gridModel
            in
            ( { model | gridModel = newGridModel }
            , Cmd.map GridMsg gridCmd
            )



{- Data generation -}


itemCount : Int
itemCount =
    20000


cities : List String
cities =
    [ "Paris", "London", "New York", "Moscow", "Roma", "Berlin", "Tokyo", "Delhi", "Shanghai", "Sao Paulo", "Mexico City", "Cairo", "Dhaka", "Mumbai", "Beijing", "", "Osaka", "Karachi", "Chongqing", "Buenos Aires", "Istanbul", "Kolkata", "Lagos", "Manila", "Tianjin", "Rio De Janeiro", "Guangzhou", "Moscow", "Lahore", "Shenzhen", "Bangalore", "Paris", "Bogota", "Chennai", "", "Lima", "Bangkok", "Seoul", "Hyderabad", "London", "Tehran", "", "New York", "Wuhan", "Ahmedabad", "Kuala Lumpur", "Riyadh", "Surat", "Santiago", "Madrid", "Pune", "Dar Es Salaam", "Toronto", "Johannesburg", "Barcelona", "St Petersburg", "Yangon", "Alexandria", "Guadalajara", "Ankara", "Melbourne", "Sydney", "Brasilia", "Nairobi", "Cape Town", "Rome", "Montreal", "Tel Aviv", "Los Angeles", "Medellin", "Jaipur", "Casablanca", "Lucknow", "Berlin", "Busan", "Athens", "Milan", "Kanpur", "Abuja", "Lisbon", "Surabaya", "Dubai", "Cali", "Manchester" ]


items : List Data
items =
    List.range 0 (itemCount - 1)
        |> List.map
            (\i ->
                { id = i
                , city = Maybe.withDefault "None" (List.Extra.getAt (modBy (List.length cities) i) cities)
                , name = "name" ++ String.fromInt i
                , value1 = (toFloat (itemCount - i) / toFloat itemCount) * 100
                , value2 = (toFloat i / toFloat itemCount) * 50
                , value3 = (toFloat (itemCount - i) / toFloat itemCount) * 25
                , value4 = (toFloat i / toFloat itemCount) * 15
                , value5 = (toFloat (itemCount - i) / toFloat itemCount) * 10
                , value6 = (toFloat i / toFloat itemCount) * 5
                }
            )



{- Init -}


init : () -> ( Model, Cmd Msg )
init _ =
    ( { gridModel = Grid.init gridConfig items
      , clickedItem = Nothing
      , arePreferencesVisible = False
      }
    , Cmd.none
    )


gridConfig : Grid.Config Data
gridConfig =
    { canSelectRows = True
    , columns = columns Dict.empty
    , containerHeight = 500
    , containerWidth = 950
    , hasFilters = True
    , headerHeight = 60
    , labels = Dict.empty
    , lineHeight = 25
    , rowClass = rowClass
    }


rowClass : Item Data -> String
rowClass item =
    let
        even =
            toFloat item.visibleIndex / 2 == toFloat (item.visibleIndex // 2)
    in
    if item.selected then
        "selected-row"

    else if even then
        "even-row"

    else
        ""



{- the definition of the columns of the grid -}


columns : Dict String String -> List (ColumnConfig Data)
columns labels =
    [ idColumn
    , nameColumn labels
    , progressColumn
    , cityColumn labels
    , value1Column
    , value1ProgressColumn
    , value2Column
    , value2ProgressColumn
    , value3Column
    , value3ProgressColumn
    , value4Column
    , value4ProgressColumn
    , value5Column
    , value5ProgressColumn
    , value6ProgressColumn
    , value6Column
    ]


idColumn =
    intColumnConfig
        { id = "Id"
        , isEditable = False
        , getter = .id
        , localize = localize
        , setter = \item _ -> item
        , title = "Id"
        , tooltip = "Une indication pour la colonne Id"
        , width = 50
        }


nameColumn =
    stringColumnConfig
        { id = "Name"
        , isEditable = True
        , getter = .name
        , localize = localize
        , setter = setName
        , title = "Nom"
        , tooltip = "Une indication pour la colonne Nom"
        , width = 100
        }


setName : Item Data -> String -> Item Data
setName item name =
    let
        oldData =
            item.data

        newData =
            { oldData | name = name }
    in
    { item | data = newData }


progressColumn =
    let
        progressColumnConfig =
            floatColumnConfig
                { id = "Progress"
                , isEditable = False
                , getter = .value1
                , localize = localize
                , setter = \item _ -> item
                , title = "Progrès"
                , tooltip = "Une indication pour la colonne Progrès"
                , width = 100
                }
    in
    { progressColumnConfig | renderer = viewProgressBar 8 .value1 }


cityColumn =
    stringColumnConfig
        { id = "City"
        , isEditable = False
        , getter = .city
        , localize = localize
        , setter = \item _ -> item
        , title = "Ville"
        , tooltip = "Une indication pour la colonne Ville"
        , width = 300
        }


value1Column =
    floatColumnConfig
        { id = "Value1"
        , isEditable = False
        , getter = .value1 >> truncateDecimals
        , localize = localize
        , setter = \item _ -> item
        , title = "Valeur 1"
        , tooltip = "Une indication pour la colonne Valeur 1"
        , width = 100
        }


value1ProgressColumn =
    let
        columnConfig =
            floatColumnConfig
                { id = "ProgressValue1"
                , isEditable = False
                , getter = .value1 >> truncateDecimals
                , localize = localize
                , setter = \item _ -> item
                , title = "Valeur 1"
                , tooltip = "Une indication pour la colonne Valeur 1"
                , width = 100
                }
    in
    { columnConfig | renderer = viewProgressBar 8 .value1 }


value2Column =
    floatColumnConfig
        { id = "Value2"
        , isEditable = False
        , getter = .value2 >> truncateDecimals
        , localize = localize
        , setter = \item _ -> item
        , title = "Valeur 2"
        , tooltip = "Une indication pour la colonne Valeur 2"
        , width = 100
        }


value2ProgressColumn =
    let
        columnConfig =
            floatColumnConfig
                { id = "ProgressValue2"
                , isEditable = False
                , getter = .value2 >> truncateDecimals
                , localize = localize
                , setter = \item _ -> item
                , title = "Valeur 2"
                , tooltip = "Une indication pour la colonne Valeur 2"
                , width = 100
                }
    in
    { columnConfig | renderer = viewProgressBar 8 .value2 }


value3Column =
    floatColumnConfig
        { id = "Value3"
        , isEditable = False
        , getter = .value3 >> truncateDecimals
        , localize = localize
        , setter = \item _ -> item
        , title = "Valeur 3"
        , tooltip = "Une indication pour la colonne Valeur 3"
        , width = 100
        }


value3ProgressColumn =
    let
        columnConfig =
            floatColumnConfig
                { id = "ProgressValue3"
                , isEditable = False
                , getter = .value3 >> truncateDecimals
                , localize = localize
                , setter = \item _ -> item
                , title = "Valeur 3"
                , tooltip = "Une indication pour la colonne Valeur 3"
                , width = 100
                }
    in
    { columnConfig | renderer = viewProgressBar 8 .value3 }


value4Column =
    floatColumnConfig
        { id = "Value4"
        , isEditable = False
        , getter = .value4 >> truncateDecimals
        , localize = localize
        , setter = \item _ -> item
        , title = "Valeur 4"
        , tooltip = "Une indication pour la colonne Valeur 4"
        , width = 100
        }


value4ProgressColumn =
    let
        columnConfig =
            floatColumnConfig
                { id = "ProgressValue4"
                , isEditable = False
                , getter = .value4 >> truncateDecimals
                , localize = localize
                , setter = \item _ -> item
                , title = "Valeur 4"
                , tooltip = "Une indication pour la colonne Valeur 4"
                , width = 100
                }
    in
    { columnConfig | renderer = viewProgressBar 8 .value4 }


value5Column =
    floatColumnConfig
        { id = "Value5"
        , isEditable = False
        , getter = .value5 >> truncateDecimals
        , localize = localize
        , setter = \item _ -> item
        , title = "Valeur 5"
        , tooltip = "Une indication pour la colonne Valeur 5"
        , width = 100
        }


value5ProgressColumn =
    let
        columnConfig =
            floatColumnConfig
                { id = "ProgressValue5"
                , isEditable = False
                , getter = .value5 >> truncateDecimals
                , localize = localize
                , setter = \item _ -> item
                , title = "Valeur 5"
                , tooltip = "Une indication pour la colonne Valeur 5"
                , width = 100
                }
    in
    { columnConfig | renderer = viewProgressBar 8 .value5 }


value6Column =
    floatColumnConfig
        { id = "Value6"
        , isEditable = False
        , getter = .value6 >> truncateDecimals
        , localize = localize
        , setter = \item _ -> item
        , title = "Valeur 6"
        , tooltip = "Une indication pour la colonne Valeur 6"
        , width = 100
        }


value6ProgressColumn =
    let
        columnConfig =
            floatColumnConfig
                { id = "ProgressValue6"
                , isEditable = False
                , getter = .value6 >> truncateDecimals
                , localize = localize
                , setter = \item _ -> item
                , title = "Valeur 6"
                , tooltip = "Une indication pour la colonne Valeur 6"
                , width = 100
                }
    in
    { columnConfig | renderer = viewProgressBar 8 .value6 }



{- A simple example of i18n -}


type alias Translations =
    Dict String String


translations : Translations
translations =
    Dict.fromList
        [ ( "Nom", "Name" )
        , ( "Progrès", "Progress" )
        , ( "Valeur 1", "Value 1" )
        , ( "Valeur 2", "Value 2" )
        , ( "Valeur 3", "Value 3" )
        , ( "Valeur 4", "Value 4" )
        , ( "Valeur 5", "Value 5" )
        , ( "Valeur 6", "Value 6" )
        , ( "Ville", "City" )
        , ( "Une indication pour la colonne Id", "A hint for Id column" )
        , ( "Une indication pour la colonne Nom", "A hint for Name column" )
        , ( "Une indication pour la colonne Valeur 1", "A hint for Value column 1" )
        , ( "Une indication pour la colonne Valeur 2", "A hint for Value column 2" )
        , ( "Une indication pour la colonne Valeur 3", "A hint for Value column 3" )
        , ( "Une indication pour la colonne Valeur 4", "A hint for Value column 4" )
        , ( "Une indication pour la colonne Valeur 5", "A hint for Value column 5" )
        , ( "Une indication pour la colonne Valeur 6", "A hint for Value column 6" )
        , ( "Une indication pour la colonne Progrès", "A hint for Progress column" )
        , ( "Une indication pour la colonne Ville", "A hint for City column" )
        ]


localize : String -> String
localize key =
    Maybe.withDefault key <| Dict.get key translations



{- an example of tranformation which can be applied ot a given column value -}


truncateDecimals : Float -> Float
truncateDecimals value =
    let
        valueAsString =
            String.fromFloat value

        pointIndex =
            String.indexes "." valueAsString
                |> List.head
                |> Maybe.withDefault (String.length valueAsString)
    in
    valueAsString
        |> String.left (pointIndex + 2)
        |> String.toFloat
        |> Maybe.withDefault 0
