
import { JsonTransactionRepository } from "../jsonTransactionRepository";

const repo = new JsonTransactionRepository();

describe("JsonTransactionRepository.getAllTransactionForCard", () => {
  it("returns transactions for a known cardId", async () => {
    const txs = await repo.getAllTransactionForCard("lkmfkl-mlfkm-dlkfm");
    expect(Array.isArray(txs)).toBe(true);
    expect(txs.length).toBeGreaterThan(0);
  });

  it("each transaction has id, amount and description", async () => {
    const txs = await repo.getAllTransactionForCard("lkmfkl-mlfkm-dlkfm");
    txs.forEach((tx) => {
      expect(tx).toHaveProperty("id");
      expect(tx).toHaveProperty("amount");
      expect(tx).toHaveProperty("description");
      expect(typeof tx.amount).toBe("number");
    });
  });

  it("returns an empty array for an unknown cardId", async () => {
    const txs = await repo.getAllTransactionForCard("nonexistent-id");
    expect(txs).toEqual([]);
  });

  it.skip("returns different transactions for different cards", async () => {
    const privateTxs  = await repo.getAllTransactionForCard("lkmfkl-mlfkm-dlkfm");
    const businessTxs = await repo.getAllTransactionForCard("elek-n3lk-4m3lk4");

    const privateIds  = privateTxs.map((t) => t.id);
    const businessIds = businessTxs.map((t) => t.id);
    expect(privateIds.some((id) => businessIds.includes(id))).toBe(false);
  });

  it("amount is always a number — including negative values", async () => {
    const allTxs = [
      ...await repo.getAllTransactionForCard("lkmfkl-mlfkm-dlkfm"),
      ...await repo.getAllTransactionForCard("elek-n3lk-4m3lk4"),
    ];
    allTxs.forEach((tx) => {
      expect(typeof tx.amount).toBe("number");
    });
  });
});