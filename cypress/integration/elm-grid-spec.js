describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'

   it('should have headers', function () {
        cy.visit(url)
        cy.get('div[data-testid="header-MultipleSelection"]').contains('Select')
        cy.get('div[data-testid="header-Id"]').contains('Id')
        cy.get('div[data-testid="header-Name"]').contains('Name')
        cy.get('div[data-testid="header-Progress"]').contains('Progress')
        cy.get('div[data-testid="header-Value"]').contains('Value')
    })

    it('should have filters', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-MultipleSelection"]')
        cy.get('input[data-testid="filter-Id"]')
        cy.get('input[data-testid="filter-Name"]')
        cy.get('input[data-testid="filter-Progress"]')
        cy.get('input[data-testid="filter-Value"]')
    })

    it('should 4 rows of data when none is filtered', function () {
        cy.visit(url)
        cy.get('div[data-testid="row"]').should('have.length', 4)
    })

    it('should display unsorted and unfiltered data in default order', function () {
        cy.visit(url)
        cy.get('div[data-testid="Id"]').each(($cell, index, $row) => {
            cy.wrap($cell).contains(index)
        })
    })

    it('should filter elements containing a given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Value"]').type("=25")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 1)
        cy.get('div[data-testid="Value"]').contains("25")
    })

    it('should filter elements greater than a given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Value"]').type(">25")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 2)
        cy.get('div[data-testid="Value"]').contains("50")
        cy.get('div[data-testid="Value"]').contains("75")
    })

    it('should filter elements lesser than a given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Value"]').type("<50")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 2)
        cy.get('div[data-testid="Value"]').contains("0")
        cy.get('div[data-testid="Value"]').contains("25")
    })

    it('should detect click on first line', function () {
        cy.visit(url)
        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = None")

        let firstRow = cy.get('div[data-testid="row"]').first().click()

        status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = id:0 - name: name0")
    })

    it('should detect click on last line', function () {
        cy.visit(url)
        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = None")

        let firstRow = cy.get('div[data-testid="row"]').last().click()

        status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = id:3 - name: name3")
    })

    it('should display data sorted by id when clicking the id header', function () {
        cy.visit(url)
        cy.get('[data-testid=header-Name]').click().click()

        cy.get('div[data-testid="Name"]').each(($cell, index, $row) => {
            cy.wrap($cell).contains(3-index)
        })
    })

    it('should select items when checkboxes are selected', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=MultipleSelection] > input').click()
        cy.get(':nth-child(3) > [data-testid=MultipleSelection] > input').click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 2)
        selectedItems.first().contains("id:1 - name: name1")
            .next().contains("id:2 - name: name2")
    })

})
