import React, { useState } from 'react';
import { useTickets } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';
import { Wrench, ClipboardList, PackagePlus, Image as ImageIcon, Check, DollarSign, Calendar, RefreshCw, Layers, Coins, ClipboardCheck } from 'lucide-react';

export const TechDashboard: React.FC = () => {
  const { tickets, addMaterial, removeMaterial, setTicketPhoto, changeTicketStatus } = useTickets();
  const { currentUser } = useAuth();

  // Filtrar los tickets asignados a este técnico en específico
  const myAssignedTickets = tickets.filter(
    (t) => t.assignedTechId === currentUser?.id && t.status !== 'rechazado'
  );

  // Seleccionar cuál ticket se está editando activamente
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    myAssignedTickets[0]?.id || ''
  );

  // Estados del Formulario de Materiales
  const [materialName, setMaterialName] = useState('');
  const [materialQty, setMaterialQty] = useState<number>(1);
  const [materialCost, setMaterialCost] = useState<number>(0);

  // Buscar el ticket seleccionado actual en base al estado
  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || myAssignedTickets[0];

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    if (!materialName.trim()) {
      alert('Ingresa el nombre del material.');
      return;
    }
    if (materialQty <= 0 || materialCost < 0) {
      alert('Valores de cantidad o costos no válidos.');
      return;
    }

    addMaterial(activeTicket.id, materialName.trim(), materialQty, materialCost);
    
    // Resetear formulario de material
    setMaterialName('');
    setMaterialQty(1);
    setMaterialCost(0);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, step: 'before' | 'during' | 'after') => {
    if (!activeTicket) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTicketPhoto(activeTicket.id, step, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!activeTicket) return;
    changeTicketStatus(activeTicket.id, e.target.value as any);
  };

  // Calcular costo total estimado del ticket activo
  const totalCost = activeTicket?.materials.reduce(
    (acc, val) => acc + val.quantity * val.estimatedCost,
    0
  ) || 0;

  // KPIs Generales del Técnico
  const techKpiAssigned = myAssignedTickets.length;
  const techKpiInProgess = myAssignedTickets.filter((t) => t.status === 'en_progreso').length;
  const techKpiCompleted = myAssignedTickets.filter((t) => t.status === 'completado').length;
  const techKpiTotalExpenses = myAssignedTickets.reduce((sum, t) => {
    const ticketCost = t.materials.reduce((acc, m) => acc + m.quantity * m.estimatedCost, 0);
    return sum + ticketCost;
  }, 0);

  return (
    <div className="w-full space-y-6">
      {/* Encabezado General (Bento Card Style) */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-850 shadow-sm bento-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-600/20 p-2.5 rounded-xl border border-amber-500/30">
            <Wrench className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Taller y Bitácora del Operador Técnico
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-mono">
              Gestión de insumos físicos y carga de evidencias en tiempo real
            </p>
          </div>
        </div>
      </div>

      {/* METRIC REPORTING ROW (KPI bento widgets) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">ÓRDENES ACTIVAS</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{techKpiAssigned}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl text-slate-600 border border-slate-100">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">EN PROCESO</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{techKpiInProgess}</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl text-amber-700 border border-amber-100">
            <RefreshCw className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">COMPLETADAS</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{techKpiCompleted}</p>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 border border-emerald-150">
            <ClipboardCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl bento-card flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">PRESUPUESTO ACUMULADO</span>
            <p className="text-xl font-black text-slate-900 mt-1.5">${techKpiTotalExpenses.toFixed(2)}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600 border border-indigo-150">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {myAssignedTickets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-sm bento-card">
          <p className="text-sm font-semibold text-slate-800">¡Bandeja técnica libre!</p>
          <p className="text-xs text-slate-400 mt-1">No tienes órdenes de mantenimiento asignadas actualmente para tu perfil.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LADO IZQUIERDO: Selector de Órdenes y Resumen */}
          <div className="lg:col-span-4 space-y-4 bg-white border border-slate-200 p-5 rounded-2xl bento-card">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2.5">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <ClipboardList className="h-4 w-4 text-slate-650" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                ÓRDENES RECIBIDAS
              </h3>
            </div>
            
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {myAssignedTickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  type="button"
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer block ${
                    (activeTicket?.id === t.id)
                      ? 'bg-slate-900 text-white border-slate-950 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-705 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-lg ${
                      activeTicket?.id === t.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.id}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                        t.status === 'autorizado' ? 'bg-sky-50 text-sky-800 border-sky-250' : 
                        t.status === 'en_progreso' ? 'bg-purple-50 text-purple-800 border-purple-250' :
                        'bg-emerald-50 text-emerald-800 border-emerald-250'
                      }`}
                    >
                      {t.status === 'autorizado' ? 'AUTORIZADO' :
                       t.status === 'en_progreso' ? 'EN PROCESO' : 'SOLUCIONADO'}
                    </span>
                  </div>
                  <h4 className={`font-extrabold text-xs block truncate ${activeTicket?.id === t.id ? 'text-white' : 'text-slate-800'}`}>{t.area}</h4>
                  <p className={`text-[10px] mt-1 line-clamp-1 ${activeTicket?.id === t.id ? 'text-slate-300' : 'text-slate-450'}`}>{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* LADO DERECHO: Detalle Interactivo de la Orden Seleccionada */}
          {activeTicket && (
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 bento-card">
              {/* Encabezado del Detalle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] font-extrabold px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-600">
                      {activeTicket.id}
                    </span>
                    <span className="text-[10px] text-slate-450 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(activeTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1.5 tracking-tight">{activeTicket.area}</h3>
                </div>

                {/* Actualizar Estado del Trabajo */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl flex items-center gap-2.5">
                  <label htmlFor="stateSelect" className="text-[10px] font-extrabold text-slate-405 text-slate-500 uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                    <RefreshCw className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
                    ACCIÓN:
                  </label>
                  <select
                    id="stateSelect"
                    value={activeTicket.status}
                    onChange={handleStatusChange}
                    className="text-xs rounded-xl border border-slate-200 bg-white py-1.5 px-3 font-extrabold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-slate-800 cursor-pointer"
                  >
                    <option value="autorizado">Recibido / Pendiente de Inicio</option>
                    <option value="en_progreso">Iniciar Trabajos / En Proceso</option>
                    <option value="completado">Completado / Validar Solución</option>
                  </select>
                </div>
              </div>

              {/* Contenido Descriptivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/55 p-4 rounded-xl border border-slate-200/50 text-xs leading-relaxed">
                <div>
                  <strong className="text-slate-400 font-extrabold uppercase text-[8px] tracking-widest block mb-1">Ubicación exacta reportada:</strong>
                  <p className="text-slate-800 font-bold">{activeTicket.exactLocation}</p>
                </div>
                <div>
                  <strong className="text-slate-400 font-extrabold uppercase text-[8px] tracking-widest block mb-1">Descripción de desperfecto:</strong>
                  <p className="text-slate-700 font-medium">{activeTicket.description}</p>
                </div>
              </div>

              {/* SECCIÓN 1: Formulario e Historial de Materiales Requeridos */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                  <PackagePlus className="h-4 w-4 text-indigo-600" />
                  BITÁCORA DE MATERIALES / COSTOS ASOCIADOS
                </h4>

                {/* Formulario de Materiales */}
                <form onSubmit={handleAddMaterialSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                  <div className="sm:col-span-6">
                    <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1.5" htmlFor="matName">Nombre Material / Repuesto</label>
                    <input
                      id="matName"
                      type="text"
                      placeholder="Ej. Cinta teflón, Tubo PVC 1/2 pulgada, Yeso kg"
                      value={materialName}
                      onChange={(e) => setMaterialName(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-205 bg-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-slate-800 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1.5" htmlFor="matQty">Cant.</label>
                    <input
                      id="matQty"
                      type="number"
                      min={1}
                      value={materialQty}
                      onChange={(e) => setMaterialQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs rounded-xl border border-slate-205 bg-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-slate-850 font-bold"
                    />
                  </div>
                  <div className="sm:col-span-4 flex flex-col justify-between">
                    <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1.5" htmlFor="matCost">Costo Estimado ($)</label>
                    <div className="flex gap-2 items-center">
                      <input
                        id="matCost"
                        type="number"
                        min={0}
                        value={materialCost}
                        onChange={(e) => setMaterialCost(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full text-xs rounded-xl border border-slate-205 bg-white px-3 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-slate-850 font-bold"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl text-xs px-4 py-3 font-black cursor-pointer transition-all shrink-0 shadow-sm"
                        title="Agregar material"
                      >
                        AGREGAR
                      </button>
                    </div>
                  </div>
                </form>

                {/* Tabla de Materiales */}
                {activeTicket.materials.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No se han registrado insumos o materiales para este servicio técnico.</p>
                ) : (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 text-slate-400 font-extrabold uppercase text-[9px] border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Insumo / Refacción</th>
                          <th className="px-4 py-3 text-center">Cantidad</th>
                          <th className="px-4 py-3 text-right">Costo Unit.</th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                          <th className="px-4 py-3 text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white font-semibold">
                        {activeTicket.materials.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 text-slate-800 font-extrabold">{m.name}</td>
                            <td className="px-4 py-3 text-center text-slate-700">{m.quantity}</td>
                            <td className="px-4 py-3 text-right text-slate-500">${m.estimatedCost.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">
                              ${(m.quantity * m.estimatedCost).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeMaterial(activeTicket.id, m.id)}
                                className="text-rose-600 hover:text-rose-500 font-extrabold text-[11px] cursor-pointer hover:underline"
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50/60 font-medium border-t border-slate-200">
                          <td colSpan={3} className="px-4 py-3 text-right text-slate-400 uppercase tracking-widest text-[8px] font-extrabold">Presupuesto Estimado Acumulado:</td>
                          <td className="px-4 py-3 text-right text-indigo-650 text-indigo-600 font-extrabold text-xs">
                            ${totalCost.toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: Repositorio Fotográfico de Evidencia de Reparación */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ImageIcon className="h-4 w-4 text-indigo-600" />
                  EVIDENCIA FOTOGRÁFICA INTERMEDIA (PROCESO)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Foto ANTES */}
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-center animate-fade-in">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2.5">1. FOTO ANTES</span>
                    {activeTicket.photoBefore ? (
                      <div className="relative h-28 w-full border border-slate-200 rounded-xl overflow-hidden mb-2.5 bg-slate-100 shadow-sm">
                        <img src={activeTicket.photoBefore} alt="Antes" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setTicketPhoto(activeTicket.id, 'before', '')}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-rose-500 shadow-sm font-bold animate-pulse"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="h-28 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-white text-slate-400 mb-2.5">
                        <ImageIcon className="h-6 w-6 text-slate-300 mb-1" />
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sin Foto Antes</span>
                      </div>
                    )}
                    <label className="text-[9px] bg-slate-900 hover:bg-indigo-600 text-white font-extrabold py-2 px-3 rounded-lg inline-block cursor-pointer transition-all uppercase tracking-wider shadow-sm">
                      Examinar...
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handlePhotoUpload(e, 'before')}
                      />
                    </label>
                  </div>

                  {/* Foto DURANTE */}
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-center animate-fade-in">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2.5">2. FOTO DURANTE</span>
                    {activeTicket.photoDuring ? (
                      <div className="relative h-28 w-full border border-slate-200 rounded-xl overflow-hidden mb-2.5 bg-slate-100 shadow-sm">
                        <img src={activeTicket.photoDuring} alt="Durante" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setTicketPhoto(activeTicket.id, 'during', '')}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-rose-500 shadow-sm font-bold animate-pulse"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="h-28 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-white text-slate-400 mb-2.5">
                        <ImageIcon className="h-6 w-6 text-slate-300 mb-1" />
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sin Foto Durante</span>
                      </div>
                    )}
                    <label className="text-[9px] bg-slate-900 hover:bg-indigo-600 text-white font-extrabold py-2 px-3 rounded-lg inline-block cursor-pointer transition-all uppercase tracking-wider shadow-sm">
                      Examinar...
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handlePhotoUpload(e, 'during')}
                      />
                    </label>
                  </div>

                  {/* Foto DESPUÉS */}
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-center animate-fade-in">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2.5">3. FOTO DESPUÉS</span>
                    {activeTicket.photoAfter ? (
                      <div className="relative h-28 w-full border border-slate-200 rounded-xl overflow-hidden mb-2.5 bg-slate-100 shadow-sm">
                        <img src={activeTicket.photoAfter} alt="Después" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setTicketPhoto(activeTicket.id, 'after', '')}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-rose-500 shadow-sm font-bold animate-pulse"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="h-28 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-white text-slate-400 mb-2.5">
                        <ImageIcon className="h-6 w-6 text-slate-300 mb-1" />
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sin Foto Después</span>
                      </div>
                    )}
                    <label className="text-[9px] bg-slate-900 hover:bg-indigo-600 text-white font-extrabold py-2 px-3 rounded-lg inline-block cursor-pointer transition-all uppercase tracking-wider shadow-sm">
                      Examinar...
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handlePhotoUpload(e, 'after')}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
