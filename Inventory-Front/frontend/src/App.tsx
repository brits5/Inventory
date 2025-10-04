import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProductsPage } from './pages/ProductsPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CreateTransactionPage } from './pages/CreateTransactionPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProductsPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="transactions/create" element={<CreateTransactionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;