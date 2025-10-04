import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateTransactionDto } from '../models/types';
import { transactionsService } from '../api/transactions.api';
import { TransactionForm } from '../components/TransactionForm';

export const CreateTransactionPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateTransactionDto) => {
    try {
      await transactionsService.create(data);
      navigate('/transactions', { state: { message: 'Transacción registrada correctamente' } });
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Error al registrar la transacción';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Registrar Nueva Transacción</h1>

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
        <TransactionForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};