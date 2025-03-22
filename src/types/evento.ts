export interface EventoFormData {
  nombre: string;
  fechaCreacion: string;
  fechaHoraEvento: string;
  capacidadMax: number;
  descripcion?: string;
  foto: string;
  idCategoria: number;
  idOrganizacion: number;
  tipoTickets: TipoTicketFormData[];
  idEvento?: number;
}

export interface TipoTicketFormData {
  tipo: string;
  precio: number;
  acceso: string;
  cantMaxPorTipo: number;
}

export interface Evento {
  idEvento: number;
  nombre: string;
  fechaCreacion: Date;
  fechaHoraEvento: Date;
  capacidadMax: number;
  descripcion?: string;
  foto: string;
  idCategoria: number;
  idOrganizacion: number;
  tipoTickets: TipoTicket[];
}

export interface TipoTicket {
  idTipoTicket: number;
  tipo: string;
  precio: number;
  acceso: string;
  cantMaxPorTipo: number;
}
