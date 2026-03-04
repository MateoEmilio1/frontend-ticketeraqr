// src/app/services/ticketService.ts

import { Ticket } from "@/types/tickets";

// URL base del backend — puede venir de .env.local
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/['"]/g, "");

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

// ✅ Validar ticket por QR token
export async function validarTicket(tokenQr: string) {
  const res = await fetch(`${API_URL}/api/tickets/validar/${tokenQr}`, {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al validar ticket");
  }
  const data = await res.json();
  return data.data;
}

// ✅ Consumir ticket por QR token
export async function consumirTicket(tokenQr: string) {
  const res = await fetch(`${API_URL}/api/tickets/consumir/${tokenQr}`, {
    method: "POST",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al consumir ticket");
  }
  const data = await res.json();
  return data.data;
}
export async function obtenerQrPorTicket(nroTicket: number): Promise<{ qr: string }> {
  const res = await fetch(`${API_URL}/api/tickets/qr/${nroTicket}`);
  if (!res.ok) throw new Error("Error al obtener el código QR");
  return res.json();
}

// ✅ Transferir ticket a otro usuario por mail
export async function transferTicket(nroTicket: number, mailNuevoDueño: string) {
  const res = await fetch(`${API_URL}/api/tickets/transferir`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nroTicket, mailNuevoDueño }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al transferir ticket");
  }
  return res.json();
}

// ✅ Reembolsar ticket
export async function refundTicket(nroTicket: number) {
  const res = await fetch(`${API_URL}/api/tickets/reembolsar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nroTicket }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al reembolsar ticket");
  }
  return res.json();
}

// ✅ Aceptar transferencia
export async function acceptTransfer(nroTicket: number) {
  const res = await fetch(`${API_URL}/api/tickets/aceptar-transferencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nroTicket }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al aceptar transferencia");
  }
  return res.json();
}

// ✅ Rechazar transferencia
export async function rejectTransfer(nroTicket: number) {
  const res = await fetch(`${API_URL}/api/tickets/rechazar-transferencia`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nroTicket }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al rechazar transferencia");
  }
  return res.json();
}

