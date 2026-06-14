import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketsProvider } from './context/TicketsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import { Login } from './views/Login';
import { TicketForm } from './views/TicketForm';
import { AdminDashboard } from './views/AdminDashboard';
import { TechDashboard } from './views/TechDashboard';

// Componente inteligente de redirección de inicio basado en el rol actual
const HomeRedirect: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir dinámicamente al panel asignado según su rol
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  if (currentUser.role === 'tech') {
    return <Navigate to="/tech" replace />;
  }
  return <Navigate to="/create-ticket" replace />;
};

// Componente de error para rutas inexistentes (404)
const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-sm bento-card">
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h2>
      <p className="text-xs font-bold text-indigo-655 text-indigo-600 uppercase tracking-widest mt-1">SECCIÓN NO ENCONTRADA</p>
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">La sección o URL que buscas no existe en el sistema actual de REPARA-79.</p>
      <Link
        to="/"
        className="mt-6 inline-block bg-indigo-600 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TicketsProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Routes>
              {/* Ruta Pública de Autenticación */}
              <Route path="/login" element={<Login />} />

              {/* Otras rutas envueltas de manera condicional */}
              <Route
                path="/*"
                element={
                  <Routes>
                    {/* Ruta de redirección inteligente */}
                    <Route path="/" element={<HomeRedirect />} />

                    {/* Rutas Protegidas - Usuario Registrado */}
                    <Route
                      path="/create-ticket"
                      element={
                        <ProtectedRoute allowedRoles={['user']}>
                          <MainLayout>
                            <TicketForm />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Rutas Protegidas - Subdirector Administrativo */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <MainLayout>
                            <AdminDashboard />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Rutas Protegidas - Personal de Mantenimiento */}
                    <Route
                      path="/tech"
                      element={
                        <ProtectedRoute allowedRoles={['tech']}>
                          <MainLayout>
                            <TechDashboard />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />

                    {/* Ruta de excepción para faltas de coincidencia */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                }
              />
            </Routes>

            {/* Pie de página con créditos elegantes y profesionales */}
            <footer className="bg-slate-900 text-slate-400 text-xs py-5 border-t border-slate-800 text-center font-medium mt-auto">
              <div className="max-w-7xl mx-auto px-4">
                <p>&copy; {new Date().getFullYear()} REPARA - 79. Plataforma Escolar de Mantenimiento Físico e Industrial.</p>
                <p className="text-slate-500 text-[10px] mt-0.5 tracking-wide">Uso restringido exclusivo para personal administrativo, técnico y escolar autorizado.</p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </TicketsProvider>
    </AuthProvider>
  );
}
