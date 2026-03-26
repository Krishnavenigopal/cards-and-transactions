import ListItem     from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography   from "@mui/material/Typography";
 
import type { Transactions } from "../../domain/models";
import { formatCurrency }   from "../../utilities/helper";
 
interface Props {
  transaction: Transactions;
  accentColor?: string;
}
 
export function TransactionRow({ transaction, accentColor }: Props) {
  const { description, amount } = transaction;
  const formattedAmount = formatCurrency(amount);
// const formattedAmount = amount;
 
  return (
    <ListItem
      data-testid="transaction-row"
      aria-label={`${description}, ${formattedAmount}`}
      disableGutters
      divider
      secondaryAction={
        <Typography
          aria-hidden="true"
          variant="body2"
          component="span"
          sx={{
            fontWeight: 700,
            fontFamily: "monospace",
            color:      accentColor ?? "primary.main",
            pr:         1,
          }}
        >
          {formattedAmount}
        </Typography>
      }
    >
      <ListItemText
        primary={description}
        slotProps={{
          primary: {
            variant:    "body2",
            fontWeight: 600,
            color:      "text.primary",
          },
        }}
      />
    </ListItem>
  );
}