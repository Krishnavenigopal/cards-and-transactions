
import { type CardRepo, type TransactionRepo } from "../repositories";

export class CardService {
    private cardRepo: CardRepo;
    private transactionRepo: TransactionRepo;

    constructor(cardRepo: CardRepo, transactionRepo: TransactionRepo) {
        this.cardRepo = cardRepo;
        this.transactionRepo = transactionRepo;
    }


  async getCardsWithTransactions() {
    const cards = await this.cardRepo.getAllCards();
    if (!cards) return [];

    const result = await Promise.all(
      cards.map(async (card) => {
        const transactions =
          await this.transactionRepo.getAllTransactionForCard(card.id);

        return {
          ...card,
          transactions: transactions || [],
        };
      })
    );

    return result;
  }
}