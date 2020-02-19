/*  Copyright (c) 2019 Orange
This code is released under the MIT license.

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'

    it('should select items when unselected checkboxes are toggled', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=_MultipleSelection_] > input').click()
        cy.get(':nth-child(3) > [data-testid=_MultipleSelection_] > input').click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 2)
        selectedItems.first().contains("id:1 - name: name1")
            .next().contains("id:2 - name: name2")
    })

    it('should not detect a line click when the user toggles a checkbox', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=_MultipleSelection_] > input').click()

        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = None.")
    })

    it('should select all rows when clicking the multiple selection checkbox', function () {
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

    it('should verify that if a row is hidden and I check another one, the last one is really checked', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Id"]').type(">0")

        cy.get(':nth-child(5) > [data-testid=_MultipleSelection_] > input').click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 1)
        selectedItems.first().contains("id:5 - name: name5")
   })

})
