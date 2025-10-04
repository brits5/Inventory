import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Gestión de Inventario</h1>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
              Productos
            </Link>
            <Link to="/transactions" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
              Transacciones
            </Link>
          </div>
        </div>
      </nav>
      
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};