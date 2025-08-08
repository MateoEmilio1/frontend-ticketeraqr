// Podriamos hacer un layout, por ser similares los menus de inicio de clientes y organizaciones

import { getEventos } from "@/app/services/eventoService";
import EventosList from "@/app/components/eventosList"

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Eventos disponibles</h1>
      <EventosList eventos={eventos} />
    </div>
  );
}