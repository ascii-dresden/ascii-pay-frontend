import styled from "@emotion/styled";

import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../redux/api/productApi";
import assetLogo from "../../assets/ascii-logo-text.svg";

import "../../assets/fonts/jetbrains-mono.css";
import { Button, ButtonGroup, CircularProgress } from "@mui/material";
import { moneyToString } from "../../terminalApp/components/Money";
import { DeleteOutlined, PrintOutlined } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDashboardSelector } from "../redux/dashboardStore";
import {
  AccountDto,
  ProductDto,
  RoleDto,
  SaveProductDto,
} from "../../common/contracts";
import { toast } from "react-toastify";
import { useGetMeQuery } from "../redux/api/userApi";
import { SelectProductPopup } from "../components/product/SelectProductPopup";

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
  grid-auto-rows: max-content;
  row-gap: 1rem;
  align-items: start;
`;

const Text = styled.div`
  display: block;
  font-family: JetBrains Mono, monospace;
  font-weight: 500;
  font-size: 16.4384px;
  line-height: 20px;
  position: relative;

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

    @page {
      size: A4 landscape;
      margin: 0;
    }
  }
`;

const ProductRemoveWrapper = styled.div`
  position: absolute;
  top: 0;
  left: -2.4em;
  bottom: 0;
  width: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.2;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media print {
    display: none;
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
const dateFormat = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
});

function hasUserPermissions(
  user: AccountDto | null,
  permissions: RoleDto[]
): boolean {
  if (!user) {
    return false;
  }

  return permissions.includes(user?.role);
}

export const PrintListPage = () => {
  const { t } = useTranslation();

  const token = useDashboardSelector((state) => state.userState.token);
  const user = useDashboardSelector((state) => state.userState.user);

  useGetMeQuery(token);

  const hasEditPermission = hasUserPermissions(user, ["Admin", "Purchaser"]);

  let params = useParams();
  let listName = params.listName ?? "";

  const [
    updateProduct,
    {
      isLoading: isMutationLoading,
      isError: isMutationError,
      error: mutationError,
      isSuccess: isMutationSuccess,
    },
  ] = useUpdateProductMutation();

  const togglePrintListForProduct = React.useCallback(
    async (product: ProductDto, listName: string) => {
      let newPrintList = [...product.print_lists];

      let index = newPrintList.indexOf(listName);
      if (index >= 0) {
        newPrintList.splice(index, 1);
      } else {
        newPrintList.push(listName);
      }

      let saveProduct: SaveProductDto = {
        ...product,
        print_lists: newPrintList,
        status_prices: product.status_prices.map((sp) => ({
          ...sp,
          status_id: sp.status.id,
        })),
      };
      await updateProduct({
        id: product.id,
        product: saveProduct,
      });
    },
    [updateProduct]
  );

  const {
    isLoading,
    isError,
    error,
    data: products,
  } = useGetAllProductsQuery();

  useEffect(() => {
    if (isMutationSuccess) {
      toast.success("Product updated successfully!");
    } else if (isMutationError) {
      toast.error("Product could not be updated!");
      console.error(error);
    }
  }, [isMutationLoading]);

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

  const printProducts = products
    .filter((product) =>
      listName === ""
        ? product.category === "Snacks"
        : product.print_lists.includes(listName)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const onPrintDocument = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <Page>
        <PrintButton>
          <ButtonGroup>
            {hasEditPermission && (
              <SelectProductPopup
                fullSizeButton
                selectProduct={(product) =>
                  togglePrintListForProduct(product, listName)
                }
              />
            )}
            <Button
              variant="contained"
              startIcon={<PrintOutlined />}
              onClick={onPrintDocument}
            >
              {t("layout.print")}
            </Button>
          </ButtonGroup>
        </PrintButton>
        <Logo src={assetLogo} alt="Logo" />
        <Text style={{ justifySelf: "end", alignSelf: "end" }}>
          {dateFormat.format(new Date())}
        </Text>
        <List>
          {Array.from({ length: COLUMN_COUNT }).map((_, column) => (
            <Grid key={column}>
              {printProducts
                .slice(
                  column * Math.ceil(printProducts.length / COLUMN_COUNT),
                  (column + 1) * Math.ceil(printProducts.length / COLUMN_COUNT)
                )
                .map((printProduct) => (
                  <React.Fragment key={printProduct.id}>
                    <Text key={`${printProduct.id}-name`}>
                      {printProduct.name}
                      {hasEditPermission && (
                        <ProductRemoveWrapper
                          onClick={() =>
                            togglePrintListForProduct(printProduct, listName)
                          }
                        >
                          <DeleteOutlined />
                        </ProductRemoveWrapper>
                      )}
                    </Text>
                    <Text key={`${printProduct.id}-price`}>
                      {moneyToString(printProduct.price.Cent ?? 0)}
                    </Text>
                  </React.Fragment>
                ))}
            </Grid>
          ))}
        </List>
      </Page>
    </PageWrapper>
  );
};
