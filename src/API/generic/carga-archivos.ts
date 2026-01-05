export interface CargaArchivoResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra: any[];
}

export interface EmisionResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra: Emision[];
}

export interface Emision {
  rows: number;
  aniomesCarga: string;
  origen: string | null;
}

export interface SiniestroResponse {
  mensaje: string;
  detalleMensaje: string;
  dataExtra: Siniestro[];
}

export interface Siniestro {
  rows: number;
  aniomesCarga: string;
  origen: string | null;
}

export interface RegistroTabla {
  anio: number;
  mes: string;
  nombreArchivo: string;
  numeroRegistros: number;
  aniomesCarga?: string;
}

export interface ValidacionCSV {
  valido: boolean;
  errores: string[];
}
