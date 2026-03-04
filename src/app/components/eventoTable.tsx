import { Evento } from "@/types/evento";
import { useState } from "react";
import { Categoria } from "@/types/categoria";

interface EventoTableProps {
  eventos: Evento[];
  categorias: Categoria[];
  loading: boolean;
  onChangeDate: (id: number, nuevaFecha: string) => void;
  onDelete: (id: number) => void;
  onCancel: (id: number) => void;
}

export const EventoTable: React.FC<EventoTableProps> = ({
  eventos,
  categorias,
  loading,
  onChangeDate,
  onDelete,
  onCancel,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState("");

  const openDateModal = (evento: Evento) => {
    setSelectedEvento(evento);
    setNuevaFecha(new Date(evento.fechaHoraEvento).toISOString().slice(0, 16));
    setModalOpen(true);
  };

  const handleDateChangeSubmit = () => {
    if (selectedEvento && nuevaFecha) {
      onChangeDate(selectedEvento.idEvento, nuevaFecha);
      setModalOpen(false);
    }
  };
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
              <td className="px-4 py-3">
                {categorias.find((c) => c.idCategoria === evento.idCategoria)?.nombreCategoria || evento.idCategoria}
              </td>
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
                {evento.estado !== 'CANCELADO' ? (
                  <>
                    <button
                      onClick={() => openDateModal(evento)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Cambiar fecha
                    </button>
                    <button
                      onClick={() => onCancel(evento.idEvento)}
                      className="text-orange-600 hover:text-orange-800 mr-2"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 italic text-sm">Sin acciones</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className="p-4 text-center text-gray-500">Cargando...</div>
      )}

      {modalOpen && selectedEvento && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Cambiar Fecha del Evento</h3>
            <div className="mb-4 flex flex-col items-center">
              {selectedEvento.foto ? (
                <img src={selectedEvento.foto} alt={selectedEvento.nombre} className="h-32 w-full object-cover rounded mb-2" />
              ) : (
                <div className="h-32 w-full bg-gray-100 flex items-center justify-center text-gray-400 rounded mb-2">Sin foto</div>
              )}
              <span className="font-semibold text-center">{selectedEvento.nombre}</span>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Fecha y Hora</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDateChangeSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
