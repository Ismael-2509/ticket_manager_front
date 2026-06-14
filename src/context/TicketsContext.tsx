import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, Material } from '../types';

interface TicketsContextType {
  tickets: Ticket[];
  createTicket: (
    area: string,
    defectType: string,
    description: string,
    exactLocation: string,
    initialPhoto?: string
  ) => void;
  authorizeTicket: (ticketId: string, assignedTechId: string) => void;
  rejectTicket: (ticketId: string, reason: string) => void;
  addMaterial: (ticketId: string, name: string, quantity: number, estimatedCost: number) => void;
  removeMaterial: (ticketId: string, materialId: string) => void;
  setTicketPhoto: (ticketId: string, step: 'before' | 'during' | 'after', photoBase64: string) => void;
  changeTicketStatus: (ticketId: string, status: Ticket['status']) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

const SEED_TICKETS: Ticket[] = [
  {
    id: 'T-101',
    area: 'Dirección Escolar',
    defectType: 'Mobiliario',
    description: 'Silla ejecuativa del director rota. La base de pistón neumático ya no bloquea la altura y se baja constantemente.',
    exactLocation: 'Edificio de Gobierno, Oficina de Dirección, Planta Alta.',
    createdAt: '2026-06-12T14:30:00Z',
    status: 'pendiente',
    materials: []
  },
  {
    id: 'T-102',
    area: 'Laboratorio de Cómputo B',
    defectType: 'Eléctrico',
    description: 'Tres contactos de la segunda fila de ordenadores no tienen corriente eléctrica. Al parecer saltó un falso fusible.',
    exactLocation: 'Edificio C, Laboratorio de Cómputo 2, planta baja.',
    createdAt: '2026-06-13T09:15:00Z',
    status: 'autorizado',
    assignedTechId: '3', // Asignado a Carlos Mendoza
    materials: [
      { id: 'mat-1', name: 'Fusible cerámico 15A', quantity: 2, estimatedCost: 45 },
      { id: 'mat-2', name: 'Contacto doble polarizado', quantity: 3, estimatedCost: 85 }
    ]
  },
  {
    id: 'T-103',
    area: 'Servicios Sanitarios Edificio Principal',
    defectType: 'Plomería',
    description: 'Fuga severa de agua potable en el lavabo central de damas. Llave angular barrida, gotea permanentemente.',
    exactLocation: 'Edificio A, planta baja, baño de mujeres contiguo a biblioteca.',
    createdAt: '2026-06-10T08:00:00Z',
    status: 'pendiente',
    materials: []
  },
  {
    id: 'T-104',
    area: 'Aulas de Clase',
    defectType: 'Infraestructura',
    description: 'La puerta del aula 15 no cierra adecuadamente porque las bisagras están flojas e impactan contra el marco de madera.',
    exactLocation: 'Edificio B, Segundo Piso, Aula 15 de Matemáticas.',
    createdAt: '2026-06-09T11:00:00Z',
    status: 'completado',
    assignedTechId: '3',
    materials: [
      { id: 'mat-3', name: 'Tornillo madera de 1 1/2 pulgada', quantity: 8, estimatedCost: 8 },
      { id: 'mat-4', name: 'Bisagra de acero inoxidable 3 pulgadas', quantity: 2, estimatedCost: 110 }
    ],
    photoBefore: 'data:text/plain;HexImageBefore...',
    photoDuring: 'data:text/plain;HexImageDuring...',
    photoAfter: 'data:text/plain;HexImageAfter...'
  }
];

export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('repara_tickets');
    return saved ? JSON.parse(saved) : SEED_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem('repara_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const createTicket = (
    area: string,
    defectType: string,
    description: string,
    exactLocation: string,
    initialPhoto?: string
  ) => {
    const newTicket: Ticket = {
      id: `T-${Math.floor(100 + Math.random() * 900)}`,
      area,
      defectType,
      description,
      exactLocation,
      initialPhoto,
      createdAt: new Date().toISOString(),
      status: 'pendiente',
      materials: []
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const authorizeTicket = (ticketId: string, assignedTechId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'autorizado', assignedTechId, rejectionReason: undefined }
          : t
      )
    );
  };

  const rejectTicket = (ticketId: string, reason: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'rechazado', rejectionReason: reason, assignedTechId: undefined }
          : t
      )
    );
  };

  const addMaterial = (ticketId: string, name: string, quantity: number, estimatedCost: number) => {
    const newMaterial: Material = {
      id: `mat-${Math.random().toString(36).substr(2, 9)}`,
      name,
      quantity,
      estimatedCost
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, materials: [...t.materials, newMaterial] } : t
      )
    );
  };

  const removeMaterial = (ticketId: string, materialId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, materials: t.materials.filter((m) => m.id !== materialId) }
          : t
      )
    );
  };

  const setTicketPhoto = (ticketId: string, step: 'before' | 'during' | 'after', photoBase64: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          if (step === 'before') return { ...t, photoBefore: photoBase64 };
          if (step === 'during') return { ...t, photoDuring: photoBase64 };
          if (step === 'after') return { ...t, photoAfter: photoBase64 };
        }
        return t;
      })
    );
  };

  const changeTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        createTicket,
        authorizeTicket,
        rejectTicket,
        addMaterial,
        removeMaterial,
        setTicketPhoto,
        changeTicketStatus
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets debe ser usado dentro de un TicketsProvider');
  }
  return context;
};
