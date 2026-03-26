
import {type TransactionRepo} from "../../domain/repositories";
import { type Transactions } from "../../domain/models";
import rawData from "../../data/transactions.json";

const transactionsData: Record<string, Transactions[]> = rawData;

export class JsonTransactionRepository implements TransactionRepo {
  async getAllTransactionForCard(cardId: string): Promise<Transactions[]> {
    return transactionsData[cardId] || [];
  }
}