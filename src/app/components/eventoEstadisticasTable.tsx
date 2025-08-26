import React from "react";
import { EstadisticaEvento as EventoEstadistica } from "@/types/evento";

interface Props {
  eventos: EventoEstadistica[];
}

export default function EventoEstadisticasTable({ eventos }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Vendidos</th>
          <th>Reembolsados</th>
          <th>% Reemb.</th>
          <th>Recaudación</th>
          <th>Edad Prom.</th>
        </tr>
      </thead>
      <tbody>
        {eventos.map((ev) => (
          <tr key={ev.idEvento}>
            <td><img src={ev.foto} alt={ev.nombre} width={80} /></td>
            <td>{ev.nombre}</td>
            <td>{new Date(ev.fecha).toLocaleDateString()}</td>
            <td>{ev.vendidos}</td>
            <td>{ev.reembolsados}</td>
            <td>{ev.porcReembolsados.toFixed(2)}%</td>
            <td>${ev.recaudacion}</td>
            <td>{ev.edadPromedio.toFixed(1)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
