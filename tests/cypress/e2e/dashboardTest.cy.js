// here's tests for the dashboard

describe('Dashboard Swiping', () => {
    beforeEach(() => {
        // Log in a user before each test
        cy.visit('http://localhost:3000') 
        cy.get('#email').type('john@example.com') 
        cy.get('#password').type('Password123') 
        cy.get('#form_button').click() 
    })

    it('allows clicking a username and opening the user profile page', () => {
        cy.get('.username').click()
        
        cy.url().should('include', '/profile/') 
        cy.contains('.button_nav', 'Back').should('be.visible')
    })

    it('allows navigating back from the user profile page', () => {
        cy.get('.username').click()
        
        cy.url().should('include', '/profile/') 
        cy.contains('.button_nav', 'Back').should('be.visible')
        
        cy.go('back')
        
        cy.url().should('include', '/dashboard') 
        cy.contains('Dashboard').should('be.visible') 
    })

    it('allows opening and closing the hamburger menu', () => {
        cy.get('.button_nav').click()
        
        cy.get('.dropdown-menu').should('be.visible')

        cy.contains('.dropdown-menu button', 'Profile').should('be.visible').click()

        cy.get('.dropdown-menu').should('not.exist')

        cy.get('.button_nav').click()
        
        cy.get('.dropdown-menu').should('be.visible')

        cy.contains('.dropdown-menu button', 'Chat').should('be.visible').click()

        cy.get('.dropdown-menu').should('not.exist')

        cy.get('.button_nav').click()
        
        cy.get('.dropdown-menu').should('be.visible')

        cy.contains('.dropdown-menu button', 'Settings').should('be.visible').click()
        
        cy.get('.dropdown-menu').should('not.exist')
    })
})
