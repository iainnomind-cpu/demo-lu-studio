import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customers(full_name, email)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  const statusColors: any = {
    pending: 'bg-orange-100 text-orange-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusLabels: any = {
    pending: 'Pendiente',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Gestión de Pedidos</h2>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30 text-sm font-bold text-secondary uppercase tracking-wider">
                <th className="p-4">ID Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-secondary">Cargando...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-secondary">No hay pedidos registrados.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50">
                    <td className="p-4 text-sm font-mono text-secondary">{order.id.split('-')[0]}</td>
                    <td className="p-4">
                      <p className="font-medium text-primary">{order.customers?.full_name || 'Desconocido'}</p>
                      <p className="text-xs text-secondary">{order.customers?.email}</p>
                    </td>
                    <td className="p-4 text-sm text-secondary">
                      {new Date(order.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="p-4 font-price-active text-primary font-bold">
                      ${order.total.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        className="border border-outline-variant rounded-md px-2 py-1 text-sm bg-white"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
