export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  tipoDoc: string;
  nroDoc: string;
  fechaNacimiento: string;
  mail: string;
  contraseña: string;
}

export type ClienteFormData = Omit<Cliente, "idCliente">;

export const DEFAULT_FORM_DATA: ClienteFormData = {
  nombre: "",
  apellido: "",
  tipoDoc: "DNI",
  nroDoc: "",
  fechaNacimiento: "",
  mail: "",
  contraseña: "",
};
