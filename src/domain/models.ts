
export interface Transactions {
    id:string,
    amount:number,
    description:string
}

export interface Card {
    id:string,
    description:string
}

export interface CardWithTransactions extends Card {
  transactions: Transactions[];
}