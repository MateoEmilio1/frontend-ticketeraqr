// src/types/ticket.ts

export interface Ticket {
  nroTicket: number;
  fechaCreacion: string;
  fechaConsumo?: string | Date;
  tokenQr: string;
  idTipoTicket: number;
  idCliente: number;
  estado: "pagado" | "consumido" | "expirado" | "reembolsado" | "pendiente" | "pendiente_transferencia";
  ofertaTransferenciaIdCliente?: number;
  metodoPago?: string;
  cliente?: {
    nombre: string;
    apellido: string;
    tipoDoc: string;
    nroDoc: string;
  };
  tipoTicket?: {
    precio: number;
    acceso: string;
    sector?: string;
    evento?: {
      idEvento: number;
      nombre: string;
      fechaHoraEvento: string;
      idOrganizacion: number;
    };
  };
}
