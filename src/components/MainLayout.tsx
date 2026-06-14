import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wrench, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  ShieldAlert, 
  Wrench as TechIcon, 
  User, 
  LayoutDashboard,
  Clock
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return <>{children}</>;

  const isActive = (path: string) => location.pathname === path;

  // Enlaces de navegación filtrados por el rol actual
  const navigationLinks = [
    {
      name: 'Reportar Incidencia',
      path: '/create-ticket',
      role: ['user'],
      icon: <PlusCircle className="h-4 w-4" />
    },
    {
      name: 'Autorización y Control',
      path: '/admin',
      role: ['admin'],
      icon: <ShieldAlert className="h-4 w-4" />
    },
    {
      name: 'Mantenimiento Técnico',
      path: '/tech',
      role: ['tech'],
      icon: <TechIcon className="h-4 w-4" />
    }
  ];

  const allowedLinks = navigationLinks.filter(link => link.role.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* BARRA SUPERIOR (NAVBAR) */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Título de Marca y Botón Mobile */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-all cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-indigo-400" />
              </div>
              <Link to="/" className="font-extrabold text-lg tracking-tight text-white hover:text-indigo-400 transition-colors uppercase">
                REPARA - 79
              </Link>
            </div>

            {/* Metadatos de Usuario y Cerrar Sesión */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-extrabold text-slate-100 tracking-tight">{currentUser.name}</span>
                <span className="text-[9px] text-indigo-400 uppercase font-extrabold tracking-widest mt-0.5">
                  {currentUser.role === 'admin' && 'SUBDIRECTOR (AUTORIZADOR)'}
                  {currentUser.role === 'tech' && 'PERSONAL TÉCNICO'}
                  {currentUser.role === 'user' && 'CREADOR DE ACCESO'}
                </span>
              </div>

              {/* Avatar circular */}
              <div className="h-8 w-8 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center font-bold text-xs text-white uppercase text-center cursor-default">
                {currentUser.name.charAt(0)}
              </div>

              <div className="border-l border-slate-800 h-6"></div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-rose-500 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer"
                title="Cerrar la sesión de inmediato"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* DISEÑO CENTRAL CON SIDEBAR DESK */}
      <div className="flex-grow flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative">
        
        {/* PANEL LATERAL (SIDEBAR) ESCRITORIO */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-4 self-start sticky top-22">
          
          {/* Card Perfil Breve */}
          <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl shadow-sm text-white flex flex-col gap-2 bento-card">
            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block">SESIÓN ACTIVA</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-sm text-white">
                {currentUser.role.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-extrabold truncate text-white">{currentUser.name}</p>
                <p className="text-[9px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-indigo-400" />
              <span>Conectado hoy</span>
            </div>
          </div>

          {/* Menú de Navegación Lateral */}
          <nav className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col gap-1.5 bento-card">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 px-3 py-1">MENÚ DE CONTROL</span>
            
            <Link
              to="/"
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/' || location.pathname === '/admin' || location.pathname === '/tech' || location.pathname === '/create-ticket'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Panel General
            </Link>

            {allowedLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-805 hover:text-slate-800'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MENÚ FLOTANTE MÓVIL (NAVBAR DRAWER) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-30 flex">
            {/* Overlay traslúcido */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Caja de Menú Lateral */}
            <div className="relative w-72 max-w-xs bg-white h-full shadow-xl flex flex-col p-6 gap-6 z-40 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-indigo-600" />
                  <span className="font-extrabold text-slate-950 uppercase tracking-tight">Menú de Navegación</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Info de sesión */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-[10px] font-extrabold text-slate-450 uppercase mb-2 tracking-wider">Perfil Activo</p>
                <p className="font-extrabold text-xs text-slate-900">{currentUser.name}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{currentUser.email}</p>
              </div>

              {/* Botones de navegación móviles */}
              <nav className="flex flex-col gap-1.5">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Panel Principal de Control
                </Link>

                {allowedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive(link.path)
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-slate-150 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión Activa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENERDOR DINÁMICO DE CONSTRUCCIÓN PRINCIPAL */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {children}
        </main>

      </div>
    </div>
  );
};
