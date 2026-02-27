import { Evento } from "@/types/evento";

interface EventoTableProps {
  eventos: Evento[];
  loading: boolean;
  onEdit: (evento: Evento) => void;
  onDelete: (id: number) => void;
  onCancel: (id: number) => void;
}

export const EventoTable: React.FC<EventoTableProps> = ({
  eventos,
  loading,
  onEdit,
  onDelete,
  onCancel,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Foto</th>
            <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
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
              <td className="px-4 py-3 font-semibold">{evento.nombre}</td>
              <td className="px-4 py-3">
                {evento.foto ? (
                  <img src={evento.foto} alt={evento.nombre} className="h-12 w-20 object-cover rounded" />
                ) : (
                  <div className="h-12 w-20 bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">Sin foto</div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${evento.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                  evento.estado === 'FINALIZADO' ? 'bg-gray-100 text-gray-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                  {evento.estado || 'ACTIVO'}
                </span>
              </td>
              <td className="px-4 py-3">{evento.descripcion || "—"}</td>
              <td className="px-4 py-3">
                {new Date(evento.fechaHoraEvento).toLocaleString()}
              </td>
              <td className="px-4 py-3">{evento.capacidadMax}</td>
              <td className="px-4 py-3">{evento.idCategoria}</td>
              <td className="px-4 py-3">{evento.idOrganizacion}</td>
              <td className="px-4 py-3">
                <ul className="list-disc pl-4">
                  {(evento.tipoTickets || []).map((ticket) => (
                    <li key={ticket.idTipoTicket || ticket.tipo}>
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
                {evento.estado !== 'CANCELADO' && (
                  <button
                    onClick={() => onCancel(evento.idEvento)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    Cancelar
                  </button>
                )}
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
