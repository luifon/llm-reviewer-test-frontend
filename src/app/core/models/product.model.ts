export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  categoryName?: string;
}

export interface ProductById {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  categoryId?: string;
}
