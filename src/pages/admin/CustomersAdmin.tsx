import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, orders(id, total)')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Directorio de Clientes (CRM)</h2>

      <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30 text-sm font-bold text-secondary uppercase tracking-wider">
                <th className="p-4">Nombre</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Dirección</th>
                <th className="p-4">Total Pedidos</th>
                <th className="p-4">Valor Total (LTV)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-secondary">Cargando...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-secondary">No hay clientes registrados.</td></tr>
              ) : (
                customers.map((customer) => {
                  const ordersCount = customer.orders?.length || 0;
                  const lifetimeValue = customer.orders?.reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;

                  return (
                    <tr key={customer.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50">
                      <td className="p-4">
                        <p className="font-medium text-primary">{customer.full_name}</p>
                        <p className="text-xs text-secondary mt-1">Registrado el {new Date(customer.created_at).toLocaleDateString('es-MX')}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span> {customer.email}</p>
                        <p className="text-sm text-secondary flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-[14px]">phone</span> {customer.phone || 'N/A'}</p>
                      </td>
                      <td className="p-4 text-sm text-secondary max-w-[200px] truncate">
                        {customer.address || 'Sin dirección'}
                      </td>
                      <td className="p-4 font-bold text-primary text-center">
                        {ordersCount}
                      </td>
                      <td className="p-4 font-price-active text-primary font-bold">
                        ${lifetimeValue.toLocaleString('en-US', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
