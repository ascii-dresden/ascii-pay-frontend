import { useGetAllPurchasesQuery } from "../../redux/api/purchaseApi";

export const usePurchaseMetadataHook = () => {
  const { isLoading, data: purchases } = useGetAllPurchasesQuery();

  let stores =
    purchases
      ?.map((p) => p.store)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }) ?? [];
  stores.sort();

  return {
    isLoading,
    stores,
  };
};
