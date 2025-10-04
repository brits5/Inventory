import { useState, useEffect, useRef } from 'react';
import type { Product, CreateProductDto } from '../models/types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDto, imageFile?: File) => void;
  onCancel: () => void;
}

export const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    price: 0,
    stock: 0,
  });
  const [priceInput, setPriceInput] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category,
        imageUrl: product.imageUrl || '',
        price: product.price,
        stock: product.stock,
      });
      setPriceInput(product.price.toString());
      if (product.imageUrl) {
        setImagePreview(`http://localhost:5001${product.imageUrl}`);
      }
    }
  }, [product]);
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, imageFile || undefined);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permitir solo números y un punto decimal
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return; // No actualizar si no es válido
    }

    // No permitir más de un punto
    if (value.split('.').length > 2) {
      return;
    }

    // Limitar a 2 decimales
    const parts = value.split('.');
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setPriceInput(value);

    setFormData(prev => ({
      ...prev,
      price: value === '' ? 0 : parseFloat(value) || 0,
    }));

    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      stock: value === '' ? 0 : parseInt(value) || 0,
    }));
    if (errors.stock) {
      setErrors(prev => ({ ...prev, stock: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'El archivo debe ser una imagen' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'La imagen no puede superar 5MB' }));
      return;
    }

    setImageFile(file);
    setErrors(prev => ({ ...prev, image: '' }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Nombre *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ ...inputStyle, borderColor: errors.name ? '#e74c3c' : '#ddd' }}
        />
        {errors.name && <div style={errorStyle}>{errors.name}</div>}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Categoría *
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ ...inputStyle, borderColor: errors.category ? '#e74c3c' : '#ddd' }}
        />
        {errors.category && <div style={errorStyle}>{errors.category}</div>}
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Imagen del Producto
        </label>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? '#3498db' : errors.image ? '#e74c3c' : '#ddd'}`,
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? '#ebf5fb' : '#f8f9fa',
            transition: 'all 0.3s',
          }}
        >
          {imagePreview ? (
            <div style={{ position: 'relative' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '4px',
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📷</div>
              <p style={{ margin: '0.5rem 0', color: '#7f8c8d' }}>
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#95a5a6' }}>
                Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        {errors.image && <div style={errorStyle}>{errors.image}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Precio * ($)
          </label>
          <input
            type="text"
            name="price"
            value={priceInput}
            onChange={handlePriceChange}
            placeholder="0.00"
            style={{ ...inputStyle, borderColor: errors.price ? '#e74c3c' : '#ddd' }}
          />
          {errors.price && <div style={errorStyle}>{errors.price}</div>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Stock *
          </label>
          <input
            type="text"
            name="stock"
            value={formData.stock === 0 ? '' : formData.stock}
            onChange={handleStockChange}
            placeholder="0"
            style={{ ...inputStyle, borderColor: errors.stock ? '#e74c3c' : '#ddd' }}
          />
          {errors.stock && <div style={errorStyle}>{errors.stock}</div>}
        </div>
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
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {product ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
};