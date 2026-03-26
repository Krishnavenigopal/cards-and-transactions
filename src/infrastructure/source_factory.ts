
import { JsonCardRepository } from "../data/json/jsonCardRepository";
import { JsonTransactionRepository } from "../data/json/jsonTransactionRepository";
import { CardService } from "../domain/services/cardService";

export function createCardService() {
  const cardRepo = new JsonCardRepository();
  const transactionRepo = new JsonTransactionRepository();

  return new CardService(cardRepo, transactionRepo);
}