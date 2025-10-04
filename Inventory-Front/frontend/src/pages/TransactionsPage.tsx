import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Transaction, TransactionFilters, Product } from '../models/types';
import { transactionsService } from '../api/transactions.api';
import { productsService } from '../api/products.api';
import { TransactionList } from '../components/TransactionList';
import { TransactionFiltersComponent } from '../components/TransactionFilters';

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentFilters, setCurrentFilters] = useState<TransactionFilters>({});

  useEffect(() => {
    loadProducts();
    loadAllTransactions();

    // Mostrar mensaje de éxito si viene de crear transacción
    if (location.state?.message) {
      showMessage('success', location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const loadAllTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsService.getAll();
      setTransactions(data);
    } catch (error) {
      showMessage('error', 'Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      showMessage('error', 'Error al cargar los productos');
      setLoading(false);
    }
  };

  const handleFilter = async (filters: TransactionFilters) => {
    try {
      setLoading(true);
      setCurrentFilters(filters);

      // Si hay productId, usar endpoint específico, sino usar getAll
      const data = filters.productId
        ? await transactionsService.getByProductId(filters.productId, filters)
        : await transactionsService.getAll(filters);

      setTransactions(data);
    } catch (error) {
      showMessage('error', 'Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setTransactions([]);
    setCurrentFilters({});
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Historial de Transacciones</h1>
        <button
          onClick={() => navigate('/transactions/create')}
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
          + Nueva Transacción
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

      <TransactionFiltersComponent onFilter={handleFilter} onClear={handleClearFilters} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '1.25rem', color: '#7f8c8d' }}>Cargando...</div>
        </div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
};