<!-- components/CargaArchivosPage.vue -->
<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    
    <v-card-text>
      <v-row class="w-100">
        <v-col cols="4"></v-col>

        <v-col cols="4" class="d-flex align-center justify-center">
          <h1>{{ titulo }}</h1>
        </v-col>

        <v-col cols="4" class="d-flex justify-end align-top gap-2"></v-col>
      </v-row>

      <!-- Sección de carga -->
      <v-card class="mt-4" elevation="0" outlined>
        <v-toolbar class="encabezado" flat>
          <v-toolbar-title>{{ tituloFormulario }}</v-toolbar-title>
        </v-toolbar>
        
        <v-card-text class="pt-6">
          <v-form ref="formRef" v-model="valid">
            <v-row>
              <!-- Input de archivo -->
              <v-col cols="12" md="4">
                <v-file-input
                  v-model="archivo"
                  label="Seleccionar archivo CSV"
                  accept=".csv"
                  prepend-icon="mdi-file-delimited"
                  :rules="archivoRules"
                  show-size
                  clearable
                  density="compact"
                  @update:model-value="onFileChange"
                  @click:clear="onFileClear"
                ></v-file-input>
                
                <!-- Info del archivo seleccionado -->
                <div v-if="archivoInfo" class="mt-2">
                  <v-chip
                    size="small"
                    :color="validacionEnProgreso ? 'orange' : 'primary'"
                    variant="tonal"
                    :prepend-icon="validacionEnProgreso ? 'mdi-loading mdi-spin' : 'mdi-file-check'"
                  >
                    {{ archivoInfo.nombre }}
                  </v-chip>
                  <div class="text-caption text-grey mt-1">
                    Tamaño: {{ archivoInfo.tamano }}
                    <span v-if="validacionEnProgreso" class="text-orange"> • Validando...</span>
                  </div>
                </div>
                
                <!-- Alertas de validación -->
                <v-alert
                  v-if="archivoError"
                  type="error"
                  density="compact"
                  class="mt-2"
                  variant="tonal"
                >
                  {{ archivoError }}
                </v-alert>
              </v-col>

              <!-- Select de año -->
              <v-col cols="12" md="3">
                <v-select
                  v-model="anioSeleccionado"
                  :items="anios"
                  label="Año"
                  :rules="anioRules"
                  prepend-icon="mdi-calendar"
                  density="compact"
                ></v-select>
              </v-col>

              <!-- Select de mes -->
              <v-col cols="12" md="3">
                <v-select
                  v-model="mesSeleccionado"
                  :items="meses"
                  item-title="nombre"
                  item-value="valor"
                  label="Mes"
                  :rules="mesRules"
                  prepend-icon="mdi-calendar-month"
                  density="compact"
                ></v-select>
              </v-col>

              <!-- Botón de cargar -->
              <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn
                  block
                  class="btn-modificar"
                  @click="cargarArchivo"
                >
                  <v-icon start>mdi-upload</v-icon>
                  Cargar
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Tabla de registros -->
      <v-data-table
        class="mt-4"
        :headers="headers"
        :items="registros"
        :loading="loading"
        striped="odd"
      >
        <template #top>
          <v-toolbar class="encabezado" flat>
            <v-toolbar-title>{{ tituloTabla }}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
        </template>

        <template #no-data>
          <div class="text-center py-6">
            <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
            <p class="text-grey mt-2">No hay archivos cargados</p>
          </div>
        </template>

        <template #item.numeroRegistros="{ item }">
          <span>{{ item.numeroRegistros.toLocaleString() }}</span>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="snackbarColor === 'info' ? -1 : 3000"
    >
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import type { useCargaArchivos } from '@/composables/archivos/useCargaArchivos';
import { onMounted, computed, ref as vueRef, watch } from 'vue';

interface Props {
  titulo: string;
  tituloFormulario: string;
  tituloTabla: string;
  breadcrumbs: string[];
  composable: ReturnType<typeof useCargaArchivos>;
}

const props = defineProps<Props>();

const {
  form,
  valid,
  archivo,
  anioSeleccionado,
  mesSeleccionado,
  loading,
  registros,
  snackbar,
  snackbarText,
  snackbarColor,
  archivoRules,
  anioRules,
  mesRules,
  anios,
  meses,
  cargarArchivo,
  cargarDatos,
  archivoSeleccionado,
  setArchivoSeleccionado,
  puedeCargar,
  validacionEnProgreso,
} = props.composable;

const formRef = vueRef();
const archivoInfo = vueRef<{ nombre: string; tamano: string } | null>(null);
const archivoError = vueRef<string | null>(null);

// Función mejorada para manejar cambios en el archivo
const onFileChange = (files: File | File[] | null) => {
  
  archivoError.value = null;
  
  // Normalizar a array
  let fileArray: File[] | null = null;
  if (files) {
    if (Array.isArray(files)) {
      fileArray = files;
    } else {
      fileArray = [files];
    }
  }
  
  if (fileArray && fileArray.length > 0) {
    const file = fileArray[0];
    
    if (!file) {
      console.warn('File es undefined');
      onFileClear();
      return;
    }

    console.log('Archivo detectado:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });

    try {
      // Validaciones inmediatas
      if (!file.name.toLowerCase().endsWith('.csv')) {
        archivoError.value = 'El archivo debe ser formato CSV';
        setArchivoSeleccionado(null);
        return;
      }

      if (file.size === 0) {
        archivoError.value = 'El archivo está vacío';
        setArchivoSeleccionado(null);
        return;
      }

      // Establecer archivo
      setArchivoSeleccionado(file);
      
      // Actualizar info visual
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      archivoInfo.value = {
        nombre: file.name,
        tamano: `${sizeMB} MB`
      };
      
    } catch (error) {
      console.error('Error procesando archivo:', error);
      archivoError.value = 'Error al procesar el archivo';
      onFileClear();
    }
  } else {
    console.log('No hay archivos, limpiando...');
    onFileClear();
  }
};

// Función para limpiar el archivo
const onFileClear = () => {
  setArchivoSeleccionado(null);
  archivoInfo.value = null;
  archivoError.value = null;
};

// Watch para debugging
watch(archivoSeleccionado, (newVal) => {
  console.log('archivoSeleccionado cambió:', newVal?.name || 'null');
});

watch(puedeCargar, (newVal) => {
  console.log('puedeCargar cambió:', newVal);
});

const headers = [
  { title: 'Año', key: 'anio' },
  { title: 'Mes', key: 'mes' },
  { title: 'Nombre de Archivo', key: 'nombreArchivo' },
  { title: 'Número de Registros', key: 'numeroRegistros' }
];

onMounted(() => {
  form.value = formRef.value;
  cargarDatos();
});
</script>

<style scoped>
.encabezado {
  background-color: #f5f5f5;
}

.btn-modificar {
  background-color: #1976d2;
  color: white;
}

.btn-modificar:hover {
  background-color: #1565c0;
}

.btn-modificar:disabled {
  background-color: #e0e0e0 !important;
  color: #9e9e9e !important;
}
</style>
