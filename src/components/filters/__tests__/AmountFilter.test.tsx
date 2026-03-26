import { render, screen } from "@testing-library/react";
import userEvent           from "@testing-library/user-event";
import { AmountFilter }    from "../AmountFilter";

function setup(value = "", onChange = vi.fn()) {
  render(<AmountFilter value={value} onChange={onChange} />);
  return { input: screen.getByRole("textbox"), onChange };
}

describe("AmountFilter — rendering", () => {
  it("renders the label", () => {
    setup();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<AmountFilter value="" onChange={vi.fn()} label="Min" />);
    expect(screen.getByLabelText(/Min/i)).toBeInTheDocument();
  });

  it("renders the currency symbol", () => {
    setup();
    expect(screen.getByText("€")).toBeInTheDocument();
  });

  it("renders the placeholder", () => {
    setup();
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "0,00");
  });
});

describe("AmountFilter — valid input", () => {
  it("accepts a plain integer", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "50");
    expect(onChange).toHaveBeenLastCalledWith("50");
    expect(screen.queryByText(/Enter a valid amount/)).not.toBeInTheDocument();
  });

  it("accepts a large plain integer (200000)", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "200000");
    expect(onChange).toHaveBeenLastCalledWith("200000");
  });

  it("accepts German thousand-separator format (2.000) → normalises to 2000", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "2.000");
    expect(onChange).toHaveBeenLastCalledWith("2000");
    expect(screen.queryByText(/Enter a valid amount/)).not.toBeInTheDocument();
  });

  it("accepts multi-group thousands (2.005.000) → 2005000", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "2.005.000");
    expect(onChange).toHaveBeenLastCalledWith("2005000");
  });

  it("accepts German thousands with decimal (2.040,00) → 2040.00", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "2.040,00");
    expect(onChange).toHaveBeenLastCalledWith("2040.00");
  });

  it("accepts comma-decimal (21,88) → 21.88", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "21,88");
    expect(onChange).toHaveBeenLastCalledWith("21.88");
  });

  it("accepts dot-decimal (21.88) → 21.88", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "21.88");
    expect(onChange).toHaveBeenLastCalledWith("21.88");
  });

  it("accepts negative integer (-5)", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "-5");
    expect(onChange).toHaveBeenLastCalledWith("-5");
  });

  it("accepts negative comma-decimal (-100,88) → -100.88", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "-100,88");
    expect(onChange).toHaveBeenLastCalledWith("-100.88");
  });

  it("calls onChange with empty string when cleared", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "50");
    await userEvent.clear(input);
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("does not call onChange for bare minus — still typing", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "-");
    expect(onChange).not.toHaveBeenCalledWith("-");
  });
});

describe("AmountFilter — invalid input", () => {
  it("shows error for letters", async () => {
    const { input, onChange } = setup();
    await userEvent.type(input, "abc");
    expect(screen.getByText(/Enter a valid amount/)).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows error for alphanumeric (12abc)", async () => {
    const { input } = setup();
    await userEvent.type(input, "12abc");
    expect(screen.getByText(/Enter a valid amount/)).toBeInTheDocument();
  });

  it("shows error for multiple separators (1.2.3 — not valid thousand grouping)", async () => {
    const { input } = setup();
    await userEvent.type(input, "1.2.3");
    expect(screen.getByText(/Enter a valid amount/)).toBeInTheDocument();
  });

  it("clears error when valid input follows", async () => {
    const onChange = vi.fn();
    render(<AmountFilter value="" onChange={onChange} />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "abc");
    expect(screen.getByText(/Enter a valid amount/)).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, "2.000");
    expect(screen.queryByText(/Enter a valid amount/)).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith("2000");
  });
});

describe("AmountFilter — card switch reset", () => {
  it("clears input and error when value prop resets to empty", async () => {
    const { rerender } = render(<AmountFilter value="50" onChange={vi.fn()} />);
    rerender(<AmountFilter value="" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });
});

describe("AmountFilter — live region", () => {
  it("renders result count when resultCount is defined", () => {
    render(<AmountFilter value="50" onChange={vi.fn()} resultCount={3} />);
    expect(screen.getByRole("status")).toHaveTextContent("3 transactions shown.");
  });

  it("uses singular when resultCount is 1", () => {
    render(<AmountFilter value="50" onChange={vi.fn()} resultCount={1} />);
    expect(screen.getByRole("status")).toHaveTextContent("1 transaction shown.");
  });

  it("announces no results when resultCount is 0", () => {
    render(<AmountFilter value="9999" onChange={vi.fn()} resultCount={0} />);
    expect(screen.getByRole("status")).toHaveTextContent("No transactions match this filter.");
  });

  it("does not render live region when resultCount is undefined", () => {
    render(<AmountFilter value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
