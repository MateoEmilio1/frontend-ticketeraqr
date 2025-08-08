type EstadoTicket = 'PAGADO' | 'CONSUMIDO' | 'EXPIRADO' | 'REEMBOLSADO';

export interface Ticket {
    nroTicket: number;
    fechaCreacion: Date;
    tokenQr: string;
    idTipoTicket: number;
    estado: EstadoTicket;
}

export interface TipoTicket {
    idTipoTicket: number;
    tipo: string;
    precio: number;
    acceso: string;
    idEvento: number;
    tickets: Ticket[]
}

export interface Evento {
    idEvento: number;
    nombre: string;
    fechaCreacion: Date;
    fechaHoraEvento: Date;
    capacidadMax: number;
    descripcion?: string;
    idCategoria: number;
    idOrganizacion: number;
    foto: string;
    tipoTicket: TipoTicket[]
}