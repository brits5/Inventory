import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Product } from '../models/types';
import { productsService } from '../api/products.api';
import { ProductList } from '../components/ProductList';

export const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProducts();
    
    // Mostrar mensaje de éxito si viene de crear/editar
    if (location.state?.message) {
      showMessage('success', location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      showMessage('error', 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await productsService.delete(id);
      showMessage('success', 'Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      showMessage('error', 'Error al eliminar el producto');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.25rem', color: '#7f8c8d' }}>Cargando productos...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestión de Productos</h1>
        <button
          onClick={() => navigate('/products/create')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          + Nuevo Producto
        </button>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c2c7'}`,
          borderRadius: '4px',
        }}>
          {message.text}
        </div>
      )}

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};