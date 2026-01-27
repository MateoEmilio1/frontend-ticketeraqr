// src/types/ticket.ts

export interface Ticket {
  nroTicket: number;
  fechaCreacion: string;
  fechaConsumo?: string | Date;
  tokenQr: string;
  idTipoTicket: number;
  idCliente: number;
  estado: "pagado" | "consumido" | "expirado" | "reembolsado";
  cliente?: {
    nombre: string;
    apellido: string;
    tipoDoc: string;
    nroDoc: string;
  };
  tipoTicket?: {
    precio: number;
    acceso: string;
    evento?: {
      idEvento: number;
      nombre: string;
      fechaHoraEvento: string;
      idOrganizacion: number;
    };
  };
}
