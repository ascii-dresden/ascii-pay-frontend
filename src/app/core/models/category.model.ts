import { Price } from './price.model';

export interface Category {
  readonly id: string;
  name: string;
  prices: Price[];
  current_price?: number;
}
