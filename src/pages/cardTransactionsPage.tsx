import { useMemo } from "react";
import { createCardService } from "../infrastructure/source_factory";
import { useCardTransactions } from "../hooks/useCardTransaction";
import { CardList }        from "../components/cards/CardList";
import { AmountFilter }    from "../components/filters/AmountFilter";
import { TransactionList } from "../components/transactions/TransactionList";

export default function CardTransactionsPage() {
  // useMemo ensures the service instance is created once per component mount,
  // not re-created on every render. Passing a new instance each render would
  // trigger the useEffect in the hook on every re-render.
  const service = useMemo(() => createCardService(), []);

  const {
    cards,
    selectedCard,
    selectedCardId,
    transactions,
    filterAmount,
    loading,
    error,
    selectCard,
    setFilterAmount,
  } = useCardTransactions(service);

  if (loading) return <div style={{ color: "#555", padding: 48 }}>Loading…</div>;
  if (error)   return <div style={{ color: "#e55", padding: 48 }}>Error: {error}</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f6f6", color: "#07474a", fontFamily: "'DM Sans', sans-serif", padding: "48px 24px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <header style={{ marginBottom: 36 }}>
          <p id="card-selection-hint" style={{ fontSize: 13, color: "#555", marginTop: 4 }} >
            Select a card to view its transactions
          </p>
        </header>

        <CardList
          cards={cards}
          selectedCardId={selectedCardId}
          onCardSelect={selectCard}
          ariaDescribedBy="card-selection-hint"
        />

        <div style={{ borderTop: "1px solid #1f1f21", borderBottom: "1px solid #1f1f21", margin: "32px 0 24px" }}>
          <AmountFilter key={selectedCardId ?? "none"} value={filterAmount} onChange={setFilterAmount} />
        </div>

        <TransactionList
          transactions={transactions}
          card={selectedCard}
        />

      </div>
    </div>
  );
}