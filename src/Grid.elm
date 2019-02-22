module Grid exposing (ColumnConfig, Config, Model, Msg, Sorting(..), init, compareBoolField, compareFloatField, compareIntField, compareStringField, update, view, viewBool, viewColumn, viewFloat, viewInt, viewProgressBar, viewString, visibleColumns, Filter(..), stringFilter, intFilter, floatFilter, boolFilter)

import Css exposing (..)
import Html
import Html.Styled exposing (Html, div, input, span, styled, text, toUnstyled)
import Html.Styled.Attributes exposing (css, fromUnstyled, style, type_)
import Html.Styled.Events exposing (onClick, onInput)
import InfiniteList as IL
import List.Extra
import Parser exposing ((|.), (|=), Parser, chompWhile, getChompedString, keyword, oneOf, spaces, succeed, symbol)


type alias Item a =
    { a
        | selected : Bool
    }


type alias Config a =
    { columns : List (ColumnConfig a)
    , containerHeight : Int
    , containerWidth : Int
    , hasFilters : Bool
    , lineHeight : Int
    , rowStyle : Item a -> Style
    }


type Msg a
    = InfListMsg IL.Model
    | HeaderClicked (ColumnConfig a)
    | FilterModified (ColumnConfig a) String


type Sorting
    = Unsorted
    | Ascending
    | Descending


type alias ColumnConfig a =
    { properties : ColumnProperties
    , comparator : Item a -> Item a -> Order
    , filteringValue : Maybe String
    , filters : Filter a
    , renderer : ColumnProperties -> (Item a -> Html (Msg a))
    }


type alias ColumnProperties =
    { id: String
    , order : Sorting
    , title : String
    , visible : Bool
    , width : Int
    }


type alias Model a =
    { config : Config a
    , content : List (Item a)
    , infList : IL.Model
    , order : Sorting
    , sortedBy : Maybe (ColumnConfig a)
    , debug : String
    }


init : Config a -> List (Item a) -> Model a
init config items =
    { config = config
    , content = items
    , infList = IL.init
    , order = Unsorted
    , sortedBy = Nothing
    , debug = ""
    }


update : Msg a -> Model a -> ( Model a, Cmd (Msg a) )
update msg model =
    case msg of
        InfListMsg infList ->
            ( { model | infList = infList }, Cmd.none )

        HeaderClicked columnConfig ->
            let
                ( sortedContent, newOrder ) =
                    case model.order of
                        Descending ->
                            ( List.sortWith columnConfig.comparator model.content |> List.reverse, Ascending )

                        _ ->
                            ( List.sortWith columnConfig.comparator model.content, Descending )
            in
            ( { model
                | content = sortedContent
                , order = newOrder
                , sortedBy = Just columnConfig
              }
            , Cmd.none
            )

        FilterModified columnConfig string ->
            let
                newColumnconfig = { columnConfig | filteringValue = Just string }
                newColumns = List.Extra.setIf (\item -> item.properties.id == columnConfig.properties.id ) newColumnconfig model.config.columns

                oldConfig = model.config
                newConfig = { oldConfig | columns = newColumns }

            in
                ({ model | config = newConfig }, Cmd.none)


gridConfig : Model a -> IL.Config (Item a) (Msg a)
gridConfig model =
    IL.config
        { itemView = viewRow model
        , itemHeight = IL.withConstantHeight model.config.lineHeight
        , containerHeight = model.config.containerHeight
        }
        |> IL.withOffset 300


view : Model a -> Html (Msg a)
view model =
    div
        [ css
            [ width (px <| toFloat (model.config.containerWidth + cumulatedBorderWidth))
            , overflow auto
            , margin auto
            ]
        ]
    <|
        if model.config.hasFilters then
            [ div [ css
                        [ border3 (px 1) solid (hex "666") ]
                  ]
                [ viewHeaders model
                , viewFilters model
                ]
            , viewRows model
            ]

        else
            [ viewHeaders model
            , viewRows model
            ]


viewRows : Model a -> Html (Msg a)
viewRows model =
    let

        columnFilters : List (Item a -> Bool)
        columnFilters = model.config.columns
                            |> List.filterMap (\c-> parseFilteringString c.filteringValue c.filters)


        filteredItems = List.foldl (\filter remainingValues -> List.filter filter remainingValues) model.content columnFilters
    in

    div []
        [ div
            [ css
                [ height (px <| toFloat model.config.containerHeight)
                , width (px <| toFloat <| totalWidth model)
                , overflow auto
                , border3 (px 1) solid (hex "CCC")
                , margin auto
                ]
            , fromUnstyled <| IL.onScroll InfListMsg
            ]
            [ Html.Styled.fromUnstyled <| IL.view (gridConfig model) model.infList filteredItems ]
        ]


parseFilteringString : Maybe String -> Filter a -> Maybe (Item a -> Bool)
parseFilteringString  filteringValue filters =
    let
        filteringString = Maybe.withDefault "" filteringValue
    in
        case filters of
            StringFilter stringTypedFilter ->
                validateFilter filteringString stringTypedFilter

            IntFilter intTypedFilter ->
                validateFilter filteringString intTypedFilter

            FloatFilter floatTypedFilter ->
                validateFilter filteringString floatTypedFilter

            BoolFilter boolTypedFilter ->
                validateFilter filteringString boolTypedFilter


validateFilter : String -> TypedFilter a b-> Maybe (Item a -> Bool)
validateFilter  filteringString filters =
    let
        parsedEqual = Parser.run filters.equal.parser filteringString
        parsedLessThan = Parser.run filters.lessThan.parser filteringString
        parsedGreaterThan = Parser.run filters.greaterThan.parser filteringString
    in
        case parsedEqual of
            Ok equalityOperand ->
                Just (filters.equal.filter equalityOperand)
            _ ->
                case parsedLessThan of
                    Ok lessThanOperand ->
                        Just (filters.lessThan.filter lessThanOperand)
                    _ ->
                        case parsedGreaterThan of
                            Ok greaterThanOperand ->
                                Just (filters.greaterThan.filter greaterThanOperand)
                            _ -> Nothing


type Filter a
    = StringFilter (TypedFilter a String)
    | IntFilter (TypedFilter a Int)
    | FloatFilter (TypedFilter a Float)
    | BoolFilter (TypedFilter a Bool)

type alias TypedFilter a b =
     { equal : { filter : b -> Item a -> Bool
               , parser : Parser b
               }
     , lessThan : { filter : b -> Item a -> Bool
                  , parser : Parser b
                  }
     , greaterThan : { filter : b -> Item a -> Bool
                     , parser : Parser b
                     }
     }

stringFilter : (Item a -> String ) ->  TypedFilter a String
stringFilter getter =
    { equal = { filter = filterStringFieldEqualTo getter
              , parser = stringEqualityParser
              }
    , lessThan = { filter = filterStringFieldLesserThan  getter
                 , parser = lessThanStringParser
                 }
    , greaterThan = { filter = filterStringFieldGreaterThan  getter
                    , parser = greaterThanStringParser
                    }
    }

filterStringFieldEqualTo : (Item a -> String ) -> String -> Item a -> Bool
filterStringFieldEqualTo getter value item =
    String.contains value <| getter item

filterStringFieldLesserThan : (Item a -> String ) -> String -> Item a -> Bool
filterStringFieldLesserThan getter value item =
    getter item < value

filterStringFieldGreaterThan : (Item a -> String ) -> String -> Item a -> Bool
filterStringFieldGreaterThan getter value item =
    getter item > value


intFilter : (Item a -> Int ) -> TypedFilter a Int
intFilter getter =
    { equal = { filter = filterIntFieldEqualTo getter
              , parser = intEqualityParser
              }
    , lessThan = { filter = filterIntFieldLesserThan getter
                 , parser = lessThanIntParser
                 }
    , greaterThan = { filter = filterIntFieldGreaterThan getter
                    , parser = greaterThanIntParser
                    }
    }

filterIntFieldEqualTo : (Item a -> Int ) -> Int -> Item a -> Bool
filterIntFieldEqualTo getter value item =
    getter item == value

filterIntFieldLesserThan : (Item a -> Int ) -> Int -> Item a -> Bool
filterIntFieldLesserThan getter value item =
    getter item < value

filterIntFieldGreaterThan : (Item a -> Int ) -> Int -> Item a -> Bool
filterIntFieldGreaterThan getter value item =
    getter item > value


floatFilter : (Item a -> Float ) -> TypedFilter a Float
floatFilter getter =
    { equal = { filter = filterFloatFieldEqualTo getter
                , parser = floatEqualityParser
                }

    , lessThan = { filter = filterFloatFieldLesserThan getter
                , parser = lessThanFloatParser
                }
    , greaterThan = { filter = filterFloatFieldGreaterThan getter
                , parser = greaterThanFloatParser
                }
    }

filterFloatFieldEqualTo : (Item a -> Float ) -> Float -> Item a -> Bool
filterFloatFieldEqualTo getter value item =
    getter item == value

filterFloatFieldLesserThan : (Item a -> Float ) -> Float -> Item a -> Bool
filterFloatFieldLesserThan getter value item =
    getter item < value

filterFloatFieldGreaterThan : (Item a -> Float ) -> Float -> Item a -> Bool
filterFloatFieldGreaterThan getter value item =
    getter item > value


boolFilter : (Item a -> Bool ) -> TypedFilter a Bool
boolFilter getter =
    { equal = { filter  = filterBoolFieldEqualTo getter
                , parser  = boolEqualityParser
                }
    , lessThan = { filter  = filterBoolFieldLesserThan getter
                , parser  = lessThanBoolParser
                }
    , greaterThan = { filter  = filterBoolFieldGreaterThan getter 
                , parser  = greaterThanBoolParser
                }
    }

filterBoolFieldEqualTo : (Item a -> Bool ) -> Bool -> Item a -> Bool
filterBoolFieldEqualTo getter value item =
    getter item == value

filterBoolFieldLesserThan : (Item a -> Bool ) -> Bool -> Item a -> Bool
filterBoolFieldLesserThan getter value item =
    getter item && not value

filterBoolFieldGreaterThan : (Item a -> Bool ) -> Bool -> Item a -> Bool
filterBoolFieldGreaterThan getter value item =
    (not <| getter item) && value

{--
idx is the index of the visible line
listIdx is the index in the data source
--}


viewRow : Model a -> Int -> Int -> Item a -> Html.Html (Msg a)
viewRow model idx listIdx item =
    toUnstyled
        << div
            [ css
                [ model.config.rowStyle item
                , height (px <| toFloat model.config.lineHeight)
                ]
            ]
    <|
        List.map (\columnConfig -> viewColumn columnConfig item) (visibleColumns model)


totalWidth : Model a -> Int
totalWidth model =
    List.foldl (\columnConfig -> (+) columnConfig.properties.width) 0 (visibleColumns model)


viewColumn : ColumnConfig a -> Item a -> Html (Msg a)
viewColumn config item =
    config.renderer config.properties item


viewInt : (Item a -> Int) -> ColumnProperties -> Item a -> Html (Msg a)
viewInt field properties item =
    div
        (cellStyles properties)
        [ text <| String.fromInt (field item) ]


viewBool : (Item a -> Bool) -> ColumnProperties -> Item a -> Html (Msg a)
viewBool field properties item =
    div
        (cellStyles properties)
        [ input
            [ type_ "checkbox"
            , Html.Styled.Attributes.checked (field item)
            ]
            []
        ]


viewFloat : (Item a -> Float) -> ColumnProperties -> Item a -> Html (Msg a)
viewFloat field properties item =
    div
        (cellStyles properties)
        [ text <| String.fromFloat (field item) ]


viewString : (Item a -> String) -> ColumnProperties -> Item a -> Html (Msg a)
viewString field properties item =
    div
        (cellStyles properties)
        [ text <| field item ]


viewProgressBar : Int -> (Item a -> Float) -> ColumnProperties -> Item a -> Html (Msg a)
viewProgressBar barHeight field properties item =
    let
        maxWidth =
            properties.width - 8 - cumulatedBorderWidth

        actualWidth =
            (field item / toFloat 100) * toFloat maxWidth
    in
    div
        [ css
            [ display inlineBlock
            , border3 (px 1) solid (hex "CCC")
            , verticalAlign top
            , paddingLeft (px 3)
            , paddingRight (px 3)
            ]
        ]
        [ div
            [ css
                [ display inlineBlock
                , backgroundColor (hex "fff")
                , borderRadius (px 5)
                , border3 (px 1) solid (hex "CCC")
                , width (px <| toFloat maxWidth)
                ]
            ]
            [ div
                [ css
                    [ backgroundColor (hex "4d4")
                    , width (px actualWidth)
                    , height (px <| toFloat barHeight)
                    , borderRadius (px 5)
                    , overflow visible
                    ]
                ]
                []
            ]
        ]

compareIntField : (Item a -> Int) -> Item a -> Item a -> Order
compareIntField field item1 item2 =
    compare (field item1) (field item2)


compareFloatField : (Item a -> Float) -> Item a -> Item a -> Order
compareFloatField field item1 item2 =
    compare (field item1) (field item2)


compareStringField : (Item a -> String) -> Item a -> Item a -> Order
compareStringField field item1 item2 =
    compare (field item1) (field item2)


compareBoolField : (Item a -> Bool) -> Item a -> Item a -> Order
compareBoolField field item1 item2 =
    case ( field item1, field item2 ) of
        ( True, True ) ->
            EQ

        ( False, False ) ->
            EQ

        ( True, False ) ->
            GT

        ( False, True ) ->
            LT

visibleColumns : Model a -> List (ColumnConfig a)
visibleColumns model =
    List.filter (\column -> column.properties.visible) model.config.columns


viewHeaders : Model a -> Html (Msg a)
viewHeaders model =
    div
        [ css
            [ width (px <| toFloat <| totalWidth model)
            , margin auto
            , height (px <| toFloat model.config.lineHeight)
            ]
        ]
        (visibleColumns model
            |> List.map (viewHeader model)
        )


viewHeader : Model a -> ColumnConfig a -> Html (Msg a)
viewHeader model columnConfig =
    let
        sortingSymbol =
            case model.sortedBy of
                Just config ->
                    if config.properties.id == columnConfig.properties.id then
                        if model.order == Descending then
                            arrowUp

                        else
                            arrowDown

                    else
                        span [] []

                _ ->
                    span [] []
    in
    div
        [ css
            [ display inlineBlock
            , backgroundColor (hex "CCC")
            , border3 (px 1) solid (hex "666")
            , overflow hidden
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            ]
        , onClick (HeaderClicked columnConfig)
        ]
        [ text <| columnConfig.properties.title
        , sortingSymbol
        ]


arrowUp : Html (Msg a)
arrowUp =
    arrow borderBottom3


arrowDown : Html (Msg a)
arrowDown =
    arrow borderTop3


arrow horizontalBorder =
    div
        [ css
            [ width (px 0)
            , height (px 0)
            , borderLeft3 (px 5) solid transparent
            , borderRight3 (px 5) solid transparent
            , horizontalBorder (px 5) solid (hex "000")
            , display inlineBlock
            , float right
            , margin (px 5)
            ]
        ]
        []


viewFilters : Model a -> Html (Msg a)
viewFilters model =
    div [css
             [ width (px <| toFloat <| totalWidth model)
             , height (px <| toFloat model.config.lineHeight)
             , marginBottom (px 3)
             ]
        ]
        (visibleColumns model
            |> List.map (viewFilter model)
        )


viewFilter : Model a -> ColumnConfig a -> Html (Msg a)
viewFilter model columnConfig =
    div
        [ css
            [ display inlineBlock
            , backgroundColor (hex "CCC")
            , border3 (px 1) solid (hex "666")
            , width (px (toFloat <| columnConfig.properties.width - cumulatedBorderWidth))
            ]
        ]
        [ input
            [ css
                [ margin (px 3)
                , width (px (toFloat <| columnConfig.properties.width - 13))
                , height (px <| toFloat <|model.config.lineHeight - 10)

                ]
                , onInput <| FilterModified columnConfig
            ]
            []
        ]

-- Left + right cell border width, in px. Useful to take in account the borders when calculating the total grid     width
cumulatedBorderWidth : Int
cumulatedBorderWidth =
    2


cellStyles : ColumnProperties -> List (Html.Styled.Attribute (Msg a))
cellStyles properties =
    [ css
        [ display inlineBlock
        , border3 (px 1) solid (hex "CCC")
        , overflow hidden
        , width (px <| toFloat (properties.width - cumulatedBorderWidth))
        ]
    ]


stringParser : Parser String
stringParser =
    getChompedString <| chompWhile Char.isAlphaNum

stringEqualityParser : Parser String
stringEqualityParser =
        succeed identity
            |. spaces
            |. symbol "="
            |. spaces
            |= stringParser


lessThanStringParser : Parser String
lessThanStringParser =
        succeed identity
            |. spaces
            |. symbol "<"
            |. spaces
            |= stringParser

greaterThanStringParser : Parser String
greaterThanStringParser =
        succeed identity
            |. spaces
            |. symbol ">"
            |. spaces
            |= stringParser

intEqualityParser : Parser Int
intEqualityParser =
        succeed identity
            |. spaces
            |. symbol "="
            |. spaces
            |= Parser.int

lessThanIntParser : Parser Int
lessThanIntParser =
        succeed identity
            |. spaces
            |. symbol "<"
            |. spaces
            |= Parser.int

greaterThanIntParser : Parser Int
greaterThanIntParser =
        succeed identity
            |. spaces
            |. symbol ">"
            |. spaces
            |= Parser.int

floatEqualityParser : Parser Float
floatEqualityParser =
        succeed identity
            |. spaces
            |. symbol "="
            |. spaces
            |= Parser.float

lessThanFloatParser : Parser Float
lessThanFloatParser =
        succeed identity
            |. spaces
            |. symbol "<"
            |. spaces
            |= Parser.float

greaterThanFloatParser : Parser Float
greaterThanFloatParser =
        succeed identity
            |. spaces
            |. symbol ">"
            |. spaces
            |= Parser.float

boolParser : Parser Bool
boolParser =
    oneOf
    [ succeed True
        |. keyword "true"
    , succeed False
        |. keyword "false"
    ]

boolEqualityParser : Parser Bool
boolEqualityParser =
        succeed identity
            |. spaces
            |. symbol "="
            |. spaces
            |= boolParser


lessThanBoolParser : Parser Bool
lessThanBoolParser =
        succeed identity
            |. spaces
            |. symbol "<"
            |. spaces
            |= boolParser

greaterThanBoolParser : Parser Bool
greaterThanBoolParser =
        succeed identity
            |. spaces
            |. symbol ">"
            |. spaces
            |= boolParser