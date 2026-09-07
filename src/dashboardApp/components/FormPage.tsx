import React from "react";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, PageHeaderNavigation } from "./PageHeader";

/**
 * Reads the optional `returnTo` query parameter used by interaction pages to
 * get back to where the user came from.
 */
export const useReturnTo = (fallback: string): string => {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  return returnTo && returnTo.startsWith("/") ? returnTo : fallback;
};

/**
 * Layout for interaction pages (forms and confirmations) that replace
 * dialogs. Renders breadcrumbs, a title with a back arrow, the form content
 * in a paper and the action buttons in a bar that sticks to the bottom on
 * phones.
 */
export const FormPage = (props: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  navigation: PageHeaderNavigation[];
  /** Target of the back arrow; defaults to the last breadcrumb entry. */
  backTo?: string;
  children: React.ReactNode;
  /** Buttons, rendered right-aligned (desktop) or full width (mobile). */
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg";
  /** Render children without the surrounding paper padding. */
  disableContentPadding?: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const backTo =
    props.backTo ??
    props.navigation[props.navigation.length - 1]?.target ??
    "/";

  return (
    <Container maxWidth={props.maxWidth ?? "sm"} sx={{ pb: isMobile ? 12 : 4 }}>
      <PageHeader navigation={props.navigation}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            edge="start"
            aria-label="back"
            onClick={() => navigate(backTo)}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" component="h1">
              {props.title}
            </Typography>
            {props.subtitle && (
              <Typography variant="body2" color="text.secondary">
                {props.subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </PageHeader>

      <Paper elevation={4} sx={{ p: props.disableContentPadding ? 0 : 2 }}>
        {props.children}
      </Paper>

      {props.actions && (
        <Paper
          elevation={isMobile ? 8 : 0}
          square={isMobile}
          sx={
            isMobile
              ? {
                  position: "fixed",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  p: 2,
                  display: "flex",
                  flexDirection: "column-reverse",
                  gap: 1,
                  zIndex: theme.zIndex.appBar,
                  "& > *": { width: "100%" },
                }
              : {
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  background: "transparent",
                }
          }
        >
          {props.actions}
        </Paper>
      )}
    </Container>
  );
};
