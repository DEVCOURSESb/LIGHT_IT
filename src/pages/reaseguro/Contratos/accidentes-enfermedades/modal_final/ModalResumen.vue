<template>
  <v-dialog v-model="showModal" max-width="95dvw" scrollable>
    <v-card>
      <v-card-title class="text-h6 bg-primary text-white d-flex align-center">
        DETALLES DE NUEVO CONTRATO ACCIDENTES Y ENFERMEDADES
      </v-card-title>

      <v-card-text style="background-color: #f5f5f5; height: 80vh">
        <!-- !GENERALES -->
        <v-row>
          <v-col cols="12">
            <h1>GENERALES</h1>
            <v-data-table
              class="mt-2"
              :headers="generalesContratoHeaders"
              :items="generalesItems"
              striped="odd"
            >
              <template #item.traspasoCartera="{ item }">
                <v-checkbox
                  :model-value="item.traspasoCartera"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
              <template #item.contratoActivo="{ item }">
                <v-checkbox
                  :model-value="item.contratoActivo"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-data-table
              class="mt-2"
              :headers="generalesContratoMonedaHeader"
              :items="generalesMonedas"
              striped="odd"
            >
              <template #item.monActiva="{ item }">
                <v-checkbox
                  :model-value="item.monActiva"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="6">
            <v-data-table
              class="mt-2"
              :headers="generalesContratoOperaciones"
              :items="generalesOperaciones"
              striped="odd"
            >
              <template #item.operRamoActivo="{ item }">
                <v-checkbox
                  :model-value="item.operRamoActivo"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <!-- !DETALLES PROPORCIONALES -->
        <v-row v-if="isTypeProporcional" >
          <v-col cols="12" >
            <h1>DETALLES PROPORCIONALES</h1>
              <v-data-table
                class="mt-2"
                :headers="detallesProporcionalesHeaders"
                :items="detallesProporcionalesItems"
                striped="odd"
              >
                <template #item.detallesOperRamo="{ item }">
                  <v-checkbox
                    :model-value="item.detallesOperRamo"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.cumulos="{ item }">
                  <v-checkbox
                    :model-value="item.cumulos"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.detalleActivo="{ item }">
                  <v-checkbox
                    :model-value="item.detalleActivo"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
        </v-row>
        <!-- ! POLIZAS FACULTATIVAS -->
         <v-row v-if="isFacultativo" >
          <v-col cols="12" >
            <h1>PÓLIZAS FACULTATIVAS</h1>
              <v-data-table
                class="mt-2"
                :headers="polizasFacultativasHeaders"
                :items="polizasFacultativas"
                striped="odd"
              >
                <template #item.polActiva="{ item }">
                  <v-checkbox
                    :model-value="item.polActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! REASEGURADORES -->
         <v-row>
          <v-col cols="12" >
            <h1>REASEGURADORES</h1>
              <v-data-table
                class="mt-2"
                :headers="reaseguradoresHeaders"
                :items="reaseguradoresItems"
                striped="odd"
              >
                <template #item.otorgaPtu="{ item }">
                  <v-checkbox
                    :model-value="item.otorgaPtu"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.comisRolReaseguro="{ item }">
                  <v-checkbox
                    :model-value="item.comisRolReaseguro"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.reasegActiva="{ item }">
                  <v-checkbox
                    :model-value="item.reasegActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! COMISIONES RATE ON LINE -->
         <v-row v-if="haveComisionEscalonada" >
          <v-col cols="12" >
            <h1>COMISIONES RATE ON LINE</h1>
              <v-data-table
                class="mt-2"
                :headers="comisionesRateOnLineHeaders"
                :items="comisionesRateOnLineItems"
                striped="odd"
              >
                <template #item.comisRolActiva="{ item }">
                  <v-checkbox
                    :model-value="item.comisRolActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! COBERTURAS -->
         <v-row>
          <v-col cols="12" >
            <h1>COBERTURAS</h1>
              <v-data-table
                class="mt-2"
                :headers="coberturasHeaders"
                :items="coberturasItems"
                striped="odd"
              >
                <template #item.propiaSaMax="{ item }">
                  <v-checkbox
                    :model-value="item.propiaSaMax"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.cobBasica="{ item }">
                  <v-checkbox
                    :model-value="item.cobBasica"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.coberActiva="{ item }">
                  <v-checkbox
                    :model-value="item.coberActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! EXCEDENTES -->
         <v-row v-if="tipoContrato == 3">
          <v-col cols="12" >
            <h1>EXCEDENTES</h1>
              <v-data-table
                class="mt-2"
                :headers="excedentesHeaders"
                :items="excedentesItems"
                striped="odd"
              >
                <template #item.capaActiva="{ item }">
                  <v-checkbox
                    :model-value="item.capaActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! CUMULOS -->
        <v-row v-if="haveCumulos" >
          <v-col cols="12" >
            <h1>CÚMULOS</h1>
              <v-data-table
                class="mt-2"
                :headers="cumulosHeaders"
                :items="cumulosItems"
                striped="odd"
              >
                <template #item.cumuloActivo="{ item }">
                  <v-checkbox
                    :model-value="item.cumuloActivo"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
        </v-row>
        <!-- ! TARIFAS -->
         <v-row v-if="isTypeProporcional" >
          <v-col cols="12" >
            <h1>TARIFAS</h1>
              <v-data-table
                class="mt-2"
                :headers="tarifasHeadrs"
                :items="tarifasItems"
                striped="odd"
              >
                <template #item.tarifaActiva="{ item }">
                  <v-checkbox
                    :model-value="item.tarifaActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! PROPORCION PRIMAS -->
         <v-row v-if="haveProporcionDias" >
          <v-col cols="12" >
            <h1>PROPORCION PRIMAS</h1>
              <v-data-table
                class="mt-2"
                :headers="proporcionPrimasHeaders"
                :items="proporcionPrimasItems"
                striped="odd"
              >
                <template #item.proporcionActiva="{ item }">
                  <v-checkbox
                    :model-value="item.proporcionActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! REINSTALACIONES -->
         <v-row v-if="!isTypeProporcional" >
          <v-col cols="12" >
            <h1>REINSTALACIONES</h1>
              <v-data-table
                class="mt-2"
                :headers="reinstalacionesHeaders"
                :items="reinstalacionesItems"
                striped="odd"
              >
                <template #item.reinstalacionActiva="{ item }">
                  <v-checkbox
                    :model-value="item.reinstalacionActiva"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! INTERMDIARIOS -->
         <v-row >
          <v-col cols="12" >
            <h1>INTERMDIARIOS</h1>
              <v-data-table
                class="mt-2"
                :headers="intermediariosHeaders"
                :items="intermediariosItems"
                striped="odd"
              >
                <template #item.intermediario="{ item }">
                  <v-checkbox
                    :model-value="item.intermediario"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.corretaje="{ item }">
                  <v-checkbox
                    :model-value="item.corretaje"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
                <template #item.interActivo="{ item }">
                  <v-checkbox
                    :model-value="item.interActivo"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! CORRETAJE -->
         <v-row v-if="haveCorretajeEscalonado" >
          <v-col cols="12" >
            <h1>CORRETAJE</h1>
              <v-data-table
                class="mt-2"
                :headers="corretajesHeaders"
                :items="corretajeItems"
                striped="odd"
              >
                <template #item.corActivo="{ item }">
                  <v-checkbox
                    :model-value="item.corActivo"
                    disabled
                    hide-details
                    density="compact"
                  />
                </template>
              </v-data-table>
          </v-col>
         </v-row>
        <!-- ! ADMINISTRACION -->
         <v-row>
          <v-col cols="12" >
            <h1>ADMINISTRACIÓN</h1>
          </v-col>
          <v-col cols="6">
            <v-data-table
              class="mt-2"
              :headers="administracionPagoHeaders"
              :items="administradionPagosItems"
              striped="odd"
            >
              <template #item.pagoActivo="{ item }">
                <v-checkbox
                  :model-value="item.pagoActivo"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="6">
            <v-data-table
              class="mt-2"
              :headers="administracionEdoHeaders"
              :items="administracionEdoCuenta"
              striped="odd"
            >
              <template #item.edoActivo="{ item }">
                <v-checkbox
                  :model-value="item.edoActivo"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="6">
            <v-data-table
              class="mt-2"
              :headers="administracionBorPrimasHeaders"
              :items="administracionBorPrimas"
              striped="odd"
            >
              <template #item.primasActivo="{ item }">
                <v-checkbox
                  :model-value="item.primasActivo"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="6">
            <v-data-table
              class="mt-2"
              :headers="administracionBorSiniestrosHeaders"
              :items="administracionBorSiniestros"
              striped="odd"
            >
              <template #item.siniestrosActivo="{ item }">
                <v-checkbox
                  :model-value="item.siniestrosActivo"
                  disabled
                  hide-details
                  density="compact"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn variant="outlined" @click="sendToService">Confirmar</v-btn>
        <v-btn variant="outlined" @click="closeModal">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { computed } from "vue";
import { tablesHaders } from "./tablesHeaders";
import { formatDate } from "@/utils/formatDate";
import { catalogosActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/catalogos.actions";
import { replaceNullValues } from "@/utils/replaceNullValues";
import { formatCurrency } from "@/utils/formatCurrency";
import { OPCIONES_PERIODICIDAD } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/administracion/useAdministracionSection";
const showModal = defineModel<boolean>({ default: false });

const { 
  generales,
  isTypeProporcional,
  detallesProporcionales,
  isFacultativo,
  reaseguradores,
  polizasFacultativas,
  haveComisionEscalonada,
  comisionesRateOnLine,
  coberturas,
  tipoContrato,
  excedentes,
  haveCumulos,
  cumulos,
  tarifas,
  haveProporcionDias,
  proporcionPrimas,
  reinstalaciones,
  intermediarios,
  haveCorretajeEscalonado,
  corretajes,
  pagos,
  edoCuenta,
  borPrimas,
  borSiniestros,
  obtenerPayloadBackend,
 } = useContratoAEStore();

const { 
  generalesContratoHeaders, 
  generalesContratoMonedaHeader, 
  generalesContratoOperaciones, 
  detallesProporcionalesHeaders,
  polizasFacultativasHeaders, 
  reaseguradoresHeaders,
  comisionesRateOnLineHeaders,
  coberturasHeaders,
  excedentesHeaders,
  cumulosHeaders,
  tarifasHeadrs,
  proporcionPrimasHeaders,
  reinstalacionesHeaders,
  intermediariosHeaders,
  corretajesHeaders,
  administracionPagoHeaders,
  administracionEdoHeaders,
  administracionBorPrimasHeaders,
  administracionBorSiniestrosHeaders,
} = tablesHaders();

// catalogos a utilizar
const {
  /* generales */
  queryTiposReaseguro,
  queryTiposContrato,
  queryFormaContractual,
  queryCriterioCobertura,
  queryEntidadFederativa,
  queryRr6Sector,
  queryMoneda,
  queryExtensionesCobertura,
  queryOperacionesRamos,
  /* detalles proporcionales */
  queryCriterioAsignacion,
  queryDistribucionCesion,
  /* reaseguradores */
  queryReaseguradoras,
  queryPtu,
  queryTipoAsignacion,
  queryCalculoComision,
  /* coberturas */
  queryCoberturasAyE,
  /* tarifas */
  queryTipoTarifa,
  querySexo,
  queryIntermediarios,
  queryLimCorretaje,
  queryFormaPago
} = catalogosActions();

// !GENERALES /*
const generalesItems = computed(() => {
  const { CAE_MONEDA_CONTRATO, CAE_OPERACION_RAMO, ...rest } = generales;

  const dataToShow = [rest].map((row) => {
    return {
      ...row,
      fechaInicioContrato: formatDate(row.fechaInicioContrato),
      fechaFinContrato: formatDate(row.fechaFinContrato),
      cveTreaseg: queryTiposReaseguro.data.value?.find(
        (el) => el.cveTreaseg == row.cveTreaseg,
      )?.descTreaseg,
      idTcontrato: queryTiposContrato.data.value?.find(
        (el) => el?.idTcontrato == row.idTcontrato,
      )?.descTcontrato,
      cveFcontrac: queryFormaContractual.data.value?.find(
        (el) => el.cveFcontrac == row.cveFcontrac,
      )?.descFcontrac,
      cveCriterioCob: queryCriterioCobertura.data.value?.find(
        (el) => el.cveCriterioCob == row.cveCriterioCob,
      )?.descCriterioCob,
      cveEntidad: queryEntidadFederativa.data.value?.find(
        (el) => el.cveEntidad == row.cveEntidad,
      )?.nombreEntidad,
      cveSector: queryRr6Sector.data.value?.find(
        (el) => el.cveSector == row.cveSector,
      )?.descSector,
    };
  });

  return replaceNullValuesInArray(dataToShow);
});

const generalesMonedas = computed(() => {
  const { CAE_MONEDA_CONTRATO: monedas } = generales;

  const data = monedas.map((row) => {
    return {
      ...row,
      cveMonedaContrato: queryMoneda.data.value?.find(
        (el) => el.cveMoneda == row.cveMonedaContrato,
      )?.descMoneda,
    };
  });

  return replaceNullValuesInArray(data);
});

const generalesOperaciones = computed(() => {
  const { CAE_OPERACION_RAMO: operaciones } = generales;

  const data = operaciones.map((row) => {
    return {
      ...row,
      cveExtCoberContrato: queryExtensionesCobertura.data.value?.find( el => el.cveExtCober == row.cveExtCoberContrato )?.descExtCober,
      cveOperRamo: queryOperacionesRamos.data.value?.find( el => el.cveCobertura == row.cveOperRamo )?.descOperacionRamos,
    }
  });

  return replaceNullValuesInArray(data);
});

/* !DETALLES PROPORCIONALES */
const detallesProporcionalesItems = computed(() => {
  const data =  detallesProporcionales.map((row => {
    return {
      ...row,
      cveExtCoberDetalles: queryExtensionesCobertura.data.value?.find(el => el.cveExtCober == row.cveExtCoberDetalles),
      cveOperRamoDetalles: queryOperacionesRamos.data.value?.find( el => el.cveCobertura == row.cveOperRamoDetalles)?.descOperacionRamos,
      porcentajeRetencion: `${formatCurrency( row.porcentajeRetencion! )} %`,
      porcentajeCesion: `${formatCurrency( row.porcentajeCesion! )} %`,
      montoRetencion: `$${formatCurrency( row.montoRetencion )}`,
      montoRetencionContrato: `$${formatCurrency( row.montoRetencionContrato )}`,
      montoCesion: `$${formatCurrency( row.montoCesion )}`,
      capacidadContrato: `$${formatCurrency( row.capacidadContrato )}`,
      cveCriterioAsigCapacidad: queryCriterioAsignacion.data.value?.find( el => el.cveCriterioAsig == row.cveCriterioAsigCapacidad )?.descCriterioAsig,
      cveDistrCesion: queryDistribucionCesion.data.value?.find(el => el.cveDistrcesion == row.cveDistrCesion)?.descDistrcesion,
      cveMonedaDetalles: queryMoneda.data.value?.find( el => el.cveMoneda == row.cveMonedaDetalles )?.descMoneda,
    }
  }));

  return replaceNullValuesInArray(data);
});

/* !REASEGURADORES */
const reaseguradoresItems = computed( () => {
    const data = reaseguradores.map( row => {
      return {
        ...row,
        cveReasegurador: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReasegurador)?.nombreReasegurador,
        participacion: `${formatCurrency(row.participacion)} %`,
        porcentajePtu: `${formatCurrency(row.porcentajePtu)} %`,
        cvePtu: queryPtu.data.value?.find( el => el.cvePtu == row.cvePtu )?.formulaPtu,
        porcentajeK: `${formatCurrency(row.porcentajeK)} %`,
        gastos: `$${formatCurrency(row.gastos)}`,
        cveAsignacionComisRol: queryTipoAsignacion.data.value?.find( el => el.cveAsignacion == row.cveAsignacionComisRol )?.descAsignacion,
        cveCalcomis: queryCalculoComision.data.value?.find( el => el.cveCalcomis == row.cveCalcomis )?.formulaComision,
        comisRolFija: `${formatCurrency(row.comisRolFija)} %`,
        comisRolProvisional: `${formatCurrency(row.comisRolProvisional)} %`,
        comisRolMin: `${formatCurrency(row.comisRolMin)} %`,
        comisRolMax: `${formatCurrency(row.comisRolMax)} %`,
        limResponsabilidad: `$${formatCurrency(row.participacion)}`,
        limAgregado: `$${formatCurrency(row.limAgregado)}`,
        cveCriterioAsigLimAgregado:queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigLimAgregado)?.descCriterioAsig,
        cveAsignacionCosto: queryTipoAsignacion.data.value?.find(el => el.cveAsignacion == row.cveAsignacionCosto)?.descAsignacion,
        costoFijo: `$${formatCurrency(row.costoFijo)}`,
        pmd: `$${formatCurrency(row.pmd)}`,
        primaMin: `$${formatCurrency(row.primaMin)}`,
        primaMax: `$${formatCurrency(row.primaMax)}`,
        facAjusteDividendo: `$${formatCurrency(row.facAjusteDividendo)}`,
        facAjusteDivisor: `$${formatCurrency(row.facAjusteDivisor)}`,
        noClaims: `$${formatCurrency(row.noClaims)}`,
      }
    })

    return replaceNullValuesInArray(data);
});

/* COMISIONES RATE ON LINE */
const comisionesRateOnLineItems = computed(() => {
  const data = comisionesRateOnLine.map(row => {
    return {
      ...row,
      cveReaseguradorComisRol: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReaseguradorComisRol)?.nombreReasegurador,
      limiteInf: `$${formatCurrency(row.limiteInf)}`,
      limiteSup: `$${formatCurrency(row.limiteSup)}`,
      comisRolDefinitiva: `${formatCurrency(row.comisRolDefinitiva)} %`,
    }
  })

  return replaceNullValuesInArray(data);
});

/* coberturas */
const coberturasItems =computed(() => {
  const data = coberturas.map((row) => {
    return {
      ...row,
      cveCriterioAsigCobertura: queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigCobertura)?.descCriterioAsig,
      cveReaseguradorCobertura: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReaseguradorCobertura)?.nombreReasegurador,
      cveOperRamoCobertura: queryOperacionesRamos.data.value?.find(el => el.cveCobertura == row.cveOperRamoCobertura)?.descOperacionRamos,
      cveCobaye: queryCoberturasAyE.data.value?.find(el => el.cveCobaye == row.cveCobaye)?.descCobaye,
      saMax: `$${formatCurrency(row.saMax)}`,
    }
  });

  return replaceNullValuesInArray(data);
});

/* excedentes */
const excedentesItems = computed(() => {
  const data = excedentes.map((row) => {
    return {
      ...row,
      cveCriterioAsigCapa: queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigCapa)?.descCriterioAsig,
      cveCobayeCapa: queryCoberturasAyE.data.value?.find(el => el.cveCobaye == row.cveCobayeCapa)?.descCobaye,
      retencionCapa: `${formatCurrency(row.retencionCapa)} %`,
      cesionCapa: `${formatCurrency(row.cesionCapa)} %`,
    }
  });

  return replaceNullValuesInArray(data);
});

/* cumulos */
const cumulosItems = computed(() => {
  const data = cumulos.map((row) => {
    return {
      ...row,
      cveOperRamoCumulo: queryOperacionesRamos.data.value?.find(el => el.cveCobertura == row.cveOperRamoCumulo)?.descOperacionRamos,
      montoCumulo: `$${formatCurrency(row.montoCumulo)}`,
    }
  });

  return replaceNullValuesInArray(data);
});


/* tarifas */
const tarifasItems = computed(() => {
  const data = tarifas.map((row) => {
    return {
      ...row,
      cveCriterioAsigTarifa: queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigTarifa)?.descCriterioAsig,
      cveReaseguradorTarifa: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReaseguradorTarifa)?.nombreReasegurador,
      cveOperRamoTarifa: queryOperacionesRamos.data.value?.find(el => el.cveCobertura == row.cveOperRamoTarifa)?.descOperacionRamos,
      cveCobayeTarifa: queryCoberturasAyE.data.value?.find(el => el.cveCobaye == row.cveCobayeTarifa)?.descCobaye,
      cveTarifa: queryTipoTarifa.data.value?.find(el => el.cveTarifa == row.cveTarifa)?.descTarifa,
      primaTarifaReaseg: `$${formatCurrency(row.primaTarifaReaseg)}`,
      porcentajePrimaEmi: `${formatCurrency(row.porcentajePrimaEmi)} %`,
      tarifaMillar: `$${formatCurrency(row.tarifaMillar)}`,
      cveSexo: querySexo.data.value?.find(el => el.cveSexo == row.cveSexo)?.descSexo,
      cveMonedaTarifa: queryMoneda.data.value?.find(el => el.cveMoneda == row.cveMonedaTarifa)?.descMoneda,
    }
  });

  return replaceNullValuesInArray(data);
});

 /* proporcion primas */
 const proporcionPrimasItems = computed(() => {
  const data = proporcionPrimas.map((row) => {
    return {
      ...row,
      cveCriterioAsigPrimaPropor: queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigPrimaPropor)?.descCriterioAsig,
      cveReaseguradorPrimaPropor: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReaseguradorPrimaPropor)?.nombreReasegurador,
      cveOperRamoPrimaPropor: queryOperacionesRamos.data.value?.find(el => el.cveCobertura == row.cveOperRamoPrimaPropor)?.descOperacionRamos,
      porcentajePrimaAnual: `${formatCurrency(row.porcentajePrimaAnual)} %`,
    }
  });

  return replaceNullValuesInArray(data);
});

/* REINSTALACIONES */
const reinstalacionesItems = computed(() => {
  const data = reinstalaciones.map((row) => {
    return {
      ...row,
      cveCriterioAsigReinstalacion: queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigReinstalacion)?.descCriterioAsig,
      cveReaseguradorReinstalacion: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReaseguradorReinstalacion)?.nombreReasegurador,
      cuotaAjusteReinstalacion: `$${formatCurrency(row.cuotaAjusteReinstalacion)}`,
      costoReinstalacion: `$${formatCurrency(row.costoReinstalacion)}`,
      montoReinstalado: `$${formatCurrency(row.montoReinstalado)}`,
    }
  });

  return replaceNullValuesInArray(data);
});

/* intermediarios */
const intermediariosItems = computed(() => {
  const data = intermediarios.map((row) => {
    return {
      ...row,
      cveCriterioAsigIntermediario: queryCriterioAsignacion.data.value?.find(el => el.cveCriterioAsig == row.cveCriterioAsigIntermediario)?.descCriterioAsig,
      cveReaseguradorIntermediario: queryReaseguradoras.data.value?.find(el => el.cveReasegurador == row.cveReaseguradorIntermediario)?.nombreReasegurador,
      cveIntermediario: queryIntermediarios.data.value?.find(el => el.cveIntermediario == row.cveIntermediario)?.nombreIntermediario,
      cveAsignacionCorretaje: queryTipoAsignacion.data.value?.find(el => el.cveAsignacion == row.cveAsignacionCorretaje)?.descAsignacion,
      porcentajeCorretajeFijo: `${formatCurrency(row.porcentajeCorretajeFijo)} %`,
      montoCorretajeFijo: `$${formatCurrency(row.montoCorretajeFijo)}`,
      cveLimCorretaje: queryLimCorretaje.data.value?.find(el => el.cveLimCorretaje == row.cveLimCorretaje)?.limiteCorretaje,
      porcentajeCorretajeProvisional: `${formatCurrency(row.porcentajeCorretajeProvisional)} %`,
      montoCorretajeProvisional: `$${formatCurrency(row.montoCorretajeProvisional)}`,
    }
  });

  return replaceNullValuesInArray(data);
});

/* corretaje */
const corretajeItems = computed(() => {
    const data = corretajes.map((row) => {
      return {
        ...row,
        cveIntermediarioCorretaje: queryIntermediarios.data.value?.find((el) => el.cveIntermediario == row.cveIntermediarioCorretaje)?.nombreIntermediario,
        cveReaseguradorCorretaje: queryReaseguradoras.data.value?.find((el) => el.cveReasegurador == row.cveReaseguradorCorretaje)?.nombreReasegurador,
        limiteInfCorretaje: `$${formatCurrency(row.limiteInfCorretaje)}`,
        limiteSupCorretaje: `$${formatCurrency(row.limiteSupCorretaje)}`,
        porcentajeCorretajeDef: `${formatCurrency(row.porcentajeCorretajeDef)} %`,
        montoCorretajeDef: `$${formatCurrency(row.montoCorretajeDef)}`,
      }
    });

    return replaceNullValuesInArray(data);
});

/* pagos */
const administradionPagosItems = computed(() => {
  const data = pagos.map((row) => {
    return {
      ...row,
      cveFormapago: queryFormaPago.data.value?.find(el => el.cveFormaPago == row.cveFormapago)?.descFormaPago,
      porcentajePago: `${formatCurrency(row.porcentajePago)} %`,
      fechaPago: formatDate(String(row?.fechaPago)) || "-",
    }
  });

  return replaceNullValuesInArray(data);
});

/* edoCuenta */
const administracionEdoCuenta = computed(() => {
  const data = edoCuenta.map((row) => {
    return {
      ...row,
      fechaEdo: formatDate(String(row?.fechaEdo)) || "-",
      cvePeriodicidadEdo: OPCIONES_PERIODICIDAD.find(el => el.value == row.cvePeriodicidadEdo)?.title || "-",
    }
  });

  return replaceNullValuesInArray(data);
});

/* borPrimas */
const administracionBorPrimas = computed(() => {
  const data = borPrimas.map((row) => {
    return {
      ...row,
      cvePeriodicidadPrimas: OPCIONES_PERIODICIDAD.find(el => el.value == row.cvePeriodicidadPrimas)?.title || "-",
      fechaPrimas: formatDate(String(row?.fechaPrimas)) || "-",
    }
  });

  return replaceNullValuesInArray(data);
});

/* borSiniestros */
const administracionBorSiniestros = computed(() => {
  const data = borSiniestros.map((row) => {
    return {
      ...row,
      cvePeriodicidadSiniestros: OPCIONES_PERIODICIDAD.find(el => el.value == row.cvePeriodicidadSiniestros)?.title || "-",
      fechaSiniestros: formatDate(String(row?.fechaSiniestros)) || "-",
    }
  });

  return replaceNullValuesInArray(data);
});

function replaceNullValuesInArray<T extends Record<string, any>>(arr: T[], replacement: string = "-"): T[] {
  return arr.map((obj) => replaceNullValues(obj, replacement));
}

const sendToService = () => {
  console.log(obtenerPayloadBackend());
};

const closeModal = () => {
  showModal.value = false;
};
</script>
