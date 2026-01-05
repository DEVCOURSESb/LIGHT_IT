// API/generic/cifras-control.ts

export interface CifrasControlSiniestroDTO {
  aniomesCarga: string;
  rows: number;
  indemnizacionPagada: number;
  montoSiniestro: number;
}

export interface CifrasControlEmisionDTO {
  aniomesCarga: string;
  rows: number;
  primaEmitida: number;
  sumaAsegurada: number;
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