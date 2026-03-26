export {};

const SEL = {
  privateCard:      "[aria-label*='Private Card']",
  businessCard:     "[aria-label*='Business Card']",
  amountInput:      "#amount-filter",
  transactionPanel: "[data-testid='transaction-panel']",
  transactionRow:   "[data-testid='transaction-row']",
};

describe("Card Transactions Page", () => {
  beforeEach(() => cy.visit("/"));

  // ── Initial load ────────────────────────────────────────────────────────────

  describe("Initial load", () => {
    it("renders both payment cards", () => {
      cy.get(SEL.privateCard).should("be.visible");
      cy.get(SEL.businessCard).should("be.visible");
    });

    it("renders the amount filter input", () => {
      cy.get(SEL.amountInput).should("be.visible");
    });

    it("no card is selected on load — both aria-checked=false", () => {
      cy.get(SEL.privateCard).should("have.attr", "aria-checked", "false");
      cy.get(SEL.businessCard).should("have.attr", "aria-checked", "false");
    });

    it("shows empty state before any card is selected", () => {
      cy.get(SEL.transactionPanel).should("contain.text", "Empty");
    });
  });

  // ── Card selection ──────────────────────────────────────────────────────────

  describe("Card selection", () => {
    it("marks Private Card as selected on click", () => {
      cy.get(SEL.privateCard).click();
      cy.get(SEL.privateCard).should("have.attr", "aria-checked", "true");
      cy.get(SEL.businessCard).should("have.attr", "aria-checked", "false");
    });

    it("shows Private Card transactions after selection", () => {
      cy.get(SEL.privateCard).click();
      // Wait for at least one transaction row to appear, then check descriptions
      cy.get(SEL.transactionRow).should("have.length.at.least", 1);
      cy.get(SEL.transactionRow).first().should("be.visible");
    });

    it("shows the card name in the transaction panel header", () => {
      cy.get(SEL.privateCard).click();
      // MUI overline applies uppercase via CSS — DOM text is still "Private Card"
      cy.get(SEL.transactionPanel)
        .contains("Private Card")
        .should("be.visible");
    });

    it("switches cards and shows Business Card transactions", () => {
      cy.get(SEL.privateCard).click();
      cy.get(SEL.transactionRow).should("have.length.at.least", 1);
      const privateCount = 0;

      cy.get(SEL.businessCard).click();
      cy.get(SEL.transactionRow).should("have.length.at.least", 1);
      cy.get(SEL.transactionPanel)
        .contains("Business Card")
        .should("be.visible");
    });

    it("deselects previous card when switching", () => {
      cy.get(SEL.privateCard).click();
      cy.get(SEL.businessCard).click();
      cy.get(SEL.privateCard).should("have.attr", "aria-checked", "false");
      cy.get(SEL.businessCard).should("have.attr", "aria-checked", "true");
    });

    it("shows transaction count in the panel", () => {
      cy.get(SEL.privateCard).click();
      cy.get(SEL.transactionPanel)
        .find("[role='status']")
        .should("contain.text", "transaction");
    });
  });

  // ── Amount filter ───────────────────────────────────────────────────────────

  describe("Amount filter", () => {
    beforeEach(() => {
      cy.get(SEL.privateCard).click();
      // Wait for transactions to load before each filter test
      cy.get(SEL.transactionRow).should("have.length.at.least", 1);
    });

    it("reduces visible transactions when amount is entered", () => {
      cy.get(SEL.transactionRow).its("length").then((totalCount) => {
        cy.get(SEL.amountInput).type("100");
        cy.get(SEL.transactionRow).should("have.length.lessThan", totalCount);
      });
    });

    it("keeps transactions at exactly the threshold — >= semantics", () => {
      cy.get(SEL.amountInput).type("43.80");
      // Food is exactly 43.80 — should still be visible
      cy.contains("Food").should("be.visible");
    });

    it("accepts German comma decimal (43,80)", () => {
      cy.get(SEL.amountInput).type("43,80");
      cy.contains("Food").should("be.visible");
    });

    it("shows empty state when all transactions are filtered out", () => {
      cy.get(SEL.amountInput).type("99999");
      cy.get(SEL.transactionPanel).should("contain.text", "Empty");
    });

    it("restores all transactions when filter is cleared", () => {
      cy.get(SEL.transactionRow).its("length").then((totalCount) => {
        cy.get(SEL.amountInput).type("500");
        cy.get(SEL.transactionRow).should("have.length.lessThan", totalCount);
        cy.get(SEL.amountInput).clear();
        cy.get(SEL.transactionRow).should("have.length", totalCount);
      });
    });

    it("resets filter input when switching cards", () => {
      cy.get(SEL.amountInput).type("50");
      cy.get(SEL.amountInput).should("have.value", "50");
      cy.get(SEL.businessCard).click();
      cy.get(SEL.amountInput).should("have.value", "");
    });
  });

  // ── Accessibility ───────────────────────────────────────────────────────────

  describe("Accessibility", () => {
    it("card list has an aria-label", () => {
      cy.get("[aria-label='Payment cards']").should("exist");
    });

    it("card buttons have descriptive aria-labels", () => {
      cy.get(SEL.privateCard)
        .should("have.attr", "aria-label")
        .and("include", "Private Card");
      cy.get(SEL.businessCard)
        .should("have.attr", "aria-label")
        .and("include", "Business Card");
    });

    it("filter input has an accessible label", () => {
      cy.get("label[for='amount-filter']").should("exist");
    });

    it("transaction panel has an aria-label after card selection", () => {
      cy.get(SEL.privateCard).click();
      cy.get(SEL.transactionPanel)
        .should("have.attr", "aria-label")
        .and("include", "Private Card");
    });
  });
});