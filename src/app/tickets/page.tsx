"use client";

import { useState } from "react";
import { crearTicket } from "@/app/services/ticketService";

export default function TicketsPage() {
  const [idCliente, setIdCliente] = useState<number | "">("");
  const [idTipoTicket, setIdTipoTicket] = useState<number | "">("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    if (!idCliente || !idTipoTicket) {
      setMensaje("⚠️ Debes completar todos los campos");
      return;
    }

    try {
      const res = await crearTicket({
        idCliente: Number(idCliente),
        idTipoTicket: Number(idTipoTicket),
      });

      setMensaje("✅ Ticket creado correctamente");
      console.log("Ticket creado:", res);
    } catch (error: unknown) {
      console.error(error);
      setMensaje("❌ Error al crear ticket");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
          🎟️ Obtener Ticket
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">ID Cliente</label>
            <input
              type="number"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el ID del cliente"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Tipo de Ticket</label>
            <select
              value={idTipoTicket}
              onChange={(e) => setIdTipoTicket(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="1">🎫 General</option>
              <option value="2">⭐ VIP</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Obtener Ticket
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center text-blue-700 font-medium">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
