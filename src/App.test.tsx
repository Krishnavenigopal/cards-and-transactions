import { render, screen } from "@testing-library/react";
import App from "./App";

test("should render the headline", () => {
  render(<App />);
  const headline = screen.getByText(/Cards & Transactions/i);
  expect(headline).toBeInTheDocument();
});

test("renders the CardTransactionsPage — shows hint text", async () => {
    render(<App />);
    expect(
      await screen.findByText("Select a card to view its transactions")
    ).toBeInTheDocument();
  });
