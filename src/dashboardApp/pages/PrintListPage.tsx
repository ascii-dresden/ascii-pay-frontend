import styled from "@emotion/styled";

import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "../redux/api/productApi";
import assetLogo from "../../assets/ascii-logo-text.svg";
import assetVegan from "../../assets/vegan.svg";

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
  SubProductDto,
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

/**
 * One cell of the price list. Rows are separated by a thin line so the eye can
 * follow a name across to its price; the padding replaces the former row gap.
 */
const RowText = styled(Text)`
  padding-block: 0.5rem;
  border-bottom: 0.5pt solid #b0b0b0;
`;

const PriceText = styled(RowText)`
  padding-left: 1rem;
  text-align: right;
`;

/** Without the row line: a product followed by its sub products draws it below the list. */
const groupedRowStyle: React.CSSProperties = {
  borderBottom: "none",
  paddingBottom: "0.25rem",
};

/** The sub products of a product (Kinder: Riegel, Pinguin, …), across both columns. */
const SubProductList = styled.ul`
  grid-column: 1 / -1;
  margin: 0;
  padding: 0 0 0.5rem 1.6rem;
  border-bottom: 0.5pt solid #b0b0b0;
  list-style: disc;
  font-family: JetBrains Mono, monospace;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
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
  left: -4em;
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

const VeganIcon = styled.img`
  position: absolute;
  left: -1.8em;
  top: 50%;
  transform: translateY(-50%);
  height: 1em;
  width: 1em;

  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
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

function isVegan(product: ProductDto): boolean {
  return product.tags.some((tag) => tag.toLowerCase() === "vegan");
}

/** Sub products listed below the product on its print lists. */
function printedSubProducts(product: ProductDto): SubProductDto[] {
  return product.sub_products
    .filter((sub) => sub.active && sub.show_on_print_list)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Rendered height of a product row in product rows (sub product lines are smaller). */
function printWeight(product: ProductDto): number {
  return 1 + printedSubProducts(product).length * 0.6;
}

/**
 * Splits the (sorted) products into columns of about the same height, keeping
 * the order: a product with many sub products counts as more than one row.
 */
function splitIntoColumns(
  products: ProductDto[],
  count: number
): ProductDto[][] {
  const total = products.reduce((sum, p) => sum + printWeight(p), 0);
  const target = total / count;
  const columns: ProductDto[][] = [[]];
  let height = 0;
  for (const product of products) {
    const weight = printWeight(product);
    // Start the next column when this product would end up mostly past the
    // target height of the current one.
    if (
      columns.length < count &&
      columns[columns.length - 1].length > 0 &&
      height + weight / 2 > target * columns.length
    ) {
      columns.push([]);
    }
    columns[columns.length - 1].push(product);
    height += weight;
  }
  while (columns.length < count) {
    columns.push([]);
  }
  return columns;
}

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
          {splitIntoColumns(printProducts, COLUMN_COUNT).map(
            (columnProducts, column) => (
              <Grid key={column}>
                {columnProducts.map((printProduct) => {
                  const subProducts = printedSubProducts(printProduct);
                  const rowStyle =
                    subProducts.length > 0 ? groupedRowStyle : undefined;
                  return (
                    <React.Fragment key={printProduct.id}>
                      <RowText key={`${printProduct.id}-name`} style={rowStyle}>
                        {isVegan(printProduct) && (
                          <VeganIcon
                            src={assetVegan}
                            alt="Vegan"
                            title="Vegan"
                          />
                        )}
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
                      </RowText>
                      <PriceText
                        key={`${printProduct.id}-price`}
                        style={rowStyle}
                      >
                        {moneyToString(printProduct.price.Cent ?? 0)}
                      </PriceText>
                      {subProducts.length > 0 ? (
                        <SubProductList key={`${printProduct.id}-subs`}>
                          {subProducts.map((sub) => (
                            <li key={sub.id}>{sub.name}</li>
                          ))}
                        </SubProductList>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </Grid>
            )
          )}
        </List>
      </Page>
    </PageWrapper>
  );
};
