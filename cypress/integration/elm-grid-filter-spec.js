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

   const citiesWithARA = ['Karachi', 'Guadalajara', 'Ankara']
   const valuesGreaterThan95 = ['95.1', '96.3', '97.5', '98.7']
   const valuesLesserThan4 = ['0', '1.2', '2.4', '3.6']

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

    it('should filter elements containing the wished item when using the quick filter', function () {
        cy.visit(url)
        cy.get('div[data-testid="quickFilter-City"]').click()
        cy.get('div[id="openedQuickFilter"] > div').eq(11).click()
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 1)
        cy.get('div[data-testid="row"]').click()

        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = id:31 - name: name31")
        cy.resetFilters()
        rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 45)
    })

    it('should filter elements containing empty value when using the quick filter', function () {
        cy.visit(url)
        cy.get('div[data-testid="quickFilter-City"]').click()
        cy.get('div[id="openedQuickFilter"] > div').eq(0).click()
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 2)
        cy.get('input[data-testid="allItemSelection"]').click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 2)
        selectedItems.first().contains("id:33 - name: name33")
            .next().contains("id:40 - name: name40")
        cy.resetFilters()
        rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 45)
    })

    it('should be allowed to edit a label in City column', function () {
        cy.visit(url)
        cy.get(':nth-child(7) > [data-testid="City"]')
          .dblclick()
          .type('{backspace}')
          .type('{backspace}')
          .type('{backspace}')
          .type('{backspace}')
          .type('{backspace}')
          .type('Saint Christophe de Valains')
        cy.get('input[id="cell-editor"]')
          .type('{enter}')

        cy.get('input[data-testid="filter-City"]').type("valains")
        cy.get('div[data-testid="City"]').should('contain', 'Saint Christophe de Valains')
    })

})
