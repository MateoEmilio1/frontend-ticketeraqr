export interface loginForm {
  mail: string;
  contraseña: string;
  idUsuario?: number;
  rol?: Rol;
}

export interface Usuario {
  mail: string;
  contraseña: string;
  idUsuario?: number;
  rol?: Rol;
}

export enum Rol {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
}
