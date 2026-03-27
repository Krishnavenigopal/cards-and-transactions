import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentCard } from "../PaymentCard";
import type { Card }   from "../../../domain/models";

const card: Card = { id: "lkmfkl-mlfkm-dlkfm", description: "Private Card" };

describe("PaymentCard — rendering", () => {
  it("renders the card description", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("Private Card")).toBeInTheDocument();
  });

  it("shows SELECTED text when selected", () => {
    render(<PaymentCard card={card} isSelected={true} onSelect={vi.fn()} />);
    expect(screen.getByText("SELECTED")).toBeInTheDocument();
  });

  it("shows SELECT text when not selected", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("SELECT")).toBeInTheDocument();
  });

  it("renders the masked PAN bullets", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("•••• •••• ••••")).toBeInTheDocument();
  });

  it("renders CARD HOLDER label", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("CARD HOLDER")).toBeInTheDocument();
  });
});

describe("PaymentCard — accessibility", () => {
  // The CardActionArea has role="radio" explicitly set, which overrides the implicit "button" role — so query by role="radio"
  it("renders a radio element", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  it("aria-label is the card description", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-label", "Private Card");
  });

  it("aria-checked=true when selected", () => {
    render(<PaymentCard card={card} isSelected={true} onSelect={vi.fn()} />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true");
  });

  it("aria-checked=false when not selected", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "false");
  });

  it("decorative elements are aria-hidden", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    const hiddenEls = document.querySelectorAll("[aria-hidden='true']");
    expect(hiddenEls.length).toBeGreaterThan(0);
  });

  it("card renders as an article landmark", () => {
    render(<PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });
});

describe("PaymentCard — interaction", () => {
  it("calls onSelect with the card id on click", () => {
    const onSelect = vi.fn();
    render(<PaymentCard card={card} isSelected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("radio"));
    expect(onSelect).toHaveBeenCalledWith("lkmfkl-mlfkm-dlkfm");
  });

  it("calls onSelect exactly once per click", () => {
    const onSelect = vi.fn();
    render(<PaymentCard card={card} isSelected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("radio"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

describe("PaymentCard — theming", () => {
  it("same card id always produces the same background", () => {
    const { rerender } = render(
      <PaymentCard card={card} isSelected={false} onSelect={vi.fn()} />
    );
    const bg1 = screen.getByRole("article").style.background;

    rerender(<PaymentCard card={card} isSelected={true} onSelect={vi.fn()} />);
    const bg2 = screen.getByRole("article").style.background;

    expect(bg1).toBe(bg2);
  });
});