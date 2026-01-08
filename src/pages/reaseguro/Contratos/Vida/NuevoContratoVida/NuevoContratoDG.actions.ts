import { ref } from "vue"
import { BaseAPI } from "@/API/BaseAPI"

export interface SelectOption<T = string | number> {
  title: string
  value: T
}

interface Subramo {
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
}

interface CriterioCobertura {
  cveCriterioCob: number
  descCriterioCob: string
}

interface EmisionContable {
  id: number;
  NUM_POLIZA: string;
  NUM_RENOV_POL: number;
}

export const NuevoContratoVida = () => {

  const subramoOptions = ref<SelectOption<string>[]>([])
  const monedaOptions = ref<SelectOption<number>[]>([])
  const formaContractualOptions = ref<SelectOption<number>[]>([])
  const tipoReaseguroOptions = ref<SelectOption<number>[]>([])
  const tipoContratoOptions = ref<SelectOption<number>[]>([])
  const criterioCoberturaOptions = ref<SelectOption<number>[]>([])
  const polizaOptions = ref<SelectOption<string>[]>([])
  const renovacionOptions = ref<SelectOption<number>[]>([])

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
    prefix: "ws_catalogos_reaseguro/api/v1/EmisionContableRest/"
  })


  const fetchSubramos = async () => {
    const { data } = await baseAPIOperacion.post<Subramo[]>("getAllRecords")

    subramoOptions.value = data
      .filter(i => i.ramo === "010")
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

    tipoContratoOptions.value = data.map(i => ({
      title: i.descTcontrato,
      value: Number(i.idTcontrato)
    }))
  }

  const fetchCriterioCobertura = async () => {
    const { data } = await baseAPICriterioCobertura.post<CriterioCobertura[]>("getAllRecords")

    criterioCoberturaOptions.value = data.map(i => ({
      title: i.descCriterioCob,
      value: Number(i.cveCriterioCob)
    }))
  }

  const fetchEmisionContable = async () => {
    const { data } = await baseAPIPolizas.post<EmisionContable[]>(
      "getRecordsBetween/2025-01-01/2025-12-31"
    )
    console.log("Datos API:", data)
    polizaOptions.value = data.map(i => ({
      title: i.NUM_POLIZA,
      value: i.NUM_POLIZA
    }))

    renovacionOptions.value = data.map(i => ({
      title: i.NUM_RENOV_POL.toString(),
      value: i.NUM_RENOV_POL
    }))
  }

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
    polizaOptions,
    fetchEmisionContable,
    renovacionOptions,
  }
}
