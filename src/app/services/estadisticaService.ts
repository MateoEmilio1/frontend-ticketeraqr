// src/services/eventoService.ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
export async function getEstadisticasEventos() {
  const res = await fetch(`${baseUrl}/api/eventos/estadisticas`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error al obtener estadísticas");
  }

  return res.json();
}

