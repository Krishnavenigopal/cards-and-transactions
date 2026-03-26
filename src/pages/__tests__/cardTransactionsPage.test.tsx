import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { CardWithTransactions }           from "../../domain/models";

vi.mock("../../infrastructure/source_factory", () => ({
  createCardService: vi.fn(),
}));

import { createCardService } from "../../infrastructure/source_factory";
import CardTransactionsPage  from "../cardTransactionsPage";

const mockData: CardWithTransactions[] = [
  {
    id: "lkmfkl-mlfkm-dlkfm", description: "Private Card",
    transactions: [
      { id: "t1", amount: 43.80,   description: "Food"      },
      { id: "t2", amount: 17.99,   description: "Streaming" },
      { id: "t3", amount: -100.88, description: "Refund"    },
    ],
  },
  {
    id: "elek-n3lk-4m3lk4", description: "Business Card",
    transactions: [
      { id: "t4", amount: 87.50,  description: "Software" },
      { id: "t5", amount: 540.00, description: "Travel"   },
    ],
  },
];

beforeEach(() => {
  (createCardService as ReturnType<typeof vi.fn>).mockReturnValue({
    getCardsWithTransactions: vi.fn().mockResolvedValue(mockData),
  });
});

afterEach(() => vi.clearAllMocks());

async function renderPage() {
  render(<CardTransactionsPage />);
  await waitFor(() =>
    expect(screen.getByText("Private Card")).toBeInTheDocument()
  );
}

describe("CardTransactionsPage — initial load", () => {
  it("shows the select-a-card hint", async () => {
    await renderPage();
    expect(
      screen.getByText("Select a card to view its transactions")
    ).toBeInTheDocument();
  });

  it("renders both cards", async () => {
    await renderPage();
    expect(screen.getByRole("radio", { name: /Private Card/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Business Card/i })).toBeInTheDocument();
  });

  it("renders the amount filter", async () => {
    await renderPage();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("no card is selected on load", async () => {
    await renderPage();
    screen.getAllByRole("radio").forEach((radio) =>
      expect(radio).toHaveAttribute("aria-checked", "false")
    );
  });

  it("shows loading state initially", () => {
    render(<CardTransactionsPage />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });
});

describe("CardTransactionsPage — card selection", () => {
  it("marks clicked card as selected", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(
      screen.getByRole("radio", { name: /Private Card/i })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("shows transactions after selecting a card", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Streaming")).toBeInTheDocument();
  });

  it("shows negative amount transactions", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(screen.getByText("Refund")).toBeInTheDocument();
  });

  it("swaps transactions when switching cards", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(screen.getByText("Food")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: /Business Card/i }));
    expect(screen.queryByText("Food")).not.toBeInTheDocument();
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getByText("Travel")).toBeInTheDocument();
  });

  it("only one card is selected at a time", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    fireEvent.click(screen.getByRole("radio", { name: /Business Card/i }));
    expect(
      screen.getByRole("radio", { name: /Private Card/i })
    ).toHaveAttribute("aria-checked", "false");
    expect(
      screen.getByRole("radio", { name: /Business Card/i })
    ).toHaveAttribute("aria-checked", "true");
  });
});

describe("CardTransactionsPage — amount filter", () => {
  it("filters transactions by minimum amount", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(screen.getByText("Streaming")).toBeInTheDocument(); // 17.99

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "20" } });
    expect(screen.queryByText("Streaming")).not.toBeInTheDocument();
  });

  it("includes transactions exactly at threshold — >= semantics", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "43.80" } });
    expect(screen.getByText("Food")).toBeInTheDocument(); // exactly 43.80
  });

  it("includes negative amount transactions when filter is negative", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "-200" } });
    expect(screen.getByText("Refund")).toBeInTheDocument(); // -100.88 >= -200
  });

  it("shows empty state when filter removes all transactions", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "99999" } });
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("restores transactions when filter is cleared", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "500" } });
    expect(screen.queryByText("Streaming")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    expect(screen.getByText("Streaming")).toBeInTheDocument();
  });

  it("resets filter input when card is switched — key remount", async () => {
    await renderPage();
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "50" } });
    expect(screen.getByRole("textbox")).toHaveValue("50");

    fireEvent.click(screen.getByRole("radio", { name: /Business Card/i }));
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});

describe("CardTransactionsPage — error state", () => {
  it("shows error message when service rejects", async () => {
    (createCardService as ReturnType<typeof vi.fn>).mockReturnValue({
      getCardsWithTransactions: vi
        .fn()
        .mockRejectedValue(new Error("Failed to load")),
    });
    render(<CardTransactionsPage />);
    await waitFor(() =>
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument()
    );
  });
});