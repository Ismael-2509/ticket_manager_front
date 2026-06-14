import React, { useState } from 'react';
import { useTickets } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';
import { FileText, MapPin, ClipboardList, Image as ImageIcon, CheckCircle, PlusCircle, PenTool } from 'lucide-react';

export const TicketForm: React.FC = () => {
  const { createTicket, tickets } = useTickets();
  const { currentUser } = useAuth();

  const [area, setArea] = useState('');
  const [defectType, setDefectType] = useState('');
  const [description, setDescription] = useState('');
  const [exactLocation, setExactLocation] = useState('');
  const [initialPhoto, setInitialPhoto] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar los tickets creados en la sesión (o asignados por defecto)
  const myTickets = tickets; // Para simulación, mostramos todos los tickets del sistema para que el usuario creador pueda ver el impacto general del flujo

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInitialPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area || !defectType || !description || !exactLocation) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);

    // Simulate small backend registry latency for premium feels
    setTimeout(() => {
      createTicket(area, defectType, description, exactLocation, initialPhoto || undefined);
      
      setArea('');
      setDefectType('');
      setDescription('');
      setExactLocation('');
      setInitialPhoto('');
      setIsSubmitting(false);

      setSuccessMsg('¡Ticket de Mantenimiento registrado de manera oficial! Ha sido canalizado al Panel de la Subdirección.');
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner / Header */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl text-white shadow-sm bento-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30">
            <ClipboardList className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Registro de Incidencias Técnicas</h2>
            <p className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest font-mono">Alta oficial de desperfectos y reparaciones del campus</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Formulario de Reporte */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 bento-card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <PenTool className="h-4 w-4 text-indigo-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">NUEVO EXPEDIENTE DE REPARACIÓN</h3>
          </div>

          {successMsg && (
            <div className="flex items-center space-x-2.5 bg-indigo-50 border border-indigo-100 text-indigo-900 px-4 py-3.5 rounded-xl mb-6 text-xs font-bold animate-fade-in">
              <CheckCircle className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Área */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="area">
                ÁREA / EDIFICIO O DEPARTAMENTO <span className="text-rose-500">*</span>
              </label>
              <input
                id="area"
                type="text"
                required
                placeholder="Ej. Aulas de Posgrado, Oficina Directiva, Cafetería Central"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border border-slate-205 bg-slate-50/50 px-3.5 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs transition-all font-medium"
              />
            </div>

            {/* Campo Tipo de Desperfecto */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="defectType">
                CATEGORÍA DEL DESPERFECTO FÍSICO <span className="text-rose-500">*</span>
              </label>
              <select
                id="defectType"
                required
                value={defectType}
                onChange={(e) => setDefectType(e.target.value)}
                className="w-full rounded-xl border border-slate-205 bg-slate-50/50 px-3.5 py-3 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs font-bold bg-white cursor-pointer"
              >
                <option value="">Selecciona el rubro técnico...</option>
                <option value="Plomería">Plomería / Fugas de Agua de Baños y Cisternas</option>
                <option value="Eléctrico">Eléctrico / Alumbrado / Cableados / Tomacorrientes</option>
                <option value="Mobiliario">Mobiliario / Pupitres / Sillas / Pizarrón / Escritorio</option>
                <option value="Cerrajería">Cerrajería / Chapas / Puertas / Marcos / Ventanas</option>
                <option value="Pintura o Acabados">Pintura / Grietas menores / Resanes / Albañilería</option>
                <option value="Equipo Tecnológico">Aire Acondicionado / Proyector / Voz y Datos</option>
                <option value="Otro">Otro Incidente Especial no especificado</option>
              </select>
            </div>

            {/* Campo Ubicación Exacta */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="exactLocation">
                UBICACIÓN EXACTA DE REFERENCIA <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  id="exactLocation"
                  type="text"
                  required
                  placeholder="Ej. Edificio B, Aula de Maestría 5, en la esquina posterior izquierda"
                  value={exactLocation}
                  onChange={(e) => setExactLocation(e.target.value)}
                  className="pl-10 w-full rounded-xl border border-slate-205 bg-slate-50/50 px-3.5 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs transition-all font-medium"
                />
              </div>
            </div>

            {/* Campo Descripción Detallada */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5" htmlFor="description">
                DESCRIPCIÓN MINUCIOSA DE LA AVERÍA <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                required
                rows={4}
                placeholder="Declare minuciosamente qué sucede, qué daño presenta el objeto, material de fabricación y qué riesgos o inconvenientes inmediatos ocasiona..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-205 bg-slate-50/50 px-3.5 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs resize-none transition-all leading-relaxed"
              />
            </div>

            {/* Campo Fotografía Inicial */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                REGISTRO FOTOGRÁFICO INICIAL DE EVIDENCIA <span className="text-slate-400 font-normal">(Opcional)</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-6 pb-7 border-2 border-slate-205 border-dashed rounded-2xl bg-slate-50/50 transition-all hover:border-indigo-400">
                <div className="space-y-2 text-center">
                  <ImageIcon className="mx-auto h-9 w-9 text-slate-400" />
                  <div className="flex text-xs text-slate-600 justify-center">
                    <label
                      htmlFor="initialPhotoFile"
                      className="relative cursor-pointer bg-white rounded-xl px-3.5 py-1.5 border border-slate-200 shadow-sm font-extrabold text-indigo-650 text-indigo-600 hover:text-indigo-500 hover:border-indigo-300 focus-within:outline-none transition-all text-[11px]"
                    >
                      <span>Examinar Archivo Local</span>
                      <input
                        id="initialPhotoFile"
                        name="initialPhotoFile"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-400">Soporta imágenes fotográficas en formatos PNG o JPG</p>
                </div>
              </div>
              {initialPhoto && (
                <div className="mt-4">
                  <p className="text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Foto de Evidencia Cargada:</p>
                  <div className="relative w-40 h-28 border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                    <img
                      src={initialPhoto}
                      alt="Evidencia inicial"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setInitialPhoto('')}
                      className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 text-[10px] w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-rose-500 shadow transition-all font-extrabold"
                      title="Eliminar foto actual"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 hover:bg-slate-900 text-white py-3 px-4 rounded-2xl font-extrabold text-xs transition-all duration-200 cursor-pointer mt-4 shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              {isSubmitting ? 'Registrando Ticket...' : 'Registrar Nuevo Ticket de Mantenimiento'}
            </button>
          </form>
        </div>

        {/* Columna Derecha: Resumen de Reportes en el Sistema */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 bento-card">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="bg-indigo-50 p-1.5 rounded-lg">
                <FileText className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                EXPEDIENTES Y SEGUIMIENTO LOCAL
              </h3>
            </div>
            
            {myTickets.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-xs font-bold text-slate-700">No hay tickets registrados</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">Cuando registre desperfectos, la bitácora histórica aparecerá de inmediato en este panel.</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
                {myTickets.map((t) => (
                  <div key={t.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-xs hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] font-extrabold px-2 py-0.5 bg-slate-205 border border-slate-250 text-slate-700 bg-slate-200 rounded-lg">
                        {t.id}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          t.status === 'pendiente' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          t.status === 'autorizado' ? 'bg-sky-50 text-sky-805 border-sky-200 text-sky-800' :
                          t.status === 'rechazado' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                          t.status === 'en_progreso' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          'bg-emerald-50 text-emerald-850 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        {t.status === 'pendiente' ? 'REVISIÓN' : t.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-850 text-slate-800">{t.area}</h4>
                    <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed text-[11px]">{t.description}</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-[10px] text-slate-500 flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <strong className="text-slate-400 uppercase tracking-widest text-[8px] block mb-0.5">Categoría:</strong> 
                        <span className="font-semibold text-slate-700">{t.defectType}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400 uppercase tracking-widest text-[8px] block mb-0.5">Ubicación exacta:</strong> 
                        <span className="font-semibold text-slate-700">{t.exactLocation}</span>
                      </div>
                      {t.rejectionReason && (
                        <div className="mt-1.5 p-2 bg-rose-50/50 text-rose-800 border border-rose-100 rounded-xl text-[10px] leading-relaxed">
                          <strong className="text-rose-500 text-[9px] uppercase tracking-wider block mb-0.5">MOTIVO DE RECHAZO TÉCNICO:</strong> 
                          {t.rejectionReason}
                        </div>
                      )}
                      {t.assignedTechId && (
                        <div className="mt-1.5 p-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-[9px] flex justify-between items-center">
                          <span><strong>Técnico de Planta:</strong> Asignado</span>
                          {t.materials.length > 0 && <span className="font-extrabold text-[8px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-lg">{t.materials.length} Materiales</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
