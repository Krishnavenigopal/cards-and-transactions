import { render, screen } from "@testing-library/react";
import { TransactionList } from "../TransactionList";
import type { Card, Transactions } from "../../../domain/models";

const card: Card = { id: "lkmfkl-mlfkm-dlkfm", description: "Private Card" };

const transactions: Transactions[] = [
  { id: "t1", amount: 43.80,   description: "Food"      },
  { id: "t2", amount: -100.88, description: "Refund"    },
  { id: "t3", amount: 540.00,  description: "Travel"    },
];

describe("TransactionList — no card selected", () => {
  it("renders the transaction panel", () => {
    render(<TransactionList transactions={[]} card={null} hasFilter={false} />);
    expect(screen.getByTestId("transaction-panel")).toBeInTheDocument();
  });

  it("shows Empty when no card is selected", () => {
    render(<TransactionList transactions={[]} card={null} hasFilter={false} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("does not render an h2 heading", () => {
    render(<TransactionList transactions={[]} card={null} hasFilter={false} />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("section has generic aria-label when no card", () => {
    render(<TransactionList transactions={[]} card={null} hasFilter={false} />);
    expect(screen.getByRole("region", { name: "Transactions" })).toBeInTheDocument();
  });
});

describe("TransactionList — card selected with transactions", () => {
  it("renders a named section landmark", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(
      screen.getByRole("region", { name: /Private Card transactions/i })
    ).toBeInTheDocument();
  });

  it("renders an h2 heading with the card description", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Private Card" })
    ).toBeInTheDocument();
  });

  it("renders a list of transactions", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("renders one row per transaction", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(screen.getAllByTestId("transaction-row")).toHaveLength(3);
  });

  it("shows correct transaction count — plural", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(screen.getByText("3 transactions")).toBeInTheDocument();
  });

  it("uses singular form when count is 1", () => {
    render(<TransactionList transactions={[transactions[0]]} card={card} hasFilter={false} />);
    expect(screen.getByText("1 transaction")).toBeInTheDocument();
  });

  it("renders all transaction descriptions", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Refund")).toBeInTheDocument();
    expect(screen.getByText("Travel")).toBeInTheDocument();
  });

  it("count has role=status for live announcement", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("does not show Empty when transactions are present", () => {
    render(<TransactionList transactions={transactions} card={card} hasFilter={false} />);
    expect(screen.queryByText("Empty")).not.toBeInTheDocument();
  });
});

describe("TransactionList — card selected, no transactions", () => {
  it("shows Empty when card is selected but no transactions", () => {
    render(<TransactionList transactions={[]} card={card} hasFilter={false} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("still renders the h2 heading", () => {
    render(<TransactionList transactions={[]} card={card} hasFilter={false} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("shows 0 transactions in the count", () => {
    render(<TransactionList transactions={[]} card={card} hasFilter={false} />);
    expect(screen.getByText("0 transactions")).toBeInTheDocument();
  });
});
