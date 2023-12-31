import { useGetAllAccountsQuery } from "../../redux/api/accountApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { AccountDto, ProductDto } from "../../../common/contracts";
import Fuse from "fuse.js";

export type SearchResultAccount = {
  type: "account";
  account: AccountDto;
  score?: number;
};
export type SearchResultProduct = {
  type: "product";
  product: ProductDto;
  score?: number;
};
export type SearchResultActionType = "newAccount" | "newProduct";
export type SearchResultAction = {
  type: "action";
  action: SearchResultActionType;
  label: string;
  score?: number;
};
export type SearchResult =
  | SearchResultAccount
  | SearchResultProduct
  | SearchResultAction;

type SearchHookResult = {
  isLoading: boolean;
  results: SearchResult[];
};

export const useSearchHook = (
  search: string,
  maxItemCount?: number
): SearchHookResult => {
  const { isLoading: accountsIsLoading, data: accounts } =
    useGetAllAccountsQuery();

  const { isLoading: productsIsLoading, data: products } =
    useGetAllProductsQuery();

  let list = [
    ...(accounts?.map(mapAccount) ?? []),
    ...(products?.map(mapProduct) ?? []),
    ...getActions(),
  ];

  const fuse = new Fuse(list, {
    isCaseSensitive: false,
    includeScore: true,
    shouldSort: true,
    threshold: 0.4,
    keys: [
      "account.name",
      "account.email",
      "account.role",
      "account.status.name",
      "product.name",
      "product.nickname",
      "product.category",
      "product.tags",
      "label",
      "type",
    ],
  });
  let result = fuse.search(search);

  if (maxItemCount && result.length > maxItemCount) {
    result = result.slice(0, maxItemCount);
  }

  return {
    isLoading: accountsIsLoading || productsIsLoading,
    results: result.map((r) => ({
      ...r.item,
      score: r.score,
    })),
  };
};

function mapAccount(account: AccountDto): SearchResultAccount {
  return {
    type: "account",
    account,
  };
}

function mapProduct(product: ProductDto): SearchResultProduct {
  return {
    type: "product",
    product,
  };
}

function getActions(): SearchResultAction[] {
  return [
    {
      type: "action",
      action: "newAccount",
      label: "Action: Create new account",
    },
    {
      type: "action",
      action: "newProduct",
      label: "Action: Create new product",
    },
  ];
}
