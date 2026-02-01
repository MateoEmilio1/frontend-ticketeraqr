"use server";

import { Politica, PoliticaFormData } from "@/types/politica";

export interface ApiResponse<T> {
    data: T;
    error: boolean;
    message: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPoliticaActual(): Promise<Politica | null> {
    const res = await fetch(`${baseUrl}/api/politicas/actual`, {
        cache: "no-store",
    });
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Error al obtener política actual");
    }
    const json = (await res.json()) as ApiResponse<Politica>;
    return json.data;
}

export async function getPoliticas(): Promise<Politica[]> {
    const res = await fetch(`${baseUrl}/api/politicas`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Error al obtener políticas");
    const json = (await res.json()) as ApiResponse<Politica[]>;
    return json.data;
}

export async function createPolitica(
    data: PoliticaFormData
): Promise<Politica> {
    const res = await fetch(`${baseUrl}/api/politicas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear política");
    const json = (await res.json()) as ApiResponse<Politica>;
    return json.data;
}

export async function updatePolitica(
    id: string,
    data: PoliticaFormData
): Promise<Politica> {
    const res = await fetch(`${baseUrl}/api/politicas/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al actualizar política");
    }
    const json = (await res.json()) as ApiResponse<Politica>;
    return json.data;
}

export async function deletePolitica(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/api/politicas/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Error al eliminar política");
    }
}
