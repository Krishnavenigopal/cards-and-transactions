
import { JsonCardRepository } from "../jsonCardRepository";

const repo = new JsonCardRepository();

describe("JsonCardRepository.getAllCards", () => {
  it("returns an array of cards", async () => {
    const cards = await repo.getAllCards();
    expect(Array.isArray(cards)).toBe(true);
    expect(cards!.length).toBeGreaterThan(0);
  });

  it("each card has id and description", async () => {
    const cards = await repo.getAllCards();
    cards!.forEach((card) => {
      expect(card).toHaveProperty("id");
      expect(card).toHaveProperty("description");
      expect(typeof card.id).toBe("string");
      expect(typeof card.description).toBe("string");
    });
  });

  it("contains the expected cards", async () => {
    const cards = await repo.getAllCards();
    const descriptions = cards!.map((c) => c.description);
    expect(descriptions).toContain("Private Card");
    expect(descriptions).toContain("Business Card");
  });

  it("does not include extra fields like accent or color", async () => {
    const cards = await repo.getAllCards();
    cards!.forEach((card) => {
      expect(card).not.toHaveProperty("accent");
      expect(card).not.toHaveProperty("color");
      expect(card).not.toHaveProperty("last4");
    });
  });
});

describe("JsonCardRepository.getCardById", () => {
  it("returns the correct card for a known id", async () => {
    const cards   = await repo.getAllCards();
    const firstId = cards![0].id;

    const card = await repo.getCardById(firstId);
    expect(card).not.toBeNull();
    expect(card!.id).toBe(firstId);
  });

  it("returns the card with the correct description", async () => {
    const cards  = await repo.getAllCards();
    const target = cards![0];

    const found = await repo.getCardById(target.id);
    expect(found!.description).toBe(target.description);
  });

  it("returns null for an unknown id", async () => {
    const card = await repo.getCardById("nonexistent-id");
    expect(card).toBeNull();
  });

  it("returns null for empty string id", async () => {
    const card = await repo.getCardById("");
    expect(card).toBeNull();
  });
});