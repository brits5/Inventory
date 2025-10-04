import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product, UpdateProductDto } from '../models/types';
import { productsService } from '../api/products.api';
import { ProductForm } from '../components/ProductForm';

export const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await productsService.getById(productId);
      setProduct(data);
    } catch (error) {
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateProductDto) => {
    if (!id) return;
    
    try {
      await productsService.update(parseInt(id), data);
      navigate('/', { state: { message: 'Producto actualizado correctamente' } });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al actualizar el producto');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.25rem', color: '#7f8c8d' }}>Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.25rem', color: '#e74c3c' }}>Producto no encontrado</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Editar Producto</h1>

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
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};