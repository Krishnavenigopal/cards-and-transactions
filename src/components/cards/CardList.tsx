
import type { Card } from "../../domain/models";
import { PaymentCard } from "./PaymentCard";
 
interface Props {
  cards: Card[];
  selectedCardId: string | null;
  onCardSelect: (id: string) => void;
  ariaDescribedBy:string;
}
 
export function CardList({ cards, selectedCardId, onCardSelect, ariaDescribedBy }: Props) {
  return (
    <div
      role="list"
      aria-label="Payment cards"
      aria-describedby={ariaDescribedBy}
      style={{ display: "flex", gap: 40, overflowX: "visible", padding:  "16px 8px 24px", }}
    >
      {cards.map((card) => {
        const isSelected = selectedCardId === card.id;
        return (
          <div
            key={card.id}
            role="listitem"
            style={{
              flex:     "0 0 auto",
              position: "relative",
              // Selected card layers on top of neighbours — zoom overlaps
              // the gap between cards rather than shifting siblings sideways
              zIndex:   isSelected ? 1 : 0,
            }}
          >
            <PaymentCard
              card={card}
              isSelected={isSelected}
              onSelect={onCardSelect}
            />
          </div>
        );
      })}
    </div>
  );
}