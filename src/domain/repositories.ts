
import type { Transactions, Card } from "./models";

export interface TransactionRepo {
    getAllTransactionForCard(cardId: string): Promise<Transactions[]>;
}

export interface CardRepo {
    getAllCards(): Promise<Card[] | null>;
    getCardById(cardId:string): Promise<Card | null>;
}