export type CoinTypeDto = "Cent" | "CoffeeStamp" | "BottleStamp";

export type CoinAmountDto = {
  Cent?: number;
  CoffeeStamp?: number;
  BottleStamp?: number;
};

export type RoleDto = "Basic" | "Member" | "Purchaser" | "Admin";

export type CardTypeDto = "NfcId" | "AsciiMifare" | "HostCardEmulation";

export type AuthMethodDtoPasswordBased = {
  type: "PasswordBased";
  username: string;
};

export type AuthMethodDtoNfcBased = {
  type: "NfcBased";
  name: string;
  card_id: string;
  card_type: CardTypeDto;
  depends_on_session?: string | null;
};

export type AuthMethodDtoPublicTab = {
  type: "PublicTab";
};

export type AuthMethodDto =
  | AuthMethodDtoPasswordBased
  | AuthMethodDtoNfcBased
  | AuthMethodDtoPublicTab;

export type AccountStatusDto = {
  id: number;
  name: string;
  color: string;
  priority: number;
};

export type SaveAccountStatusDto = {
  name: string;
  color: string;
  priority: number;
};

export type AccountDto = {
  id: number;
  balance: CoinAmountDto;
  name: string;
  email: string;
  role: RoleDto;
  auth_methods: AuthMethodDto[];
  enable_monthly_mail_report: boolean;
  enable_automatic_stamp_usage: boolean;
  status: AccountStatusDto | null;
};

export type SaveAccountDto = {
  name: string;
  email: string;
  role: RoleDto;
  enable_monthly_mail_report: boolean;
  enable_automatic_stamp_usage: boolean;
  status_id: number | null;
};

export type CreateAdminAccountDto = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type AuthTokenDto = {
  token: string;
};

export type AuthPasswordBasedDto = {
  username: string;
  password: string;
  longLived?: boolean;
};

export type ProductStatusPriceDto = {
  status: AccountStatusDto;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
};

/**
 * One barcode of a product: a purchasing variant with its own container size. The code on the
 * single bottle and the code on the crate belong to the same product but stand for a different
 * number of single units. Alias codes simply use `container_size: 1`.
 */
export type ProductBarcodeDto = {
  id: number;
  code: string;
  /** Single units this code stands for (crate of 20 => 20). */
  container_size: number;
  /** Free text shown next to the code, e.g. "Kasten 20x0,5l". */
  label: string;
  /** Sub product the code belongs to; null = the product itself. */
  sub_product_id: number | null;
};

/**
 * A purchasing variant that is tracked on its own (name, codes, purchase tax,
 * price history) but sold as the parent product: "Haribo" is one product on
 * the snack list, Goldbären and Tropifrutti are its sub products.
 */
export type SubProductDto = {
  id: number;
  name: string;
  purchase_tax: number;
  /** Inactive sub products keep their history but are no longer offered. */
  active: boolean;
  /** Listed below the product on every print list (snack list) the product is on. */
  show_on_print_list: boolean;
  /** Target stock in single units; the inventory is counted per sub product. */
  target_quantity: number;
};

export type SaveSubProductDto = {
  /** Existing sub product to update; absent creates a new one. */
  id?: number | null;
  /** Client chosen key that barcodes of the same save reference via `sub_product_key`. */
  key?: string | null;
  name: string;
  /** Defaults to the purchase tax of the product. */
  purchase_tax?: number | null;
  /** Defaults to true. */
  active?: boolean;
  /** Defaults to false. */
  show_on_print_list?: boolean;
  /** Defaults to 0. */
  target_quantity?: number;
};

export type SaveProductBarcodeDto = {
  code: string;
  /** Defaults to 1. */
  container_size?: number;
  /** Defaults to "". */
  label?: string;
  /** Existing sub product of the product. */
  sub_product_id?: number | null;
  /** `key` of an entry in `sub_products` of the same save; wins over `sub_product_id`. */
  sub_product_key?: string | null;
};

/** A product that already uses a barcode, for the duplicate warning in the product form. */
export type BarcodeConflictDto = {
  product_id: number;
  product_name: string;
};

export type ProductDto = {
  id: number;
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  purchase_tax: number;
  nickname?: string | null;
  /** @deprecated Primary (first) code, read only. Use `barcodes`. */
  barcode?: string | null;
  barcodes: ProductBarcodeDto[];
  /** Sub products, oldest first (inactive ones included). */
  sub_products: SubProductDto[];
  category: string;
  print_lists: string[];
  tags: string[];
  status_prices: ProductStatusPriceDto[];
  /** Part of the active assortment (inventory). */
  stocked: boolean;
  /** Par level in single units. */
  target_quantity: number;
};

export type ItemWithPriceDto = {
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  status_prices: ProductStatusPriceDto[];
};

export type PriceBonusDto = {
  price: CoinAmountDto;
  bonus: CoinAmountDto;
};

export type SaveProductStatusPriceDto = {
  status_id: number;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
};

export type SaveProductDto = {
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  purchase_tax: number;
  nickname?: string | null;
  /**
   * @deprecated Legacy single code. Only read on create and only when `barcodes` is absent;
   * ignored on update. Send `barcodes` instead.
   */
  barcode?: string | null;
  /**
   * Replaces the whole barcode list (`[]` clears it). When absent the product keeps the
   * barcodes it has, so a partial update can never drop variants it does not know about.
   */
  barcodes?: SaveProductBarcodeDto[];
  /**
   * Replaces the sub products (entries with `id` are updated, the others
   * created). Missing ones are deleted, or only deactivated when something was
   * bought as them. When absent the sub products stay as they are.
   */
  sub_products?: SaveSubProductDto[];
  category: string;
  print_lists: string[];
  tags: string[];
  status_prices: SaveProductStatusPriceDto[];
  stocked: boolean;
  target_quantity: number;
};

export type TransactionItemDto = {
  effective_price: CoinAmountDto;
  product?: ProductDto | null;
};

export type TransactionDto = {
  id: number;
  timestamp: string;
  account_id?: number | null;
  authorized_by_account_id?: number | null;
  authorized_with_method?: AuthMethodTypeDto | null;
  items: TransactionItemDto[];
};

export type PaymentItemDto = {
  effective_price: CoinAmountDto;
  product_id?: number | null;
};

export type PaymentDto = {
  items: PaymentItemDto[];
};

export type PaymentResponseDto = {
  account: AccountDto;
  transaction: TransactionDto;
};

export type SaveAuthPasswordDto = {
  username: string;
  password: string;
};

export type PasswordResetTokenDto = {
  token: string;
};

export type UpdateAuthNfcDto = {
  card_id: string;
  name: string;
};

export type DeleteAuthNfcDto = {
  card_id: string;
};

export type AuthMethodTypeDto =
  | "PasswordBased"
  | "NfcBased"
  | "PublicTab"
  | "PasswordResetToken";

export type SessionDto = {
  auth_method: AuthMethodTypeDto;
  valid_until: string;
  is_single_use: boolean;
};

export type RegisterHistoryStateDto = {
  coin200: number;
  coin100: number;
  coin50: number;
  coin20: number;
  coin10: number;
  coin5: number;
  coin2: number;
  coin1: number;
  note100: number;
  note50: number;
  note20: number;
  note10: number;
  note5: number;
};

export type RegisterHistoryDto = {
  id: number;
  timestamp: string;
  source_register: RegisterHistoryStateDto;
  target_register: RegisterHistoryStateDto;
  envelope_register: RegisterHistoryStateDto;
};

export type SaveRegisterHistoryDto = {
  source_register: RegisterHistoryStateDto;
  target_register: RegisterHistoryStateDto;
  envelope_register: RegisterHistoryStateDto;
};

export type PurchaseStateDto = "draft" | "finalized";

export type PurchaseDto = {
  id: number;
  /** Optional label for a shopping trip, "" when unset. */
  name: string;
  store: string;
  timestamp: string;
  state: PurchaseStateDto;
  purchased_by_account_id: number | null;
  finalized_at: string | null;
  finalized_by_account_id: number | null;
  items: PurchaseItemDto[];
};

export type PurchaseItemDto = {
  id: number;
  name: string;
  container_size: number;
  container_count: number;
  container_cents: number;
  /** Best-before date (MHD) as "YYYY-MM-DD" or null. */
  best_before: string | null;
  /** Barcode remembered for items without a linked product. */
  barcode: string | null;
  /** false = planned item on the shopping list, true = in the cart. */
  collected: boolean;
  product: ProductDto | null;
  /** Sub product of `product` that was bought (see `product.sub_products`). */
  sub_product_id: number | null;
};

export type SavePurchaseDto = {
  name?: string;
  store: string;
  timestamp: string;
  /** Only honoured on create. Defaults to "draft". */
  state?: PurchaseStateDto;
  purchased_by_account_id: number | null;
  /**
   * On create: initial items. On update: when present the item list is
   * replaced (draft only); when absent only the header fields change.
   */
  items?: SavePurchaseItemDto[];
};

export type SavePurchaseItemDto = {
  name: string;
  container_size: number;
  container_count: number;
  container_cents: number;
  best_before?: string | null;
  barcode?: string | null;
  /** Defaults to true. */
  collected?: boolean;
  product_id: number | null;
  /** Sub product of `product_id` that was bought. */
  sub_product_id?: number | null;
};

export type UpdateInventoryProductDto = {
  product_id: number;
  stocked: boolean;
  target_quantity: number;
};

export type InventoryLastPurchaseDto = {
  purchase_id: number;
  timestamp: string;
  container_size: number;
  container_cents: number;
};

export type InventorySubProductRowDto = {
  sub_product_id: number;
  target_quantity: number;
  last_counted_quantity: number | null;
};

export type InventoryRowDto = {
  product: ProductDto;
  target_quantity: number;
  last_counted_quantity: number | null;
  last_counted_at: string | null;
  /**
   * last count + units bought in finalized purchases since the count
   * - units sold since the count. null when never counted.
   */
  estimated_quantity: number | null;
  last_purchase: InventoryLastPurchaseDto | null;
  /**
   * Per active sub product: target and last count. With sub products the row
   * holds their sums and the product is only a heading.
   */
  sub_products: InventorySubProductRowDto[];
};

export type InventoryCheckStateDto = "draft" | "completed";

export type InventoryCheckItemDto = {
  product: ProductDto;
  /** Set when the product is counted per sub product (see `product.sub_products`). */
  sub_product_id: number | null;
  target_quantity: number;
  counted_quantity: number | null;
};

export type InventoryCheckSummaryDto = {
  id: number;
  state: InventoryCheckStateDto;
  started_at: string;
  completed_at: string | null;
  started_by_account_id: number | null;
  completed_by_account_id: number | null;
  generated_purchase_id: number | null;
  note: string;
  item_count: number;
  counted_count: number;
};

export type InventoryCheckDto = InventoryCheckSummaryDto & {
  items: InventoryCheckItemDto[];
};

export type CreateInventoryCheckDto = {
  note?: string;
};

export type UpdateInventoryCheckItemDto = {
  counted_quantity: number | null;
};

export type CompleteInventoryCheckDto = {
  /**
   * Put every counted product below its target on the shared shopping list.
   * Defaults to true on the server: counting stock and going shopping are
   * separate moments, and the list is what carries the result between them.
   */
  add_to_shopping_list?: boolean;
  /** Note prefix of the generated entries; "<counted>/<target>" is appended. */
  note?: string;
  /** Additionally create a draft purchase. Off by default. */
  generate_purchase?: boolean;
  store?: string;
  name?: string;
};

export type CompleteInventoryCheckResponseDto = {
  check: InventoryCheckDto;
  purchase: PurchaseDto | null;
  /**
   * Entries created on the shopping list. Products that already have an open
   * entry are skipped, so this can be shorter than the list of articles below
   * target.
   */
  shopping_list_items: ShoppingListItemDto[];
};

export type ShoppingListStateDto = "open" | "done" | "all";

/** Entry of the shared shopping list (Einkaufsliste). */
export type ShoppingListItemDto = {
  id: number;
  name: string;
  quantity: number;
  note: string;
  product: ProductDto | null;
  /** Specific sub product of `product`; null = any of them. */
  sub_product_id: number | null;
  created_by_account_id: number | null;
  created_by_name: string | null;
  created_at: string;
  done_at: string | null;
  done_by_account_id: number | null;
  purchase_id: number | null;
};

export type SaveShoppingListItemDto = {
  /** Required unless `product_id` is given (then the product name is used). */
  name?: string;
  /** Defaults to 1, must be >= 1. */
  quantity?: number;
  /** Defaults to "". */
  note?: string;
  product_id?: number | null;
  /** Specific sub product of `product_id`. */
  sub_product_id?: number | null;
};

export type MarkShoppingListItemDoneDto = {
  purchase_id?: number | null;
};
