export interface BackendStats {
  media: number;
  varianza: number;
  desviacion_estandar: number;
  datos?: number[];
  x_vals?: number[];
  y_vals?: number[];
}

export interface BackendSimulationResponse {
  simulado: BackendStats;
  teorico: BackendStats;
}
