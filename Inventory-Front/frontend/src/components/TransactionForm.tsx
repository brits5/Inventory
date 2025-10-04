import { useState, useEffect } from 'react';
import type { CreateTransactionDto, Product } from '../models/types';
import { productsService } from '../api/products.api';

interface TransactionFormProps {
  onSubmit: (data: CreateTransactionDto) => void;
  onCancel: () => void;
}

export const TransactionForm = ({ onSubmit, onCancel }: TransactionFormProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateTransactionDto>({
    type: 'compra',
    productId: 0,
    quantity: 1,
    unitPrice: 0,
    details: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleProductChange = (productId: number) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setFormData(prev => ({
      ...prev,
      productId,
      unitPrice: product?.price || 0,
    }));
    if (errors.productId) {
      setErrors(prev => ({ ...prev, productId: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.productId === 0) {
      newErrors.productId = 'Debe seleccionar un producto';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (formData.type === 'venta' && selectedProduct && formData.quantity > selectedProduct.stock) {
      newErrors.quantity = `Stock insuficiente. Disponible: ${selectedProduct.stock}`;
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'El precio unitario debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : 
              name === 'productId' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  const errorStyle = {
    color: '#e74c3c',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  };

  const totalPrice = formData.quantity * formData.unitPrice;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Tipo de Transacción *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="compra">Compra</option>
          <option value="venta">Venta</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Producto *
        </label>
        <select
          name="productId"
          value={formData.productId}
          onChange={(e) => handleProductChange(parseInt(e.target.value))}
          style={{ ...inputStyle, borderColor: errors.productId ? '#e74c3c' : '#ddd' }}
        >
          <option value={0}>Seleccione un producto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - Stock: {product.stock}
            </option>
          ))}
        </select>
        {errors.productId && <div style={errorStyle}>{errors.productId}</div>}
      </div>

      {selectedProduct && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#e8f4f8',
          borderRadius: '4px',
          border: '1px solid #b8daff',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <strong>Categoría:</strong> {selectedProduct.category}
            </div>
            <div>
              <strong>Precio:</strong> ${selectedProduct.price.toFixed(2)}
            </div>
            <div>
              <strong>Stock Actual:</strong> {selectedProduct.stock}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Cantidad *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            style={{ ...inputStyle, borderColor: errors.quantity ? '#e74c3c' : '#ddd' }}
          />
          {errors.quantity && <div style={errorStyle}>{errors.quantity}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Precio Unitario *
          </label>
          <input
            type="number"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            step="0.01"
            style={{ ...inputStyle, borderColor: errors.unitPrice ? '#e74c3c' : '#ddd' }}
          />
          {errors.unitPrice && <div style={errorStyle}>{errors.unitPrice}</div>}
        </div>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#d4edda',
        borderRadius: '4px',
        border: '1px solid #c3e6cb',
        fontSize: '1.125rem',
        fontWeight: '600',
      }}>
        Precio Total: ${totalPrice.toFixed(2)}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Detalles
        </label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
          rows={3}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
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
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Registrar Transacción
        </button>
      </div>
    </form>
  );
};