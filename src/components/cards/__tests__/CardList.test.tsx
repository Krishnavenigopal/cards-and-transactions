import { render, screen, fireEvent } from "@testing-library/react";
import { CardList } from "../CardList";
import type { Card } from "../../../domain/models";

const twoCards: Card[] = [
  { id: "card-1", description: "Private Card"  },
  { id: "card-2", description: "Business Card" },
];

const manyCards: Card[] = Array.from({ length: 5 }, (_, i) => ({
  id:          `card-${i + 1}`,
  description: `Card ${i + 1}`,
}));

describe("CardList — rendering", () => {
  it("renders a radio for each card", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("renders both card descriptions", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByText("Private Card")).toBeInTheDocument();
    expect(screen.getByText("Business Card")).toBeInTheDocument();
  });

  it("renders empty without crashing", () => {
    render(<CardList cards={[]} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });
});

describe("CardList — accessibility", () => {
  it("has role=list on the container", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has aria-label=Payment cards on the list", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("list")).toHaveAttribute("aria-label", "Payment cards");
  });

  it("passes ariaDescribedBy to the list", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("list")).toHaveAttribute("aria-describedby", "hint");
  });

  it("each card is wrapped in a listitem", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("selected card has aria-checked=true, others false", () => {
    render(<CardList cards={twoCards} selectedCardId="card-1" onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("radio", { name: /Private Card/i })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /Business Card/i })).toHaveAttribute("aria-checked", "false");
  });

  it("all cards are unchecked when selectedCardId is null", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    screen.getAllByRole("radio").forEach((r) =>
      expect(r).toHaveAttribute("aria-checked", "false")
    );
  });
});

describe("CardList — interaction", () => {
  it("calls onCardSelect with the correct id", () => {
    const onCardSelect = vi.fn();
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={onCardSelect} ariaDescribedBy="hint" />);
    fireEvent.click(screen.getByRole("radio", { name: /Business Card/i }));
    expect(onCardSelect).toHaveBeenCalledWith("card-2");
  });

  it("calls onCardSelect exactly once per click", () => {
    const onCardSelect = vi.fn();
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={onCardSelect} ariaDescribedBy="hint" />);
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(onCardSelect).toHaveBeenCalledTimes(1);
  });
});

describe("CardList — scroll", () => {
  it("does not show scroll buttons when 2 or fewer cards", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.queryByRole("button", { name: /scroll cards left/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /scroll cards right/i })).not.toBeInTheDocument();
  });

  it("shows scroll buttons when more than 2 cards", () => {
    render(<CardList cards={manyCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("button", { name: /scroll cards left/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /scroll cards right/i })).toBeInTheDocument();
  });

  it("scroll buttons have accessible aria-labels", () => {
    render(<CardList cards={manyCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("button", { name: "Scroll cards left" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Scroll cards right" })).toBeInTheDocument();
  });

  it("scroll container has data-testid", () => {
    render(<CardList cards={twoCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByTestId("card-scroll-container")).toBeInTheDocument();
  });

  it("clicking scroll buttons does not crash", () => {
    render(<CardList cards={manyCards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(() => {
      fireEvent.click(screen.getByRole("button", { name: /scroll cards right/i }));
      fireEvent.click(screen.getByRole("button", { name: /scroll cards left/i }));
    }).not.toThrow();
  });
});