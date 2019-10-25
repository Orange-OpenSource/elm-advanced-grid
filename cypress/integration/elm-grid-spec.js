/*  Copyright (c) 2019 Orange
This code is released under the MIT license.

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'
   const defaultOrderCities = ['Paris', 'London', 'New York', 'Moscow']
   const setFilterCityList = ['London', 'New York', 'Moscow', 'Roma', 'Tokyo']
   const sortCitiesAscending = ['Abuja', 'Ahmedabad', 'Alexandria', 'Ankara']
   const sortCitiesDescending = ['Yangon', 'Wuhan', 'Toronto', 'Tokyo']
   const citiesWithARA = ['Karachi', 'Guadalajara', 'Ankara']
   const valuesGreaterThan95 = ['95.1', '96.3', '97.5', '98.7']
   const valuesLesserThan4 = ['0', '1.2', '2.4', '3.6']

   it('should have headers', function () {
        cy.visit(url)
        cy.get('div[data-testid="header-_MultipleSelection_"]')  // TODO test checkbox presence
        cy.get('div[data-testid="header-Id"]').contains('Id')
        cy.get('div[data-testid="header-Name"]').contains('Name')
        cy.get('div[data-testid="header-Progress"]').contains('Progress')
        cy.get('div[data-testid="header-Value"]').contains('Value')
    })

    it('should have filters', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Id"]')
        cy.get('input[data-testid="filter-Name"]')
        cy.get('input[data-testid="filter-Progress"]')
        cy.get('input[data-testid="filter-Value"]')
    })

    it('should contain 45 rows of data when none is filtered', function () {
        cy.visit(url)
        cy.get('div[data-testid="row"]').should('have.length', 45)
    })

    it('should display unsorted and unfiltered data in default order', function () {
        cy.visit(url)
        cy.get('div[data-testid="Id"]').each(($cell, index, $row) => {
            cy.wrap($cell).contains(index)
        })
    })

    it('should filter elements containing an exact given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-City"]').type("=paris")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 2)
        cy.get('div[data-testid="City"]').contains("Paris")
    })

    it('should filter elements containing at least the given string', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-City"]').type("ara")
        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(3)
            for (let i=0; i<3; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${citiesWithARA[`${i}`]}`)
            }
        })
    })

    it('should filter elements greater than a given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Value"]').type(">95")
        cy.get('div[data-testid="Value"]').then (function($valuesList){
            expect($valuesList).to.have.length(4)
            for (let i=0; i<3; i++){
              expect ($valuesList.eq(`${i}`)).to.contain(`${valuesGreaterThan95[`${i}`]}`)
            }
        })
    })

    it('should filter elements lesser than a given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Value"]').type("<4")
        cy.get('div[data-testid="Value"]').then (function($valuesList){
            expect($valuesList).to.have.length(4)
            for (let i=0; i<3; i++){
              expect ($valuesList.eq(`${i}`)).to.contain(`${valuesLesserThan4[`${i}`]}`)
            }
        })
    })

    it('should detect click on first line', function () {
        cy.visit(url)
        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = None")

        let firstRow = cy.get('div[data-testid="row"]').first().click()

        status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = id:0 - name: name0")
    })

    it('should select items when checkboxes are selected', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=_MultipleSelection_] > input').click()
        cy.get(':nth-child(3) > [data-testid=_MultipleSelection_] > input').click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 2)
        selectedItems.first().contains("id:1 - name: name1")
            .next().contains("id:2 - name: name2")
    })

    it('should not detect click when checkboxes are selected', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=_MultipleSelection_] > input').click()

        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = None.")
    })

    it('should select all rows when clicking the multiple selection button', function () {
         cy.visit(url)
         cy.get('input[data-testid="allItemSelection"]').click()

         cy.get('ul[data-testid="selectedItems"]').children().then (function($itemList){
            expect($itemList).to.have.length(83)
            for (let i=0; i<83; i++){
              expect ($itemList.eq(`${i}`)).to.contain("id:"+`${i}`+" - name: name"+`${i}`)
            }
        })
    })

    it('should select all rows when clicking the multiple selection button even if a line has already been selected', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=_MultipleSelection_] > input').click()
        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 1)
        selectedItems.first().contains("id:1 - name: name1")

        cy.get('input[data-testid="allItemSelection"]').click()
         cy.get('ul[data-testid="selectedItems"]').children().then (function($itemList){
            expect($itemList).to.have.length(83)
            for (let i=0; i<83; i++){
              expect ($itemList.eq(`${i}`)).to.contain("id:"+`${i}`+" - name: name"+`${i}`)
            }
        })
    })

    it('should deselect all rows when clicking 2 times the multiple selection button', function () {
        cy.visit(url)
        cy.get('input[data-testid="allItemSelection"]').click().click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 0)
    })

    it('should deselect all rows when clicking 2 times the multiple selection button even if a line has already been selected', function () {
        cy.visit(url)
        cy.get(':nth-child(3) > [data-testid=_MultipleSelection_] > input').click()
        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 1)
        selectedItems.first().contains("id:2 - name: name2")

        cy.get('input[data-testid="allItemSelection"]').click().click()
        selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 0)
    })

    it('should filter elements containing at least the given string when clicking the "set filters" button', function () {
        cy.visit(url)
        cy.setFilters()

        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(36)
            for (let i=0; i<5; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${setFilterCityList[`${i}`]}`)
            }
        })
    })

    it('should reset filters when clicking on "Reset filters" button', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Id"]').type("<25")
        cy.get('input[data-testid="filter-Name"]').type("me1")
        cy.get('input[data-testid="filter-Progress"]').type(">15")
        cy.get('input[data-testid="filter-Value"]').type("8")
        cy.get('input[data-testid="filter-City"]').type("sa")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 1)
        cy.get('div[data-testid="City"]').contains("Osaka")

        cy.resetFilters()

        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(45)
            for (let i=0; i<4; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${defaultOrderCities[`${i}`]}`)
            }
        })
    })

   it('should filter elements containing exactly the given string', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-City"]').type("=ondon")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 0)
        cy.get('input[data-testid="filter-City"]').clear()

        cy.get('input[data-testid="filter-City"]').type("=london")
        rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 2)
        cy.get('input[data-testid="filter-City"]').clear()

        cy.get('input[data-testid="filter-City"]').type("=London")
        rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 2)
        cy.get('div[data-testid="City"]').contains("London")
    })

    it('should sort cities when clicking the "sort cities" buttons', function () {
        cy.visit(url)
        cy.sortCitiesAscending()
        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(45)
            for (let i=0; i<4; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${sortCitiesAscending[`${i}`]}`)
            }
        })

        cy.sortCitiesDescending()
        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(45)
            for (let i=0; i<4; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${sortCitiesDescending[`${i}`]}`)
            }
        })
    })

    it('should set preferences when clicking the "Show preferences" button', function () {
        cy.visit(url)
        cy.get('button[data-testid="showPreferencesButton"]').click()
          .get('input[id="Id"]').click()
          .get('input[id="Progress"]').click()
          .get('input[id="City"]').click()
          .get('input[id="Id"]').parent().prev().click()

        cy.get('div[data-testid="header-Name"]').should('be.visible')
        cy.get('div[data-testid="header-Value"]').should('be.visible')

        cy.get('body>div>div>div>div>div').each(($cell, index, $list) => {
            cy.wrap($cell).should('not.have.attr', 'data-testid', 'header-Id')
            cy.wrap($cell).should('not.contain', 'Progress')
            cy.wrap($cell).should('not.contain', 'City')
        })
   })

    it('should display the wished city when using the "scroll to first city starting with" field', function () {
        cy.visit(url)
        let rows = cy.get('div[data-testid="row"]')
        rows.should('not.contain', 'Brasilia')
            .should('not.contain', 'Manchester')

        cy.scrollToCityStartingWith('br')
        rows = cy.get('div[data-testid="row"]')
        rows.should('contain', 'Brasilia')

        cy.scrollToCityStartingWith('manch')
        rows = cy.get('div[data-testid="row"]')
        rows.should('contain', 'Manchester')
        rows.last().click()
        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = id:82 - name: name82")
    })

})
