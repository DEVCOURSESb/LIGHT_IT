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

export interface IdContrato {
  id: number
  idContrato: string
  fechaInicioContrato: Date
  fechaFinContrato: Date
  fechaFinProrrogada: Date
  fechaCancelacion: Date
}

export const CalcularSiniestros = () => {

  const subramoOptions = ref<SelectOption<string>[]>([])
  const idContratoOptions = ref<SelectOption<number>[]>([])
  const baseAPIContrato = BaseAPI({
    prefix: "ws_reaseguro_contratos_vida/api/v1/DatosContratoRest"
  })

  const baseAPIOperacion = BaseAPI({
    prefix: "ws_catalogos_reaseguro/api/v1/ReasegCatCnsfintOperYRamosAnx3817Rest/"
  })

  const fetchSubramos = async () => {
    const { data } = await baseAPIOperacion.post<Subramo[]>("getAllRecords")

    subramoOptions.value = data
      .filter(i => i.subramo === "012" || i.subramo === "013") // aqui no debe aparecer vida 010 como subramo
      .map(i => ({
        title: i.descOperacionRamos,
        value: i.subramo
      }))
  }

  const fetchIdContratos = async () => {
    const { data } = await baseAPIContrato.post<IdContrato[]>("getAllRecords")

    idContratoOptions.value = data.map(i => ({
      title: i.idContrato,
      value: Number(i.id)
    }))
  }

  return {
    subramoOptions,
    fetchSubramos,
    idContratoOptions,
    fetchIdContratos
  }

}
