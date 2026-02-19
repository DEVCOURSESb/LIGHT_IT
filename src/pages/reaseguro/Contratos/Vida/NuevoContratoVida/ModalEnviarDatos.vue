<template>
  <v-dialog v-model="modalResumen" max-width="1400px" scrollable>
    <v-card>
      <v-card-title class="text-h6 bg-primary text-white d-flex align-center">
        RESUMEN NUEVO CONTRATO VIDA
      </v-card-title>

      <v-card-text style="background-color: #f5f5f5; height: 80vh;">
        <v-alert type="warning" variant="tonal" border="start" class="mb-4 mt-2">
          Revise la información antes de guardar. Si detecta errores, cierre esta pestaña y regrese al formulario correspondiente.
        </v-alert>

        <v-container fluid>
          <v-card class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">DATOS GENERALES DEL CONTRATO</v-card-title>
            <v-data-table :headers="headersDatosContrato" :items="datosContratoResumen" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="excedenteCapasResumen.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">EXCEDENTE POR CAPAS</v-card-title>
            <v-data-table :headers="headersCapasResumen" :items="excedenteCapasResumen" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="polizasFacuResumen.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">PÓLIZAS FACULTATIVAS</v-card-title>
            <v-data-table :headers="headersPolizasResumen" :items="polizasFacuResumen" density="compact" hide-default-footer />
          </v-card>

          <v-card v-if="reaseguradoresTablaCompleta.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">REASEGURADORES Y PARTICIPACIÓN DE UTILIDADES (PTU)</v-card-title>
            <v-data-table :headers="headersReaseguradores" :items="reaseguradoresTablaCompleta" density="compact" />
          </v-card>

          <v-card v-if="tarifasTablaCompleta.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">DETALLE TÉCNICO DE COBERTURAS (TARIFAS)</v-card-title>
            <v-data-table :headers="headersCoberturas" :items="tarifasTablaCompleta" density="compact" />
          </v-card>

          <v-card v-if="comisionFijaTabla.length || comisionEscalonadaTabla.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">COMISIONES (FIJA Y ESCALONADA)</v-card-title>
            <v-data-table v-if="comisionFijaTabla.length" :headers="headersComisionContrato" :items="comisionFijaTabla" density="compact" class="mb-2" />

            <v-card-title v-if="comisionEscalonadaTabla.length" class="text-caption">ESCALONADA</v-card-title>
            <v-data-table v-if="comisionEscalonadaTabla.length" :headers="headersComisionEscalonada" :items="comisionEscalonadaTabla" density="compact" />
          </v-card>

          <v-card v-if="intermediariosTablaCompleta.length" class="mb-4 elevation-2">
            <v-card-title class="text-subtitle-2 bg-grey-lighten-3">INTERMEDIARIOS DEL CONTRATO</v-card-title>
            <v-data-table :headers="headersIntermediarios" :items="intermediariosTablaCompleta" density="compact" />
          </v-card>
        </v-container>
      </v-card-text>

      <v-card-actions class="pa-4 bg-white">
        <v-spacer />
        <v-btn variant="tonal" color="grey-darken-1" @click="modalResumen = false">Cerrar y Editar</v-btn>
        <v-btn color="success" variant="tonal" @click="guardarEnBD">Confirmar y Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useContratoStore } from '@/stores/contratoStore'
import { DialogType, useDialog } from "@/stores/dialogStore"
import { BaseAPI } from '@/API/BaseAPI'
import { AuthStore } from '@/stores/authStore'

const contratoStore = useContratoStore()
const modalResumen = ref(false)
const dialog = useDialog()
const getID = (item: any): any => {
  if (item === null || item === undefined) return null;
  if (typeof item === 'object' && 'value' in item) return item.value;
  return item;
};

const getTX = (item: any): string => {
  if (item === null || item === undefined) return 'NULL';
  if (typeof item === 'object') return item.title || item.label || item.nombre || 'NULL';
  return String(item);
};

const joinByDash = (arr: any[]) =>
  Array.isArray(arr) ? arr.map(a => getID(a)).join('-') : getID(arr);

const formatoSiNo = (val: any) => {
  const v = getID(val);
  if (v === 1 || v === '1' || v === true || String(v).toUpperCase() === 'SI' || String(v).toUpperCase() === 'SÍ') return 'SÍ';
  if (v === 0 || v === '0' || v === false || String(v).toUpperCase() === 'NO') return 'NO';
  return '-';
};

const cleanN = (val: any) => {
  if (val === null || val === undefined || val === '') return 0.0;
  return parseFloat(val.toString().replace('%', '').replace(',', '')) || 0.0;
};

const formatF = (f: string | Date) => {
  if (!f) return "";
  const d = new Date(f);
  return d.toISOString().split('T')[0] + " 00:00:00.0";
};

const datosContratoResumen = computed(() => {
  const g = contratoStore.general; if (!g) return [];
  return [{
    idRamo: '010',
    subRamo: joinByDash(g.subramo),
    idContrato: g.idContrato,
    negocioCubiertos: g.negociosCubiertos || '-',
    fechaInicioContrato: g.fechaInicio,
    fechaFinContrato: g.fechaFin,
    cveMoneda: getTX(g.cveMoneda),
    cveFContrac: getTX(g.cveFormaContractual),
    idTContrato: getTX(g.idTContrato),
    criterioCobertura: getTX(g.criterioCobertura),
    limiteMaximoContrato: '$ ' + cleanN(g.limiteMax).toLocaleString(),
    limiteMaximoPorContrato: '$ ' + cleanN(g.limiteMaxResCR).toLocaleString(),
    cveTReaseg: getTX(g.cveTReaseguro),
    montoRetencion: '$ ' + cleanN(g.montoRetencion).toLocaleString(),
    piso: '$ ' + cleanN(g.piso).toLocaleString(),
    techo: '$ ' + cleanN(g.techo).toLocaleString(),
    porcentajeCesion: cleanN(g.porcentajeCesion) + '%'
  }]
});

const excedenteCapasResumen = computed(() => {
  const id = contratoStore.general?.idContrato || '';
  return (contratoStore.expc?.capas || []).map(c => ({
    idContrato: id,
    detalleCapa: c.detalleCapa,
    montoRetencionCapa: cleanN(c.retencionC),
    techoCapa: cleanN(c.techoC)
  }))
});

const polizasFacuResumen = computed(() => {
  const id = contratoStore.general?.idContrato || '';
  return (contratoStore.poli?.polizas || []).map(p => ({
    idContrato: id,
    llavePolRen: `${p.poliza}|${p.renovacion}`,
    numPoliza: p.poliza,
    numRenovPol: p.renovacion
  }))
});

const reaseguradoresTablaCompleta = computed(() => {
  const lista = contratoStore.listaReaseguradoresFinal;
  if (!lista || lista.length === 0) return [];

  return lista.map((item: any) => ({
    idContrato: item.general.idContrato,
    cveReasegurador: item.general.nombreReasegurador || getTX(item.general.cveReasegurador),
    participacion: item.general.participacion + '%',
    cveDistrCesion: getTX(item.general.indicadorDistrC),
    indCesionBasica: formatoSiNo(item.general.cesionCoberBasi),
    indComisionReaseguro: formatoSiNo(item.general.comisionReaseg),
    indDetalleCobertura: formatoSiNo(item.general.detalleCobertura),
    cveAsignacion: getTX(item.general.tipoComision),
    otrogaPtu: formatoSiNo(item.ptu?.otorgaPtu),
    cvePtu: getTX(item.ptu?.metodoCalPTU),
    porcentajePtu: (item.ptu?.ptu || 0) + '%',
    porcentajeK: (item.ptu?.kPor || 0) + '%',
    gastos: (item.ptu?.gastos || 0) + '%',
    aniosArrastre: item.ptu?.aniosArrastre || 0
  }))
});


const tarifasTablaCompleta = computed(() => {
  const lista = contratoStore.listaReaseguradoresFinal;
  if (!lista) return [];

  const todasLasTarifas: any[] = [];

  lista.forEach((item: any) => {
    const cob = item.coberturas;
    if (!cob || !cob.tarifas) return;

    cob.tarifas.forEach((t: any) => {
      const agrup = cob.agrupaciones?.find((a: any) =>
        a.coberturas?.some((c: any) => String(getID(c)) === String(t.cveCob))
      );

      const esMadre = agrup
        ? String(t.cveCob) === String(getID(agrup.madre))
        : false;

      todasLasTarifas.push({
        idContrato: item.general.idContrato,
        cveReasegurador: item.general.nombreReasegurador,
        detalleCapa: t.detalleCapa || '-',
        descClasifCober: String(t.tipoCobertura),
        cveCob: String(t.cveCob),
        descCob: t.cobertura,

        cveAgrupCob: (agrup && !esMadre) ? String(getID(agrup.madre)) : '-',
        descAgrupCob: (agrup && !esMadre) ? getTX(agrup.madre) : '-',

        cveTarifa: getTX(t.tipoTarifa),
        primaTarifaFija: '$ ' + cleanN(t.primaTarifa).toLocaleString(),
        porSobrePrima: cleanN(t.porSobrePrima) + '%',
        tarifaFija: cleanN(t.tarifaFijaM).toFixed(4),
        factorTarifaPropia: cleanN(t.factorTap) + '%',
        tarifaPropia: getTX(t.nombreArchivo) || ''
      });
    });
  });

  return todasLasTarifas;
});

const comisionFijaTabla = computed(() => {
  const lista = contratoStore.listaReaseguradoresFinal || [];

  return lista
    .filter((item: any) => getID(item.general.comisionReaseg) === 1)
    .flatMap((item: any) => {
      const coberturas = item.general.coberturas || [];

      return coberturas.map((cob: any) => ({
        idContrato: item.general.idContrato,
        cveReasegurador: item.general.nombreReasegurador,
        descClasifCober: cob.tipoCobertura || cob.tipoCobertura,
        tipoComision: item.general.tipoComision?.title || 'N/A',
        comisionPrimerAnioFijaProv: `${cob.comisionPrimerAnio || 0}%`,
        comisionRenovacionFijaProv: `${cob.comisionRenovacion || 0}%`
      }));
    });
});

const comisionEscalonadaTabla = computed(() => {
  const lista = contratoStore.listaReaseguradoresFinal;
  const todasEscalonadas: any[] = [];

  lista.forEach((item: any) => {
    if (item.comisiones?.comisiones) {

      item.comisiones.comisiones.forEach((c: any) => {
        todasEscalonadas.push({
          idContrato: item.general.idContrato,
          cveReasegurador: item.general.nombreReasegurador,
          desClasifCober: getTX(c.tipoCobertura),
          limiteInf: c.limiteInf + '%',
          limiteSup: c.limiteSup + '%',
          comisionDefinitiva: c.comisionDefinitiva + '%'
        });
      });
    }
  });
  return todasEscalonadas;
});


const intermediariosTablaCompleta = computed(() => {
  const int = contratoStore.configInt;
  if (!int?.intermediariosTabla) return [];
  return int.intermediariosTabla.map((i: any) => ({
    idContrato: int.idContrato,
    cveReasegurador: i.display?.reaseguradora || getTX(i.reaseguradora),
    indIntermediario: getTX(int.intermediario),
    cveCriterioAsig: i.display?.asignacion || getTX(i.asignacionInterm),
    cveIntermediario: i.display?.broker || getTX(i.broker),
    indCorretaje: getTX(i.corretaje),
    cveAsignacion: i.display?.tipo || getTX(i.tipoCorretaje),
    porcentajeCorretaje: (i.corretajeFijo || 0) + '%',
    montoCorretaje: '$ ' + cleanN(i.montoCorreFijo).toLocaleString()
  }))
});

const headersDatosContrato = [
  { title: 'SUBRAMO', key: 'subRamo' }, { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'NEGOCIOS', key: 'negocioCubiertos' },
  { title: 'INICIO', key: 'fechaInicioContrato' }, { title: 'FIN', key: 'fechaFinContrato' }, { title: 'MONEDA', key: 'cveMoneda' },
  { title: 'FORMA CONTRACTUAL', key: 'cveFContrac' }, { title: 'TIPO CONTRATO', key: 'idTContrato' }, { title: 'CRITERIO', key: 'criterioCobertura' },
  { title: 'LIMITE MAXIMO', key: 'limiteMaximoContrato' }, { title: 'LIMITE MAXIMO POR CONTRATO', key: 'limiteMaximoPorContrato' }, { title: 'TIPO REASEGURO', key: 'cveTReaseg' },
  { title: 'RETENCIÓN', key: 'montoRetencion' }, { title: 'PISO', key: 'piso' }, { title: 'TECHO', key: 'techo' }, { title: '% CESIÓN', key: 'porcentajeCesion' }
];

const headersCapasResumen = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'DETALLE CAPA', key: 'detalleCapa' }, { title: 'RETENCIÓN', key: 'montoRetencionCapa' }, { title: 'TECHO', key: 'techoCapa' }
];

const headersPolizasResumen = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'LLAVE', key: 'llavePolRen' }, { title: 'PÓLIZA', key: 'numPoliza' }, { title: 'RENOVACIÓN', key: 'numRenovPol' }
];

const headersReaseguradores = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'PARTICIPACIÓN', key: 'participacion' },
  { title: '¿CESIÓN SOBRE LA COBERTURA BÁSICA?', key: 'indCesionBasica' }, { title: 'DISTRIBUCIÓN SOBRE LA CESIÓN', key: 'cveDistrCesion' }, { title: 'COMISIÓN', key: 'indComisionReaseguro' },
  { title: 'DETALLE COB.', key: 'indDetalleCobertura' }, { title: 'ASIGNACIÓN', key: 'cveAsignacion' }, { title: 'OTORGA PTU', key: 'otrogaPtu' },
  { title: 'MÉTODO PTU', key: 'cvePtu' }, { title: '% PTU', key: 'porcentajePtu' }, { title: '% K', key: 'porcentajeK' }, {title: '%Gastos', key: 'gastos'}, { title: 'AÑOS ARRASTRE', key: 'aniosArrastre' }
];

const headersCoberturas = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'DETALLE CAPA', key: 'detalleCapa' },
  { title: 'TIPO COBERTURA', key: 'descClasifCober' }, { title: 'CLAVE COB', key: 'cveCob' }, { title: 'COBERTURA', key: 'descCob' },
  { title: 'CVE AGRUPAR', key: 'cveAgrupCob' }, { title: 'AGRUPAR EN', key: 'descAgrupCob' }, { title: 'TIPO TARIFA', key: 'cveTarifa' },
  { title: 'PRIMA FIJA', key: 'primaTarifaFija' }, { title: '% SOBRE PRIMA', key: 'porSobrePrima' }, { title: 'TARIFA MILLAR', key: 'tarifaFija' },
  { title: 'FACTOR PROPIA', key: 'factorTarifaPropia' }, { title: 'TARIFA PROPIA', key: 'tarifaPropia' }
];

const headersComisionContrato = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'TIPO COBERTURA', key: 'descClasifCober' },
  { title: '% 1ER AÑO', key: 'comisionPrimerAnioFijaProv' }, { title: '% RENOVACIÓN', key: 'comisionRenovacionFijaProv' }
];

const headersComisionEscalonada = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: 'TIPO COBERTURA', key: 'desClasifCober' },
  { title: 'LÍMITE INF', key: 'limiteInf' }, { title: 'LÍMITE SUP', key: 'limiteSup' }, { title: 'COMISIÓN DEF.', key: 'comisionDefinitiva' }
];

const headersIntermediarios = [
  { title: 'IDENTIFICADOR DE CONTRATO', key: 'idContrato' }, { title: 'REASEGURADORA', key: 'cveReasegurador' }, { title: '¿INTERMEDIARIO?', key: 'indIntermediario' },
  { title: 'ASIGNACIÓN', key: 'cveCriterioAsig' }, { title: 'BROKER', key: 'cveIntermediario' }, { title: '¿CORRETAJE?', key: 'indCorretaje' },
  { title: 'TIPO CORRETAJE', key: 'cveAsignacion' }, { title: '% CORRETAJE', key: 'porcentajeCorretaje' }, { title: 'MONTO CORRETAJE', key: 'montoCorretaje' }
];

// sigue pasando de que solo llegan algunos registros a las comisiones normales, hice dos pruebas si mando 4 registros solo llegan 3, y asi
const procesarComisionesSecuencial = async (listaFinal: any[], idContrato: string) => {
  for (const item of listaFinal) {
    const g = item.general;
    const com = item.comisiones;
    const tieneComision = getID(g.comisionReaseg) == 1;
    const esEscalonada = com?.comisiones && com.comisiones.length > 0;

    if (tieneComision) {
      if (esEscalonada) {
        for (const ce of com.comisiones) {
          await apiComisionEsc.post('register', {
            idContrato: idContrato,
            cveReasegurador: String(getID(g.cveReasegurador)),
            descClasifCober: getTX(ce.tipoCobertura),
            limiteInf: cleanN(ce.limiteInf),
            limiteSup: cleanN(ce.limiteSup),
            comisionDefinitiva: cleanN(ce.comisionDefinitiva)
          });
        }
      } else if (g.coberturas && g.coberturas.length > 0) {
        for (const cob of g.coberturas) {
          await apiComision.post('register', {
            idContrato: idContrato,
            cveReasegurador: String(getID(g.cveReasegurador)),
            descClasifCober: getTX(cob.tipoCobertura),
            comisionPrimerAnioFijaProv: cleanN(cob.comisionPrimerAnio),
            comisionRenovacionFijaProv: cleanN(cob.comisionRenovacion)
          });
        }
      }
    }
  }
};

const guardarEnBD = async () => {
  const authStore = AuthStore();
  if (!authStore.getToken) return;

  try {
    dialog.show({ title: 'Procesando', message: 'Guardando información...', type: DialogType.INFO });

    const gen = contratoStore.general;
    const listaFinal = contratoStore.listaReaseguradoresFinal;
    if (!gen || !listaFinal.length) return;

    const payloadGen = {
      idRamo: "010",
      subRamo: joinByDash(gen.subramo),
      idContrato: gen.idContrato,
      negocioCubiertos: gen.negociosCubiertos,
      fechaInicioContrato: formatF(gen.fechaInicio),
      fechaFinContrato: formatF(gen.fechaFin),
      cveMoneda: getID(gen.cveMoneda),
      cveFContrac: getID(gen.cveFormaContractual),
      idTContrato: getID(gen.idTContrato),
      criterioCobertura: getID(gen.criterioCobertura),
      limiteMaximoContrato: cleanN(gen.limiteMax),
      limiteMaximoPorContrato: cleanN(gen.limiteMaxResCR),
      cveTReaseg: getID(gen.cveTReaseguro),
      montoRetencion: cleanN(gen.montoRetencion),
      piso: cleanN(gen.piso),
      techo: cleanN(gen.techo),
      porcentajeCesion: cleanN(gen.porcentajeCesion)
    };
    await apiDatosContrato.post('register', payloadGen);

    const promsReas: any[] = [];
    const promsCob: any[] = [];

    listaFinal.forEach((item: any) => {
      const g = item.general;
      const c = item.coberturas;
      const p = item.ptu;

      promsReas.push(apiReaseguradoras.post('register', {
        idContrato: gen.idContrato,
        cveReasegurador: String(getID(g.cveReasegurador)),
        participacion: cleanN(g.participacion),
        cveDistrCesion: getID(g.indicadorDistrC),
        indCesionBasica: getID(g.cesionCoberBasi),
        indComisionReaseguro: getID(g.comisionReaseg),
        indDetalleCobertura: getID(g.detalleCobertura),
        cveAsignacion: getID(g.tipoComision),
        otrogaPtu: getID(p?.otorgaPtu),
        cvePtu: getID(p?.metodoCalPTU),
        porcentajePtu: cleanN(p?.ptu),
        porcentajeK: cleanN(p?.kPor),
        aniosArrastre: cleanN(p?.aniosArrastre),
        porcentajeGastos: cleanN(p?.gastos)
      }));

      if (c?.tarifas) {
        c.tarifas.forEach((t: any) => {
          const agrupacionEncontrada = c.agrupaciones?.find((a: any) =>
            a.coberturas?.some((idCob: any) => String(getID(idCob)) === String(getID(t.cveCob)))
          );
          const esMadre = agrupacionEncontrada
            ? String(getID(t.cveCob)) === String(getID(agrupacionEncontrada.madre))
            : false;

          promsCob.push(apiCoberturas.post('register', {
            idContrato: gen.idContrato,
            cveReasegurador: String(getID(g.cveReasegurador)),
            detalleCapa: t.detalleCapa ? String(t.detalleCapa).toUpperCase() : "",
            descClasifCober: getTX(t.tipoCobertura || "BASICA"),
            cveCob: String(getID(t.cveCob)),
            descCob: getTX(t.cobertura),
            cveAgrupCob: (agrupacionEncontrada && !esMadre) ? String(getID(agrupacionEncontrada.madre)) : null,
            descAgrupCob: (agrupacionEncontrada && !esMadre) ? getTX(agrupacionEncontrada.madre) : null,
            cveTarifa: Number(getID(t.tipoTarifa)),
            primaTarifaFija: cleanN(t.primaTarifa),
            porcentajePrimaEmitida: cleanN(t.porSobrePrima),
            tarifaFija: cleanN(t.tarifaFijaM),
            factorTarifaPropia: cleanN(t.factorTap),
            tarifaPropia: getTX(t.nombreArchivo)
          }));
        });
      }
    });
    const promsCapas = (contratoStore.expc?.capas || []).map(c => apiCapas.post('register', {
      idContrato: gen.idContrato,
      detalleCapa: c.detalleCapa,
      montoRetencionCapa: cleanN(c.retencionC),
      techoCapa: cleanN(c.techoC)
    }));

    const promsPolizas = (contratoStore.poli?.polizas || []).map(p => apiPolizas.post('register', {
      idContrato: gen.idContrato,
      llavePolRen: `${p.poliza}|${p.renovacion}`,
      numPoliza: p.poliza,
      numRenovPol: p.renovacion
    }));

    const promsInter = (contratoStore.configInt?.intermediariosTabla || []).flatMap(filaInter => {
      const reaseguradorValor = getID(filaInter.reaseguradora);
      const listaFinalFiltrada = contratoStore.listaReaseguradoresFinal.filter((r: any) => {
         const id = r.general?.cveReasegurador || r.clave;
         return id && String(getID(id)) !== '[object Object]';
      });

      let reaseguradorasAAplicar: string[] = [];

      if (!reaseguradorValor || String(reaseguradorValor) === 'TODAS' || reaseguradorValor == 0) {
        reaseguradorasAAplicar = listaFinalFiltrada.map((r: any) => String(getID(r.general?.cveReasegurador || r.clave)));
      } else {
        reaseguradorasAAplicar = [String(reaseguradorValor)];
      }

      return reaseguradorasAAplicar.map((idReasegurador) => {
        if (!idReasegurador || idReasegurador.includes('[object')) return null;

        return apiIntermediarios.post('register', {
          idContrato: String(gen.idContrato),
          cveReasegurador: idReasegurador,
          indIntermediario: String(getID(contratoStore.configInt?.intermediario) ?? "0"),
          cveCriterioAsig: Number(getID(filaInter.asignacionInterm) ?? 0),
          cveIntermediario: String(getID(filaInter.broker) ?? ""),
          indCorretaje: Number(getID(filaInter.corretaje) ?? 0),
          cveAsignacion: Number(getID(filaInter.tipoCorretaje) ?? 0),
          porcentajeCorretaje: cleanN(filaInter.corretajeFijo),
          montoCorretaje: cleanN(filaInter.montoCorreFijo)
        });
      }).filter(p => p !== null);
    });
    await Promise.all([
        ...promsReas,
        ...promsCob,
        ...promsCapas,
        ...promsPolizas,
        ...promsInter
      ]);

    await procesarComisionesSecuencial(listaFinal, gen.idContrato);

    await dialog.show({
      title: 'ÉXITO',
      message: 'Contrato guardado correctamente.',
      type: DialogType.SUCCESS
    });

    contratoStore.reset();
    modalResumen.value = false;
    window.location.reload();

  } catch (error: any) {
    console.error("ERROR AL GUARDAR:", error);
    dialog.show({ title: 'ERROR', message: `No se pudo guardar: ${error.message || error}`, type: DialogType.ERROR });
  }
};

const abrirResumen = () => { modalResumen.value = true }
defineExpose({ abrirResumen })

const apiDatosContrato = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/DatosContratoRest', isBase: true, isPrivate: true });
const apiCapas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ExcedentePorCapasRest', isBase: true, isPrivate: true });
const apiPolizas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/PolizasFacuRest', isBase: true, isPrivate: true });
const apiReaseguradoras = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ReaseguradorasRest', isBase: true, isPrivate: true });
const apiCoberturas = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/CoberturasRest', isBase: true, isPrivate: true });
const apiComision = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ComisionRest', isBase: true, isPrivate: true });
const apiComisionEsc = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/ComisionEscalonadaRest', isBase: true, isPrivate: true });
const apiIntermediarios = BaseAPI({ prefix: 'ws_reaseguro_contratos_vida/api/v1/IntermediariosRest', isBase: true, isPrivate: true });
</script>
