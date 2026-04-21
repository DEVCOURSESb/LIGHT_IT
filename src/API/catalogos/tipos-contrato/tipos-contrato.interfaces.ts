export interface TipoContrato {
  id: number;
  cveTcontrato: string;
  cveTreaseg: number;
  descTcontrato: string;
  esActivo: number;
  fechaRegistro: string;
  idTcontrato: number;
}

export interface TipoContratoTrasnformado extends TipoContrato{
  cveTreasegRaw: number;
}