// these test handle the login. Theres in total 3 unittests

describe('Login Form', () => {
    it('successfully logs in with valid credentials', () => {
      // Visit the login page
      cy.visit("http://localhost:3000")
  
      // fills in the email and password fields
      cy.get('#email').type('john@example.com')
      cy.get('#password').type('Password123')
  
      // Submit the login form
      cy.get('#form_button').click()
  
      // Assert navigation to the dashboard
      cy.url().should('include', '/dashboard')
    })
  
    it('displays error message with invalid password', () => {
      // Visit the login page
      cy.visit("http://localhost:3000")
  
      // Fill in the email and password fields with invalid credentials
      cy.get('#email').type('john@example.com')
      cy.get('#password').type('invalidpassword')
  
      // Submit the login form
      cy.get('#form_button').click()
  
      // Assert error message is displayed
      cy.contains('div', 'Invalid password').should('be.visible')
    })

    it('displays error message with invalid email', () => {
        // Visit the login page
        cy.visit("http://localhost:3000")
    
        // Fill in the email and password fields with invalid credentials
        cy.get('#email').type('john@exampleee.com')
        cy.get('#password').type('Password123')
    
        // Submit the login form
        cy.get('#form_button').click()
    
        // Assert error message is displayed
        cy.contains('div', 'User not found').should('be.visible')
      })
  })
  