import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Logo from '../../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full bg-white rounded-xl shadow-xl p-8 border border-outline-variant/30">
        <div className="text-center mb-8">
          <Logo className="text-[48px] mb-4" />
          <h2 className="text-secondary text-sm font-medium tracking-widest uppercase mt-4">Panel de Administración</h2>
        </div>

        {error && (
          <div className="bg-error-container text-error p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-bold text-sm text-primary mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full border border-outline-variant rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold text-sm text-primary mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              className="w-full border border-outline-variant rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
