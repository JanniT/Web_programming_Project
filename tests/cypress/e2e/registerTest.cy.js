// A test to fill in the registration fields successfully. The picture is not mandatory and it is not added in this 
// This test can be ran once as when running this again it will end up in a error as the username (and email) is in use

describe('Registration Form', () => {
  it('fails submission of the registration form', () => {
    cy.visit("http://localhost:3000/register")

    // Fill in the form fields
    cy.get('#firstName').type('John')
    cy.get('#surName').type('Doe')
    cy.get('#username').type('johndoe')
    cy.get('#email').type('john')
    cy.get('#password').type('Password123')
    cy.get('#age').type('25')

    // Submit the form
    cy.get('#form_button').click()

    // Assert success message or navigation to dashboard
    cy.contains('.error-message', 'Invalid email', { timeout: 10000 }).should('be.visible')
    cy.url().should('include', '/register')
  })

  it('successfully submits the registration form', () => {
    cy.visit("http://localhost:3000/register")

    cy.get('#firstName').type('John')
    cy.get('#surName').type('Doe')
    cy.get('#username').type('johndoe')
    cy.get('#email').type('john@example.com')
    cy.get('#password').type('Password123')
    cy.get('#age').type('25')

    cy.get('#form_button').click()

    cy.contains('.success-message', 'Registration successful', { timeout: 10000 }).should('be.visible')
    cy.url().should('include', '/')
  })

  it('fails the registration form with already used username', () => {
    cy.visit("http://localhost:3000/register")

    cy.get('#firstName').type('John')
    cy.get('#surName').type('Doe')
    cy.get('#username').type('johndoe')
    cy.get('#email').type('John@doe.com')
    cy.get('#password').type('Password123')
    cy.get('#age').type('25')

    cy.get('#form_button').click()

    cy.contains('.error-message', 'Username already in use', { timeout: 1000 }).should('be.visible')
  cy.url().should('include', '/register')
  })
})