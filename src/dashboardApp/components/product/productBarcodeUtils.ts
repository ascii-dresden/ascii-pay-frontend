import { ProductBarcodeDto, ProductDto } from "../../../common/contracts";

/** All codes of a product as one string, for free-text search and filters. */
export const barcodeSearchText = (product: ProductDto): string =>
  product.barcodes.map((barcode) => barcode.code).join(" ");

/**
 * Short label for list rows: the primary code, plus how many more the product
 * has. `null` when the product has no barcode at all.
 */
export const barcodeSummary = (product: ProductDto): string | null => {
  if (product.barcodes.length === 0) {
    return null;
  }
  const [first, ...rest] = product.barcodes;
  return rest.length === 0 ? first.code : `${first.code} +${rest.length}`;
};

/** The variant a scanned code belongs to, or null for a code we do not know. */
export const findBarcode = (
  product: ProductDto,
  code: string | null | undefined
): ProductBarcodeDto | null => {
  const needle = (code ?? "").trim();
  if (needle.length === 0) {
    return null;
  }
  return product.barcodes.find((barcode) => barcode.code === needle) ?? null;
};
