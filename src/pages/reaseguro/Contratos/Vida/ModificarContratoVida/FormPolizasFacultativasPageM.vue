<template>
  <v-dialog v-model="mostrarAdvertencia" persistent max-width="500">
    <v-card>
      <v-card-title class="text-h5 bg-blue text-white">
        <v-icon start>mdi-alert</v-icon> Aviso de Rendimiento
      </v-card-title>
      <v-card-text class="pt-4">
        La base de datos contiene un volumen alto de registros. El proceso de filtrado por las fechas seleccionadas para el contrato
        <strong>puede tardar varios minutos</strong>. ¿Desea iniciar la carga ahora?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="mostrarAdvertencia = false">Cerrar</v-btn>
        <v-btn color="indigo" variant="elevated" @click="confirmarCarga">Cargar Datos</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-overlay :model-value="estaCargando" class="align-center justify-center" persistent>
    <div class="text-center">
      <v-progress-circular color="white" indeterminate size="64" width="7" />
      <div class="text-white text-h6 mt-4">Procesando registros...</div>
    </div>
  </v-overlay>

  <v-form ref="formRef" :disabled="estaCargando">
    <v-container>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="5">
          <v-select
            v-model="polizaInput"
            label="Póliza"
            :items="polizaOptions"
            :rules="[v => !!v || 'Campo requerido']"
            variant="solo-filled"
            maxlength="20"
            no-data-text="No hay pólizas que coincidan"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="renovacionInput"
            label="Renovación"
            :items="renovacionOptions"
            :rules="[v => v !== null || 'Campo requerido']"
            variant="solo-filled"
            no-data-text="Seleccione una póliza primero"
          />
        </v-col>

        <v-col cols="12" md="1">
          <v-btn
            color="indigo"
            icon="mdi-plus"
            size="small"
            @click="agregarPoliza"
            :disabled="!polizaInput || renovacionInput === null"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <v-data-table :headers="headers1" :items="polizas" class="elevation-1 mt-4" hide-default-footer>
    <template #item.modificar="{ item, index }">
      <v-btn variant="text" color="blue" icon="mdi-pencil" @click="editarPoliza(item, index)" />
    </template>
    <template #item.borrar="{ index }">
      <v-btn variant="text" color="red" icon="mdi-delete" @click="eliminarPoliza(index)" />
    </template>
  </v-data-table>

  <v-col class="text-center mt-6">
    <v-btn class="btn-guardar" :disabled="polizas.length === 0" @click="guardarDatosGenerales">
      Actualizar polizas
    </v-btn>
  </v-col>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useContratoStore } from "@/stores/reaseguro/contratos/vidaStore"
import { DialogType, useDialog } from "@/stores/general/dialogStore"
import { NuevoContratoVida, type EmisionContable } from '@/pages/reaseguro/Contratos/Vida/NuevoContratoVida/NuevoContratoDG.actions'

interface PolizaItem {
  poliza: string
  renovacion: number
}

const { fetchEmisionContable } = NuevoContratoVida()
const contratoStore = useContratoStore()
const dialog = useDialog()
const formRef = ref<any>(null)

const mostrarAdvertencia = ref(true)
const estaCargando = ref(false)
const emisiones = ref<EmisionContable[]>([])

const polizas = ref<PolizaItem[]>([])
const polizaEditando = ref<number | null>(null)

const polizaInput = ref<string | null>(null)
const renovacionInput = ref<number | null>(null)

const fechaInicioContrato = computed(() => contratoStore.general?.fechaInicio)
const fechaFinContrato = computed(() => contratoStore.general?.fechaFin)

const normalizarFecha = (fecha: string | undefined | null): string => {
  if (!fecha) return ''
  return new Date(fecha).toISOString().split('T')[0] ?? ''
}

const confirmarCarga = async () => {
  mostrarAdvertencia.value = false
  await ejecutarConsulta()
}

const ejecutarConsulta = async () => {
  const fInicio = fechaInicioContrato.value
  const fFin = fechaFinContrato.value

  if (!fInicio || !fFin) {
    dialog.show({ title: 'Atención', message: 'Faltan fechas en sección General', type: DialogType.ERROR })
    return
  }

  const fi: string = normalizarFecha(fInicio)
  const ff: string = normalizarFecha(fFin)

  estaCargando.value = true
  try {
    emisiones.value = await fetchEmisionContable(fi, ff)
  } catch (error) {
    dialog.show({ title: 'Error', message: 'Error al conectar con el servidor', type: DialogType.ERROR })
  } finally {
    estaCargando.value = false
  }
}

watch([fechaInicioContrato, fechaFinContrato], () => {
  if (!mostrarAdvertencia.value) ejecutarConsulta()
})

const polizaOptions = computed(() => {
  const fi = normalizarFecha(fechaInicioContrato.value)
  const ff = normalizarFecha(fechaFinContrato.value)
  const unicos = new Map()

  emisiones.value.forEach(e => {
    if (normalizarFecha(e.fintVigPol) === fi &&
        normalizarFecha(e.ffinVigPol) === ff) {
      const numPoliza = e.numPoliza || 'S/N'
      unicos.set(numPoliza, { title: numPoliza, value: numPoliza })
    }
  })
  return Array.from(unicos.values())
})

const renovacionOptions = computed(() => {
  if (!polizaInput.value) return []

  const fi = normalizarFecha(fechaInicioContrato.value)
  const ff = normalizarFecha(fechaFinContrato.value)

  const emisionesFiltradas = emisiones.value.filter(e =>
    e.numPoliza === polizaInput.value &&
    normalizarFecha(e.fintVigPol) === fi &&
    normalizarFecha(e.ffinVigPol) === ff
  )

  const unicos = new Map()

  emisionesFiltradas.forEach(e => {
    const renovacion = e.numRenovPol

    const yaEstaEnTabla = polizas.value.some(p =>
      String(p.poliza).trim() === String(polizaInput.value).trim() &&
      Number(p.renovacion) === Number(renovacion)
    )

    if (!yaEstaEnTabla && !unicos.has(renovacion)) {
      unicos.set(renovacion, {
        title: renovacion.toString(),
        value: renovacion
      })
    }
  })

  return Array.from(unicos.values())
})

watch(polizaInput, () => {
  if (polizaEditando.value === null) renovacionInput.value = null
})

const headers1 = [
  { title: 'Póliza', key: 'poliza' },
  { title: 'Renovación', key: 'renovacion' },
  { title: 'Modificar', key: 'modificar', sortable: false },
  { title: 'Borrar', key: 'borrar', sortable: false },
]

const agregarPoliza = () => {
  if (!polizaInput.value || renovacionInput.value === null) return

  const polizaNueva = String(polizaInput.value).trim()
  const renovacionNueva = Number(renovacionInput.value)

  // La validación ahora es por AMBOS campos estrictamente
  const duplicadoExacto = polizas.value.some((p, index) => {
    if (polizaEditando.value !== null && index === polizaEditando.value) return false

    return String(p.poliza).trim() === polizaNueva &&
           Number(p.renovacion) === renovacionNueva
  })

  if (duplicadoExacto) {
    dialog.show({
      title: 'Registro Duplicado',
      message: `La póliza ${polizaNueva} ya cuenta con la renovación ${renovacionNueva} en la lista.`,
      type: DialogType.ERROR
    })
    return
  }

  // Si llegamos aquí, es una renovación nueva (aunque la póliza sea repetida)
  const item: PolizaItem = {
    poliza: polizaNueva,
    renovacion: renovacionNueva
  }

  if (polizaEditando.value !== null) {
    polizas.value[polizaEditando.value] = item
    polizaEditando.value = null
  } else {
    polizas.value.push(item)
  }

  polizaInput.value = null
  renovacionInput.value = null
}

const editarPoliza = (item: PolizaItem, index: number) => {
  polizaEditando.value = index
  polizaInput.value = item.poliza
  setTimeout(() => { renovacionInput.value = item.renovacion }, 50)
}

const eliminarPoliza = (index: number) => {
  polizas.value.splice(index, 1)
}

const guardarDatosGenerales = async () => {
  const idContrato = contratoStore.general?.idContrato
  if (!idContrato) return

  contratoStore.setPolizas({ idContrato, polizas: polizas.value })
  dialog.show({ title: 'Éxito', message: 'Pólizas guardadas', type: DialogType.SUCCESS })
}

const hidratarPolizasDesdeStore = () => {
  const guardadas = contratoStore.poli?.polizas || []

  guardadas.forEach(p => {
    const existe = polizas.value.some(local =>
      String(local.poliza).trim() === String(p.poliza).trim() &&
      Number(local.renovacion) === Number(p.renovacion)
    )

    if (!existe) {
      polizas.value.push({
        poliza: String(p.poliza).trim(),
        renovacion: Number(p.renovacion)
      })
    }
  })
}
const hidratado = ref(false);

watch(
  [() => emisiones.value.length, () => contratoStore.poli],
  ([len, poli]) => {
    // Solo hidratamos si tenemos emisiones cargadas, hay datos en el store Y NO hemos hidratado ya
    if (len > 0 && poli?.polizas?.length && !hidratado.value) {
      hidratarPolizasDesdeStore();
      hidratado.value = true; // Marcamos como listo
    }
  },
  { immediate: true }
);


</script>
