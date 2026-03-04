"use server";

import { Evento, EventoFormData } from "@/types/evento";

export interface ApiResponse<T> {
  data: T;
  error: boolean;
  message: string;
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/['"]/g, "");

// Obtener todos los eventos
export async function getEventos(idOrganizacion?: number): Promise<Evento[]> {
  const url = idOrganizacion
    ? `${baseUrl}/api/eventos?idOrganizacion=${idOrganizacion}`
    : `${baseUrl}/api/eventos`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al obtener eventos");
  const json = (await res.json()) as ApiResponse<Evento[]>;
  return json.data;
}

// Obtener un evento por ID
export async function getEventoById(id: number): Promise<Evento> {
  const res = await fetch(`${baseUrl}/api/eventos/${id}`);
  if (!res.ok) throw new Error("Error al obtener evento");
  const json = (await res.json()) as ApiResponse<Evento>;
  return json.data;
}

// Crear evento
export async function createEvento(data: EventoFormData): Promise<Evento> {
  const res = await fetch(`${baseUrl}/api/eventos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear evento");
  const json = (await res.json()) as ApiResponse<Evento>;
  return json.data;
}

// Actualizar fecha evento
export async function cambiarFechaEvento(id: number, fechaHoraEvento: string): Promise<Evento> {
  const res = await fetch(`${baseUrl}/api/eventos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fechaHoraEvento }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al actualizar la fecha del evento");
  }
  const json = (await res.json()) as ApiResponse<Evento>;
  return json.data;
}

// Eliminar evento
export async function deleteEvento(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}/api/eventos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar evento");
}

export interface ReporteHora {
  hora: string;
  cantidad: number;
  recaudacion: number;
}

export async function getVentasReport(filters: { fechaInicio?: string; fechaFin?: string; idCategoria?: string; idEvento?: string; idTipoTicket?: string; idOrganizacion?: number | string }): Promise<ReporteHora[]> {
  const params = new URLSearchParams();
  if (filters.fechaInicio) params.append("fechaInicio", filters.fechaInicio);
  if (filters.fechaFin) params.append("fechaFin", filters.fechaFin);
  if (filters.idCategoria) params.append("idCategoria", filters.idCategoria);
  if (filters.idEvento) params.append("idEvento", filters.idEvento);
  if (filters.idTipoTicket) params.append("idTipoTicket", filters.idTipoTicket);
  if (filters.idOrganizacion) params.append("idOrganizacion", filters.idOrganizacion.toString());

  const res = await fetch(`${baseUrl}/api/eventos/ventas-hora?${params.toString()}`);
  if (!res.ok) throw new Error("Error al obtener reporte");

  const json = await res.json();
  return json.data || [];
}

// Cancelar evento
export async function cancelarEvento(id: number): Promise<void> {
  const res = await fetch(`${baseUrl}/api/eventos/${id}/cancelar`, {
    method: "PATCH",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al cancelar evento");
  }
}
