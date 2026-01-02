import { ref } from "vue"
import { BaseAPI } from "@/API/BaseAPI"

export interface SelectOption<T = string | number> {
  title: string
  value: T
}

interface CompaniaReaseg {
  esActivo: number
  cveReasegurador: number
  nombreReasegurador: string
}

interface IndicadorDis {
  cveDistrcesion: number
  descDistrcesion: string
}

interface ComisionReaseg {
  cveAsignacion: number
  descAsignacion: string
}

interface TipoCobertura {
  cveClasifcober: number
  descClasifcober: string
}

interface Coberturas {
  cveCob: number;
  descCob: string;
}

interface CoberturasBasicas {
  cveCob: number;
  descCob: string;
}

interface CoberturasAdicionales {
  cveCob: number;
  descCob: string;
}

interface TipoTarifa {
  cveTarifa: number;
  descTarifa: string;
}

interface PTU {
  cvePtu: number;
  formulaPtu: string;
}

export const NuevoContratoVidaConR = () => {

  const compaReasegOptions = ref<SelectOption<number>[]>([])
  const indicadorDistrCOptions = ref<SelectOption<number>[]>([])
  const tipoComisionOptions = ref<SelectOption<number>[]>([])
  const tipoCoberturaOptions = ref<SelectOption<number>[]>([])
  const coberturasOptions = ref<SelectOption<number>[]>([])
  const coberturasBasiOptions = ref<SelectOption<number>[]>([])
  const coberturasAdiciOptions = ref<SelectOption<number>[]>([])
  const metodoCalPTUOptions = ref<SelectOption<number>[]>([])
  const polizasOptions = ref<SelectOption<number>[]>([])
  const tipoTarifaOptions = ref<SelectOption<number>[]>([])

  const baseAPIReaseg = BaseAPI({
    prefix: "ReasegCatCnsfintReaseguradoraRest/"
  })
  const baseAPIIndiDis = BaseAPI({
    prefix: "ReasegCatIntDistribucionCesionRest/"
  })
  const baseAPITipoComision = BaseAPI({
    prefix: "ReasegCatIntTipoAsignacionRest/"
  })
  const baseAPITipoCobertura = BaseAPI({
    prefix: "ReasegCatIntClasificacionCoberturaRest/"
  })
//coberturas
  const baseAPICoberturas = BaseAPI({
    prefix: "ReasegCatIntCoberturaRest/"
  })
  const baseAPICoberturasBas = BaseAPI({
    prefix: "ReasegCatIntCoberturaRest/"
  })
  const baseAPICoberturasAdi = BaseAPI({
    prefix: "ReasegCatIntCoberturaRest/"
  })

  const baseAPITipoTarifa = BaseAPI({
    prefix: "ReasegCatIntTipoTarifaRest/"
  })
  // ptu

  const baseAPIPtu = BaseAPI({
    prefix: "ReasegCatIntPtuRest/"
  })

  //General
  const fetchReaseguradores = async () => {
    const { data } = await baseAPIReaseg.post<CompaniaReaseg[]>("getAllRecords")

    compaReasegOptions.value = data
      .filter(i => i.esActivo === 1)
      .map(i => ({
        title: i.nombreReasegurador,
        value: Number(i.cveReasegurador)
  }));
  }

  const fetchIndicadorDistriC = async () => {
    const { data } = await baseAPIIndiDis.post<IndicadorDis[]>("getAllRecords")

    indicadorDistrCOptions.value = data.map(i => ({
      title: i.descDistrcesion,
      value: Number(i.cveDistrcesion)
    }))
  }

  const fetchTipoComision = async () => {
    const { data } = await baseAPITipoComision.post<ComisionReaseg[]>("getAllRecords")

    tipoComisionOptions.value = data.map(i => ({
      title: i.descAsignacion,
      value: Number(i.cveAsignacion)
    }))
  }

  const fetchTipoCobertura = async () => {
    const { data } = await baseAPITipoCobertura.post<TipoCobertura[]>("getAllRecords")

    tipoCoberturaOptions.value = data.map(i => ({
      title: i.descClasifcober,
      value: Number(i.cveClasifcober)
    }))
  }

  //Coberturas
  const fetchCoberturas = async () => {
    const { data } = await baseAPICoberturas.post<Coberturas[]>("getAllRecords")

    coberturasOptions.value = data.map(i => ({
      title: i.descCob,
      value: Number(i.cveCob)
    }))
  }

  const fetchCoberturasBasicas = async () => {
    const { data } = await baseAPICoberturasBas.post<CoberturasBasicas[]>("getAllRecords")

    coberturasBasiOptions.value = data.map(i => ({
      title: i.descCob,
      value: Number(i.cveCob)
    }))
  }

  const fetchCoberturasAdicionales = async () => {
    const { data } = await baseAPICoberturasAdi.post<CoberturasAdicionales[]>("getAllRecords")

    coberturasAdiciOptions.value = data.map(i => ({
      title: i.descCob,
      value: Number(i.cveCob)
    }))
  }

  const fetchTipoTarifa = async () => {
    const { data } = await baseAPITipoTarifa.post<TipoTarifa[]>("getAllRecords")
    tipoTarifaOptions.value = data.map(i => ({
      title: i.descTarifa,
      value: Number(i.cveTarifa)
    }))
  }

  //ptu
  const fetchMetodoCalPTU = async () => {
    const { data } = await baseAPIPtu.post<PTU[]>("getAllRecords")

    metodoCalPTUOptions.value = data.map(i => ({
      title: i.formulaPtu,
      value: Number(i.cvePtu)
    }))
  }


  return {
    compaReasegOptions,
    fetchReaseguradores,
    indicadorDistrCOptions,
    fetchIndicadorDistriC,
    tipoComisionOptions,
    fetchTipoComision,
    tipoCoberturaOptions,
    fetchTipoCobertura,
    coberturasOptions,
    fetchCoberturas,
    coberturasBasiOptions,
    fetchCoberturasBasicas,
    coberturasAdiciOptions,
    fetchCoberturasAdicionales,
    metodoCalPTUOptions,
    fetchMetodoCalPTU,
    tipoTarifaOptions,
    fetchTipoTarifa
  }
}
