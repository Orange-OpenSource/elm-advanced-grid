/*  Copyright (c) 2019 Orange
This code is released under the MIT license.

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'

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
