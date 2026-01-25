"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { Evento, EventoFormData, TipoTicketFormData } from "@/types/evento";
import {
  getEventos,
  createEvento,
  updateEvento,
  deleteEvento,
} from "@/app/services/eventosService";
import { EventoForm } from "@/app/components/eventoForm";
import { EventoTable } from "@/app/components/eventoTable";
import { TipoTicketForm } from "../components/tipoTicketForm";

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvento, setEditingEvento] = useState<EventoFormData | null>(null);
  const [tipoTickets, setTipoTickets] = useState<TipoTicketFormData[]>([]);

  useEffect(() => {
    loadEventos();
  }, []);

  const loadEventos = async () => {
    try {
      const data = await getEventos();
      setEventos(data);
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
      idOrganizacion: typeof data.idOrganizacion === 'number' ? data.idOrganizacion : parseInt(String(data.idOrganizacion), 10) || 1,
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <CalendarDays className="h-6 w-6" /> Gestión de Eventos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-4">
          <EventoForm
            initialData={editingEvento || undefined}
            isEditing={!!editingEvento}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            loading={loading}
          />
          <TipoTicketForm
            isEditing={false}
            onSubmit={handleTipoTicketSubmit}
            loading={loading}
          />
        </div>
        <div className="col-span-12 md:col-span-8">
          <EventoTable
            eventos={eventos}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
