// src/api/transactions.api.ts
import { transactionApi } from './axios.config';
import type { Transaction, CreateTransactionDto, TransactionFilters } from '../models/types';

export const transactionsService = {
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await transactionApi.post<Transaction>('/transactions', data);
    return response.data;
  },

  getByProductId: async (
    productId: number,
    filters?: TransactionFilters
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.type) params.append('type', filters.type);

    const response = await transactionApi.get<Transaction[]>(
      `/transactions/product/${productId}?${params.toString()}`
    );
    return response.data;
  },

  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const params = new URLSearchParams();

    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.type) params.append('type', filters.type);

    const response = await transactionApi.get<Transaction[]>(
      `/transactions/productAll?${params.toString()}`
    );
    return response.data;
  },
};