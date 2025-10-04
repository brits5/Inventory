import type { Product } from '../models/types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductList = ({ products, onEdit, onDelete }: ProductListProps) => {
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderCollapse: 'collapse',
      }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Categoría</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Precio</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Stock</th>
            <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                No hay productos registrados
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '1rem' }}>{product.id}</td>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>{product.category}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  ${product.price.toFixed(2)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: product.stock > 0 ? '#d5f4e6' : '#fadbd8',
                    color: product.stock > 0 ? '#0f5132' : '#842029',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                  }}>
                    {product.stock}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => onEdit(product)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};