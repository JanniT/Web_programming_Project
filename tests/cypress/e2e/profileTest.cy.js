// These tests are for testing the users profile editing

describe('Profile Editing', () => {
    beforeEach(() => {
        // Log in a user before each test
        cy.visit('http://localhost:3000') 
        cy.get('#email').type('john@example.com') 
        cy.get('#password').type('Password123') 
        cy.get('#form_button').click() 

        // Route to the profile page
        cy.get('.button_nav').click()
        cy.get('.dropdown-menu').should('be.visible')
        cy.contains('.dropdown-menu button', 'Profile').should('be.visible').click()
    })

    it('allows canceling the editing process', () => {
        cy.contains('.edit_button', 'Edit Bio').click()
        cy.get('.bio_text').type('This is a test bio')
        cy.contains('.cancel_button', 'Cancel').click()
        cy.contains('p', 'This is a test bio').should('not.exist')
        cy.contains('.edit_button', 'Edit Bio').should('be.visible')
    })

    it('allows adding text to the bio and saving it', () => {
        cy.contains('.edit_button', 'Edit Bio').click()
        cy.get('.bio_text').type('This is a test bio')
        cy.contains('p', 'Characters Left: 982').should('be.visible')
        cy.contains('.edit_button', 'Save').click()
        cy.contains('p', 'This is a test bio').should('be.visible')
    })
})
