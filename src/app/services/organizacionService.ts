"use server"

import { Organizacion, OrganizacionFormData } from "@/types/organizacion";

export interface ApiResponse<T> {
    data: T,
    message: boolean,
    error: string
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/['"]/g, "");

export async function getOrganizaciones(): Promise<Organizacion[]> {
    const res = await fetch(`${baseUrl}/api/organizaciones`);
    if (!res.ok) throw new Error("Error al obtener organizaciones");
    const json = (await res.json()) as ApiResponse<Organizacion[]>;
    return json.data;
}

export async function createOrganizacion(data: OrganizacionFormData): Promise<Organizacion> {
    const res = await fetch(`${baseUrl}/api/organizaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        if (error.details && Array.isArray(error.details)) {
            throw { isValidationError: true, details: error.details };
        }
        throw new Error(error.message || "Error al crear organizacion");
    }
    const json = (await res.json()) as ApiResponse<Organizacion>;
    return json.data;
}

export async function updateOrganizacion(id: number, data: OrganizacionFormData): Promise<Organizacion> {
    const res = await fetch(`${baseUrl}/api/organizaciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...data
        }),
    });
    if (!res.ok) {
        const error = await res.json();
        if (error.details && Array.isArray(error.details)) {
            throw { isValidationError: true, details: error.details };
        }
        throw new Error(error.message || "Error al actualizar organizacion");
    }
    const json = (await res.json()) as ApiResponse<Organizacion>;
    return json.data;
}

export async function deleteOrganizacion(id: number): Promise<Organizacion> {
    const res = await fetch(`${baseUrl}/api/organizaciones/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar organizacion");
    // Si la respuesta tiene formato { data, error, message } la puedes usar o simplemente ignorarla.

    // El tipo tendría que ser <null> en lugar de <Organizacion> ??.
    const json = (await res.json()) as ApiResponse<Organizacion>;
    return json.data;
}
export async function getOrganizacionByUsuarioId(idUsuario: number): Promise<Organizacion> {
    const res = await fetch(`${baseUrl}/api/organizaciones/usuario/${idUsuario}`);
    if (!res.ok) throw new Error("Error al obtener organizacion por ID de usuario");
    const json = (await res.json()) as ApiResponse<Organizacion>;
    return json.data;
}
