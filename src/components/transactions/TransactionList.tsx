import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { generateCardTheme } from "../../utilities/cardTheme";
import type { Transactions, Card } from "../../domain/models";
import { TransactionRow }  from "./TransactionRow";
// import { EmptyState }             from "../common/EmptyState";
 
interface Props {
  transactions: Transactions[];
  card:         Card | null;
}
 
export function TransactionList({ transactions, card }: Props) {
  const headingId = "transaction-heading";
  const countId   = "transaction-count";
 
  const theme = card ? generateCardTheme(card.id) : null;
  return (
    <Box
      component="section"
      data-testid="transaction-panel"
      aria-label={card ? `${card.description} transactions` : "Transactions"}
      aria-live="polite"
      aria-atomic="false"
      sx={{
        borderRadius: 2,
        border:      theme ? `1.5px solid ${theme.panelBorder}` : "1px solid transparent",
        bgcolor:     theme ? theme.background : "transparent",
        px:           card ? 2.5 : 0,
        pt:           card ? 0.5 : 0,
        pb:           card ? 1   : 0,
        // Smooth colour transition when switching cards
        transition:  "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {card && theme && (
        <Box
          component="header"
          sx={{
            display:"flex",
            alignItems:   "center",
            gap:          1,
            pt:           2,
            pb:           0.5,
            mb:           0.5,
            borderBottom: "1px solid ${theme.panelBorder}",
          }}
        >
          <Typography
            id={headingId}
            component="h2"
            variant="overline"
            sx={{ lineHeight: 1, letterSpacing: 1.2, color: theme.textColor, }}
          >
            {card.description}
          </Typography>
 
          {/*
            role="status" + aria-live="polite" — announced when filter changes.
            "3 transactions" or "0 transactions" is read without stealing focus.
          */}
          <Typography
            id={countId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            variant="caption"
            sx={{ color: theme.textColor, ml: "auto" }}
          >
            {transactions.length}{" "}
            {transactions.length === 1 ? "transaction" : "transactions"}
          </Typography>
        </Box>
      )}
 
      {/* Content */}
      {transactions.length === 0 ? (
        <div>Empty</div>
      ) : (
        <>
          <Divider sx={{ mb: 0.5, borderColor: theme?.panelBorder }} />
          {/*
            List → <ul>
            aria-labelledby  links to the h2: "Private Card"
            aria-describedby links to the count: "3 transactions"
            Together AT reads: "Private Card, list, 3 transactions"
          */}
          <List
            dense
            disablePadding
            aria-labelledby={card ? headingId : undefined}
            aria-describedby={card ? countId : undefined}
          >
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} accentColor={theme?.textColor} />
            ))}
          </List>
        </>
      )}
    </Box>
  );
}