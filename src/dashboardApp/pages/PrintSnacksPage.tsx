import styled from "@emotion/styled";

import { useGetAllProductsQuery } from "../redux/api/productApi";
import assetLogo from "../../assets/ascii-logo-text.svg";

import "../../assets/fonts/jetbrains-mono.css";
import { CircularProgress } from "@mui/material";

const Logo = styled.img`
  height: 4rem;
  align-self: end;
`;

const Page = styled.div`
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
  aligncontent: center;
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

const COLUMN_COUNT = 2;
const TEA_ID = 77;

export const PrintSnacksPage = () => {
  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  if (isLoading)
    return (
      <Page>
        <CircularProgress sx={{ justifySelf: "center" }} />
      </Page>
    );

  if (isError)
    return (
      <Page>
        <Text>Failed to load Snacks.</Text>
        {error && <Text>Error: {error.toString()}</Text>}
      </Page>
    );

  if (!products) return <></>;

  const snacks = products
    .filter((product) => product.category === "Snacks" && product.id !== TEA_ID)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Page>
      <Logo src={assetLogo} alt="Logo" />
      <Text style={{ justifySelf: "end", alignSelf: "end" }}>
        {new Intl.DateTimeFormat("de-DE").format(new Date())}
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
                    {snack.price.Cent !== undefined
                      ? new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        }).format(snack.price.Cent / 100)
                      : "N/A"}
                  </Text>
                </>
              ))}
          </Grid>
        ))}
      </List>
    </Page>
  );
};
