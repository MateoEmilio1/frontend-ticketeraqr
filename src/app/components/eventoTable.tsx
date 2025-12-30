import { Evento } from "@/types/evento";

interface EventoTableProps {
  eventos: Evento[];
  loading: boolean;
  onEdit: (evento: Evento) => void;
  onDelete: (id: number) => void;
}

export const EventoTable: React.FC<EventoTableProps> = ({
  eventos,
  loading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Descripción</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Fecha Evento</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Capacidad</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Organización</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Tickets</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Acciones</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {eventos.map((evento) => (
            <tr key={evento.idEvento}>
              <td className="px-4 py-3">{evento.nombre}</td>
              <td className="px-4 py-3">{evento.descripcion || "—"}</td>
              <td className="px-4 py-3">
                {new Date(evento.fechaHoraEvento).toLocaleString()}
              </td>
              <td className="px-4 py-3">{evento.capacidadMax}</td>
              <td className="px-4 py-3">{evento.idCategoria}</td>
              <td className="px-4 py-3">{evento.idOrganizacion}</td>
              <td className="px-4 py-3">
                <ul className="list-disc pl-4">
                  {evento.tipoTickets.map((ticket) => (
                    <li key={ticket.idTipoTicket}>
                      {ticket.tipo} (${ticket.precio}) - {ticket.acceso}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                <button
                  onClick={() => onEdit(evento)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(evento.idEvento)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="p-4 text-center text-gray-500">Cargando...</div>
      )}
    </div>
  );
};
