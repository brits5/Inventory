import type { Transaction } from '../models/types';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Tipo</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Producto</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Stock Actual</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Cantidad</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>P. Unitario</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                No hay transacciones registradas
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '1rem' }}>{transaction.id}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  {formatDate(transaction.date)}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: transaction.type === 'compra' ? '#d4edda' : '#fff3cd',
                    color: transaction.type === 'compra' ? '#0f5132' : '#856404',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}>
                    {transaction.type.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>
                  {transaction.productName}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {transaction.productStock}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {transaction.quantity}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  ${transaction.unitPrice.toFixed(2)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                  ${transaction.totalPrice.toFixed(2)}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#7f8c8d' }}>
                  {transaction.details || '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};