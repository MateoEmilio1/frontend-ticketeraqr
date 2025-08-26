"use client";

import { useState, useEffect } from "react";
import { getEstadisticasEventos } from "@/app/services/eventoService";
import { EstadisticasResponse, EstadisticaEvento } from "@/types/evento";
import EventoEstadisticasTable from "@/app/components/eventoEstadisticasTable";

export default function EstadisticasPage() {
  const [allData, setAllData] = useState<EstadisticasResponse | null>(null);
  const [filteredEventos, setFilteredEventos] = useState<EstadisticaEvento[]>([]);
  
  const [search, setSearch] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [categoria, setCategoria] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await getEstadisticasEventos(); // ahora sin filtros
      setAllData(res);
      setFilteredEventos(res.eventos); // arranca mostrando todos
    } catch (err) {
      console.error(err);
    }
  };

  // Llamada inicial
  useEffect(() => {
    fetchData();
  }, []);

  // Aplicar filtros en el front
  useEffect(() => {
    if (!allData) return;

    let eventosFiltrados = allData.eventos;

    if (search) {
      eventosFiltrados = eventosFiltrados.filter((e) =>
        e.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      eventosFiltrados = eventosFiltrados.filter(
        (e) => new Date(e.fecha) >= inicio && new Date(e.fecha) <= fin
      );
    }

    if (categoria) {
      eventosFiltrados = eventosFiltrados.filter(
        (e) => e.idCategoria === categoria
      );
    }

    setFilteredEventos(eventosFiltrados);
  }, [search, fechaInicio, fechaFin, categoria, allData]);

  if (!allData) return <p>Cargando estadísticas...</p>;

  // Calcular resumen de los eventos filtrados
  const totalVendidos = filteredEventos.reduce((a, e) => a + e.vendidos, 0);
  const totalReembolsados = filteredEventos.reduce((a, e) => a + e.reembolsados, 0);
  const totalRecaudacion = filteredEventos.reduce((a, e) => a + e.recaudacion, 0);

  const resumen = {
    totalVendidos,
    promedioVendidos: filteredEventos.length ? totalVendidos / filteredEventos.length : 0,
    totalReembolsados,
    porcReembolsados: totalVendidos ? (totalReembolsados / totalVendidos) * 100 : 0,
    recaudacionTotal: totalRecaudacion,
    recaudacionPromedio: filteredEventos.length ? totalRecaudacion / filteredEventos.length : 0,
  };

  return (
    <div>
      <h1>Estadísticas de Eventos</h1>

      {/* Filtros */}
      <div>
        <input
          type="text"
          placeholder="Buscar evento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <select
          value={categoria ?? ""}
          onChange={(e) =>
            setCategoria(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Todas las categorías</option>
          <option value="1">Conciertos</option>
          <option value="2">Deportes</option>
          <option value="3">Teatro</option>
          {/* lo ideal: traer dinámicamente las categorías */}
        </select>
      </div>

      {/* Resumen general */}
      <h2>Resumen General</h2>
      <ul>
        <li>Total vendidos: {resumen.totalVendidos}</li>
        <li>Promedio vendidos: {resumen.promedioVendidos}</li>
        <li>Total reembolsados: {resumen.totalReembolsados}</li>
        <li>% reembolsados: {resumen.porcReembolsados.toFixed(2)}%</li>
        <li>Recaudación total: ${resumen.recaudacionTotal}</li>
        <li>Recaudación promedio: ${resumen.recaudacionPromedio}</li>
      </ul>

      {/* Tabla de eventos */}
      <h2>Eventos</h2>
      <EventoEstadisticasTable eventos={filteredEventos} />
    </div>
  );
}
