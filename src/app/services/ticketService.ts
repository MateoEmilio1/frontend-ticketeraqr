// src/app/services/ticketService.ts

import { Ticket } from "@/types/tickets";

// URL base del backend — puede venir de .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Crear un nuevo ticket
export async function crearTicket(data: {
  idCliente: number;
  idTipoTicket: number;
  metodoPago?: string;
}) {
  const res = await fetch(`${API_URL}/api/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear ticket: ${errorText}`);
  }

  return res.json();
}

// ✅ Obtener todos los tickets
export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/api/tickets`);

  if (!res.ok) throw new Error("Error al obtener tickets");
  const data = await res.json();
  return data.data;
}

// ✅ Obtener ticket por ID
export async function getTicketById(id: number): Promise<Ticket> {
  const res = await fetch(`${API_URL}/api/tickets/${id}`);

  if (!res.ok) throw new Error("Ticket no encontrado");
  const data = await res.json();
  return data.data;
}

export async function getTicketsByCliente(id: number): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/api/tickets/cliente/${id}`);

  if (!res.ok) throw new Error("Error al obtener tickets");
  const data = await res.json();
  return data.data;
}

export async function obtenerQrPorTicket(nroTicket: number): Promise<{ qr: string }> {
  const res = await fetch(`${API_URL}/api/tickets/qr/${nroTicket}`);
  if (!res.ok) throw new Error("Error al obtener el código QR");
  return res.json();
}
