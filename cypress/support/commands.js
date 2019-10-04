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
    cy.get('div[data-testid="buttonBar"]').children().first().click()
})

Cypress.Commands.add("resetFilters", () => {
    cy.get('div[data-testid="buttonBar"]').children().first().next().click()
})

Cypress.Commands.add("sortCitiesAscending", () => {
    cy.get('div[data-testid="buttonBar"]').children().first().next().next().click()
})

Cypress.Commands.add("sortCitiesDescending", () => {
    cy.get('div[data-testid="buttonBar"]').children().first().next().next().next().click()
})

Cypress.Commands.add("scrollToCityStartingWith", (cityName) => {
        cy.scrollTo('bottom')
        cy.get('div[data-testid="InputBar"] > label > input')
          .clear()
          .type(`${cityName}`)
})
