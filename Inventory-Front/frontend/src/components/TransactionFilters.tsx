import { useState, useEffect } from 'react';
import type { Product, TransactionFilters } from '../models/types';
import { productsService } from '../api/products.api';

interface TransactionFiltersProps {
  onFilter: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export const TransactionFiltersComponent = ({ onFilter, onClear }: TransactionFiltersProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({
    productId: undefined,
    startDate: '',
    endDate: '',
    type: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'productId' ? (value ? parseInt(value) : undefined) : value || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({
      productId: undefined,
      startDate: '',
      endDate: '',
      type: '',
    });
    onClear();
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#2c3e50' }}>
        Filtros de Búsqueda
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Producto
          </label>
          <select
            name="productId"
            value={filters.productId || ''}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Todos los productos</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Tipo
          </label>
          <select
            name="type"
            value={filters.type || ''}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Todos</option>
            <option value="compra">Compra</option>
            <option value="venta">Venta</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Fecha Inicio
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate || ''}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Fecha Fin
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate || ''}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Limpiar Filtros
        </button>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Aplicar Filtros
        </button>
      </div>
    </form>
  );
};