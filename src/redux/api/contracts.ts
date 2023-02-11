export type CoinTypeDto = "cent" | "coffeeStamp" | "bottleStamp";

export type CoinAmountDto = {
  cent?: number;
  coffeeStamp?: number;
  bottleStamp?: number;
};

export type RoleDto = "basic" | "member" | "admin";

export type CardTypeDto = "nfcId" | "asciiMifare";

export type AuthMethodDtoPasswordBased = {
  type: "passwordBased";
  username: string;
};

export type AuthMethodDtoNfcBased = {
  type: "nfcBased";
  name: string;
  card_id: string;
  card_type: CardTypeDto;
};

export type AuthMethodDtoPublicTab = {
  type: "publicTab";
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
  account_id: number;
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
