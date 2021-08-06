import { Category } from './category.model';
import { Price } from './price.model';

export interface Product {
  readonly id: string;
  name: string;
  category?: Category;
  image?: string;
  prices: Price[];
  current_price?: number;
  barcode?: string;
}
