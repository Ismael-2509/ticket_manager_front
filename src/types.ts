/**
 * Definiciones de tipos para el Sistema de Gestión de Tickets de Mantenimiento "REPARA - 79".
 */

export type Role = 'user' | 'admin' | 'tech';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  estimatedCost: number;
}

export interface Ticket {
  id: string;
  area: string;
  defectType: string;
  description: string;
  exactLocation: string;
  initialPhoto?: string; // Almacenado como base64 o referencia de datos local
  createdAt: string;
  status: 'pendiente' | 'autorizado' | 'rechazado' | 'en_progreso' | 'completado';
  rejectionReason?: string;
  assignedTechId?: string; // ID del técnico asignado si está autorizado
  materials: Material[];
  photoBefore?: string;  // Foto antes de la reparación
  photoDuring?: string;  // Foto durante la reparación
  photoAfter?: string;   // Foto después de la reparación
}
