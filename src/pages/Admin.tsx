import React, { useState, useEffect } from 'react';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, byCategory: {} as Record<string, number> });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/server-products');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
        const byCat = data.data.reduce((acc: any, curr: any) => {
          const cat = curr.category || 'Uncategorized';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});
        
        setStats({
          total: data.data.length,
          byCategory: byCat
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-primary-600 mb-2">/OYA System</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Portal de Administración</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Contraseña de acceso"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-center tracking-widest"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button
              type="submit"
              disabled={loggingIn || !password}
              className="w-full bg-primary-600 text-white font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loggingIn ? 'Verificando...' : 'Acceder'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-black tracking-tighter">OYA<span className="text-primary-500">ADMIN</span></h1>
          <span className="bg-slate-800 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded">ESTADO: ONLINE</span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
          <p className="text-slate-500">Resumen y estadísticas de tu tienda.</p>
        </div>

        {/* Stats Flex */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Productos</h3>
            <p className="text-4xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">En Inventario</h3>
            <p className="text-4xl font-black text-emerald-500">Activo</p>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Productos por Categoría</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-bold text-slate-800 truncate mb-1">{category}</p>
                <p className="text-xs text-primary-600 font-bold">{count} items</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Products List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Muestra de Productos</h3>
            <button className="text-xs font-bold text-primary-600 uppercase tracking-widest">Ver todos</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3 text-right">Precio</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-200 overflow-hidden shrink-0">
                        {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium text-slate-800 line-clamp-1">{p.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.category}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-slate-800">€{Number(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Activo</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
