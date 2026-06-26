import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          { count: productsCount },
          { count: ordersCount, data: orders },
          { count: customersCount }
        ] = await Promise.all([
          supabase.from('products').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('total', { count: 'exact' }),
          supabase.from('customers').select('*', { count: 'exact', head: true })
        ]);

        const revenue = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

        setStats({
          products: productsCount || 0,
          orders: ordersCount || 0,
          customers: customersCount || 0,
          revenue
        });
      } catch (error) {
        console.error('Error loading stats', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { title: 'Ventas Totales', value: `$${stats.revenue.toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: 'payments', color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Pedidos', value: stats.orders, icon: 'shopping_bag', color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Productos', value: stats.products, icon: 'inventory_2', color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Clientes', value: stats.customers, icon: 'group', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm text-secondary font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-primary font-price-active">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 p-6">
        <h3 className="font-product-title text-[18px] text-primary mb-4">Actividad Reciente</h3>
        <p className="text-secondary text-sm">El dashboard está listo. Cuando comiences a recibir pedidos, aparecerán aquí.</p>
      </div>
    </div>
  );
}
