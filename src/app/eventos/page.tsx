"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { Evento, EventoFormData, TipoTicketFormData } from "@/types/evento";
import {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
  cancelarEvento,
} from "@/app/services/eventosService";
import { EventoForm } from "@/app/components/eventoForm";
import { EventoTable } from "@/app/components/eventoTable";
import { TipoTicketForm } from "../components/tipoTicketForm";
import RoleGuard from "../components/RoleGuard";
import { useAuth } from "@/context/AuthContext";

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvento, setEditingEvento] = useState<EventoFormData | null>(null);
  const [tipoTickets, setTipoTickets] = useState<TipoTicketFormData[]>([]);
  const [successEvent, setSuccessEvent] = useState<Evento | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const { user } = useAuth(); // Assume we need to import useAuth and destructure user

  useEffect(() => {
    loadEventos();
  }, [user]);

  const loadEventos = async () => {
    try {
      const data = await getEventos();
      if (user?.idUsuario) {
        setEventos(data.filter(e => e.idOrganizacion === user.idUsuario));
      } else {
        setEventos(data);
      }
    } catch (error) {
      console.error("Error cargando eventos:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleFormSubmit = async (data: EventoFormData) => {
    setLoading(true);
    try {
      // Create a type-safe copy of the event data
      const eventoData: EventoFormData = {
        ...data,
        capacidadMax: typeof data.capacidadMax === 'number' ? data.capacidadMax : parseInt(String(data.capacidadMax), 10) || 0,
        idCategoria: typeof data.idCategoria === 'number' ? data.idCategoria : parseInt(String(data.idCategoria), 10) || 1,
        idOrganizacion: user?.idUsuario || 1, // Dynamically set from logged in user
        fechaCreacion: data.fechaCreacion || new Date().toISOString(), // Inject current date if absent
        tipoTickets: tipoTickets
      };

      if (editingEvento?.idEvento) {
        const updated = await updateEvento(editingEvento.idEvento, eventoData);
        setEventos((prev) =>
          prev.map((ev) => (ev.idEvento === updated.idEvento ? updated : ev))
        );
      } else {
        const nuevo = await createEvento(eventoData);
        // Explicitly update state with new event
        setEventos(prev => [...prev, nuevo]);
        setSuccessEvent(nuevo);
        // Desaparecer mensaje de éxito después de 10 segundos
        setTimeout(() => setSuccessEvent(null), 10000);
      }

      // Reset form state
      setEditingEvento(null);
      setTipoTickets([]);

      // Reload events list to ensure consistency
      await loadEventos();
    } catch (error) {
      console.error("Error en el formulario de evento:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // When adding new ticket types
  const handleTipoTicketSubmit = (newTipoTicket: TipoTicketFormData) => {
    // Ensure numeric values are properly typed
    const typedTicket: TipoTicketFormData = {
      ...newTipoTicket,
      precio: typeof newTipoTicket.precio === 'number' ?
        newTipoTicket.precio :
        parseFloat(String(newTipoTicket.precio)) || 0,
      cantMaxPorTipo: typeof newTipoTicket.cantMaxPorTipo === 'number' ?
        newTipoTicket.cantMaxPorTipo :
        parseInt(String(newTipoTicket.cantMaxPorTipo), 10) || 0
    };

    setTipoTickets(prev => [...prev, typedTicket]);
    setShowTicketModal(false); // Close modal on submit
  };

  const handleEdit = (evento: Evento) => {
    // Convertir las fechas a formato ISO para los inputs de tipo datetime-local
    const fechaCreacionStr = new Date(evento.fechaCreacion)
      .toISOString()
      .slice(0, 16);
    const fechaHoraEventoStr = new Date(evento.fechaHoraEvento)
      .toISOString()
      .slice(0, 16);
    setEditingEvento({
      idEvento: evento.idEvento,
      nombre: evento.nombre,
      fechaCreacion: fechaCreacionStr,
      fechaHoraEvento: fechaHoraEventoStr,
      capacidadMax: evento.capacidadMax,
      descripcion: evento.descripcion || "",
      foto: evento.foto,
      idCategoria: evento.idCategoria,
      idOrganizacion: evento.idOrganizacion,
      tipoTickets: evento.tipoTickets.map((tt) => ({
        tipo: tt.tipo,
        precio: tt.precio,
        acceso: tt.acceso,
        cantMaxPorTipo: tt.cantMaxPorTipo,
      })),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    setLoading(true);
    try {
      await deleteEvento(id);
      setEventos((prev) => prev.filter((ev) => ev.idEvento !== id));
    } catch (error) {
      console.error("Error eliminando evento:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvento(null);
  };

  const handleCancelEvento = async (id: number) => {
    if (!confirm("¿Estás seguro de cancelar este evento? Esto reembolsará todos los tickets pagados y el evento no será visible como activo.")) return;
    setLoading(true);
    try {
      await cancelarEvento(id);
      await loadEventos(); // Recargar todos para asegurar que el estado se actualiza en la tabla
    } catch (error) {
      console.error("Error cancelando evento:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["ORGANIZACION"]}>
      <div className="p-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <CalendarDays className="h-6 w-6" /> Gestión de Eventos
        </h1>

        {successEvent && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm animate-in fade-in duration-500">
            <h3 className="text-green-800 font-bold flex items-center gap-2 mb-2">
              ✓ ¡Evento creado con éxito!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <p><strong>Nombre:</strong> {successEvent.nombre}</p>
                <p><strong>Fecha:</strong> {new Date(successEvent.fechaHoraEvento).toLocaleString()}</p>
                <p><strong>Categoría ID:</strong> {successEvent.idCategoria}</p>
              </div>
              <div className="flex justify-center md:justify-end">
                {successEvent.foto ? (
                  <img src={successEvent.foto} alt="Evento" className="h-20 w-32 object-cover rounded shadow" />
                ) : (
                  <div className="h-20 w-32 bg-gray-200 flex items-center justify-center rounded text-gray-400">Sin foto</div>
                )}
              </div>
            </div>
            <button
              onClick={() => setSuccessEvent(null)}
              className="mt-3 text-xs text-green-600 hover:text-green-800 font-medium"
            >
              Cerrar aviso
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <EventoForm
              initialData={editingEvento || undefined}
              isEditing={!!editingEvento}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
              loading={loading}
              tipoTickets={editingEvento ? editingEvento.tipoTickets : tipoTickets}
            />

            <button
              onClick={() => setShowTicketModal(true)}
              className="mt-4 w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors font-medium flex items-center justify-center gap-2"
            >
              + Agregar Tipo de Ticket
            </button>

            {showTicketModal && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-800">Cargar Nuevo Ticket</h3>
                    <button
                      onClick={() => setShowTicketModal(false)}
                      className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="p-4">
                    <TipoTicketForm
                      isEditing={false}
                      onSubmit={handleTipoTicketSubmit}
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-8">
            <EventoTable
              eventos={eventos}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCancel={handleCancelEvento}
            />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
