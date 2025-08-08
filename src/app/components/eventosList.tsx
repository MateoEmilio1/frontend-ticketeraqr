"use client"

import { Evento } from "@/types/evento";

interface EventosListProps {
  eventos: Evento[];
}

export default function EvenostList({ eventos }: EventosListProps) {
  if (!eventos.length) {
    return <p>No hay eventos disponibles.</p>;
  }

  return (
    <ul className="space-y-4">
      {eventos.map((evento) => (
        <li
          key={evento.idEvento}
          className="p-4 border rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold">{evento.nombre}</h2>
          <p className="text-gray-600">{evento.descripcion || "Sin descripción"}</p>
          <p className="text-sm text-gray-500">
            {new Date(evento.fechaHoraEvento).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
