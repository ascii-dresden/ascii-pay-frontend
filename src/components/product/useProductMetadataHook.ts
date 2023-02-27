import { useGetAllProductsQuery } from "../../redux/api/productApi";

export const useProductMetadataHook = () => {
  const { isLoading, data: products } = useGetAllProductsQuery();

  let categories =
    products
      ?.map((p) => p.category)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }) ?? [];
  categories.sort();

  let tags =
    products
      ?.flatMap((p) => p.tags)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }) ?? [];
  tags.sort();

  return {
    isLoading,
    tags,
    categories,
  };
};
