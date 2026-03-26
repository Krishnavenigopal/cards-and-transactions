
import { render, screen, fireEvent } from "@testing-library/react";
import { CardList } from "../CardList";
import type { Card } from "../../../domain/models";

const cards: Card[] = [
  { id: "card-1", description: "Private Card"  },
  { id: "card-2", description: "Business Card" },
];

describe("CardList — rendering", () => {
  it("renders a radio for each card", () => {
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("renders both card descriptions", () => {
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
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
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("has aria-label on the list", () => {
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("list")).toHaveAttribute("aria-label", "Payment cards");
  });

  it("passes ariaDescribedBy to the list container", () => {
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("list")).toHaveAttribute("aria-describedby", "hint");
  });

  it("each card is wrapped in a listitem", () => {
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("selected card has aria-checked=true", () => {
    render(<CardList cards={cards} selectedCardId="card-1" onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    expect(screen.getByRole("radio", { name: /Private Card/i })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /Business Card/i })).toHaveAttribute("aria-checked", "false");
  });

  it("all cards are unchecked when selectedCardId is null", () => {
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={vi.fn()} ariaDescribedBy="hint" />);
    screen.getAllByRole("radio").forEach((radio) => {
      expect(radio).toHaveAttribute("aria-checked", "false");
    });
  });
});

describe("CardList — interaction", () => {
  it("calls onCardSelect with the correct id on click", () => {
    const onCardSelect = vi.fn();
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={onCardSelect} ariaDescribedBy="hint" />);
    fireEvent.click(screen.getByRole("radio", { name: /Business Card/i }));
    expect(onCardSelect).toHaveBeenCalledWith("card-2");
  });

  it("calls onCardSelect exactly once per click", () => {
    const onCardSelect = vi.fn();
    render(<CardList cards={cards} selectedCardId={null} onCardSelect={onCardSelect} ariaDescribedBy="hint" />);
    fireEvent.click(screen.getByRole("radio", { name: /Private Card/i }));
    expect(onCardSelect).toHaveBeenCalledTimes(1);
  });
});