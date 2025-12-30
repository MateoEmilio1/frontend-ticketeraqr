export interface ClienteFormData {
  mail: string;
  contraseña?: string;
  nombre: string;
  apellido: string;
  tipoDoc: string;
  nroDoc: string;
  fechaNacimiento: string;
  idCliente?: number;
}

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  tipoDoc: string;
  nroDoc: string;
  fechaNacimiento: Date;
  usuario: {
    mail: string;
    rol: Rol;
    pasword: string;
  };
}

export enum Rol {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
}
