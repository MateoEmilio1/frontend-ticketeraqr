"use server";

import { Evento, EventoFormData } from "@/types/evento";

export interface ApiResponse<T> {
  data: T;
  error: boolean;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// Obtener todos los eventos
export async function getEventos(): Promise<Evento[]> {
  const res = await fetch(`${baseUrl}/api/eventos`);
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

// Actualizar evento
export async function updateEvento(id: number, data: EventoFormData): Promise<Evento> {
  const res = await fetch(`${baseUrl}/api/eventos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al actualizar evento");
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
