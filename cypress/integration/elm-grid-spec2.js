describe('elm grid example 2', function () {

   const url = 'http://127.0.0.1:9999'
   const sortCitiesAscending = ['London', 'Moscow', 'New York', 'Paris']
   const sortCitiesDescending = ['Paris', 'New York', 'Moscow', 'London']

//    it('should drag and drop columns', function () {
//        cy.visit(url)
//        cy.get('div[data-testid="header-Name"] > div').children().first()
//          .invoke('show')
//          .trigger('mousedown', {which: 1, force: true})
//          .trigger('mousemove', {which: 1, clientX: 400, clientY: 0, force: true})
//          .trigger('mouseup', {force: true})
//
//        let rows = cy.get('div[data-testid="row"]')
//        rows.should('have.length', 3)
//    })
//
//    it('should drag and drop columns', function () {
//        cy.visit(url)
//        cy.get('div[data-testid="header-Name"] > div').children().first()
//          .trigger('dragstart', {which: 1, force: true})
//
//         cy.get('div[data-testid="header-Value"]')
//           .trigger('drop', {which: 1, force: true})
//       let rows = cy.get('div[data-testid="row"]')
//        rows.should('have.length', 3)
//      })

    it('should sort cities when clicking the "sort cities" buttons', function () {
        cy.visit(url)
        //Cities are sorted ascending
        cy.get('div[data-testid="buttonBar"]').children().first().next().next().click()

        let citiesList = cy.get('div[data-testid="City"]')
        citiesList.should('have.length', 4)
        for (let i=0; i<4; i++){
          expect (citiesList[`${i}`]).to.contain(`${sortCitiesAscending[`${i}`]}`)
        }
//        cy.get('div[data-testid="City"]').then (function($citiesList){
//            expect($citiesList).to.have.length(4)
//            for (let i=0; i<4; i++){
//              expect ($citiesList.eq(`${i}`)).to.contain(`${sortCitiesAscending[`${i}`]}`)
//            }
//        })

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
