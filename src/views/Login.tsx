import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Lock, Mail, Shield, AlertCircle, Wrench } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, mockUsers } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('user');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }

    // El sistema simula el password (cualquiera es válido en esta etapa funcional)
    const success = login(email, selectedRole);
    if (success) {
      // Redirigir según el rol
      if (selectedRole === 'admin') {
        navigate('/admin');
      } else if (selectedRole === 'tech') {
        navigate('/tech');
      } else {
        navigate('/create-ticket');
      }
    } else {
      setError('Credenciales inválidas para el rol seleccionado.');
    }
  };

  const handleQuickLogin = (emailStr: string, roleVal: Role) => {
    setEmail(emailStr);
    setSelectedRole(roleVal);
    setPassword('demo123'); // Autocompletar contraseña simulada
    login(emailStr, roleVal);
    
    // Redirigir de inmediato para mejorar la fluidez
    if (roleVal === 'admin') {
      navigate('/admin');
    } else if (roleVal === 'tech') {
      navigate('/tech');
    } else {
      navigate('/create-ticket');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 bento-card relative overflow-hidden">
        {/* Glow effect backdrops */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative">
          <div className="inline-flex bg-indigo-50 p-3 rounded-2xl border border-indigo-100 mb-3.5">
            <Wrench className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">REPARA - 79</h1>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1.5">MANTENIMIENTO INDUSTRIAL</p>
          <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full mt-3"></div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 text-rose-800 px-4 py-3.5 rounded-2xl mb-6 text-xs font-medium animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          {/* Campo Correo */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="email">
              CORREO ELECTRÓNICO
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="ejemplo@repara79.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs transition-all font-medium"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="password">
              CONTRASEÑA DEL PANEL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-4 w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs transition-all font-medium"
              />
            </div>
          </div>

          {/* Selección de Rol Requerido */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="role">
              ROL DE ACCESO AL PLANTEL
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Shield className="h-4 w-4" />
              </span>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="pl-10 pr-4 w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs transition-all font-extrabold bg-white cursor-pointer"
              >
                <option value="user">Usuario Registrado (Creador)</option>
                <option value="admin">Subdirector (Autorizador)</option>
                <option value="tech">Personal Técnico de Planta</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-slate-900 text-white py-3 px-4 rounded-2xl font-extrabold text-xs transition-all duration-200 cursor-pointer mt-3 shadow-md shadow-indigo-600/10 hover:shadow-none active:scale-98"
          >
            Ingresar al Sistema
          </button>
        </form>

        {/* Acceso Rápido Simulador */}
        <div className="mt-8 pt-6 border-t border-slate-100 relative">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 text-center">
            ACCESOS DEMO RÁPIDOS
          </h3>
          <div className="space-y-2.5">
            {mockUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user.email, user.role)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <div>
                  <p className="text-xs font-extrabold text-slate-850 text-slate-800">{user.name}</p>
                  <p className="text-[10px] text-slate-450 font-mono mt-0.5">{user.email}</p>
                </div>
                <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${
                  user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' : 
                  user.role === 'tech' ? 'bg-amber-50 text-amber-800 border-amber-150' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {user.role === 'admin' && 'Autorizador'}
                  {user.role === 'tech' && 'Técnico'}
                  {user.role === 'user' && 'Creador'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
