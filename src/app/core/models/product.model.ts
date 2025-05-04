export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  categoryName?: string;
  createdAt?: string;
  updatedAt?: string;
}
