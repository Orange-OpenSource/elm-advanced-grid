// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("setFilters", () => {
    cy.get('button[data-testid="setFiltersButton"]').click()
})

Cypress.Commands.add("resetFilters", () => {
    cy.get('button[data-testid="resetFiltersButton"]').click()
})

Cypress.Commands.add("sortCitiesAscending", () => {
    cy.get('button[data-testid="setAscendingOrderButton"]').click()
})

Cypress.Commands.add("sortCitiesDescending", () => {
    cy.get('button[data-testid="setDecendingOrderButton"]').click()
})

Cypress.Commands.add("scrollToCityStartingWith", (cityName) => {
    cy.get('div[id="eag-rows"]').scrollTo('bottom')
    cy.get('input[data-testid="scrollToInput"]')
        .clear()
        .type(`${cityName}`)
})

Cypress.Commands.add("gridShouldContainTheCity", (cityName) => {
    cy.get('div[data-testid="City"]').contains(`${cityName}`)
})

Cypress.Commands.add("gridShouldNotContainTheCity", (cityName) => {
    cy.get('div[data-testid="City"]').should('not.contain', `${cityName}`)
})

Cypress.Commands.add("numberOflinesInTheGridShouldBe", (numberOfLines) => {
    let rows = cy.get('div[data-testid="row"]')
    rows.should('have.length', `${numberOfLines}`)
})

Cypress.Commands.add("typeSuchValueInSuchFilter", (value, filterName) => {
    let filter = 'input[data-testid="filter-'+`${filterName}`+'"]'
    cy.get(filter).type(`${value}`)
})

Cypress.Commands.add("statusContains", (expectedValue) => {
    let status = cy.get('div[data-testid="clickedItem"]')
    status.contains(`${expectedValue}`)
})

Cypress.Commands.add("clickOnTheFirstRow", () => {
    let rows = cy.get('div[data-testid="row"]')
    rows.first().click()
})

Cypress.Commands.add("clickOnTheLastRow", () => {
    let rows = cy.get('div[data-testid="row"]')
    rows.last().click()
})

Cypress.Commands.add("selectInTheCityQuickFilterIndexNumber", (expectedindex) => {
    cy.get('div[data-testid="quickFilter-City"]').click()
    cy.get('div[id="openedQuickFilter"] > div').eq(`${expectedindex}`).click()
})
