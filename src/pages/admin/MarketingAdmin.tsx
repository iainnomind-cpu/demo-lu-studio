import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Segment = 'all' | 'high_ltv' | 'new';

export default function MarketingAdmin() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<Segment>('all');
  const [messageTemplate, setMessageTemplate] = useState('¡Hola [Nombre]! Tenemos una sorpresa exclusiva para ti en LU Studio con envíos gratis esta semana. 👗✨');
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, orders(total, created_at)');
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }

  // Segmentar clientes
  const filteredCustomers = customers.filter(customer => {
    // Solo clientes con número de teléfono
    if (!customer.phone) return false;

    if (activeSegment === 'all') return true;

    if (activeSegment === 'high_ltv') {
      const ltv = customer.orders?.reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;
      return ltv >= 2000; // Mejores clientes (compraron >= $2,000)
    }

    if (activeSegment === 'new') {
      const daysSinceRegistration = (new Date().getTime() - new Date(customer.created_at).getTime()) / (1000 * 3600 * 24);
      return daysSinceRegistration <= 30; // Registrados en los últimos 30 días
    }

    return true;
  });

  const getPersonalizedMessage = (customer: any) => {
    let msg = messageTemplate;
    const firstName = customer.full_name ? customer.full_name.split(' ')[0] : 'amigo(a)';
    msg = msg.replace(/\[Nombre\]/g, firstName);
    return encodeURIComponent(msg);
  };

  const handleSendWA = (phone: string, customer: any) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `https://wa.me/52${cleanPhone}?text=${getPersonalizedMessage(customer)}`;
    window.open(url, '_blank');
  };

  const insertVariable = (variable: string) => {
    setMessageTemplate(prev => prev + variable);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header y Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <div>
              <span className="text-secondary text-sm font-bold block">Base de Contactos</span>
              <span className="text-2xl font-bold text-primary">
                {customers.filter(c => c.phone).length}
              </span>
            </div>
          </div>
          <p className="text-xs text-secondary">Clientes con número registrado</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined">loyalty</span>
            </div>
            <div>
              <span className="text-secondary text-sm font-bold block">Mejores Clientes</span>
              <span className="text-2xl font-bold text-primary">
                {customers.filter(c => {
                  const ltv = c.orders?.reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;
                  return ltv >= 2000;
                }).length}
              </span>
            </div>
          </div>
          <p className="text-xs text-secondary">Compras acumuladas &gt; $2,000</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined">campaign</span>
            </div>
            <div>
              <span className="text-secondary text-sm font-bold block">Mensajes Hoy</span>
              <span className="text-2xl font-bold text-primary">0</span>
            </div>
          </div>
          <p className="text-xs text-secondary">Campañas simuladas enviadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Izquierdo: Editor de Campaña */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">forum</span>
                Configuración de Campaña
              </h3>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Selección de Segmento */}
              <div>
                <label className="block text-sm font-bold text-primary mb-2">1. Selecciona tu Audiencia</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveSegment('all')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeSegment === 'all' ? 'bg-primary text-white' : 'bg-surface-container-lowest border border-outline-variant/50 text-secondary hover:border-primary/50'}`}
                  >
                    Todos los clientes
                  </button>
                  <button 
                    onClick={() => setActiveSegment('high_ltv')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeSegment === 'high_ltv' ? 'bg-primary text-white' : 'bg-surface-container-lowest border border-outline-variant/50 text-secondary hover:border-primary/50'}`}
                  >
                    ⭐ VIP / Mejores Compradores
                  </button>
                  <button 
                    onClick={() => setActiveSegment('new')}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeSegment === 'new' ? 'bg-primary text-white' : 'bg-surface-container-lowest border border-outline-variant/50 text-secondary hover:border-primary/50'}`}
                  >
                    🆕 Nuevos (Últimos 30 días)
                  </button>
                </div>
              </div>

              {/* Editor de Mensaje */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-primary">2. Redacta tu Mensaje</label>
                  <div className="flex gap-2">
                    <button onClick={() => insertVariable(' [Nombre] ')} className="text-[11px] font-bold bg-surface-container-low px-2 py-1 rounded text-secondary hover:bg-surface-container-highest transition-colors">
                      + [Nombre]
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full border border-outline-variant rounded-md px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                />
                <p className="text-xs text-secondary mt-1">Usa variables como [Nombre] para personalizar el mensaje. WhatsApp no admite imágenes directamente por URL simple, se envían manual.</p>
              </div>
            </div>
          </div>

          {/* Tabla de Resultados (Audiencia a enviar) */}
          <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-primary">Destinatarios ({filteredCustomers.length})</h3>
            </div>
            
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="border-b border-outline-variant/30 text-xs font-bold text-secondary uppercase">
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={3} className="p-8 text-center text-secondary">Cargando...</td></tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-secondary">No hay clientes en este segmento.</td></tr>
                  ) : (
                    filteredCustomers.map(customer => (
                      <tr key={customer.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-primary text-sm">{customer.full_name}</p>
                          <p className="text-xs text-secondary">{customer.email}</p>
                        </td>
                        <td className="p-4 text-sm font-medium text-secondary">
                          {customer.phone}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleSendWA(customer.phone, customer)}
                            className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                            Enviar WA
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Preview del Mensaje */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-widest">Vista Previa</h3>
            <div className="bg-[#E5DDD5] rounded-3xl p-4 shadow-inner relative overflow-hidden h-[500px] border-[8px] border-surface-container-lowest">
              {/* Header WA */}
              <div className="absolute top-0 left-0 w-full bg-[#075E54] text-white p-3 flex items-center gap-3 z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight">Cliente (Vista Previa)</div>
                  <div className="text-[10px] opacity-80">en línea</div>
                </div>
              </div>
              
              {/* WA Background Pattern */}
              <div className="absolute inset-0 opacity-[0.06] bg-[url('https://w0.peakpx.com/wallpaper/508/606/HD-wallpaper-whatsapp-background-solid-color-pattern.jpg')] bg-repeat bg-[length:300px]"></div>

              {/* Burbuja de chat */}
              <div className="mt-16 relative z-10 flex flex-col items-end">
                <div className="bg-[#DCF8C6] text-[#303030] p-3 rounded-xl rounded-tr-sm max-w-[85%] shadow-sm text-sm whitespace-pre-wrap relative">
                  {messageTemplate.replace(/\[Nombre\]/g, 'María')}
                  <div className="text-[10px] text-gray-500 text-right mt-1 flex justify-end items-center gap-1">
                    12:00 PM <span className="material-symbols-outlined text-[14px] text-blue-500">done_all</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
