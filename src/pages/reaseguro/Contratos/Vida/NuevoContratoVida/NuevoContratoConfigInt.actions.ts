import { ref } from "vue"
import { BaseAPI } from "@/API/BaseAPI"

export interface SelectOption<T = string | number> {
  title: string
  value: T
}

interface AsignacionInt {
  cveCriterioAsig:  number
  descCriterioAsig: string
}

interface Reasegurador {
  cveReasegurador: number
  nombreReasegurador: string
}

interface Intermediario {
  cveIntermediario: number
  nombreIntermediario: string
}

interface TipoCorretaje {
  cveAsignacion: number
  descAsignacion: string
}

export const NuevoContratoVidaConInt = () => {

  const asignacionIntermediarioOptions = ref<SelectOption<number>[]>([])
  const reaseguradoraOptions = ref<SelectOption<number>[]>([])
  const intermeOptions = ref<SelectOption<number>[]>([])
  const tipoCorretajeOptions = ref<SelectOption<number>[]>([])

  const baseAPIAsigInt = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntCriterioAsignacionRest/"
  })
  const baseAPIReaseg = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintReaseguradoraRest/"
  })
  const baseAPIInter = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfIntermediarioRest/"
  })
  const baseAPITipoCorr = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatIntTipoAsignacionRest/"
  })

  //General
  const fetchAsignacionInt = async () => {
    const { data } = await baseAPIAsigInt.post<AsignacionInt[]>("getAllRecords")

    asignacionIntermediarioOptions.value = data
      .map(i => ({
        title: i.descCriterioAsig,
        value: Number(i.cveCriterioAsig)
  }));
  }

  const fetchReasegurador = async () => {
    const { data } = await baseAPIReaseg.post<Reasegurador[]>("getAllRecords")

    reaseguradoraOptions.value = data.map(i => ({
      title: i.nombreReasegurador,
      value: Number(i.cveReasegurador)
    }))
  }

  const fetchIntermediario = async () => {
    const { data } = await baseAPIInter.post<Intermediario[]>("getAllRecords")

    intermeOptions.value = data.map(i => ({
      title: i.nombreIntermediario,
      value: Number(i.cveIntermediario)
    }))
  }

  const fetchTipoCorretaje = async () => {
    const { data } = await baseAPITipoCorr.post<TipoCorretaje[]>("getAllRecords")

    tipoCorretajeOptions.value = data.map(i => ({
      title: i.descAsignacion,
      value: Number(i.cveAsignacion)
    }))
  }

  return {
    asignacionIntermediarioOptions,
    fetchAsignacionInt,
    reaseguradoraOptions,
    fetchReasegurador,
    intermeOptions,
    fetchIntermediario,
    tipoCorretajeOptions,
    fetchTipoCorretaje
  }
}
