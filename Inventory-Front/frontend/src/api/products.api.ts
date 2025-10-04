import { productApi } from './axios.config';
import type { Product, CreateProductDto, UpdateProductDto } from '../models/types';

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await productApi.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await productApi.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto, imageFile?: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (data.imageUrl) {
      formData.append('imageUrl', data.imageUrl);
    }

    const response = await productApi.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, data: UpdateProductDto, imageFile?: File): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    
    if (data.description) {
      formData.append('description', data.description);
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (data.imageUrl) {
      formData.append('imageUrl', data.imageUrl);
    }

    const response = await productApi.put<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await productApi.delete(`/products/${id}`);
  },
};