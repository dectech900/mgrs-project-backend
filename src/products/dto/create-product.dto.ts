export class CreateProductDto {
  product_name: string;
  slug: string;
  old_price: number;

  new_price?: number;

  quantity: number;

  short_description?: string;

  category: string;

  description?: string;

  sizes?: string[];

  images: string[];

  colors?: string[];
  featured?: boolean;
  banner?: boolean;
}
