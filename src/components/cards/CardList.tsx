import { useRef } from "react";
import IconButton  from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import type { Card } from "../../domain/models";
import { PaymentCard } from "./PaymentCard";

interface Props {
  cards: Card[];
  selectedCardId: string | null;
  onCardSelect: (id: string) => void;
  ariaDescribedBy:string;
}

const SCROLL_AMOUNT = 340; //  one card width + gap

export function CardList({ cards, selectedCardId, onCardSelect, ariaDescribedBy }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Left scroll button */}
      {cards.length > 2 && (
        <IconButton
          aria-label="Scroll cards left"
          onClick={() => scroll("left")}
          size="small"
          sx={{
            position: "absolute",
            left:     -20,
            top:      "50%",
            transform: "translateY(-50%)",
            zIndex:   10,
            bgcolor:  "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          ‹
        </IconButton>
      )}

      <div
        ref={scrollRef}
        role="list"
        aria-label="Payment cards"
        aria-describedby={ariaDescribedBy}
        data-testid="card-scroll-container"
        style={{
          display: "flex",
          gap:  40,
          // Scroll horizontally when cards overflow
          overflowX: "auto",
          overflowY: "visible",
          padding: "16px 8px 24px",
          // Hide scrollbar visually but keep it functional
          scrollbarWidth:   "none",       // Firefox
          msOverflowStyle:  "none",       // IE/Edge
        }}
      >
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;
          return (
            <div
              key={card.id}
              role="listitem"
              style={{
                flexShrink: 0,
                position:   "relative",
                zIndex:     isSelected ? 1 : 0,
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

      {/* Right scroll button */}
      {cards.length > 2 && (
        <IconButton
          aria-label="Scroll cards right"
          onClick={() => scroll("right")}
          size="small"
          sx={{
            position: "absolute",
            right:    -20,
            top:      "50%",
            transform: "translateY(-50%)",
            zIndex:   10,
            bgcolor:  "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          ›
        </IconButton>
      )}
    </Box>
  );
}