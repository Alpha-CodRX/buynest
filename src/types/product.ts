export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  _id: string;

  title: string;
  description: string;
  price: number;

  category:
    | string
    | {
        _id: string;
        name: string;
      };

  image: string[];

  inStock: boolean;

  specifications?: Record<string, unknown>;

  options?: ProductOption[];

  stock: number;

  rating?: number;

  createdAt?: string;
}
