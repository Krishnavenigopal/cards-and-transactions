import type { Card } from "../../domain/models";
import { generateCardTheme } from "../../utilities/cardTheme";
import {
  Card as MuiCard,
  CardActionArea,
  Box,
  Typography,
} from "@mui/material";

interface Props {
  card: Card;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function PaymentCard({ card, isSelected, onSelect }: Props) {
  const { id, description } = card;

  const theme = generateCardTheme(id);

  return (
    <MuiCard
      component="article"
      elevation={0}
      sx={{
        width: 300,
        height: 180,
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        background: theme.background,
        transform:    isSelected ? "translateY(-8px) scale(1.08)" : "scale(1)",
        opacity:      isSelected ? 1 : 0.9,
        // Selection ring uses the card's own background colour
        outline:      isSelected ? `3px solid ${theme.background}` : "none",
        outlineOffset: isSelected ? "4px" : "0",
        transition: "all 0.25s ease",
      }}
    >
      <CardActionArea
        component="button"
        type="button"
        onClick={() => onSelect(id)}
        role="radio"
        aria-checked={isSelected}
        aria-label={description}
        sx={{
          width: "100%",
          height: "100%",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "stretch",
          textAlign: "left",
          "&:focus-visible": {
            outline:       `3px solid ${theme.background}`,
            outlineOffset: -3,
          },
        }}
      >
        <Box
          aria-hidden="true"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            sx={{
              width: 40,
              height: 28,
              borderRadius: 1,
              background:
                "linear-gradient(135deg, #d4af37, #f1d27a, #c5a028)",
            }}
          />
        </Box>

        <Typography
          aria-hidden="true"
          sx={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 18,
            letterSpacing: 3,
            color:theme.textColor,
          }}
        >
          •••• •••• ••••
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Typography
              aria-hidden="true"
              variant="caption"
              sx={{ color:theme.textColor, fontSize: 10 }}
            >
              CARD HOLDER
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color:theme.textColor,
              }}
            >
              {description}
            </Typography>
          </Box>

          <Typography
            aria-hidden="true"
            variant="caption"
            sx={{
              color:theme.textColor,
              fontSize: 11,
            }}
          >
           {isSelected?'SELECTED':'SELECT'} 
          </Typography>
        </Box>
      </CardActionArea>
    </MuiCard>
  );
}