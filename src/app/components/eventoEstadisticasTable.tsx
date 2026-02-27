"use client";

import React, { useState } from "react";
import { EstadisticaEvento } from "@/types/evento";

interface Props {
  eventos: EstadisticaEvento[];
  totalEventos: number;
}

export default function EventoEstadisticasTable({ eventos, totalEventos }: Props) {
  const [paginaActual, setPaginaActual] = useState(1);
  const eventosPorPagina = 5;

  const totalPaginas = eventos.length
    ? Math.ceil(eventos.length / eventosPorPagina)
    : 1;

  const indexInicio = (paginaActual - 1) * eventosPorPagina;
  const indexFin = indexInicio + eventosPorPagina;
  const eventosPagina = eventos.slice(indexInicio, indexFin);

  return (
    <div className="overflow-x-auto">
      {totalEventos === 0 ? (
        <p className="text-center text-red-500 flex items-center justify-center gap-2 py-6">
          🚫 No hay eventos cargados en el sistema.
        </p>
      ) : (
        <>
          <table className="min-w-full border-collapse rounded-2xl overflow-hidden shadow-md">
            <thead className="sticky top-0 z-10">
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-center">Fecha</th>
                <th className="px-4 py-3 text-center">Vendidos</th>
                <th className="px-4 py-3 text-center">Reembolsados</th>
                <th className="px-4 py-3 text-center">Recaudación</th>
                <th className="px-4 py-3 text-center">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {eventosPagina.length > 0 ? (
                eventosPagina.map((e, i) => (
                  <tr
                    key={`evento-${i}`}
                    className="odd:bg-white even:bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-800">{e.nombre}</td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {new Date(e.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-blue-700">
                      {e.vendidos}
                    </td>
                    <td className="px-4 py-3 text-center text-red-600">
                      {e.reembolsados}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-green-700">
                      ${e.recaudacion}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      ID: {e.idCategoria}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    🚫 No se encontraron eventos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {eventos.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual((p) => p - 1)}
              >
                ◀ Anterior
              </button>
              <span className="text-gray-700">
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual((p) => p + 1)}
              >
                Siguiente ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
