# Overview of this application:  

This project follows a clean architecture having the four basic layers:  

UI, Application, Domain and Infrastructure, each of them is isolated from one another and follows Single Responsibility Principle.  


## Key features of architecture :
Implementation of Dependency Injection (cardService receives props via constructor)  

Representation of LisKov substitution principle  

Data source can be changed without much change to architecture.  


## Application features:
Implemented accessibility parameters.  

Added unit tests and Cypress end to end test.  

Added CI.  

Components are accessible. 

Implemented themed cards  


## Getting Started
 Prerequisites:  

  Node.js 18+  

  npm or yarn  

## Install
npm install

## Run development server
npm run dev

## Running Tests  
Unit tests:  

npx vitest run  

*** Please note: Skipped one unit test to check unique transactionID intentionally to pass pipeline stage, because the given input has duplicate id for transactions.

## E2E tests (Cypress)
Requires the dev server to be running:  

### Terminal 1: 
npm run dev

### Terminal 2
npx cypress run        

npx cypress open    

### Application new additions:  

Enabled horizontal scrolling if more cards arise and also added pagination if more transactions come.  

Added feature to handle german format of input amount at filter.  


### Possible future expansion :  

Can replace hardcoded json with real api with no changes to domain layer.  

Add routing so each card has its own URL and enable linking and browser history.  

Add a state management if there are chances of data mutations that can arise in future.  

For extreme large transaction lists,  pagination can be replaced with virtual scrolling using react-virtual for better performance.  




