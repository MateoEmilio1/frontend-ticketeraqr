"use client";

import { useState } from "react";
import { crearTicket } from "@/app/services/ticketService";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Ticket } from "@/types/tickets";

export default function TicketForm({ onTicketCreated }: { onTicketCreated: (ticket: Ticket) => void }) {
  const [idCliente, setIdCliente] = useState("");
  const [idTipoTicket, setIdTipoTicket] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const res = await crearTicket(Number(idCliente), Number(idTipoTicket));
      onTicketCreated(res.data);
      setMensaje(res.message);
    } catch (error: unknown) {
      setMensaje(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cliente">ID Cliente</Label>
        <Input
          id="cliente"
          type="number"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          placeholder="Ej: 1"
        />
      </div>

      <div>
        <Label htmlFor="tipo">Tipo de Ticket</Label>
        <select
          id="tipo"
          value={idTipoTicket}
          onChange={(e) => setIdTipoTicket(e.target.value)}
          className="border border-blue-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona un tipo</option>
          <option value="1">🎫 General</option>
          <option value="2">⭐ VIP</option>
          <option value="3">🎤 Backstage</option>
        </select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
      >
        {loading ? "Generando..." : "Obtener Ticket"}
      </Button>

      {mensaje && <p className="text-center text-blue-600 mt-2">{mensaje}</p>}
    </form>
  );
}
