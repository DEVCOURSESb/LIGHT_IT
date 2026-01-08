// API/generic/cifras-control.ts

export interface CifrasControlSiniestroDTO {
  aniomesCarga: string;
  rows: number;
  indemnizacionPagada: number;
  montoSiniestro: number;
}

export interface CifrasControlEmisionDTO {
  primaNetaEmitida: number;
  ramo: string;
  registros: number;
  anio: number;
  mes: number;
}

export interface CifrasControlSiniestroResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra: CifrasControlSiniestroDTO[];
}

export interface CifrasControlEmisionResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra: CifrasControlEmisionDTO[];
}