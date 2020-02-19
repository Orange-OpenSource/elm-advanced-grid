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
        cy.get('div[id="_grid_"]').scrollTo('bottom')
        cy.get('input[data-testid="scrollToInput"]')
          .clear()
          .type(`${cityName}`)
})
