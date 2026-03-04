import { Cliente, ClienteFormData } from "@/types/cliente";

export interface ApiResponse<T> {
  data: T;
  error: boolean;
  message: string;
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/['"]/g, "");

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(`${baseUrl}/api/clientes`);
  if (!res.ok) throw new Error("Error al obtener clientes");
  const json = (await res.json()) as ApiResponse<Cliente[]>;
  return json.data;
}

export async function createCliente(data: ClienteFormData): Promise<Cliente> {
  const res = await fetch(`${baseUrl}/api/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    if (error.details && Array.isArray(error.details)) {
      throw { isValidationError: true, details: error.details };
    }
    throw new Error(error.message || "Error al crear cliente");
  }
  const json = (await res.json()) as ApiResponse<Cliente>;
  return json.data;
}

export async function updateCliente(
  id: number,
  data: ClienteFormData
): Promise<Cliente> {
  const res = await fetch(`${baseUrl}/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      fechaNacimiento: new Date(data.fechaNacimiento).toISOString(),
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    if (error.details && Array.isArray(error.details)) {
      throw { isValidationError: true, details: error.details };
    }
    throw new Error(error.message || "Error al actualizar cliente");
  }
  const json = (await res.json()) as ApiResponse<Cliente>;
  return json.data;
}

export async function deleteCliente(id: number): Promise<null> {
  const res = await fetch(`${baseUrl}/api/clientes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar cliente");
  // Si la respuesta tiene formato { data, error, message } la puedes usar o simplemente ignorarla.
  const json = (await res.json()) as ApiResponse<null>;
  return json.data;
}

export async function getClienteByUsuarioId(idUsuario: number): Promise<Cliente> {
  const res = await fetch(`${baseUrl}/api/clientes/usuario/${idUsuario}`);
  if (!res.ok) throw new Error("Error al obtener cliente por ID de usuario");
  const json = (await res.json()) as ApiResponse<Cliente>;
  return json.data;
}
