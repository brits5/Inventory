import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateProductDto } from '../models/types';
import { productsService } from '../api/products.api';
import { ProductForm } from '../components/ProductForm';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateProductDto, imageFile?: File) => {
    try {
      await productsService.create(data, imageFile);
      navigate('/', { state: { message: 'Producto creado correctamente' } });
    } catch (error: any) {
      setError(error.response?.data?.message || error.response?.data || 'Error al crear el producto');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Crear Nuevo Producto</h1>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f8d7da',
          color: '#842029',
          border: '1px solid #f5c2c7',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};