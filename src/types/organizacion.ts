export interface Organizacion {
  idOrganizacion: number;
  nombre: string;
  ubicacion: string;
  cuit: string;
  usuario: Usuario;
}

export interface OrganizacionFormData {
  idOrganizacion?: number;
  nombre: string;
  ubicacion: string;
  mail: string;
  cuit: string;
  contraseña: string;
  repetirContraseña?: string;
}

export interface Usuario {
  mail: string;
  rol: Rol;
  contraseña: string;
}

export enum Rol {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
  ORGANIZACION = "ORGANIZACION",
}
