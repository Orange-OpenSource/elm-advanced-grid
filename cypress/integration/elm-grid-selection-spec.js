/*  Copyright (c) 2019 Orange
This code is released under the MIT license.

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'
   const sortCitiesAscending = ['', '', 'Abuja', 'Ahmedabad']
   const sortCitiesDescending = ['Yangon', 'Wuhan', 'Toronto', 'Tokyo']

   it('should have headers', function () {
        cy.visit(url)
        cy.get('div[data-testid="header-_MultipleSelection_"]')  // TODO test checkbox presence
        cy.get('div[data-testid="header-Id"]').contains('Id')
        cy.get('div[data-testid="header-Name"]').contains('Name')
        cy.get('div[data-testid="header-Progress"]').contains('Progress')
        cy.get('div[data-testid="header-Value"]').contains('Value')
    })

    it('should display unsorted and unfiltered data in default order', function () {
        cy.visit(url)
        cy.get('div[data-testid="Id"]').each(($cell, index, $row) => {
            cy.wrap($cell).contains(index)
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

})
