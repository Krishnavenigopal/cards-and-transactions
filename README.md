# Overview of this application:
This project follows a clean architecture having the four basic layers:
UI, Application, Domain and Infrastructure, each of them is isolated from one another and follows Single Responsibility Principle.

## Key features of arcitecture :
Implementation of Dependency Injection (cardService receives props via constructor)
Representattionn of LisKov substitution principle
Data source can be changed without much change to architecture.

## Application features:
Implemented accessibility parameters.
Added unit tests and Cypress end to end test.
Added CI.
Components are accessible
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
npx vitest run

## E2E tests (Cypress)
Requires the dev server to be running:
### Terminal 1: 
npm run dev

### Terminal 2
npx cypress run       # headless
npx cypress open      # interactive browser UI

### Application new additions:
Enabled horizontal scrolling if more cards arise and also added pagination if more transactions come.
Added feature to handle german format of input amount at filter.

### Possible future expansion :
Can replace hardcoded json with real api with no changes to domain layer.
Add routing so each card has its own URL and enable linking and browser history.
Add a state management if there are chances of data mutations that can arise in future.
For extreme large transaction lists,  pagination can be replaced with virtual scrolling using react-virtual for better performance.









<!-- The challenge is moved to below -->









# Cards & Transactions Overview – Frontend Exercise

This exercise is a small frontend application that simulates a banking-style overview page.

The goal is to build a page where a user can view payment cards, select one of them, and inspect its transactions. The user must also be able to filter the transactions by amount.

A rough interface sketch is included in the repository to illustrate the intended layout and interaction. The design is only guidance — a pixel-perfect implementation is **not required**.

**Expected time investment:** ~4 hours

![image](docs/cardTransactionDesigns.png)


## Functional Requirements

### Card Selection

* Display a list of payment cards
* The user can select one of the cards
* The selected card becomes the active context of the page

### Transactions

* When a card is selected, show the transactions belonging to that card
* The transactions should visually relate to the selected card (for example: matching background color or another clear visual connection)

### Filtering

* A numeric filter field must exist between the cards and the transactions list
* The user can enter an amount
* Only transactions with an amount **greater than or equal to** the entered value remain visible
* When the user switches to another card, the filter input resets

## Technical Setup

Use the framework relevant to the role you applied for (e.g. React, Vue, etc.).

You may:

* use the included starter project, or
* create your own setup from scratch

You are free to add any libraries you consider appropriate (state management, routing, testing tools, UI helpers, etc.).

If you use the starter project:

```bash
yarn
```

## Data Source

The repository contains example data inside `src/data` as JSON files.

You may use this data as the backing data for the application.
However, the application should be implemented as if the data were loaded from an external API rather than directly from static imports.

In other words, structure your solution so that replacing the local data with real network requests would not require major changes to the application architecture.

## General Expectations

We are interested in how you approach implementing a feature in a small application.

If you complete the core requirements early, you are welcome to extend the solution further or refine parts of the implementation. Additional improvements are optional and should not be necessary to submit a valid solution.

### Junior

A working implementation that follows the described behavior and is reasonably understandable.

### Mid-Level

A well-structured and maintainable solution with clear organization and thoughtful implementation choices.

### Senior

A solution that reflects engineering maturity and consideration for long-term maintainability and scalability.

## What to Include in Your Submission

Please provide:

* the full source code
* a short `README` explaining:

  * how to run the project
  * assumptions or tradeoffs you made
  * what you would improve with more time

The goal of this exercise is to understand your technical decisions and development approach when implementing a real feature.
