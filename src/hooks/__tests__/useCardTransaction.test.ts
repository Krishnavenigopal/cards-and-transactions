import { renderHook, act } from "@testing-library/react";
import { useCardTransactions } from "../useCardTransaction";
import type { CardService }        from "../../domain/services/cardService";
import type { CardWithTransactions } from "../../domain/models";

const mockData: CardWithTransactions[] = [
  {
    id: "card-1", description: "Private Card",
    transactions: [
      { id: "t1", amount: 20.00,    description: "Food"     },
      { id: "t2", amount: 300.00,   description: "Travel"   },
      { id: "t3", amount: -100.88,  description: "Refund"   },
    ],
  },
  {
    id: "card-2", description: "Business Card",
    transactions: [
      { id: "t4", amount: 87.50,  description: "Software" },
    ],
  },
];

function makeService(opts: { data?: CardWithTransactions[]; error?: string } = {}): CardService {
  return {
    getCardsWithTransactions: opts.error
      ? vi.fn().mockRejectedValue(new Error(opts.error))
      : vi.fn().mockResolvedValue(opts.data ?? mockData),
  } as unknown as CardService;
}

describe("useCardTransactions — initial state", () => {
  it("starts loading", () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    expect(result.current.loading).toBe(true);
  });

  it("starts with no card selected", () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    expect(result.current.selectedCardId).toBeNull();
    expect(result.current.selectedCard).toBeNull();
  });

  it("starts with empty transactions", () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    expect(result.current.transactions).toEqual([]);
  });

  it("starts with empty filterAmount", () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    expect(result.current.filterAmount).toBe("");
  });
});

describe("useCardTransactions — data loading", () => {
  it("populates cards after service resolves", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.cards).toHaveLength(2);
  });

  it("strips transactions from the cards array", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    result.current.cards.forEach((card) => {
      expect(card).not.toHaveProperty("transactions");
    });
  });

  it("sets error when service rejects", async () => {
    const { result } = renderHook(() =>
      useCardTransactions(makeService({ error: "Network failure" }))
    );
    await act(async () => {});
    expect(result.current.error).toBe("Network failure");
    expect(result.current.loading).toBe(false);
  });
});

describe("useCardTransactions — card selection", () => {
  it("updates selectedCardId when selectCard is called", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    expect(result.current.selectedCardId).toBe("card-1");
  });

  it("resolves selectedCard with its transactions", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    expect(result.current.selectedCard?.description).toBe("Private Card");
    expect(result.current.transactions).toHaveLength(3);
  });

  it("switches transactions when a different card is selected", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    act(() => result.current.selectCard("card-2"));
    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].description).toBe("Software");
  });
});

describe("useCardTransactions — filter", () => {
  it("filters transactions by minimum amount", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    act(() => result.current.setFilterAmount("20"));
    // -100.88 excluded, 20.00 included (>=), 300.00 included
    expect(result.current.transactions).toHaveLength(2);
  });

  it("includes negative amount transactions when filter is negative", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    act(() => result.current.setFilterAmount("-200"));
    // all three qualify (>= -200)
    expect(result.current.transactions).toHaveLength(3);
  });

  it("returns all transactions when filter is cleared", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    act(() => result.current.setFilterAmount("100"));
    expect(result.current.transactions).toHaveLength(1);
    act(() => result.current.setFilterAmount(""));
    expect(result.current.transactions).toHaveLength(3);
  });
});

describe("useCardTransactions — filter resets on card switch", () => {
  it("clears filterAmount when a different card is selected", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    act(() => result.current.setFilterAmount("50"));
    expect(result.current.filterAmount).toBe("50");
    act(() => result.current.selectCard("card-2"));
    expect(result.current.filterAmount).toBe("");
  });

  it("clears filterAmount even when the same card is re-selected", async () => {
    const { result } = renderHook(() => useCardTransactions(makeService()));
    await act(async () => {});
    act(() => result.current.selectCard("card-1"));
    act(() => result.current.setFilterAmount("100"));
    act(() => result.current.selectCard("card-1"));
    expect(result.current.filterAmount).toBe("");
  });
});