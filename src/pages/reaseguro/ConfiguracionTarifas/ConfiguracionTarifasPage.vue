<template>
  <v-form ref="formRef">
    <v-breadcrumbs :items="['Reaseguro', 'Configuración de tarifas']" />
    <v-card-title class="d-flex align-center">
      Configuración de Tarifas {{ esModoEdicion ? '- Editando' : '' }}
    </v-card-title>
    <v-sheet class="d-flex justify-center">
      <v-label>En esta sección podrás administrar y cargar archivos sobre configuración de tarifas.</v-label>
    </v-sheet>
    <br>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="nombreTarifaPropia"
            label="Nombre tarifa propia"
            variant="solo-filled"
            :maxlength="20"
            :rules="[v => !!v || 'Nombre tarifa obligatorio']"
            counter="20"
            :disabled="esModoEdicion"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-file-input
            v-model="tarifaPropiaFile"
            label="Tarifa propia (CSV)"
            accept=".csv"
            variant="solo-filled"
            @update:model-value="alCambiarArchivo"
            :disabled="esModoEdicion"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="esActivo"
            :items="optionsEsActivo"
            :disabled="!esModoEdicion"
            label="Estado"
            variant="solo-filled"
          />
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn class="btn-guardar mx-2" @click="guardarEnBD">
            {{ esModoEdicion ? 'ACTUALIZAR' : 'GUARDAR' }}
          </v-btn>
          <v-btn v-if="esModoEdicion" color="grey" @click="limpiarFormulario">
            CANCELAR
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
  <br>
  <v-row justify="center">
    <v-col cols="8">
      <v-data-table :headers="headers2" :items="itemsTablaTarifas" class="elevation-1">
        <template #item.acciones="{ item }">
          <v-btn icon color="blue" variant="text" size="small" @click="visualizarTarifa(item)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <!--<v-btn icon color="orange" variant="text" size="small" @click="cargarParaEditar(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>-->
          <v-btn icon color="red" variant="text" size="small" @click="eliminarTarifa(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DialogType, useDialog } from "@/stores/dialogStore"
import { AuthStore } from '@/stores/authStore'
import { BaseAPI } from '@/API/BaseAPI'

interface DetalleTarifa {
  edad: number;
  sexo: string;
  fumador: number;
  primaRiesgo: number;
  esActivo: number;
}

const dialog = useDialog()
const authStore = AuthStore()
const router = useRouter()

const apiTarifaRegistro = BaseAPI({ prefix: 'ws_configuracion_tarifas_reaseg/api/v1/ReasegArchivoTipoTarifaRest', isBase: true, isPrivate: true });
const apiTarifaConsulta = BaseAPI({ prefix: 'ws_configuracion_tarifas_reaseg/api/v1/ReasegArchivoTipoTarifaRest', isBase: true, isPrivate: true });
const apiTarifaPropiaRegistro = BaseAPI({ prefix: 'ws_configuracion_tarifas_reaseg/api/v1/ReasegTipoTarifaPropiaRest', isBase: true, isPrivate: true });


const tarifaPropiaFile = ref<File | null>(null)
const itemsTablaTarifas = ref<any[]>([])
const nombreTarifaPropia = ref('');
const datosTemporalCSV = ref<DetalleTarifa[]>([]);
const esActivo = ref(1);
const esModoEdicion = ref(false);
const idSeleccionado = ref<number | null>(null);

const optionsEsActivo = [
  { title: 'ACTIVO', value: 1 },
  { title: 'NO ACTIVO', value: 0 }
]

const headers2 = [
  { title: 'Archivo Original', key: 'tarifaP' },
  { title: 'Estado', key: 'estadoTexto' },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const cargarTarifas = async () => {
  try {
    const response = await apiTarifaConsulta.post('getAllRecords');
    itemsTablaTarifas.value = response.data.map((t: any) => ({
      id: t.idTarifa || t.id || t.id_tarifa,
      nombreTarifa: t.nombreTarifaPropia,
      tarifaP: t.nombreArchivo || 'N/A',
      esActivo: t.esActivo,
      estadoTexto: t.esActivo === 1 ? 'ACTIVO' : 'NO ACTIVO'
    }));
  } catch (error) { }
};

const visualizarTarifa = (item: any) => {
  const nombreParaEnviar = item.tarifaP || item.nombreTarifa || item.nombreArchivo;

  console.log("Enviando a detalle:", item.id, nombreParaEnviar);

  router.push({
    path: `/reaseguro/configuracion_tarifas_archivo/${item.id}`,
    query: { nombre: nombreParaEnviar }
  });
};

onMounted(cargarTarifas);

const cargarParaEditar = (item: any) => {
  esModoEdicion.value = true;
  idSeleccionado.value = item.id;
  nombreTarifaPropia.value = item.nombreTarifa;
  esActivo.value = item.esActivo;
  tarifaPropiaFile.value = null;
  window.scrollTo(0, 0);
};

const obtenerFechaHoy = (): string => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio = hoy.getFullYear();
  return `${dia}${mes}${anio}`;
};

const guardarEnBD = async () => {
  if (!authStore.getToken) return;

  if (esModoEdicion.value) {
    try {
      await apiTarifaConsulta.post('updateStatus', {
        idTarifa: idSeleccionado.value,
        esActivo: esActivo.value
      });
      dialog.show({ title: 'ÉXITO', message: 'Estado actualizado.', type: DialogType.SUCCESS });
      await cargarTarifas();
      limpiarFormulario();
    } catch (error) {
      dialog.show({ title: 'ERROR', message: 'Error al actualizar estado', type: DialogType.ERROR });
    }
    return;
  }

  if (!tarifaPropiaFile.value || !nombreTarifaPropia.value || datosTemporalCSV.value.length === 0) {
    dialog.show({ type: DialogType.ERROR, message: 'Faltan datos o el archivo no se ha procesado.', title: 'Error' });
    return;
  }

  try {
    dialog.show({ title: 'Procesando', message: 'Guardando configuración y detalles...', type: DialogType.INFO });
    const fechaHoy = obtenerFechaHoy();
    const nombreArchivoFinal = `${nombreTarifaPropia.value}${fechaHoy}`;

    const archivoBase64 = await fileToBase64(tarifaPropiaFile.value);
    const payloadNombreArchivo = {
      nombreArchivo: nombreArchivoFinal,
      base64Content: archivoBase64,
      esActivo: esActivo.value
    };

    const resCabecera = await apiTarifaRegistro.post('insertRecord', payloadNombreArchivo);

    const nuevoId = resCabecera.data?.id || null;

    const payloadDetalles = datosTemporalCSV.value.map(fila => ({
      nombreArchivo: nombreArchivoFinal,
      edad: fila.edad,
      genero: fila.sexo,
      fumador: fila.fumador,
      primaRiesgo: fila.primaRiesgo,
      esActivo: esActivo.value
    }));

    await apiTarifaPropiaRegistro.post('insertRecord', payloadDetalles);

    dialog.show({
      title: 'ÉXITO',
      message: `Se guardó la tarifa y ${payloadDetalles.length} registros de detalle.`,
      type: DialogType.SUCCESS
    });

    await cargarTarifas();
    limpiarFormulario();

  } catch (error: any) {
    console.error("Error en el proceso de guardado:", error);
    dialog.show({
      title: 'ERROR',
      message: 'Error al guardar la información. Verifique los datos.',
      type: DialogType.ERROR
    });
  }
};

const eliminarTarifa = async (item: any) => {
  dialog.show({
    title: 'Confirmar',
    message: `¿Estás seguro de eliminar ${item.nombreTarifa}?`,
    type: DialogType.INFO,
  });
  // await apiTarifaRegistro.post('delete', { id: item.id });
  // cargarTarifas();
};


const alCambiarArchivo = (file: any) => {
  const selectedFile = Array.isArray(file) ? file[0] : file;
  if (selectedFile) {
    tarifaPropiaFile.value = selectedFile;
    procesarArchivoCSV(selectedFile);
  }
};

const procesarArchivoCSV = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    const lineas = content.split(/\r?\n/).filter(l => l.trim() !== '');

    if (lineas.length < 2) {
      dialog.show({ type: DialogType.ERROR, message: 'El archivo está vacío o no contiene datos.', title: 'Error de archivo' });
      tarifaPropiaFile.value = null;
      return;
    }
    const primeraLinea = lineas[0];
    if (!primeraLinea) return;

    const encabezadosRecibidos = primeraLinea.toUpperCase().split(',').map(h => h.trim());

    const encabezadosRequeridos = ['EDAD', 'CVE_SEXO', 'CVE_FUMADOR', 'PRIMA_RIESGO'];

    const faltantes = encabezadosRequeridos.filter(h => !encabezadosRecibidos.includes(h));

    if (faltantes.length > 0) {
      dialog.show({
        type: DialogType.ERROR,
        title: 'Formato de archivo inválido',
        message: `El archivo CSV no tiene la estructura correcta. Faltan los siguientes encabezados: ${faltantes.join(', ')}. Asegúrese de que estén escritos exactamente igual.`
      });

      tarifaPropiaFile.value = null;
      datosTemporalCSV.value = [];
      return;
    }

    const idx = {
      edad: encabezadosRecibidos.indexOf('EDAD'),
      sexo: encabezadosRecibidos.indexOf('CVE_SEXO'),
      fum: encabezadosRecibidos.indexOf('CVE_FUMADOR'),
      pri: encabezadosRecibidos.indexOf('PRIMA_RIESGO')
    };

    try {
      datosTemporalCSV.value = lineas.slice(1).map((linea, index) => {
        const col = linea.split(',');

        if (col.length < encabezadosRequeridos.length) {
          console.warn(`Fila ${index + 2} incompleta`);
        }

        return {
          edad: Number(col[idx.edad]) || 0,
          sexo: col[idx.sexo]?.trim() || '',
          fumador: col[idx.fum]?.trim().toUpperCase() === 'N' ? 1 : 0,
          primaRiesgo: Number(col[idx.pri]) || 0,
          esActivo: 1
        };
      });

      console.log("CSV Procesado correctamente", datosTemporalCSV.value);
    } catch (error) {
      dialog.show({ type: DialogType.ERROR, message: 'Ocurrió un error al leer las filas del archivo.', title: 'Error de lectura' });
      tarifaPropiaFile.value = null;
    }
  };

  reader.onerror = () => {
    dialog.show({ type: DialogType.ERROR, message: 'No se pudo leer el archivo.', title: 'Error' });
  };

  reader.readAsText(file);
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (!result) {
        reject("No se pudo leer el archivo");
        return;
      }
      const parts = result.split(',');
      const cleanBase64 = parts.length > 1 ? parts[1] : parts[0];
      resolve(cleanBase64 || '');
    };
    reader.onerror = (error) => reject(error);
  });
};

const borrarDetallesAnteriores = async (nombre: string) => {
    await apiTarifaPropiaRegistro.post('deleteByFileName', { nombreArchivo: nombre });
};

const limpiarFormulario = () => {
  nombreTarifaPropia.value = '';
  tarifaPropiaFile.value = null;
  datosTemporalCSV.value = [];
  esActivo.value = 1;
  esModoEdicion.value = false;
  idSeleccionado.value = null;
}
</script>
