// Remote "use server" to avoid server action issues

import { ApiResponse } from "./clientService";
import { Usuario } from "@/types/usuario";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

export async function getMe(token: string): Promise<Usuario> {
    const res = await fetch(`${baseUrl}/api/usuario/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Error al obtener perfil");
    const json = await res.json();
    return json;
}

export async function forgotPassword(mail: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${baseUrl}/api/usuario/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al solicitar recuperación");
    }
    return await res.json();
}

export async function resetPassword(token: string, nuevaContraseña: string): Promise<ApiResponse<null>> {
    const res = await fetch(`${baseUrl}/api/usuario/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContraseña }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al restablecer contraseña");
    }
    return await res.json();
}
