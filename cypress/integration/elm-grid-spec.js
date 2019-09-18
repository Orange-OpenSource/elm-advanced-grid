describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'
   const sortCitiesAscending = ['London', 'Moscow', 'New York', 'Paris']
   const sortCitiesDescending = ['Paris', 'New York', 'Moscow', 'London']

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

    it('should contain 4 rows of data when none is filtered', function () {
        cy.visit(url)
        cy.get('div[data-testid="row"]').should('have.length', 4)
    })

    it('should display unsorted and unfiltered data in default order', function () {
        cy.visit(url)
        cy.get('div[data-testid="Id"]').each(($cell, index, $row) => {
            cy.wrap($cell).contains(index)
        })
    })

    it('should filter elements containing an exact given value', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Value"]').type("25")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 1)
        cy.get('div[data-testid="Value"]').contains("25")
    })

    it('should filter elements containing at least the given string', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-City"]').type("o")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 3)
        cy.get('div[data-testid="City"]').contains("New York")
        cy.get('div[data-testid="City"]').contains("London")
        cy.get('div[data-testid="City"]').contains("Moscow")
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
        cy.get('div[data-testid="header-_MultipleSelection_"] > input').click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 4)
        selectedItems.first().contains("id:0 - name: name0")
            .next().contains("id:1 - name: name1")
            .next().contains("id:2 - name: name2")
            .next().contains("id:3 - name: name3")
    })

    it('should select all rows when clicking the multiple selection button (v2)', function () {
        cy.visit(url)
        cy.get(':nth-child(2) > [data-testid=_MultipleSelection_] > input').click()
        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 1)
        selectedItems.first().contains("id:1 - name: name1")

        cy.get('div[data-testid="header-_MultipleSelection_"] > input').click()
        selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 4)
        selectedItems.first().contains("id:0 - name: name0")
            .next().contains("id:1 - name: name1")
            .next().contains("id:2 - name: name2")
            .next().contains("id:3 - name: name3")
    })

    it('should deselect all rows when clicking 2 times the multiple selection button', function () {
        cy.visit(url)
        cy.get('div[data-testid="header-_MultipleSelection_"] > input').click().click()

        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 0)
    })

    it('should deselect all rows when clicking 2 times the multiple selection button (v2)', function () {
        cy.visit(url)
        cy.get(':nth-child(3) > [data-testid=_MultipleSelection_] > input').click()
        let selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 1)
        selectedItems.first().contains("id:2 - name: name2")

        cy.get('div[data-testid="header-_MultipleSelection_"] > input').click().click()
        selectedItems = cy.get('ul[data-testid="selectedItems"]').children()
        selectedItems.should('have.length', 0)
    })

    it('should filter elements containing at least the given string when clicking the "set filters" button', function () {
        cy.visit(url)
        cy.get('div[data-testid="buttonBar"]').children().first().click()

        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 3)
        cy.get('div[data-testid="City"]').contains("New York")
        cy.get('div[data-testid="City"]').contains("London")
        cy.get('div[data-testid="City"]').contains("Moscow")
    })

    it('should reset filters when clicking on "Reset filters" button', function () {
        cy.visit(url)
        cy.get('input[data-testid="filter-Id"]').type("<2")
        cy.get('input[data-testid="filter-Name"]').type("me")
        cy.get('input[data-testid="filter-Progress"]').type("<30")
        cy.get('input[data-testid="filter-Value"]').type("25")
        cy.get('input[data-testid="filter-City"]').type("ond")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 1)
        cy.get('div[data-testid="City"]').contains("London")

        cy.get('div[data-testid="buttonBar"]').children().first().next().click()

        rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 4)
        cy.get('div[data-testid="City"]').contains("Paris")
        cy.get('div[data-testid="City"]').contains("New York")
        cy.get('div[data-testid="City"]').contains("London")
        cy.get('div[data-testid="City"]').contains("Moscow")
    })

    it('should sort cities when clicking the "sort cities" buttons', function () {
        cy.visit(url)
        //Cities are sorted ascending
        cy.get('div[data-testid="buttonBar"]').children().first().next().next().click()
        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(4)
            expect ($citiesList.eq(0)).to.contain(`${sortCitiesAscending[0]}`)
            expect ($citiesList.eq(1)).to.contain(`${sortCitiesAscending[1]}`)
            expect ($citiesList.eq(2)).to.contain(`${sortCitiesAscending[2]}`)
            expect ($citiesList.eq(3)).to.contain(`${sortCitiesAscending[3]}`)
        })

        //Cities are sorted descending
        cy.get('div[data-testid="buttonBar"]').children().first().next().next().next().click()
        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(4)
            expect ($citiesList.eq(0)).to.contain(`${sortCitiesDescending[0]}`)
            expect ($citiesList.eq(1)).to.contain(`${sortCitiesDescending[1]}`)
            expect ($citiesList.eq(2)).to.contain(`${sortCitiesDescending[2]}`)
            expect ($citiesList.eq(3)).to.contain(`${sortCitiesDescending[3]}`)
        })
    })
})
