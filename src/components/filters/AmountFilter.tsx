import { useState, useEffect } from "react";
import TextField       from "@mui/material/TextField";
import InputAdornment  from "@mui/material/InputAdornment";
import Box             from "@mui/material/Box";
 
interface Props {
  value:         string;
  onChange:      (value: string) => void;
  label?:        string;
  currency?:     string;
  resultCount?:  number;
}
 
export function AmountFilter({value, onChange,label="Amount",currency= "€",resultCount}: Props) {


    // inputValue is what the user sees — comma as decimal separator ("21,88")
  // value (prop) is what the parent owns — dot as decimal separator ("21.88")
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState("");
 
  // When the parent resets value to "" (card switch), clear the local display
  useEffect(() => {
    if (value === "") {
      setInputValue("");
      setError("");
    }
    console.log("effect")
  }, [value]);
 
  function handleChange(raw: string) {
    setInputValue(raw);
 
    if (raw === "" || raw === "-") {
      setError("");
      onChange("");
      return;
    }
 
    // Valid: optional minus, digits, optional single comma or dot, more digits
    // e.g. "-100,88"  "21.50"  "0"  "-5"
    const isValid = /^-?(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/.test(raw)   // German: dots=thousands, comma=decimal
                 || /^-?\d+(\.\d{1,2})?$/.test(raw);                       // Neutral: dot=decimal only
 
    if (!isValid) {
      setError("Enter a valid amount (e.g. 2.000 or -100,00)");
      return;
    }
 
    // Normalise to a plain float string for parseFloat:
    // 1. Remove thousand-separator dots when followed by exactly 3 digits
    // 2. Replace decimal comma with dot
    const normalised = raw
      .replace(/\.(?=\d{3}(?:[,.]|$))/g, "") // remove thousand dots
      .replace(",", ".");                      // decimal comma → dot
 
    setError("");
    onChange(normalised);
  }

  return (
    <Box sx={{ py: 1.5 }}>
      <TextField
        id="amount-filter"
        type="text"
        label={label}
        inputMode="decimal"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="0,00"
        size="small"
        // helperText="Only transactions at or above this amount will be shown."
        error={!!error}
        helperText={error || " "}
        slotProps={{
          input: {
            startAdornment: (
              /*
                InputAdornment renders the currency symbol visually.
                aria-hidden prevents it being read by screen readers —
                the label "Minimum amount" already gives sufficient context.
              */
              <InputAdornment position="start" aria-hidden="true">
                {currency}
              </InputAdornment>
            ),
          },
          htmlInput: {
            min:0,
            step:0.01,
            "aria-label": `${label} in ${currency}`,
          },
        }}
        sx={{ maxWidth: 240 }}
      />
 
      {/*
        Visually hidden live region.
        Announced to screen readers after filtering without stealing focus.
        "polite" waits until the user stops interacting before speaking.
        Only rendered when a card is selected (resultCount is defined).
      */}
      
      {resultCount !== undefined && (
        <Box
          component="span"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position:"absolute",
            width:1,
            height:1,
            overflow:"hidden",
            clip:"rect(0 0 0 0)",
            whiteSpace:"nowrap",
          }}
        >
          {resultCount === 0
            ? "No transactions match this filter."
            : `${resultCount} transaction${resultCount !== 1 ? "s" : ""} shown.`}
        </Box>
      )}
    </Box>
  );
}