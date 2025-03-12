import type { Politica, PoliticaFormData } from "@/types/politica"

const API_URL = "/api/politicas"

// Obtener todas las políticas
export async function getPoliticas(): Promise<Politica[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Error al obtener las políticas")
  }

  return response.json()
}

// Crear una nueva política
export async function createPolitica(data: PoliticaFormData): Promise<Politica> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Error al crear la política")
  }

  return response.json()
}

// Actualizar una política existente
export async function updatePolitica(data: PoliticaFormData): Promise<Politica> {
  const response = await fetch(`${API_URL}/${encodeURIComponent(data.fechaVigencia)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Error al actualizar la política")
  }

  return response.json()
}

// Eliminar una política
export async function deletePolitica(fechaVigencia: string): Promise<void> {
  const response = await fetch(`${API_URL}/${encodeURIComponent(fechaVigencia)}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Error al eliminar la política")
  }
}

