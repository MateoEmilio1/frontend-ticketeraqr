export interface ClienteFormData {
  mail: string;
  contraseña?: string;
  nombre: string;
  apellido: string;
  tipoDoc: string;
  nroDoc: string;
  fechaNacimiento: string;
  telefono?: string;
  prefijo?: string;
  idCliente?: number;
  repetirContraseña?: string;
}

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  tipoDoc: string;
  nroDoc: string;
  fechaNacimiento: Date;
  telefono?: string;
  usuario: {
    mail: string;
    rol: Rol;
    password: string;
  };
}

export enum Rol {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
}
