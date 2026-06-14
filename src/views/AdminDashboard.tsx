import React, { useState } from 'react';
import { useTickets } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Inbox, FileSpreadsheet, XOctagon, AlertTriangle, Hammer, CheckCircle, Clock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { tickets, authorizeTicket, rejectTicket } = useTickets();
  const { mockUsers } = useAuth();

  // Filtrar técnicos calificados para asignación
  const techs = mockUsers.filter((u) => u.role === 'tech');

  // Estados locales para la acción de rechazar un ticket específico
  const [rejectionReasons, setRejectionReasons] = useState<{ [ticketId: string]: string }>({});
  
  // Estados para los técnicos seleccionados en cada ticket pendiente
  const [selectedTechs, setSelectedTechs] = useState<{ [ticketId: string]: string }>({});

  const pendingTickets = tickets.filter((t) => t.status === 'pendiente');
  const nonPendingTickets = tickets.filter((t) => t.status !== 'pendiente');

  // KPIs
  const kpiPending = pendingTickets.length;
  const kpiAuthorized = tickets.filter((t) => t.status === 'autorizado' || t.status === 'en_progreso').length;
  const kpiCompleted = tickets.filter((t) => t.status === 'completado').length;
  const kpiRejected = tickets.filter((t) => t.status === 'rechazado').length;

  const handleAuthorize = (ticketId: string) => {
    // Tomar el técnico seleccionado para este ticket, o usar el primero por defecto
    const techId = selectedTechs[ticketId] || (techs[0]?.id || '3');
    authorizeTicket(ticketId, techId);
  };

  const handleReject = (ticketId: string) => {
    const reason = rejectionReasons[ticketId] || '';
    if (!reason.trim()) {
      alert('Por favor, escribe un motivo o justificación para rechazar el ticket.');
      return;
    }
    rejectTicket(ticketId, reason);
    // Limpiar input del motivo
    setRejectionReasons((prev) => ({ ...prev, [ticketId]: '' }));
  };

  const updateRejectionReason = (ticketId: string, text: string) => {
    setRejectionReasons((prev) => ({ ...prev, [ticketId]: text }));
  };

  const updateSelectedTech = (ticketId: string, techId: string) => {
    setSelectedTechs((prev) => ({ ...prev, [ticketId]: techId }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Encabezado General (Bento Card Style) */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-850 shadow-sm bento-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Control y Dictámenes del Plantel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-mono">
              Bandeja de Autorización de la Subdirección Administrativa
            </p>
          </div>
        </div>
      </div>

      {/* METRIC REPORTING ROW (KPI bento widgets) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">PARA AUTORIZAR</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiPending}</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl text-amber-600 border border-amber-100/50">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">EN TALLER / CURSO</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiAuthorized}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded-xl text-purple-600 border border-purple-100/50">
            <Hammer className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">COMPLETADOS</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiCompleted}</p>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 border border-emerald-150/50">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">CANCELADOS / RECHAZADOS</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{kpiRejected}</p>
          </div>
          <div className="bg-rose-50 p-2 rounded-xl text-rose-600 border border-rose-100/50">
            <XOctagon className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Sección principal: Bandeja de Entrada de Pendientes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <Inbox className="h-4 w-4 text-slate-650" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            EXPEDIENTES POR DICTAMINAR ({pendingTickets.length})
          </h3>
        </div>

        {pendingTickets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 bento-card">
            <p className="text-sm font-semibold text-slate-800">¡Bandeja al día!</p>
            <p className="text-xs text-slate-400 mt-1">No hay tickets de mantenimiento pendientes de dictaminar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingTickets.map((t) => {
              const currentReason = rejectionReasons[t.id] || '';
              const currentTech = selectedTechs[t.id] || (techs[0]?.id || '');

              return (
                <div key={t.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between bento-card">
                  <div>
                    {/* ID y Categoría */}
                    <div className="flex items-center justify-between mb-3.5 border-b border-slate-100 pb-2.5">
                      <span className="font-mono text-[9px] font-extrabold px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                        {t.id}
                      </span>
                      <span className="text-[9px] bg-amber-50 text-amber-800 font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
                        REVISIÓN
                      </span>
                    </div>

                    {/* Información Principal */}
                    <h4 className="text-base font-extrabold text-slate-900 tracking-tight">{t.area}</h4>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">{t.defectType}</p>
                    
                    <div className="mt-4 bg-slate-50/50 p-4 rounded-xl text-xs text-slate-700 space-y-2.5 border border-slate-200/50">
                      <div>
                        <strong className="text-slate-400 tracking-wider text-[8px] uppercase block mb-0.5">Ubicación exacta:</strong> 
                        <span className="font-semibold text-slate-850 text-slate-800">{t.exactLocation}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 tracking-wider text-[8px] uppercase block mb-0.5">Descripción de la Falla:</strong> 
                        <span className="text-slate-705 font-medium leading-relaxed block">{t.description}</span>
                      </div>
                    </div>

                    {/* Si tiene foto inicial */}
                    {t.initialPhoto && (
                      <div className="mt-4">
                        <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">REGISTRO FOTOGRÁFICO:</p>
                        <div className="relative w-full max-h-44 rounded-2xl overflow-hidden border border-slate-205 shadow-sm">
                          <img
                            src={t.initialPhoto}
                            alt="Evidencia"
                            className="w-full object-cover max-h-44"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones de Autorización/Rechazo */}
                  <div className="mt-5 pt-4 border-t border-slate-200/50 space-y-3.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/50">
                    {/* Campo para asignar Técnico en caso de Autorizar */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                        A DESIGNAR PERSONAL TÉCNICO
                      </label>
                      <select
                        value={currentTech}
                        onChange={(e) => updateSelectedTech(t.id, e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 font-extrabold cursor-pointer"
                      >
                        {techs.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name} (Técnico de Planta)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Botón de Autorizar */}
                    <button
                      type="button"
                      onClick={() => handleAuthorize(t.id)}
                      className="w-full bg-indigo-600 hover:bg-slate-900 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer shadow-sm active:scale-98"
                    >
                      ✓ AUTORIZAR Y ENVIAR EXPEDIENTE
                    </button>

                    <div className="flex items-center justify-between my-2">
                      <div className="border-t border-slate-200 grow"></div>
                      <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wide">Ó</span>
                      <div className="border-t border-slate-200 grow"></div>
                    </div>

                    {/* Campo para motivo de rechazo en caso de rechazar */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                        JUSTIFICACIÓN DE RECHAZO TÉCNICO
                      </label>
                      <input
                        type="text"
                        placeholder="Escribe la causa del rechazo o cancelación..."
                        value={currentReason}
                        onChange={(e) => updateRejectionReason(t.id, e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-slate-700 placeholder-slate-400 font-medium"
                      />
                    </div>

                    {/* Botón de Rechazar */}
                    <button
                      type="button"
                      onClick={() => handleReject(t.id)}
                      className="w-full bg-slate-200 hover:bg-rose-600 hover:text-white text-slate-700 font-extrabold py-2.5 px-3 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      × CANCELAR / RECHASAR PROPUESTA
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historial de Tickets Dictaminados */}
      <div>
        <div className="flex items-center gap-2 mb-4 mt-8">
          <div className="bg-slate-150 p-1.5 rounded-lg border border-slate-200">
            <FileSpreadsheet className="h-4 w-4 text-slate-600" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            HISTORIAL DE DICTÁMENES Y ARCHIVOS ({nonPendingTickets.length})
          </h3>
        </div>

        {nonPendingTickets.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white border border-slate-200 rounded-2xl bento-card">
            <p className="text-xs text-slate-450 italic">No hay registros dictaminados en esta sesión académica.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm bento-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-300 text-[9px] font-extrabold uppercase tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">ID</th>
                    <th className="px-5 py-3.5">ÁREA / INSTALACIONES</th>
                    <th className="px-5 py-3.5">RUBRO</th>
                    <th className="px-5 py-3.5">ESTADO ACTUAL</th>
                    <th className="px-5 py-3.5">DICTAMEN EXCLUSIVO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-medium">
                  {nonPendingTickets.map((t) => {
                    const techUser = mockUsers.find((u) => u.id === t.assignedTechId);
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-400">{t.id}</td>
                        <td className="px-5 py-3.5">
                          <p className="font-extrabold text-slate-800">{t.area}</p>
                          <p className="text-[10px] text-slate-400 tracking-wider mt-0.5 font-mono">{t.exactLocation}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 font-semibold">{t.defectType}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                              t.status === 'autorizado' ? 'bg-sky-50 text-sky-800 border-sky-200' :
                              t.status === 'en_progreso' ? 'bg-purple-50 text-purple-800 border-purple-250' :
                              t.status === 'completado' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {t.status === 'autorizado' ? 'AUTORIZADO' :
                             t.status === 'en_progreso' ? 'EN PROCESO' :
                             t.status === 'completado' ? 'SOLUCIONADO' : 'RECHAZADO'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          {t.status === 'rechazado' && (
                            <div className="text-rose-700 font-semibold max-w-sm">
                              <span className="text-[9px] uppercase tracking-wider text-rose-400 block font-extrabold">RECHAZO JUSTIFICADO:</span>
                              <span className="text-[11px] font-medium leading-relaxed block mt-0.5 text-rose-800 bg-rose-50/50 p-2 border border-rose-100 rounded-xl">{t.rejectionReason}</span>
                            </div>
                          )}
                          {t.status !== 'rechazado' && (
                            <div className="max-w-sm bg-slate-50/60 p-2.5 border border-slate-150 rounded-xl">
                              <span className="text-slate-400 text-[8px] font-extrabold uppercase tracking-widest block">PERSONAL DE OBRA</span>
                              <p className="font-extrabold text-slate-800 mt-0.5 text-xs">{techUser ? techUser.name : 'Asignado'}</p>
                              {t.materials.length > 0 && (
                                <p className="text-[9px] text-indigo-600 mt-1 font-extrabold flex items-center gap-1 bg-white p-1 px-2 border border-slate-200/50 rounded-lg w-max shadow-sm">
                                  <span>{t.materials.length} Insumos Registrados</span>
                                </p>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
