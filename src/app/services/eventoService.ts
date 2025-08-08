import { Evento } from "@/types/evento";

export interface ApiResponse<T> {
  data: T;
  error: boolean;
  message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export async function getEventos(): Promise<Evento[]> {
  const res = await fetch(`${baseUrl}/api/eventos`);
  if (!res.ok) throw new Error("Error al obtener eventos");
  const json = (await res.json()) as ApiResponse<Evento[]>;
  return json.data;
}