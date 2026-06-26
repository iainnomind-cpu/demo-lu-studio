import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Storefront from './pages/Storefront';
import Collection from './pages/Collection';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import OrdersAdmin from './pages/admin/OrdersAdmin';
import CustomersAdmin from './pages/admin/CustomersAdmin';
import MarketingAdmin from './pages/admin/MarketingAdmin';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Tienda Pública */}
          <Route path="/" element={<Storefront />} />
          <Route path="/collection/:id" element={<Collection />} />
          
          {/* Autenticación de Admin */}
          <Route path="/admin/login" element={<Login />} />
          
          {/* Rutas Privadas del Panel de Administración */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="orders" element={<OrdersAdmin />} />
            <Route path="customers" element={<CustomersAdmin />} />
            <Route path="marketing" element={<MarketingAdmin />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
