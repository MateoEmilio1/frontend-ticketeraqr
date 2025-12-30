export interface EstadisticaEvento {
  idCategoria: number;
  idEvento: number;
  nombre: string;
  foto: string;
  fecha: string;
  vendidos: number;
  reembolsados: number;
  porcReembolsados: number;
  recaudacion: number;
  edadPromedio: number;
}

export interface ResumenEstadisticas {
  totalVendidos: number;
  promedioVendidos: number;
  totalReembolsados: number;
  porcReembolsados: number;
  recaudacionTotal: number;
  recaudacionPromedio: number;
}

export interface EstadisticasResponse {
  resumen: ResumenEstadisticas;
  eventos: EstadisticaEvento[];
}
