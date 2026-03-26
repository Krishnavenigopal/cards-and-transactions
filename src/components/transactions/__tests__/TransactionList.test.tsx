import { render, screen, fireEvent } from "@testing-library/react";
import { TransactionList } from "../TransactionList";
import type { Card, Transactions } from "../../../domain/models";

const card: Card = { id: "lkmfkl-mlfkm-dlkfm", description: "Private Card" };

// 3 transactions — below PAGE_SIZE(10), no pagination
const fewTransactions: Transactions[] = [
  { id: "t1", amount: 43.80,   description: "Food"   },
  { id: "t2", amount: -100.88, description: "Refund" },
  { id: "t3", amount: 540.00,  description: "Travel" },
];

// 15 transactions — above PAGE_SIZE(10), pagination shown
const manyTransactions: Transactions[] = Array.from({ length: 15 }, (_, i) => ({
  id:          `t${i + 1}`,
  amount:      (i + 1) * 10,
  description: `Transaction ${i + 1}`,
}));

describe("TransactionList — no card selected", () => {
  it("renders the transaction panel", () => {
    render(<TransactionList transactions={[]} card={null} />);
    expect(screen.getByTestId("transaction-panel")).toBeInTheDocument();
  });

  it("shows Empty when no card selected and no transactions", () => {
    render(<TransactionList transactions={[]} card={null} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("does not render h2 heading when no card", () => {
    render(<TransactionList transactions={[]} card={null} />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("section has generic aria-label when no card", () => {
    render(<TransactionList transactions={[]} card={null} />);
    expect(screen.getByRole("region", { name: "Transactions" })).toBeInTheDocument();
  });
});

describe("TransactionList — card selected with transactions", () => {
  it("renders a named section landmark", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(
      screen.getByRole("region", { name: /Private Card transactions/i })
    ).toBeInTheDocument();
  });

  it("renders h2 heading with card description", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Private Card" })
    ).toBeInTheDocument();
  });

  it("renders all transaction descriptions when below page size", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Refund")).toBeInTheDocument();
    expect(screen.getByText("Travel")).toBeInTheDocument();
  });

  it("shows correct transaction count — plural", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(screen.getByText("3 transactions")).toBeInTheDocument();
  });

  it("shows singular when count is 1", () => {
    render(<TransactionList transactions={[fewTransactions[0]]} card={card} />);
    expect(screen.getByText("1 transaction")).toBeInTheDocument();
  });

  it("count has role=status for live announcement", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("does not show Empty when transactions are present", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(screen.queryByText("Empty")).not.toBeInTheDocument();
  });
});

describe("TransactionList — card selected, no transactions", () => {
  it("shows Empty when card selected but no transactions", () => {
    render(<TransactionList transactions={[]} card={card} />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("still renders the h2 heading", () => {
    render(<TransactionList transactions={[]} card={card} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("shows 0 transactions in the count", () => {
    render(<TransactionList transactions={[]} card={card} />);
    expect(screen.getByText("0 transactions")).toBeInTheDocument();
  });
});

describe("TransactionList — pagination", () => {
  it("does not show pagination when transactions <= 10", () => {
    render(<TransactionList transactions={fewTransactions} card={card} />);
    expect(screen.queryByTestId("transaction-pagination")).not.toBeInTheDocument();
  });

  it("shows pagination when transactions > 10", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    expect(screen.getByTestId("transaction-pagination")).toBeInTheDocument();
  });

  it("shows only 10 rows on the first page", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    expect(screen.getAllByTestId("transaction-row")).toHaveLength(10);
  });

  it("total count always shows all transactions regardless of page", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    expect(screen.getByText("15 transactions")).toBeInTheDocument();
  });

  it("pagination has accessible aria-label", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    expect(
      screen.getByRole("navigation", { name: /Transaction pages/i })
    ).toBeInTheDocument();
  });

  it("page 1 shows first 10 items", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    expect(screen.getByText("Transaction 1")).toBeInTheDocument();
    expect(screen.getByText("Transaction 10")).toBeInTheDocument();
    expect(screen.queryByText("Transaction 11")).not.toBeInTheDocument();
  });

  it("navigating to page 2 shows remaining items", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    fireEvent.click(screen.getByRole("button", { name: /page 2/i }));
    expect(screen.getByText("Transaction 11")).toBeInTheDocument();
    expect(screen.getByText("Transaction 15")).toBeInTheDocument();
    expect(screen.queryByText("Transaction 1")).not.toBeInTheDocument();
  });

  it("page 2 shows correct row count — 5 remaining", () => {
    render(<TransactionList transactions={manyTransactions} card={card} />);
    fireEvent.click(screen.getByRole("button", { name: /page 2/i }));
    expect(screen.getAllByTestId("transaction-row")).toHaveLength(5);
  });
});