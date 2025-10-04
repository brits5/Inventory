export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
}

export interface Transaction {
  id: number;
  date: string;
  type: string;
  productId: number;
  productName: string;
  productStock: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details?: string;
}

export interface CreateTransactionDto {
  type: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  details?: string;
}

export interface TransactionFilters {
  productId?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
}