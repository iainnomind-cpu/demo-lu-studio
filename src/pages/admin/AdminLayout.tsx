import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/Logo';

export default function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin', icon: 'dashboard', label: 'Resumen' },
    { path: '/admin/products', icon: 'inventory_2', label: 'Productos' },
    { path: '/admin/orders', icon: 'local_shipping', label: 'Pedidos' },
    { path: '/admin/customers', icon: 'group', label: 'Clientes (CRM)' },
    { path: '/admin/marketing', icon: 'campaign', label: 'Marketing' },
  ];

  return (
    <div className="flex min-h-screen bg-surface-container-low font-body-main text-on-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-outline-variant/30 flex flex-col">
        <div className="p-6 border-b border-outline-variant/30 flex flex-col items-center">
          <Logo className="text-[32px] mb-2" />
          <span className="text-xs font-bold text-secondary uppercase tracking-widest mt-2">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-calzado-blush text-white shadow-md' 
                    : 'text-secondary hover:bg-surface-container-lowest hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant/30">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-secondary hover:text-error transition-colors rounded-lg"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-outline-variant/30 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="font-product-title text-[20px] text-primary capitalize">
            {location.pathname.split('/').pop() || 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
             <Link to="/" target="_blank" className="text-sm text-secondary hover:text-primary underline">Ver Tienda</Link>
             <div className="w-8 h-8 rounded-full bg-calzado-blush flex items-center justify-center text-white">
               <span className="material-symbols-outlined text-sm">person</span>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
