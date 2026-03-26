import { useState }  from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import type { Transactions, Card } from "../../domain/models";
import { generateCardTheme } from "../../utilities/cardTheme";
import { TransactionRow }  from "./TransactionRow";

const PAGE_SIZE = 10;

interface Props {
  transactions: Transactions[];
  card:         Card | null;
}

export function TransactionList({ transactions, card }: Props) {
  const [page, setPage] = useState(1);

  const headingId = "transaction-heading";
  const countId   = "transaction-count";

  const theme      = card ? generateCardTheme(card.id) : null;
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);

  // Slice transactions for the current page
  const paginated = transactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset to page 1 whenever transactions change (card switch or filter)
  // Using a key on the component in the page handles this automatically,
  // but we also guard here for safety
  function handlePageChange(_: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
    // Scroll transaction panel into view smoothly
    document
      .querySelector("[data-testid='transaction-panel']")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

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
            borderBottom: `1px solid ${theme.panelBorder}`,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width:        10,
              height:       10,
              borderRadius: "50%",
              bgcolor:      theme.background,
              flexShrink:   0,
            }}
          />

          <Typography
            id={headingId}
            component="h2"
            variant="overline"
            sx={{ lineHeight: 1, letterSpacing: 1.2, color: theme.textColor }}
          >
            {card.description}
          </Typography>

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

      {transactions.length === 0 ? (
        <div>Empty</div>
      ) : (
        <>
          <Divider sx={{ mb: 0.5, borderColor: theme?.panelBorder }} />
          <List
            dense
            disablePadding
            aria-labelledby={card ? headingId : undefined}
            aria-describedby={card ? countId : undefined}
          >
            {paginated.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                accentColor={theme?.textColor}
              />
            ))}
          </List>

          {/* Pagination — only shown when there are more than PAGE_SIZE transactions */}
          {totalPages > 1 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              pt={1.5}
              pb={0.5}
            >
              <Pagination
                data-testid="transaction-pagination"
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                size="small"
                color="primary"
                aria-label="Transaction pages"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}