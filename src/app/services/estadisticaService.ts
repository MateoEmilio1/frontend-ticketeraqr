// src/services/eventoService.ts
const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/['"]/g, "");
export async function getEstadisticasEventos(idOrganizacion?: number) {
  const url = idOrganizacion
    ? `${baseUrl}/api/eventos/estadisticas?idOrganizacion=${idOrganizacion}`
    : `${baseUrl}/api/eventos/estadisticas`;
  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error al obtener estadísticas");
  }

  return res.json();
}

