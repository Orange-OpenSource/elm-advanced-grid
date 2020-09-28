{- Copyright (c) 2019 Orange
   This code is released under the MIT license.

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}


module Examples.Basic exposing (main)

import Browser
import Dict exposing (Dict)
import Grid exposing (ColumnConfig, Msg(..), Sorting(..), floatColumnConfig, intColumnConfig, selectedAndVisibleItems, stringColumnConfig, viewProgressBar)
import Grid.Item exposing (Item)
import Html exposing (Html, button, div, input, label, li, text, ul)
import Html.Attributes exposing (attribute, id, style)
import Html.Events exposing (onClick, onInput)
import Html.Styled.Attributes exposing (class)
import List.Extra


type alias Data =
    { id : Int
    , city : String
    , name : String
    , value : Float
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
        [ id "grid-container"
        , style "background-color" "white"
        , style "margin-left" "auto"
        , style "margin-right" "auto"
        , style "color" "#555555"
        , style "width" "691px"
        ]
        [ Html.map GridMsg <| Grid.view model.gridModel ]


viewMenu : Model -> Html Msg
viewMenu model =
    div
        [ style "display" "flex"
        , style "flex-direction" "column"
        ]
        [ if model.arePreferencesVisible then
            viewButton "Hide Preferences" "hidePreferencesButton" HidePreferences

          else
            viewButton "Show Preferences" "showPreferencesButton" DisplayPreferences
        , viewButton "Set Filters" "setFiltersButton" SetFilters
        , viewButton "Reset Filters" "resetFiltersButton" ResetFilters
        , viewButton "Sort cities ascending" "setAscendingOrderButton" SetAscendingOrder
        , viewButton "Sort cities descending" "setDecendingOrderButton" SetDecendingOrder
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


viewButton : String -> String -> Msg -> Html Msg
viewButton label testId msg =
    button
        [ attribute "data-testid" testId
        , onClick msg
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
                ++ [ attribute "data-testid" "scrollToInput"
                   , onInput UserRequiredScrollingToCity
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


itemCount : Int
itemCount =
    List.length cities


cities : List String
cities =
    [ "Paris", "London", "New York", "Moscow", "Roma", "Berlin", "Tokyo", "Delhi", "Shanghai", "Sao Paulo", "Mexico City", "Cairo", "Dhaka", "Mumbai", "Beijing", "Osaka", "Karachi", "Chongqing", "Buenos Aires", "Istanbul", "Kolkata", "Lagos", "Manila", "Tianjin", "Rio De Janeiro", "Guangzhou", "Moscow", "Lahore", "Shenzhen", "Bangalore", "Paris", "Bogota", "Chennai", "", "Lima", "Bangkok", "Seoul", "Hyderabad", "London", "Tehran", "", "New York", "Wuhan", "Ahmedabad", "Kuala Lumpur", "Riyadh", "Surat", "Santiago", "Madrid", "Pune", "Dar Es Salaam", "Toronto", "Johannesburg", "Barcelona", "St Petersburg", "Yangon", "Alexandria", "Guadalajara", "Ankara", "Melbourne", "Sydney", "Brasilia", "Nairobi", "Cape Town", "Rome", "Montreal", "Tel Aviv", "Los Angeles", "Medellin", "Jaipur", "Casablanca", "Lucknow", "Berlin", "Busan", "Athens", "Milan", "Kanpur", "Abuja", "Lisbon", "Surabaya", "Dubai", "Cali", "Manchester" ]


items : List Data
items =
    List.range 0 (itemCount - 1)
        |> List.map
            (\i ->
                { id = i
                , city = Maybe.withDefault "None" (List.Extra.getAt (modBy (List.length cities) i) cities)
                , name = "name" ++ String.fromInt i
                , value = (toFloat i / toFloat itemCount) * 100
                }
            )


init : () -> ( Model, Cmd Msg )
init _ =
    let
        ( initialGridModel, gridCmd ) =
            Grid.init gridConfig items
    in
    ( { gridModel = initialGridModel
      , clickedItem = Nothing
      , arePreferencesVisible = False
      }
    , Cmd.map GridMsg gridCmd
    )


gridConfig : Grid.Config Data
gridConfig =
    { canSelectRows = True
    , columns = columns columnLabels
    , containerId = "grid-container"
    , hasFilters = True
    , footerHeight = 240 -- defines the distance from the bottom of the window
    , headerHeight = 60
    , labels = translations -- use default texts, which are in English; you could use "translations", which is provided below as an example
    , lineHeight = 25
    , rowAttributes =
        \item ->
            [ class (rowClass item)
            , Html.Styled.Attributes.attribute "data-testid" "row"
            ]
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



{- the definition of the columns of the grid
   the string columns require a dictionary of translations.
   Here, as an example, the texts are defined in french by default and an english translation is provided
-}


columns : Dict String String -> List (ColumnConfig Data)
columns labels =
    [ intColumnConfig
        { id = "Id"
        , getter = .id
        , setter = \item _ -> item
        , localize = localize
        , title = "Id"
        , tooltip = "Une indication pour la colonne Id"
        , width = 50
        }
        labels
    , stringColumnConfig
        { id = "Name"
        , editor = Nothing
        , getter = .name
        , setter = \item _ -> item
        , localize = localize
        , title = "Nom"
        , tooltip = "Une indication pour la colonne Nom"
        , width = 100
        }
        labels
    , let
        progressColumnConfig =
            floatColumnConfig
                { id = "Progress"
                , getter = .value
                , setter = \item _ -> item
                , localize = localize
                , title = "Progrès"
                , tooltip = "Une indication pour la colonne Progrès"
                , width = 100
                }
                labels
      in
      { progressColumnConfig | renderer = viewProgressBar 8 .value }
    , floatColumnConfig
        { id = "Value"
        , getter = .value >> truncateDecimals
        , setter = \item _ -> item
        , localize = localize
        , title = "Valeur"
        , tooltip = "Une indication pour la colonne Valeur"
        , width = 100
        }
        labels
    , stringColumnConfig
        { id = "City"
        , editor = Just { fromString = setCity, maxLength = 32 }
        , getter = .city
        , setter = setCity
        , localize = localize
        , title = "Ville"
        , tooltip = "Une indication pour la colonne Ville"
        , width = 300
        }
        labels
    ]


setCity : Item Data -> String -> Item Data
setCity item city =
    let
        oldData =
            item.data

        newData =
            { oldData | city = city }
    in
    { item | data = newData }



{- A simple example of i18n -}


type alias Translations =
    Dict String String


{-| In order to show how to provide a translation for the title and tooltip of the columns,
they are defined in French in this example (in "columns"), and below are provided translation from French to English
in order to the example to be displayed in English.

You may want to provide a translation, or just an empty Dict if your app is to be displayed in a unique language.

-}
translations : Translations
translations =
    Dict.fromList
        [ ( "Nom", "Name" )
        , ( "Progrès", "Progress" )
        , ( "Valeur", "Value" )
        , ( "Ville", "City" )
        , ( "Une indication pour la colonne Id", "A hint for Id column" )
        , ( "Une indication pour la colonne Nom", "A hint for Name column" )
        , ( "Une indication pour la colonne Valeur", "A hint for Value column" )
        , ( "Une indication pour la colonne Progrès", "A hint for Progress column" )
        , ( "Une indication pour la colonne Ville", "A hint for City column" )
        ]


{-| Translation of grid default texts
Default texts are in english
To display the UI in another language, you have to provide a translation for all keys
defined in Grid.Labels.keys, like:

        Dict.fromList
            [
                  (Grid.Labels.cancel, "Annuler")
                , (Grid.Labels.clear, "Effacer")
                , (Grid.Labels.empty, "Vide")
                , (Grid.Labels.openQuickFilter, "Afficher le filtre rapide")
                , (Grid.Labels.or, "ou")
                , (Grid.Labels.submit, "Valider")
            ]

See Grid.labels for more information about the usage of these labels

In this example, we will provide an empty dictionary in order to display all labels in Englsih

-}
columnLabels : Dict String String
columnLabels =
    Dict.empty


{-| Returns the translation for a given key
-}
localize : String -> String
localize key =
    Maybe.withDefault key <| Dict.get key translations


{-| An example of tranformation which can be applied to a given column value
-}
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
