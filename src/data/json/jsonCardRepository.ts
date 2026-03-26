

import cardsData from "../cards.json";
import { type CardRepo } from "../../domain/repositories";
import { type Card } from "../../domain/models";

export class JsonCardRepository implements CardRepo {
  async getAllCards(): Promise<Card[] | null> {
    return cardsData;
  }

  async getCardById(cardId: string): Promise<Card | null> {
    return cardsData.find((c) => c.id === cardId) || null;
  }
}