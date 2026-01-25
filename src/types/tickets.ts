// src/types/ticket.ts

export interface Ticket {
  nroTicket: number;
  fechaCreacion: string;
  tokenQr: string;
  idTipoTicket: number;
  idCliente: number;
  estado: "pagado" | "consumido" | "expirado" | "reembolsado";
  cliente?: {
    nombre: string;
    apellido: string;
  };
  tipoTicket?: {
    precio: number;
    acceso: string;
    evento?: {
      nombre: string;
      fechaHoraEvento: string;
    };
  };
}
