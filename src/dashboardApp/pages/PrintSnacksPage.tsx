import styled from "@emotion/styled";

import { useGetAllProductsQuery } from "../redux/api/productApi";
import assetLogo from "../../assets/ascii-logo-text.svg";

import "../../assets/fonts/jetbrains-mono.css";
import { Button, CircularProgress } from "@mui/material";
import { moneyToString } from "../../terminalApp/components/Money";
import { PrintOutlined } from "@mui/icons-material";
import React from "react";
import { useTranslation } from "react-i18next";

const Logo = styled.img`
  height: 4rem;
  align-self: end;
`;

const Page = styled.div`
  position: relative;
  display: grid;
  width: 296.5mm;
  height: 209.5mm;
  background-color: white;
  color: black;
  padding-inline: 4rem;
  grid-template-columns: max-content 1fr;
  grid-template-rows: 0 max-content;
  align-content: center;
  row-gap: 4rem;
`;

const List = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-column: 1 / 3;
  column-gap: 4rem;
  align-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-auto-rows: 2rem;
  align-items: start;
`;

const Text = styled.div`
  display: block;
  font-family: JetBrains Mono, monospace;
  font-weight: 500;
  font-size: 16.4384px;
  line-height: 20px;

  &::before {
    content: "";
    margin-bottom: -0.2383em;
    display: table;
  }

  &::after {
    content: "";
    margin-top: -0.2483em;
    display: table;
  }
`;

const PageWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  & > div {
    box-shadow: rgba(0, 0, 0, 0.6) 0.1em 0.2em 1em -0.2em;
  }

  @media print {
    background-color: transparent;
    display: block;
    width: 100%;
    height: 100%;

    & > div {
      box-shadow: none;
    }
  }
`;

const PrintButton = styled.div`
  position: absolute;
  top: 1em;
  right: 1em;

  @media print {
    display: none;
  }
`;

const COLUMN_COUNT = 2;
const TEA_ID = 77;
const dateFormat = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
});

export const PrintSnacksPage = () => {
  const { t } = useTranslation();
  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  if (isLoading) {
    return (
      <Page>
        <CircularProgress sx={{ justifySelf: "center" }} />
      </Page>
    );
  }

  if (isError) {
    return (
      <Page>
        <Text>Failed to load Snacks.</Text>
        {error && <Text>Error: {error.toString()}</Text>}
      </Page>
    );
  }

  if (!products) {
    return <></>;
  }

  const snacks = products
    .filter((product) => product.category === "Snacks" && product.id !== TEA_ID)
    .sort((a, b) => a.name.localeCompare(b.name));

  const onPrintDocument = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <Page>
        <PrintButton>
          <Button
            variant="outlined"
            endIcon={<PrintOutlined />}
            onClick={onPrintDocument}
          >
            {t("layout.print")}
          </Button>
        </PrintButton>
        <Logo src={assetLogo} alt="Logo" />
        <Text style={{ justifySelf: "end", alignSelf: "end" }}>
          {dateFormat.format(new Date())}
        </Text>
        <List>
          {Array.from({ length: COLUMN_COUNT }).map((_, column) => (
            <Grid key={column}>
              {snacks
                .slice(
                  column * Math.ceil(snacks.length / COLUMN_COUNT),
                  (column + 1) * Math.ceil(snacks.length / COLUMN_COUNT)
                )
                .map((snack) => (
                  <>
                    <Text key={`${snack.id} -name`}>{snack.name}</Text>
                    <Text key={`${snack.id} -price`}>
                      {moneyToString(snack.price.Cent ?? 0)}
                    </Text>
                  </>
                ))}
            </Grid>
          ))}
        </List>
      </Page>
    </PageWrapper>
  );
};
