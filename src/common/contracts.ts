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

export type ProductDto = {
  id: number;
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  purchase_tax: number;
  nickname?: string | null;
  barcode?: string | null;
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
  barcode?: string | null;
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
};

export type InventoryCheckStateDto = "draft" | "completed";

export type InventoryCheckItemDto = {
  product: ProductDto;
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
  generate_purchase: boolean;
  store?: string;
  name?: string;
};

export type CompleteInventoryCheckResponseDto = {
  check: InventoryCheckDto;
  purchase: PurchaseDto | null;
};

export type ShoppingListStateDto = "open" | "done" | "all";

/** Entry of the shared shopping list (Einkaufsliste). */
export type ShoppingListItemDto = {
  id: number;
  name: string;
  quantity: number;
  note: string;
  product: ProductDto | null;
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
};

export type MarkShoppingListItemDoneDto = {
  purchase_id?: number | null;
};
