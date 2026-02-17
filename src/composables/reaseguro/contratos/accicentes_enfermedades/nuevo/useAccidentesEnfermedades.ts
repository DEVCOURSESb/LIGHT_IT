import { calculoComisionConfig } from "@/components/config/catalogos/calculo_comision/calculo_comision.config";
import { coberturasAyeConfig } from "@/components/config/catalogos/coberturas_aye/coberturas_aye.config";
import { CriterioCoberturaConfig } from "@/components/config/catalogos/criterio_cobertura/criterio_cobertura.config";
import { criteriosAsignacionConfig } from "@/components/config/catalogos/criterios_asignacion/criteriosAsignacion.config";
import { DistribucionCesionConfig } from "@/components/config/catalogos/distribucion-cesion/distribucion-cesion.config";
import { EntidadFederativaConfig } from "@/components/config/catalogos/entidad_federativa/entidad_federativa.config";
import { ExtensionesConfig } from "@/components/config/catalogos/extensiones/extensiones.config";
import { FormaContractualConfig } from "@/components/config/catalogos/forma-contractual/forma-contractual.config";
import { FormaPagoConfig } from "@/components/config/catalogos/forma_pago/formaPago.config";
import { intermediariosConfig } from "@/components/config/catalogos/intermediarios/intermediarios.config";
import { limCorretajeConfig } from "@/components/config/catalogos/Lim_corretaje/LimCorretaje.config";
import { monedaConfig } from "@/components/config/catalogos/moneda/moneda.config";
import { operacionesRamosConfig } from "@/components/config/catalogos/operaciones-ramos/operaciones-ramos.config";
import { ptuConfig } from "@/components/config/catalogos/ptu/ptu.config";
import { reaseguradoresConfig } from "@/components/config/catalogos/reaseguradores/reaseguradores.config";
import { rr6SectorConfig } from "@/components/config/catalogos/rr6_sector/rr6_sector.config";
import { SexoConfig } from "@/components/config/catalogos/sexo/sexo.config";
import { tipoAsignacionConfig } from "@/components/config/catalogos/tipo-asignacion/tipo-asignacion.config";
import { tipoReaseguroConfig } from "@/components/config/catalogos/tipo-reaseguro/tipo-reaseguro.config";
import { tipoTarifaConfig } from "@/components/config/catalogos/tipo-tarifa/tipo-tarifa.config";
import { tiposContratoConfig } from "@/components/config/catalogos/tipos-contrato/tipos-contrato.config";
import { useQuery } from "@tanstack/vue-query";
/**
 * Catalogos necesarios para dar de alta un contrato de accidentes y enfermedades
 * @returns queryResults
 */
export const useAccidentesEnfermedades = () => {
  const list = "list";

  // catalogos
  //REASEG_CAT_CNSF_RR6_MONEDA
  const queryMoneda = useQuery({
    queryKey: [monedaConfig.entity, list],
    queryFn: monedaConfig.apiActions.fetch,
  });

  //REASEG_CAT_CNSF_INTERMEDIARIOS
  const queryIntermediarios = useQuery({
    queryKey: [intermediariosConfig.entity, list],
    queryFn: intermediariosConfig.apiActions.fetch,
  });

  // REASEG_CAT_CNSF_RR6_ENTIDAD
  const queryEntidad = useQuery({
    queryKey: [EntidadFederativaConfig.entity, list],
    queryFn: EntidadFederativaConfig.apiActions.fetch,
  });

  //! NEW REASEG_CAT_CNSF_RR6_SECTOR
  const queryRr6Sector = useQuery({
    queryKey: [rr6SectorConfig.entity, list],
    queryFn: rr6SectorConfig.apiActions.fetch,
  });

  // REASEG_CAT_CNSFINT_OPER_Y_RAMOS_ANX38_1_7
  const queryOperacionesRamos = useQuery({
    queryKey: [operacionesRamosConfig.entity, list],
    queryFn: operacionesRamosConfig.apiActions.fetch,
  });

  //  REASEG_CAT_CNSFINT_TIPO_CONTRATO
  const queryTiposContrato = useQuery({
    queryKey: [tiposContratoConfig.entity, list],
    queryFn: tiposContratoConfig.apiActions.fetch,
  });

  //REASEG_CAT__CNSFINT_REASEGURADORAS
  const queryReaseguradoras = useQuery({
    queryKey: [reaseguradoresConfig.entity, list],
    queryFn: reaseguradoresConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_EXTENSION_COBERTURA
  const queryExtensionesCobertura = useQuery({
    queryKey: [ExtensionesConfig.entity, list],
    queryFn: ExtensionesConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_TIPO_ASIGNACION
  const queryTipoAsignacion = useQuery({
    queryKey: [tipoAsignacionConfig.entity, list],
    queryFn: tipoAsignacionConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_FORMA_CONTRACTUAL
  const queryFormaContractual = useQuery({
    queryKey: [FormaContractualConfig.entity, list],
    queryFn: FormaContractualConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_TIPO_REASEGURO
  const queryTiposReaseguro = useQuery({
    queryKey: [tipoReaseguroConfig.entity, list],
    queryFn: tipoReaseguroConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_PTU
  const queryPtu = useQuery({
    queryKey: [ptuConfig.entity, list],
    queryFn: ptuConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_CRITERIO_COBERTURA
  const queryCriterioCobertura = useQuery({
    queryKey: [CriterioCoberturaConfig.entity, list],
    queryFn: CriterioCoberturaConfig.apiActions.fetch,
  });

  //! NEW REASEG_CAT_INT_BASE_CESION

  // REASEG_CAT_INT_CRITERIO_ASIGNACION
  const queryCriterioAsignacion = useQuery({
    queryKey: [criteriosAsignacionConfig.entity, list],
    queryFn: criteriosAsignacionConfig.apiActions.fetch,
  });

  //! NEW REASEG_CAT_INT_COBERTURAS_AYE
  const queryCoberturasAyE = useQuery({
    queryKey: [coberturasAyeConfig.entity, list],
    queryFn: coberturasAyeConfig.apiActions.fetch,
  });

  //! NEW REASEG_CAT_INT_LIM_CORRETAJE
  const queryLimCorretaje = useQuery({
    queryKey: [limCorretajeConfig.entity, "lim"],
    queryFn: limCorretajeConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_TIPO_TARIFA
  const queryTipoTarifa = useQuery({
    queryKey: [tipoTarifaConfig.entity, list],
    queryFn: tipoTarifaConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_DISTRIBUCION_CESION
  const queryDistribucionCesion = useQuery({
    queryKey: [DistribucionCesionConfig.entity, list],
    queryFn: DistribucionCesionConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_FORMA_PAGO
  const queryFormaPago = useQuery({
    queryKey: [FormaPagoConfig.entity, list],
    queryFn: FormaPagoConfig.apiActions.fetch,
  });

  //! NEW REASEG_CAT_INT_CALCULO_COMISION
  const queryCalculoComision = useQuery({
    queryKey: [calculoComisionConfig.entity, list],
    queryFn: calculoComisionConfig.apiActions.fetch,
  });

  // REASEG_CAT_INT_SEXO
  const querySexo = useQuery({
    queryKey: [SexoConfig.entity, list],
    queryFn: SexoConfig.apiActions.fetch,
  });

  return {
    queryMoneda,
    queryIntermediarios,
    queryEntidad,
    queryRr6Sector,
    queryOperacionesRamos,
    queryTiposContrato,
    queryReaseguradoras,
    queryExtensionesCobertura,
    queryTipoAsignacion,
    queryFormaContractual,
    queryTiposReaseguro,
    queryPtu,
    queryCriterioCobertura,
    queryCriterioAsignacion,
    queryCoberturasAyE,
    queryLimCorretaje,
    queryTipoTarifa,
    queryDistribucionCesion,
    queryFormaPago,
    queryCalculoComision,
    querySexo,
  };
};
