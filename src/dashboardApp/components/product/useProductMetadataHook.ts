import { useGetAllProductsQuery } from "../../redux/api/productApi";
import React from "react";

export const useProductMetadataHook = () => {
  const { isLoading, data: products } = useGetAllProductsQuery();

  const { tags, printLists, categories } = React.useMemo(() => {
    let categories =
      products
        ?.map((p) => p.category)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        }) ?? [];
    categories.sort();

    let printLists =
      products
        ?.flatMap((p) => p.print_lists)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        }) ?? [];
    printLists.sort();

    let tags =
      products
        ?.flatMap((p) => p.tags)
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        }) ?? [];
    tags.sort();

    return {
      tags,
      printLists,
      categories,
    };
  }, [products]);

  return {
    isLoading,
    tags,
    printLists,
    categories,
  };
};
