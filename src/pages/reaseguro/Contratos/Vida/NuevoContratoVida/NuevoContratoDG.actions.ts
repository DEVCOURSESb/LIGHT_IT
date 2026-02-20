import { ref } from "vue"
import { BaseAPI } from "@/API/BaseAPI"

export interface SelectOption<T = string | number> {
  title: string
  value: T
}

export interface Subramo {
  ramo: string
  subramo: string
  descOperacionRamos: string
}

interface Moneda {
  cveMoneda: number
  descMoneda: string
}

interface FormaContractual {
  cveFcontrac: number
  descFcontrac: string
}

interface TipoReaseguro {
  cveTreaseg: number
  descTreaseg: string
}

export interface TipoContrato {
  idTcontrato: number
  descTcontrato: string
  cveTreaseg : number
  esActivo: number
}

interface CriterioCobertura {
  cveCriterioCob: number
  descCriterioCob: string
}

export interface EmisionContable {
  id: number
  numPoliza: string
  numRenovPol: number
  fintVigPol: string
  ffinVigPol: string
}


export const NuevoContratoVida = () => {

  const subramoOptions = ref<SelectOption<string>[]>([])
  const monedaOptions = ref<SelectOption<number>[]>([])
  const formaContractualOptions = ref<SelectOption<number>[]>([])
  const tipoReaseguroOptions = ref<SelectOption<number>[]>([])
  const tipoContratoOptions = ref<SelectOption<number>[]>([])
  const criterioCoberturaOptions = ref<SelectOption<number>[]>([])

  const baseAPIOperacion = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintOperYRamosAnx3817Rest/"
  })

  const baseAPIMoneda = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfRr6MonedaRest/"
  })

  const baseAPIFormaContractual = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntFormaContractualRest/"
  })

  const baseAPITipoReaseguro = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoReaseguroRest/"
  })

  const baseAPITipoContrato = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintTipoContratoRest/"
  })

  const baseAPICriterioCobertura = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntCriterioCoberturaRest/"
  })

  const baseAPIPolizas = BaseAPI({
    prefix: "ws_reaseguro_contratos_vida/api/v1/EmisionContableRest/"
  })

  const apiDatosContrato = BaseAPI({
    prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest',
    isBase: true,
    isPrivate: true
  });

  const apiPolizasFacul = BaseAPI({
    prefix: 'ws_reaseguro_contratos_vida/api/v1/PolizasFacuRest',
    isBase: true,
    isPrivate: true
  });

  const fetchAllRecords = async () => {
    try {
      const response = await apiDatosContrato.post('getAllRecords');
      return response.data;
    } catch (error) {
      console.error("Error al obtener contratos:", error);
      throw error;
    }
  };

  const fetchSubramos = async () => {
    const { data } = await baseAPIOperacion.post<Subramo[]>("getAllRecords")

    subramoOptions.value = data
      .filter(i => i.subramo === "011" || i.subramo === "012" || i.subramo === "013")
      .map(i => ({
        title: i.descOperacionRamos,
        value: i.subramo
      }))
  }

  const fetchMoneda = async () => {
    const { data } = await baseAPIMoneda.post<Moneda[]>("getAllRecords")

    monedaOptions.value = data.map(i => ({
      title: i.descMoneda,
      value: Number(i.cveMoneda)
    }))
  }

  const fetchFormaContractual = async () => {
    const { data } = await baseAPIFormaContractual.post<FormaContractual[]>("getAllRecords")

    formaContractualOptions.value = data.map(i => ({
      title: i.descFcontrac,
      value: Number(i.cveFcontrac)
    }))
  }

  const fetchTipoReaseguro = async () => {
    const { data } = await baseAPITipoReaseguro.post<TipoReaseguro[]>("getAllRecords")

    tipoReaseguroOptions.value = data.map(i => ({
      title: i.descTreaseg,
      value: Number(i.cveTreaseg)
    }))
  }

  const fetchTipoContrato = async () => {
    const { data } = await baseAPITipoContrato.post<TipoContrato[]>("getAllRecords")

    tipoContratoOptions.value = data
    .filter(i => i.esActivo === 1)
    .map(i => ({
      title: i.descTcontrato,
      value: Number(i.idTcontrato),
      cveTreaseg: Number(i.cveTreaseg)
    }))
  }

  const fetchCriterioCobertura = async () => {
    const { data } = await baseAPICriterioCobertura.post<CriterioCobertura[]>("getAllRecords")

    criterioCoberturaOptions.value = data.map(i => ({
      title: i.descCriterioCob,
      value: Number(i.cveCriterioCob)
    }))
  }

  const fetchEmisionContable = async (
    fechaInicio: string,
    fechaFin: string
  ): Promise<EmisionContable[]> => {
    const { data } = await baseAPIPolizas.post<EmisionContable[]>(
      `getRecordsBetween/${fechaInicio}/${fechaFin}`
    )
    return data
  }

  const fetchPolizasFacultativas = async () => {
    try {
      const response = await apiPolizasFacul.post('getAllRecords');
      return response.data;
    } catch (error) {
      console.error("Error al obtener polizas:", error);
      throw error;
    }
  };

  const verificarPolizas = async (poliza: string, renovacion: number, idContratoActual?: number): Promise<boolean> => {
    try {
      const todosLosRegistros = await fetchPolizasFacultativas();

      const existe = todosLosRegistros.some((reg: any) =>
        reg.numPoliza === poliza &&
        Number(reg.numRenovPol) === renovacion &&
        reg.idContrato !== idContratoActual
      );

      return existe;
    } catch (error) {
      return false;
    }
  };


  return {
    subramoOptions,
    fetchSubramos,
    monedaOptions,
    fetchMoneda,
    formaContractualOptions,
    fetchFormaContractual,
    tipoReaseguroOptions,
    fetchTipoReaseguro,
    tipoContratoOptions,
    fetchTipoContrato,
    criterioCoberturaOptions,
    fetchCriterioCobertura,
    fetchEmisionContable,
    apiDatosContrato,
    fetchAllRecords,
    apiPolizasFacul,
    fetchPolizasFacultativas,
    verificarPolizas,
  }

}
