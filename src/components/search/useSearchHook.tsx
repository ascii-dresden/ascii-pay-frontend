import React from "react";
import { useGetAllAccountsQuery } from "../../redux/api/accountApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { AccountDto, ProductDto } from "../../redux/api/contracts";
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
export type SearchResult = SearchResultAccount | SearchResultProduct;

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
      "product.name",
      "product.nickname",
      "product.category",
      "product.tags",
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
