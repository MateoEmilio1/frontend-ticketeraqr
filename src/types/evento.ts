export interface EstadisticaEvento {
  idCategoria: number;
  idEvento: number;
  nombre: string;
  foto: string;
  fecha: string;
  vendidos: number;
  reembolsados: number;
  porcReembolsados: number;
  recaudacion: number;
  edadPromedio: number;
}

export interface ResumenEstadisticas {
  totalVendidos: number;
  promedioVendidos: number;
  totalReembolsados: number;
  porcReembolsados: number;
  recaudacionTotal: number;
  recaudacionPromedio: number;
}

export interface EstadisticasResponse {
  resumen: ResumenEstadisticas;
  eventos: EstadisticaEvento[];
}


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
  ubicacion: string;
}

export interface TipoTicketFormData {
  tipo: string;
  precio: number;
  acceso: string;
  sector?: string;
  cantMaxPorTipo: number;
}

export interface Evento {
  idEvento: number;
  nombre: string;
  fechaCreacion: Date;
  fechaHoraEvento: Date;
  capacidadMax: number;
  descripcion?: string;
  idOrganizacion: number;
  foto: string;
  idCategoria: number;
  estado?: 'ACTIVO' | 'CANCELADO' | 'FINALIZADO';
  tipoTickets: TipoTicket[];
  ubicacion: string;
}

export interface TipoTicket {
  idTipoTicket: number;
  tipo: string;
  precio: number;
  acceso: string;
  sector?: string;
  cantMaxPorTipo: number;
}