
import { useState, useEffect, useMemo } from "react";
import type { CardService } from "../domain/services/cardService";
import type { Card, CardWithTransactions } from "../domain/models";
import { filterByMinAmount } from "../utilities/helper";
 
export function useCardTransactions(service: CardService) {
  const [cardsWithTxs, setCardsWithTxs] = useState<CardWithTransactions[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [filterAmount, setFilterAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    let cancelled = false;
    service
      .getCardsWithTransactions()
      .then((data) => {
        if (!cancelled) {
          setCardsWithTxs(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [service]);
 
  const cards: Card[] = useMemo(
    () => cardsWithTxs.map(({ transactions: _tx, ...card }) => card),
    [cardsWithTxs]
  );
 
  const selectedCard = useMemo(
    () => cardsWithTxs.find((c) => c.id === selectedCardId) ?? null,
    [cardsWithTxs, selectedCardId]
  );
 
  const transactions = useMemo(() => {
    if (!selectedCard) return [];
    return filterByMinAmount(selectedCard.transactions, filterAmount);
  }, [selectedCard, filterAmount]);

  function selectCard(id: string) {
    setSelectedCardId(id);
    setFilterAmount("");
  }
 
  return {
    cards,
    selectedCard,
    selectedCardId,
    transactions,
    filterAmount,
    loading,
    error,
    selectCard,
    setFilterAmount,
  };
}
 