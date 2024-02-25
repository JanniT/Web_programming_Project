# Web programming Project

This is a project work for a web programming -course of my studies. It's a chat application related to for example Tinder. The frontend is built with React, and the backend is developed using Node.js with the Express framework.

I have a repository for this courses' exercises, which can be found via this [link](https://github.com/JanniT/Web_Programming_Course)

## Prerequisites
- node v18.18.2 and npm 
- mongodb server v.7.0.2 on port ```mongodb://localhost:27017```

## Installation
- Clone this repository
- Open 2x terminals (git bash)
- Navigate on the first to /client and on the second to /server
- Run ```$ npm install``` to download dependencies

## How to run the app
Run ```$ npm start``` in the server folder, to run the backend. This should connect to port ```http://localhost:5000/```

Run ```$ npm start``` in the client folder, to run the front-end. This should connect to port ```http://localhost:3000/```

Open the [http://localhost:3000/](http://localhost:3000/) in your web browser to access the application

## How to run the tests

- Go to the /tests/cypress folder where the Cypress tests are located
- Run ```$ npm install``` to download dependencies
- Run ```$ npx cypress open```
- Then click the E2E testing
- Choose the browser you wish (Chrome works for sure)
- Then choose the tests you want to run

To make the runs as intented run the tests in this order:
- registerTest.cy.js
- loginTest.cy.js
- dashboardTest.cy.js
- profileTest.cy.js

Make sure that there is no users (users with same data) created to the app before running the tests to make them work like intented. The tests are really simple unit tests and they test the basic functionality of the page. Therefore there isn't that much of commenting as they're quite self explanatory. 
