describe('elm grid example', function () {

   const url = 'http://127.0.0.1:9999'
   const defaultOrderCities = ['Paris', 'London', 'New York', 'Moscow']
   const setFilterCityList = ['London', 'New York', 'Moscow', 'Roma', 'Tokyo']
   const sortCitiesAscending = ['Abuja', 'Ahmedabad', 'Alexandria', 'Ankara']
   const sortCitiesDescending = ['Yangon', 'Wuhan', 'Toronto', 'Tokyo']
   const citiesWithARA = ['Karachi', 'Guadalajara', 'Ankara']
   const valuesGreaterThan95 = ['95.18072289156626', '96.3855421686747', '97.59036144578313', '98.79518072289156']
   const valuesLesserThan4 = ['0', '1.2048192771084338', '2.4096385542168677', '3.614457831325301']

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

    it('should contain 56 rows of data when none is filtered', function () {
        cy.visit(url)
        cy.get('div[data-testid="row"]').should('have.length', 56)
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

    it('should display data sorted by id when clicking the id header', function () {
        cy.visit(url)
        cy.get('[data-testid=header-Id]').click().click()

        cy.get('div[data-testid="Name"]').each(($cell, index, $row) => {
            cy.wrap($cell).contains(82-index)
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
        selectedItems.should('have.length', 83)
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
        selectedItems.should('have.length', 83)
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
        cy.get('input[data-testid="filter-Value"]').type("66")
        cy.get('input[data-testid="filter-City"]').type("sa")
        let rows = cy.get('div[data-testid="row"]')
        rows.should('have.length', 1)
        cy.get('div[data-testid="City"]').contains("Osaka")

        cy.resetFilters()

        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(56)
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
            expect($citiesList).to.have.length(56)
            for (let i=0; i<4; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${sortCitiesAscending[`${i}`]}`)
            }
        })

        cy.sortCitiesDescending()
        cy.get('div[data-testid="City"]').then (function($citiesList){
            expect($citiesList).to.have.length(56)
            for (let i=0; i<4; i++){
              expect ($citiesList.eq(`${i}`)).to.contain(`${sortCitiesDescending[`${i}`]}`)
            }
        })
    })

    it('should set preferences when clicking the "Show preferences" button', function () {
        cy.visit(url)
        cy.get('div[data-testid="Preferences"] > button').click()
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

    it('should display the last line when using the "scroll to item number" field', function () {
        cy.visit(url)
        cy.scrollToItemNumber(60)

        let lastRow = cy.get('div[data-testid="row"]').last().click()

        let status = cy.get('div[data-testid="clickedItem"]')
        status.contains("Clicked Item = id:82 - name: name82")
    })

})
