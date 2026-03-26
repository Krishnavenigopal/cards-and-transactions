import { render, screen } from "@testing-library/react";
import { TransactionRow } from "../TransactionRow";
import type { Transactions } from "../../../domain/models";

const tx: Transactions         = { id: "t1", amount: 43.80,   description: "Food"   };
const negativeTx: Transactions = { id: "t2", amount: -100.88, description: "Refund" };

describe("TransactionRow — rendering", () => {
  it("renders the description", () => {
    render(<TransactionRow transaction={tx} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("renders the formatted amount in German locale", () => {
    render(<TransactionRow transaction={tx} />);
    expect(screen.getByText("43,80 €")).toBeInTheDocument();
  });

  it("renders a negative amount correctly", () => {
    render(<TransactionRow transaction={negativeTx} />);
    expect(screen.getByText("-100,88 €")).toBeInTheDocument();
  });

  it("renders the description for a negative transaction", () => {
    render(<TransactionRow transaction={negativeTx} />);
    expect(screen.getByText("Refund")).toBeInTheDocument();
  });
});

describe("TransactionRow — accessibility", () => {
  it("renders a listitem", () => {
    render(<TransactionRow transaction={tx} />);
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("has data-testid=transaction-row", () => {
    render(<TransactionRow transaction={tx} />);
    expect(screen.getByTestId("transaction-row")).toBeInTheDocument();
  });

  it("aria-label contains description and formatted amount", () => {
    render(<TransactionRow transaction={tx} />);
    const label = screen.getByTestId("transaction-row").getAttribute("aria-label") ?? "";
    expect(label).toContain("Food");
    expect(label).toMatch(/43,80/);
    expect(label).toMatch(/€/);
  });

  it("aria-label works for negative amounts", () => {
    render(<TransactionRow transaction={negativeTx} />);
    const label = screen.getByTestId("transaction-row").getAttribute("aria-label") ?? "";
    expect(label).toContain("Refund");
    expect(label).toMatch(/-100,88/);
    expect(label).toMatch(/€/);
  });

  it("formatted amount is aria-hidden — already covered by aria-label", () => {
    render(<TransactionRow transaction={tx} />);
    const amountEl = screen.getByText("43,80 €");
    expect(amountEl).toHaveAttribute("aria-hidden", "true");
  });
});

describe("TransactionRow — accentColor", () => {
  it("renders without accentColor prop without crashing", () => {
    expect(() => render(<TransactionRow transaction={tx} />)).not.toThrow();
  });

  it("accepts an accentColor prop without crashing", () => {
    expect(() =>
      render(<TransactionRow transaction={tx} accentColor="#6b8e23" />)
    ).not.toThrow();
  });
});