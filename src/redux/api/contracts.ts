export type CoinTypeDto = "Cent" | "CoffeeStamp" | "BottleStamp";

export type CoinAmountDto = {
  Cent?: number;
  CoffeeStamp?: number;
  BottleStamp?: number;
};

export type RoleDto = "Basic" | "Member" | "Admin";

export type CardTypeDto = "NfcId" | "AsciiMifare";

export type AuthMethodDtoPasswordBased = {
  type: "passwordBased";
  username: string;
};

export type AuthMethodDtoNfcBased = {
  type: "NfcBased";
  name: string;
  card_id: string;
  card_type: CardTypeDto;
};

export type AuthMethodDtoPublicTab = {
  type: "PublicTab";
};

export type AuthMethodDto =
  | AuthMethodDtoPasswordBased
  | AuthMethodDtoNfcBased
  | AuthMethodDtoPublicTab;

export type AccountDto = {
  id: number;
  balance: CoinAmountDto;
  name: string;
  email: string;
  role: RoleDto;
  auth_methods: AuthMethodDto[];
};

export type SaveAccountDto = {
  name: string;
  email: string;
  role: RoleDto;
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
};

export type ProductDto = {
  id: number;
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  nickname?: string | null;
  barcode?: string | null;
  category: string;
  tags: string[];
};

export type SaveProductDto = {
  name: string;
  price: CoinAmountDto;
  bonus: CoinAmountDto;
  nickname?: string | null;
  barcode?: string | null;
  category: string;
  tags: string[];
};

export type TransactionItemDto = {
  effective_price: CoinAmountDto;
  product?: ProductDto | null;
};

export type TransactionDto = {
  id: number;
  timestamp: string;
  account_id?: number | null;
  items: TransactionItemDto[];
};

export type PaymentItemDto = {
  effective_price: CoinAmountDto;
  product_id?: number | null;
};

export type PaymentDto = {
  items: PaymentItemDto[];
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
