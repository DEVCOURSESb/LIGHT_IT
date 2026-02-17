<template>
  <v-breadcrumbs :items="['Reaseguro', 'Configuración de tarifas', nombreArchivoVisual || 'Detalle']" />
  <br>
  <v-btn color="blue" rounded="xl" to="/reaseguro/configuracion_tarifas" variant="text">
    <v-icon start>mdi-arrow-left</v-icon>
    Volver
  </v-btn>
  <br>

  <v-card-title class="d-flex align-center">
    Configuración de Tarifas para {{ nombreArchivoVisual || 'Cargando...' }}
  </v-card-title>

  <br>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers2"
        :items="itemsDetalle"
        :loading="cargando"
        class="elevation-1"
        no-data-text="No se encontraron registros para este archivo"
      >
        <template #item.acciones="{ item }">
          <v-btn icon color="blue" variant="text" size="small" @click="abrirEditar(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <!--<v-btn icon color="red" variant="text" size="small">
            <v-icon>mdi-delete</v-icon>
          </v-btn>-->
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <v-dialog v-model="modalEditar" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center bg-grey-lighten-3">Editar registro</v-card-title>
      <br>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.edad"
              label="Edad (0 a 99)"
              type="number"
              :rules="validarRangoEdad"
              variant="solo-filled"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.genero"
              :items="['M', 'F']"
              label="Género"
              variant="solo-filled"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="form.fumador"
              :items="['S', 'N']"
              label="Fumador"
              variant="solo-filled"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.primaRiesgo"
              label="Prima de riesgo"
              type="number"
              variant="solo-filled"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" variant="text" @click="modalEditar = false">Cancelar</v-btn>
        <v-btn color="green" variant="elevated" @click="confirmarEdicion">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-row justify="center" class="mt-5">
    <v-btn class="btn-guardar" @click="guardarEnBD">
      Guardar cambios
    </v-btn>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { DialogType, useDialog } from "@/stores/dialogStore"
import { BaseAPI } from '@/API/BaseAPI'

const route = useRoute()
const dialogGlobal = useDialog()
const dialog = useDialog()

const modalEditar = ref(false)
const idActual = ref<any>(null)
const form = reactive({
  edad: '',
  genero: '',
  fumador: '',
  primaRiesgo: ''
})

const itemsDetalle = ref<any[]>([])
const cargando = ref(false)
const nombreArchivoVisual = ref<string>('')

const apiConfigTarifa = BaseAPI({
  prefix: 'ws_configuracion_tarifas_reaseg/api/v1/ReasegTipoTarifaPropiaRest',
  isBase: true,
  isPrivate: true
});

const headers2 = [
  { title: 'Edad', key: 'edad' },
  { title: 'Género', key: 'genero' },
  { title: 'Fumador', key: 'fumadorTexto' },
  { title: 'Prima de riesgo', key: 'primaRiesgo' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const cargarDetalles = async () => {
  cargando.value = true;
  try {
    const response = await apiConfigTarifa.post('getAllRecords', {});
    if (response.data && Array.isArray(response.data)) {
      const filtro = nombreArchivoVisual.value;
      const filtrados = response.data.filter((reg: any) => reg.nombreArchivo === filtro);

      itemsDetalle.value = filtrados.map((reg: any) => ({
        ...reg,
        idInterno: reg.id || reg.cveTarifa || Math.random(),
        fumadorTexto: reg.fumador === 1 ? 'S' : 'N'
      }));
    }
  } catch (error) {
    console.error("Error al cargar detalles:", error);
  } finally {
    cargando.value = false;
  }
};

const abrirEditar = (item: any) => {
  idActual.value = item.idInterno;
  form.edad = item.edad;
  form.genero = item.genero;
  form.fumador = item.fumadorTexto;
  form.primaRiesgo = item.primaRiesgo;

  modalEditar.value = true;
};

const confirmarEdicion = () => {
  const index = itemsDetalle.value.findIndex(i => i.idInterno === idActual.value);
  if (index !== -1) {
    itemsDetalle.value[index] = {
      ...itemsDetalle.value[index],
      edad: Number(form.edad),
      genero: form.genero,
      fumador: form.fumador === 'S' ? 0 : 1,
      fumadorTexto: form.fumador,
      primaRiesgo: Number(form.primaRiesgo)
    };
  }
  modalEditar.value = false;
};

const validarRangoEdad = ref();

const eliminarTarifa = async (item: any) => {
  dialog.show({
    title: 'Confirmar',
    message: `¿Estás seguro de eliminar el archivo?`,
    type: DialogType.CONFIRM,
  }); // debe esperar primero la confirmación antes de proceder a eliminar

  await apiConfigTarifa.delete(`deleteRecord/${item.id}`);
  cargarDetalles();
};

const guardarEnBD = async () => {
  try {
    dialogGlobal.show({ title: 'Guardando', message: 'Actualizando registros...', type: DialogType.INFO });

    const promesas = itemsDetalle.value.map(item => {
      return apiConfigTarifa.post(`insertRecord/${item.id}`, {
        //id: item.id,
        nombreArchivo: item.nombreArchivo,
        edad: item.edad,
        genero: item.genero,
        fumador: item.fumador,
        primaRiesgo: item.primaRiesgo,
      });
    });

    await Promise.all(promesas);

    dialogGlobal.show({
      title: 'ÉXITO',
      message: 'Todos los cambios se guardaron correctamente.',
      type: DialogType.SUCCESS
    });

    cargarDetalles();
  } catch (error: any) {
  }
};

onMounted(() => {
  const nombreQuery = route.query.nombre as string;
  if (nombreQuery) {
    nombreArchivoVisual.value = nombreQuery;
    cargarDetalles();
  }
});
</script>
