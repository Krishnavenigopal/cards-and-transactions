// Vitest — vi.fn() instead of jest.fn()
// No imports needed — describe/it/expect/vi are all globals via "vitest/globals"

import { CardService } from "../cardService";

const mockCards = [
  { id: "card-1", description: "Private Card"  },
  { id: "card-2", description: "Business Card" },
];

const mockTransactions: Record<string, { id: string; amount: number; description: string }[]> = {
  "card-1": [
    { id: "t1", amount: 43.80,   description: "Deal"   },
    { id: "t2", amount: -100.88, description: "Refund" },
  ],
  "card-2": [
    { id: "t3", amount: 87.50, description: "Doctor" },
  ],
};

function makeService(opts: { cards?: typeof mockCards | null ; txNull?: boolean } = {}) {
  const cardRepo = {
    getAllCards: vi.fn().mockResolvedValue(opts.cards !== undefined ? opts.cards : mockCards),
    getCardById: vi.fn().mockResolvedValue(mockCards[0]),
  };
  const transactionRepo = {
    getAllTransactionForCard: opts.txNull
      ? vi.fn().mockResolvedValue(null)
      : vi.fn().mockImplementation((id: string) =>
          Promise.resolve(mockTransactions[id] ?? [])
        ),
  };
  return new CardService(cardRepo, transactionRepo);
}

describe("CardService.getCardsWithTransactions", () => {
  it("returns cards with their transactions", async () => {
    const result = await makeService().getCardsWithTransactions();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("card-1");
    expect(result[0].transactions).toHaveLength(2);
    expect(result[1].id).toBe("card-2");
    expect(result[1].transactions).toHaveLength(1);
  });

  it("fetches transactions once per card", async () => {
    const cardRepo  = { getAllCards: vi.fn().mockResolvedValue(mockCards),
        getCardById: vi.fn().mockResolvedValue(mockCards[0])
     };
    const transactionRepo = {
      getAllTransactionForCard: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(mockTransactions[id] ?? [])
      ),
    };
    await new CardService(cardRepo, transactionRepo).getCardsWithTransactions();

    expect(transactionRepo.getAllTransactionForCard).toHaveBeenCalledTimes(2);
    expect(transactionRepo.getAllTransactionForCard).toHaveBeenCalledWith("card-1");
    expect(transactionRepo.getAllTransactionForCard).toHaveBeenCalledWith("card-2");
  });

  it("returns [] when cards is null", async () => {
    const result = await makeService({ cards: null }).getCardsWithTransactions();
    expect(result).toEqual([]);
  });

  it("returns [] when cards is empty", async () => {
    const result = await makeService({ cards: [] }).getCardsWithTransactions();
    expect(result).toEqual([]);
  });

  it("falls back to [] when transactions is null", async () => {
    const result = await makeService({ txNull: true }).getCardsWithTransactions();
    expect(result[0].transactions).toEqual([]);
  });

  it("preserves original card fields", async () => {
    const result = await makeService().getCardsWithTransactions();
    expect(result[0].description).toBe("Private Card");
  });
});