<template>
  <v-form ref="formRef">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasBasiObj"
            :items="coberturasBasicasOptions"
            label="Coberturas básicas"
            item-title="title"
            return-object
            multiple
            chips
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="coberturasAdiciObj"
            :items="coberturasAdicionalesOptions"
            label="Coberturas adicionales"
            item-title="title"
            return-object
            multiple
            chips
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCapa"
            :items="siNoOptions"
            label="¿Detalle por capa?"
            chips
            :disabled="!esExcedentePorCapas"
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="4" v-if="detalleCapa === 1">
          <v-select
            v-model="capaSeleccionada"
            :items="detalleCOptions"
            chips
            label="Detalle de capa"
            :rules="[v => (detalleCapa === 1 ? !!v : true) || 'Seleccione una capa']"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="detalleCobertura"
            :items="siNoOptions"
            chips
            label="¿Detalle por cobertura?"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4" v-if="detalleCobertura === 1">
          <v-select
            v-model="coberturaTarifaObj"
            label="Cobertura"
            :items="coberturasPermitidasParaTarifa"
            item-title="title"
            chips
            return-object
            hide-selected
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="tipoTarifaObj"
            :items="tipoTarifaOptions"
            label="Tipo de tarifa"
            item-title="title"
            chips
            return-object
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 0">
          <v-text-field v-model.number="primaTarFi" label="Monto Fijo" type="number" variant="solo-filled" :rules="[ValidacionesContrato.numeroC21()]" />
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 1">
          <v-text-field v-model.number="porSobrePrimaE" label="% Prima" suffix="%" type="number" variant="solo-filled" :rules="[ValidacionesContrato.participacion()]"/>
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 3">
          <v-text-field v-model.number="tarifaFijaM" label="Tasa al millar" type="number" variant="solo-filled" :rules="[ValidacionesContrato.tasaAlMillar()]"/>
        </v-col>
        <v-col cols="12" md="4" v-if="tipoTarifaObj?.value === 2">
          <v-text-field v-model.number="factorTarifaP" label="Factor %" type="number" variant="solo-filled" :rules="[ValidacionesContrato.participacion()]"/>
        </v-col>

        <v-col cols="12" md="5" v-if="tipoTarifaObj?.value === 2">
          <v-select
            v-model="tarifaPropiaObj"
            :items="tarifasPropiasOptions"
            item-title="title"
            return-object
            label="Tarifa propia"
            chips
            multiple
            clearable
            variant="solo-filled"
            :rules="[v => !!v || 'Debe seleccionar una tarifa propia']"
          >
            <template v-slot:append>
              <router-link to="/reaseguro/configuracion_tarifas" style="text-decoration: none;">
                <v-icon>mdi-help-circle-outline</v-icon>
                <v-tooltip activator="parent" location="top" max-width="350">
                  Si requiere agregar o modificar algun archivo de la lista antes de seleccionarlo presione aqui
                </v-tooltip>
              </router-link>
            </template>
        </v-select>
        </v-col>

        <v-col cols="12" md="1" class="d-flex align-center">
          <v-btn color="indigo" icon @click="agregarTarifa">
            <v-icon>{{ editandoIndex !== -1 ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editandoIndex !== -1 ? 'Actualizar registro' : 'Agregar detalle tarifa' }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="itemsTablaTarifas.length > 0">
        <v-col cols="12">
          <v-data-table
            :headers="headers2"
            :items="itemsTablaTarifas"
            class="elevation-1"
          >
            <template #item.tipoTarifa="{ item }">
              {{ item.tipoTarifa?.title }}
            </template>

            <template #item.primaTarifa="{ item }">
              <span v-if="item.tipoTarifa?.value === 0">$ {{ item.primaTarifa }}</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.porSobrePrima="{ item }">
              <span v-if="item.tipoTarifa?.value === 1">{{ item.porSobrePrima }}%</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.tarifaFijaM="{ item }">
              <span v-if="item.tipoTarifa?.value === 3">{{ item.tarifaFijaM }}</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.factorTap="{ item }">
              <span v-if="item.tipoTarifa?.value === 2">{{ item.factorTap }}%</span>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.tarifaPropia="{ item }">
              <div v-if="item.tipoTarifa?.value === 2 && item.nombreArchivo">
                <v-icon size="small" color="green" class="mr-1">mdi-file-csv</v-icon>
                <small>{{ item.nombreArchivo }}</small>
              </div>
              <span v-else class="text-grey">-</span>
            </template>

            <template #item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" size="small" @click="editarTarifa(item, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" variant="text" size="small" @click="eliminarTarifa(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <br>
      <v-divider />
      <br>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="4">
          <v-select
            v-model="agrupacionCoberturas"
            :items="siNoOptions"
            label="¿Agrupación de coberturas?"
            chips
            variant="solo-filled"
            @update:model-value="guardarAgrupacion = false"
          />
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center align-center" v-if="agrupacionCoberturas === 1">
        <v-col cols="12" md="5">
          <p class="text-subtitle-2 mb-2">Coberturas para agrupar:</p>
          <v-data-table
            v-model="coberturasParaAgrupar"
            :headers="[{ title: 'Coberturas Disponibles', key: 'title' }]"
            :items="coberturasDisponiblesParaAgrupar"
            show-select
            item-value="value"
            select-strategy="page"
            return-object
            density="compact"
            max-height="300px"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="coberturaMadreObj"
            :items="coberturasDisponiblesParaAgrupar"
            item-title="title"
            chips
            return-object
            label="Agrupar en (Cobertura Madre):"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn color="indigo" icon @click="agregarAgrupacion">
            <v-icon>{{ editandoAgrupacionIndex !== null ? 'mdi-check' : 'mdi-plus' }}</v-icon>
            <v-tooltip activator="parent" location="top">
              {{ editandoAgrupacionIndex !== null ? 'Actualizar registro' : 'Agregar a la tabla' }}
            </v-tooltip>
          </v-btn>
        </v-col>

        <v-col cols="12" md="10" v-if="agrupaciones.length > 0">
          <v-data-table :headers="headersAgrupacion" :items="agrupaciones" hide-default-footer>
            <template v-slot:item.coberturas="{ item }">
              {{ item.coberturas.map((c: any) => c.title).join(', ') }}
            </template>
            <template v-slot:item.madre="{ item }">
              <v-chip color="primary" label>{{ item.madre?.title }}</v-chip>
            </template>
            <template v-slot:item.acciones="{ item, index }">
              <v-btn icon color="blue" variant="text" @click="editarAgrupacion(item, index)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon color="red" variant="text" @click="eliminarAgrupacion(index)"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center align-center" v-if="agrupacionCoberturas === 1">
        <v-col cols="12" md="4" class="text-center">
          <v-btn color="primary" @click="confirmarAgrupacion">Guardar Agrupación</v-btn>
        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col class="text-center">
          <v-btn class="btn-guardar" @click="guardarTodoEnStore">
            ACTUALIZAR COBERTURAS
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useContratoStore } from "@/stores/reaseguro/contratos/vidaStore"
import { DialogType, useDialog } from "@/stores/general/dialogStore"
import { NuevoContratoVidaConR } from '@/pages/reaseguro/Contratos/Vida/NuevoContratoVida/NuevoContratoConfigR.actions'
import { ValidacionesContrato } from '@/pages/reaseguro/Contratos/Vida/NuevoContratoVida/ValidacionesContrato'

const emits = defineEmits<{
  (e: 'on-save-complete'): void
}>();

const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref()

const {
  coberturasOptions, fetchCoberturas,
  coberturasBasiOptions, fetchCoberturasBasicas,
  coberturasAdiciOptions, fetchCoberturasAdicionales,
  tipoTarifaOptions, fetchTipoTarifa,
  tarifasPropiasOptions, fetchTarifaPropia
} = NuevoContratoVidaConR()

const agrupacionCoberturas = ref(0)
const guardarAgrupacion = ref(false)
const coberturasParaAgrupar = ref<any[]>([])
const coberturaMadreObj = ref<any>(null)
const agrupaciones = ref<any[]>([])

const coberturasBasiObj = ref<any[]>([])
const coberturasAdiciObj = ref<any[]>([])
const detalleCapa = ref(0)
const capaSeleccionada = ref<string | null>(null)

const detalleCobertura = ref(0)
const coberturaTarifaObj = ref<any>(null)
const tipoTarifaObj = ref<any>(null)

const primaTarFi = ref<number>(0)
const porSobrePrimaE = ref<number>(0)
const tarifaFijaM = ref<number>(0)
const factorTarifaP = ref<number>(0)
const tarifaPropiaObj = ref<any[]>([])

const itemsTablaTarifas = ref<any[]>([])
const editandoIndex = ref(-1)
const editandoAgrupacionIndex = ref<number | null>(null)

const siNoOptions = [{ title: 'SI', value: 1 }, { title: 'NO', value: 0 }]

const getID = (item: any) => {
  if (!item) return null;
  return (typeof item === 'object' && 'value' in item) ? item.value : item;
}

const coberturasBasicasOptions = computed(() => {
  if (agrupacionCoberturas.value === 0) return coberturasBasiOptions.value;
  const idsMadres = agrupaciones.value.map(a => getID(a.madre));
  return coberturasBasiOptions.value.filter(c => idsMadres.includes(c.value));
});

const coberturasAdicionalesOptions = computed(() => {
  const idsSeleccionadosBasi = coberturasBasiObj.value.map(c => getID(c));
  return coberturasAdiciOptions.value.filter(c => !idsSeleccionadosBasi.includes(c.value));
});

const todasLasSeleccionadas = computed(() => {
  return [...(coberturasBasiObj.value || []), ...(coberturasAdiciObj.value || [])];
});

watch(todasLasSeleccionadas, (newList) => {
  const idsVivos = newList.map(c => getID(c));

  agrupaciones.value = agrupaciones.value
    .filter(a => idsVivos.includes(getID(a.madre)))
    .map(a => ({
      ...a,
      coberturas: a.coberturas.filter((c: any) => idsVivos.includes(getID(c)))
    }))
    .filter(a => a.coberturas.length > 0);
}, { deep: true });

const coberturasDisponiblesParaAgrupar = computed(() => {
  const idsMadres = agrupaciones.value.map(a => getID(a.madre));
  const idsHijas = agrupaciones.value.flatMap(a => a.coberturas.map((c: any) => getID(c)));

  const idsEnUso = [...idsMadres, ...idsHijas];

  return todasLasSeleccionadas.value.filter(c => !idsEnUso.includes(getID(c)));
});

const coberturasPermitidasParaTarifa = computed(() => {
  const idsPermitidos = [...coberturasBasiObj.value.map(c => getID(c)), ...coberturasAdiciObj.value.map(c => getID(c))];
  return coberturasOptions.value.filter(c => idsPermitidos.includes(c.value));
});

const esExcedentePorCapas = computed(() => Number(getID(contratoStore.general?.idTContrato)) === 3);
const detalleCOptions = computed(() => contratoStore.expc?.capas.map(c => ({ title: c.detalleCapa, value: c.detalleCapa })) || []);

watch(() => getID(tipoTarifaObj.value), (tipo) => {
  primaTarFi.value = 0;
  tarifaFijaM.value = 0;
  porSobrePrimaE.value = tipo === 1 ? 100 : 0;
  factorTarifaP.value = tipo === 2 ? 100 : 0;
  if (tipo !== 2) tarifaPropiaObj.value = [];
});

const hidratarDesdeStore = () => {
  const data = contratoStore.configReasegCob;
  if (!data || Object.keys(data).length === 0) return;

  agrupacionCoberturas.value = data.agrupacionCoberturas ?? 0;
  agrupaciones.value = data.agrupaciones || [];
  coberturasBasiObj.value = data.coberturasBasi || [];
  coberturasAdiciObj.value = data.coberturasAdici || [];
  detalleCapa.value = data.detalleCapa ?? 0;
  detalleCobertura.value = data.detalleCobertura ?? 0;
  itemsTablaTarifas.value = data.tarifas ? [...data.tarifas] : [];
};

watch([coberturasOptions, tipoTarifaOptions], ([c, t]) => {
  if (c.length > 0 && t.length > 0) hidratarDesdeStore();
}, { immediate: true });


const agregarAgrupacion = () => {
  if (coberturasParaAgrupar.value.length === 0 || !coberturaMadreObj.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Faltan datos de agrupación', title: 'Error' });
    return;
  }
  agrupaciones.value.push({
    coberturas: [...coberturasParaAgrupar.value],
    madre: { ...coberturaMadreObj.value }
  });
  coberturasParaAgrupar.value = [];
  coberturaMadreObj.value = null;
};

const editarAgrupacion = (item: any, index: number) => {

  const seleccionadas = item.coberturas.map((guardada: any) => {
    return coberturasDisponiblesParaAgrupar.value.find(
      (disponible: any) => String(disponible.value) === String(guardada.value)
    ) || guardada;
  });

  const madreEncontrada = coberturasDisponiblesParaAgrupar.value.find(
    (disponible: any) => String(disponible.value) === String(item.madre.value)
  ) || item.madre;

  coberturasParaAgrupar.value = seleccionadas;
  coberturaMadreObj.value = madreEncontrada;

  eliminarAgrupacion(index);

  editandoAgrupacionIndex.value = null;
};

const eliminarAgrupacion = (index: number) => {
  const agrupacionEliminada = agrupaciones.value.splice(index, 1)[0];

  agrupacionEliminada.coberturas.forEach((cobertura: any) => {
    if (cobertura.tipo === 'basica') {
      coberturasBasiObj.value.push(cobertura);
    } else if (cobertura.tipo === 'adicional') {
      coberturasAdiciObj.value.push(cobertura);
    }
  });
};

watch(agrupacionCoberturas, (newValue) => {
  if (newValue === 0) {
    coberturasParaAgrupar.value = [];
    coberturaMadreObj.value = null;
    agrupaciones.value = [];
    editandoAgrupacionIndex.value = null;

    console.log("Se han reseteado todas las agrupaciones porque se marcó 'No'");
  }
});

const confirmarAgrupacion = () => {
  if (agrupaciones.value.length === 0) {
    dialog.show({ type: DialogType.ERROR, message: 'Debe realizar al menos una agrupación.', title: 'Error' });
    return;
  }
  guardarAgrupacion.value = true;
  dialog.show({ type: DialogType.SUCCESS, message: 'Agrupación confirmada.', title: 'Éxito' });
};

const obtenerAnioVigencia = () => {
  const fecha = contratoStore.general?.fechaInicio;
  if (!fecha) return new Date().getFullYear();
  return new Date(fecha).getFullYear();
};

const generarNombreDefaultArchivo = (nombreCob: string) => {
  const anio = obtenerAnioVigencia();
  return `${nombreCob.toUpperCase().replace(/\s+/g, '_')}_${anio}`;
};

/*const agregarTarifa = () => {
  const idTipoTarifa = getID(tipoTarifaObj.value);
  const textoTarifa = tipoTarifaObj.value?.title || '';

  if (idTipoTarifa === null) {
    dialog.show({ type: DialogType.ERROR, message: 'Seleccione un tipo de tarifa', title: 'Error' });
    return;
  }

  if (detalleCapa.value === 1 && !capaSeleccionada.value) {
    dialog.show({
      type: DialogType.ERROR,
      message: 'Debe seleccionar una capa para continuar.',
      title: 'Dato obligatorio'
    });
    return;
  }

  const capaActual = detalleCapa.value === 1 ? (capaSeleccionada.value || 'SI') : 'NO';
  const esTipoQX = textoTarifa.includes('TARIFA PROPIA TIPO QX') || idTipoTarifa === 2;

  let coberturasAProcesar: any[] = [];
  if (detalleCobertura.value === 0) {
    coberturasAProcesar = [...coberturasBasiObj.value, ...coberturasAdiciObj.value];
    itemsTablaTarifas.value = [];
  } else {
    if (!coberturaTarifaObj.value) return;
    coberturasAProcesar = [coberturaTarifaObj.value];
  }

  coberturasAProcesar.forEach(cob => {
    const idCob = getID(cob);
    const esBasica = coberturasBasiObj.value.some(c => getID(c) == idCob);
    const nombreDefault = generarNombreDefaultArchivo(cob.title);

    let listaNombres: string[] = [];
    if (esTipoQX) {
      listaNombres = tarifaPropiaObj.value.length > 0
        ? tarifaPropiaObj.value.map(a => a.title)
        : [nombreDefault];
    } else {
      listaNombres = [tarifaPropiaObj.value.length > 0 ? tarifaPropiaObj.value[0].title : ''];
    }

    listaNombres.forEach((nombreRef, indexArchivo) => {
      const duplicado = itemsTablaTarifas.value.some((item, index) => {
        if (editandoIndex.value !== -1 && index === editandoIndex.value) return false;
        const mismaCob = item.cveCob === idCob;
        const mismaCapa = item.detalleCapa === capaActual;

        if (esTipoQX) {
          return mismaCob && mismaCapa && item.nombreArchivo === nombreRef;
        } else {
          return mismaCob && mismaCapa;
        }
      });

      if (duplicado && detalleCobertura.value === 1) {
        let mensajeError = '';

        if (esExcedentePorCapas.value && detalleCapa.value === 1) {
          mensajeError = `La cobertura ${cob.title} ya tiene la tarifa ${nombreRef} asignada en la capa ${capaActual}.`;
        } else {
          mensajeError = `La cobertura ${cob.title} ya cuenta con una tarifa asignada.`;
        }
        dialog.show({
          type: DialogType.ERROR,
          message: mensajeError,
          title: 'Registro Duplicado'
        });
        return;
      }

      const nuevaFila = {
        detalleCapa: capaActual,
        tipoCobertura: esBasica ? 'BASICA' : 'BADI',
        cobertura: cob.title || '',
        cveCob: idCob,
        tipoTarifa: { ...tipoTarifaObj.value },
        primaTarifa: primaTarFi.value,
        porSobrePrima: porSobrePrimaE.value,
        tarifaFijaM: tarifaFijaM.value,
        factorTap: factorTarifaP.value,
        nombreArchivo: nombreRef,
        tarifaPropia: nombreRef
      };

      if (editandoIndex.value > -1 && indexArchivo === 0) {
        itemsTablaTarifas.value[editandoIndex.value] = nuevaFila;
        editandoIndex.value = -1;
      } else {
        itemsTablaTarifas.value.push(nuevaFila);
      }
    });
  });

  if (detalleCobertura.value === 1) limpiarTarifa();
};*/

const agregarTarifa = () => {
  const idTipoTarifa = getID(tipoTarifaObj.value);
  const textoTarifa = tipoTarifaObj.value?.title || '';

  if (idTipoTarifa === null) {
    dialog.show({ type: DialogType.ERROR, message: 'Seleccione un tipo de tarifa', title: 'Error' });
    return;
  }

  if (detalleCapa.value === 1 && !capaSeleccionada.value) {
    dialog.show({ type: DialogType.ERROR, message: 'Debe seleccionar una capa para continuar.', title: 'Dato obligatorio' });
    return;
  }

  let capasAProcesar: string[] = [];

  if (esExcedentePorCapas.value) {
    if (detalleCapa.value === 1) {
      if (!capaSeleccionada.value) {
        return dialog.show({ type: DialogType.ERROR, message: 'Debe seleccionar una capa para continuar.', title: 'Dato obligatorio' });
      }
      capasAProcesar = [capaSeleccionada.value];
    } else {
      capasAProcesar = contratoStore.expc?.capas.map(c => c.detalleCapa || '').filter(Boolean) || [];
    }

    if (capasAProcesar.length === 0) {
      return dialog.show({
        type: DialogType.ERROR,
        message: 'No se encontraron capas configuradas en el contrato.',
        title: 'Error'
      });
    }
    } else {
      capasAProcesar = ['NO'];
    }

  let coberturasAProcesar: any[] = [];
  if (detalleCobertura.value === 0) {
    coberturasAProcesar = [...coberturasBasiObj.value, ...coberturasAdiciObj.value];
  } else {
    if (!coberturaTarifaObj.value) return;
    coberturasAProcesar = [coberturaTarifaObj.value];
  }

  const hayDuplicados = coberturasAProcesar.some(cob => {
    const idCob = getID(cob);
    return capasAProcesar.some(capa =>
      itemsTablaTarifas.value.some(item => item.cveCob === idCob && item.detalleCapa === capa)
    );
  });

  const ejecutarGuardado = () => {
    const esTipoQX = textoTarifa.includes('TARIFA PROPIA TIPO QX') || idTipoTarifa === 2;

    coberturasAProcesar.forEach(cob => {
      const idCob = getID(cob);
      const esBasica = coberturasBasiObj.value.some(c => getID(c) == idCob);
      const nombreDefault = generarNombreDefaultArchivo(cob.title);

      let listaNombres = esTipoQX
        ? (tarifaPropiaObj.value.length > 0 ? tarifaPropiaObj.value.map(a => a.title) : [nombreDefault])
        : [tarifaPropiaObj.value[0]?.title || ''];

      capasAProcesar.forEach(capaActual => {
        listaNombres.forEach((nombreRef) => {
          const indiceDuplicado = itemsTablaTarifas.value.findIndex(item =>
            item.cveCob === idCob && item.detalleCapa === capaActual
          );

          const nuevaFila = {
            detalleCapa: capaActual, // Se guarda el nombre de la capa (ej. "1er Excedente")
            tipoCobertura: esBasica ? 'BASICA' : 'BADI',
            cobertura: cob.title || '',
            cveCob: idCob,
            tipoTarifa: { ...tipoTarifaObj.value },
            primaTarifa: primaTarFi.value,
            porSobrePrima: porSobrePrimaE.value,
            tarifaFijaM: tarifaFijaM.value,
            factorTap: factorTarifaP.value,
            nombreArchivo: nombreRef,
            tarifaPropia: nombreRef
          };

          if (indiceDuplicado !== -1) {
            itemsTablaTarifas.value[indiceDuplicado] = nuevaFila;
          } else {
            itemsTablaTarifas.value.push(nuevaFila);
          }
        });
      });
    });
    limpiarTarifa();
  };

  if (hayDuplicados) {
    const msg = detalleCapa.value === 0
      ? 'Se actualizarán las tarifas para todas las capas existentes. ¿Desea continuar?'
      : 'Esta combinación de cobertura y capa ya existe. ¿Desea actualizarla?';

    dialog.show({
      title: 'Confirmar Actualización',
      message: msg,
      type: DialogType.CONFIRM,
      onConfirm: ejecutarGuardado
    });
  } else {
    ejecutarGuardado();
  }
};

const limpiarTarifa = () => {
  coberturaTarifaObj.value = null;
  tipoTarifaObj.value = null;
  primaTarFi.value = 0;
  tarifaPropiaObj.value = [];
  capaSeleccionada.value = null;
};

const editarTarifa = (item: any, index: number) => {
  editandoIndex.value = index;
  detalleCOptions.value.forEach(c => {
    if (c.title === item.detalleCapa) {
      capaSeleccionada.value = c.value;
    }
  });

  detalleCobertura.value = item.detalleCapa === 'NO' ? 0 : 1;
  coberturaTarifaObj.value = coberturasOptions.value.find(c => c.value === item.cveCob) || null;
  tipoTarifaObj.value = item.tipoTarifa;
  primaTarFi.value = item.primaTarifa;
  porSobrePrimaE.value = item.porSobrePrima;
  tarifaFijaM.value = item.tarifaFijaM;
  factorTarifaP.value = item.factorTap;
  tarifaPropiaObj.value = item.nombreArchivo
    ? [{ title: item.nombreArchivo }]
    : [];
}

const eliminarTarifa = (index: number) => itemsTablaTarifas.value.splice(index, 1)


const guardarTodoEnStore = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const idContrato = contratoStore.general?.idContrato;
  if (!idContrato) {
    dialog.show({ type: DialogType.ERROR, message: 'Falta ID del contrato', title: 'Error' });
    return;
  }

  const idsRequeridos = [
    ...coberturasBasiObj.value.map(c => getID(c)),
    ...coberturasAdiciObj.value.map(c => getID(c))
  ];

  if (idsRequeridos.length === 0) {
    dialog.show({
      type: DialogType.ERROR,
      message: 'Debe seleccionar al menos una cobertura (Básica o Adicional) antes de guardar.',
      title: 'Configuración incompleta'
    });
    return;
  }

  let tarifasFinales: any[] = [];

  if (itemsTablaTarifas.value.length > 0) {
    tarifasFinales = [...itemsTablaTarifas.value];

    const idsEnTabla = tarifasFinales.map(t => t.cveCob);
    const faltantes = idsRequeridos.filter(id => !idsEnTabla.includes(id));

    if (faltantes.length > 0) {
      dialog.show({
        type: DialogType.ERROR,
        title: 'Coberturas sin Tarifa',
        message: 'Existen coberturas seleccionadas que no tienen una tarifa asignada.'
      });
      return;
    }
  }
  else if (detalleCobertura.value === 0) {
    const idTipoTarifa = getID(tipoTarifaObj.value);

    if (!idTipoTarifa) {
      dialog.show({
        type: DialogType.ERROR,
        message: 'No se ha definido un tipo de tarifa para asignar a las coberturas seleccionadas.',
        title: 'Faltan datos'
      });
      return;
    }

    tarifasFinales = idsRequeridos.map(id => {
      const cobOriginal = [...coberturasBasiOptions.value, ...coberturasAdiciOptions.value].find(c => getID(c) === id);
      const esBasica = coberturasBasiObj.value.some(c => getID(c) === id);
      const nombreRef = tarifaPropiaObj.value.length > 0 ? tarifaPropiaObj.value[0].title : null;

      return {
        detalleCapa: detalleCapa.value === 1 ? (capaSeleccionada.value || 'SI') : 'NO',
        tipoCobertura: esBasica ? 'BASICA' : 'BADI',
        cobertura: cobOriginal?.title || '',
        cveCob: id,
        tipoTarifa: { ...tipoTarifaObj.value },
        primaTarifa: primaTarFi.value,
        porSobrePrima: porSobrePrimaE.value,
        tarifaFijaM: tarifaFijaM.value,
        factorTap: factorTarifaP.value,
        nombreArchivo: nombreRef,
        tarifaPropia: nombreRef
      };
    });
  }

  else {
    dialog.show({
      type: DialogType.ERROR,
      message: 'Debe agregar al menos una tarifa a la tabla técnica.',
      title: 'Faltan datos'
    });
    return;
  }

  const payload = {
    idContrato,
    agrupacionCoberturas: agrupacionCoberturas.value,
    agrupaciones: agrupaciones.value,
    coberturasBasi: coberturasBasiObj.value,
    coberturasAdici: coberturasAdiciObj.value,
    detalleCapa: detalleCapa.value,
    detalleC: contratoStore.expc?.capas || [],
    detalleCobertura: detalleCobertura.value,
    tarifas: tarifasFinales
  };

  contratoStore.setConfigReasCob(payload);
  itemsTablaTarifas.value = tarifasFinales;

  dialog.show({
    type: DialogType.SUCCESS,
    message: 'Configuración guardada exitosamente.',
    title: 'Éxito'
  });
  emits('on-save-complete');
};


onMounted(async () => {
  await Promise.all([
    fetchCoberturas(),
    fetchCoberturasBasicas(),
    fetchCoberturasAdicionales(),
    fetchTipoTarifa(),
    fetchTarifaPropia()
  ]);
});

const headersAgrupacion = [
  { title: 'Coberturas', key: 'coberturas' },
  { title: 'Agrupar en:', key: 'madre' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const headers2 = [
  { title: 'Detalle capa', key: 'detalleCapa' },
  { title: 'Tipo cobertura', key: 'tipoCobertura' },
  { title: 'Cobertura', key: 'cobertura' },
  { title: 'Tipo de tarifa', key: 'tipoTarifa' },
  { title: 'Prima Fija', key: 'primaTarifa' },
  { title: '% Prima Em.', key: 'porSobrePrima' },
  { title: 'Tarifa al Millar', key: 'tarifaFijaM' },
  { title: 'Factor Propio', key: 'factorTap' },
  { title: 'Tarifa Propia', key: 'tarifaPropia' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]
</script>
