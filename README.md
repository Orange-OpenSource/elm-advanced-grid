# Elm Advanced Grid

This library displays a dynamically configurable grid of data.

![](https://raw.githubusercontent.com/Orange-OpenSource/elm-advanced-grid/1.0.1/docs/screenshot.png)

It offers in-place filtering and  sorting, multiple selection, click event listener and
customizable rendering of the rows and cells.
Columns can be resized using the mouse. They can also be reordered by drag and drop.
Values in a column may be selected by a quick filter popup, displayed when clicking the funnel icon.  
 
The data can count more than 20,000 lines, with a limited performance impact, thanks to the use of [FabienHenon/elm-infinite-list-view](https://package.elm-lang.org/packages/FabienHenon/elm-infinite-list-view/latest/) under the hood.

[Demos](https://orange-opensource.github.io/elm-advanced-grid/) are available.
 
See the src/Examples directory content for the source code of the examples.

## Changelog

v2.0

* Model is private now
* add quick filters
* translation of labels

## TODO

* Translate the "preference" word

 