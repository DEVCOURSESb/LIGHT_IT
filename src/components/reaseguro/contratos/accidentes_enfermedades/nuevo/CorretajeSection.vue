<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <v-row>

            <!-- INTERMEDIARIO -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formData.cveIntermediarioCorretaje"
                @update:model-value="setFieldValue('cveIntermediarioCorretaje', $event)"
                :items="intermediariosData"
                item-title="nombreIntermediario"
                item-value="cveIntermediario"
                label="Intermediario *"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveIntermediarioCorretaje : ''"
              />
            </v-col>

            <!-- REASEGURADORA (solo cuando hay escalonado POR REASEGURADORA) -->
            <v-col v-if="hayEscalonadoPorReaseg" cols="12" md="3">
              <v-select
                :model-value="formData.cveReaseguradorCorretaje"
                @update:model-value="setFieldValue('cveReaseguradorCorretaje', $event)"
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora *"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveReaseguradorCorretaje : ''"
              />
            </v-col>

            <!-- LÍMITE INFERIOR -->
            <v-col cols="12" md="2">
              <v-text-field
                :model-value="limiteInf"
                @update:model-value="onInputGeneric('limiteInfCorretaje', $event)"
                @blur="onBlurGeneric('limiteInfCorretaje')"
                label="Límite inferior *"
                variant="solo-filled"
                :error-messages="showErrors ? formErrors.limiteInfCorretaje : ''"
              />
            </v-col>

            <!-- LÍMITE SUPERIOR -->
            <v-col cols="12" md="2">
              <v-text-field
                :model-value="limiteSup"
                @update:model-value="onInputGeneric('limiteSupCorretaje', $event)"
                @blur="onBlurGeneric('limiteSupCorretaje')"
                label="Límite superior *"
                variant="solo-filled"
                :error-messages="showErrors ? formErrors.limiteSupCorretaje : ''"
              />
            </v-col>

            <!-- % CORRETAJE DEFINITIVO (mutuamente excluyente con monto) -->
            <v-col cols="12" md="3">
              <v-text-field
                :model-value="porcentajeCorretajeDef"
                @update:model-value="onInputGeneric('porcentajeCorretajeDef', $event)"
                @blur="onBlurGeneric('porcentajeCorretajeDef')"
                label="% Corretaje definitivo"
                variant="solo-filled"
                :suffix="porcentajeCorretajeDef ? '%' : ''"
                :disabled="formData.montoCorretajeDef != null"
                :error-messages="showErrors ? formErrors.porcentajeCorretajeDef : ''"
              />
              <v-slider
                :model-value="formData.porcentajeCorretajeDef ?? 0"
                @update:model-value="
                  setFieldValue('porcentajeCorretajeDef', $event);
                  porcentajeCorretajeDef = $event.toFixed(2);
                "
                min="0"
                max="100"
                step="0.01"
                color="secondary"
                thumb-label
                :disabled="formData.montoCorretajeDef != null"
                class="mt-1"
              />
            </v-col>

            <!-- MONTO CORRETAJE DEFINITIVO (mutuamente excluyente con %) -->
            <v-col cols="12" md="3">
              <v-text-field
                :model-value="montoCorretajeDef"
                @update:model-value="onInputGeneric('montoCorretajeDef', $event)"
                @blur="onBlurGeneric('montoCorretajeDef')"
                label="Monto corretaje definitivo"
                variant="solo-filled"
                :disabled="formData.porcentajeCorretajeDef != null"
                :error-messages="showErrors ? formErrors.montoCorretajeDef : ''"
              />
            </v-col>

          </v-row>

          <!-- BOTONES PRINCIPALES -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleFileUpload">
              Carga corretaje
            </v-btn>
            <v-btn size="large" variant="outlined" @click="handleAgregarCorretaje">
              Agregar corretaje
            </v-btn>
            <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarCorretaje">
              Guardar corretaje
            </v-btn>
          </v-row>

          <br /><br />

          <!-- FILE INPUT + BUSCAR ARCHIVO + ACTIVAR/DESACTIVAR -->
          <v-row align="center">
            <v-col cols="12" md="7">
              <v-file-input
                id="file-input-corretaje"
                label="Seleccionar archivo CSV"
                accept=".csv"
                prepend-icon="mdi-file-delimited"
                show-size
                clearable
                density="compact"
                :loading="csvLoading"
                @update:model-value="handleFileChange"
                @click:clear="() => {}"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-btn size="large" variant="outlined" @click="handleFileUpload">
                Buscar archivo
              </v-btn>
            </v-col>

            <v-col cols="12" md="3">
              <v-btn
                size="large"
                variant="outlined"
                :disabled="dataTable.length === 0"
                @click="toggleAllActiva"
              >
                Activar / desactivar corretaje
              </v-btn>
            </v-col>
          </v-row>

          <!-- TABLA PRINCIPAL -->
          <v-col cols="12" md="12">
            <v-data-table
              class="mt-4"
              :headers="tableHeaders"
              :items="dataTable"
              :loading="false"
              striped="odd"
            >
              <template #top>
                <v-toolbar class="encabezado" flat>
                  <v-toolbar-title class="text-secondary">
                    Solo los registros de esta tabla se registrarán
                  </v-toolbar-title>
                  <v-spacer />
                </v-toolbar>
              </template>

              <template #no-data>No hay datos disponibles</template>

              <!-- % Corretaje definitivo -->
              <template #item.porcentajeCorretajeDef="{ item }">
                {{ item.porcentajeCorretajeDef != null ? `${item.porcentajeCorretajeDef.toFixed(2)} %` : '—' }}
              </template>

              <!-- Monto corretaje definitivo -->
              <template #item.montoCorretajeDef="{ item }">
                {{ item.montoCorretajeDef != null ? formatCurrency(item.montoCorretajeDef) : '—' }}
              </template>

              <!-- Límites con 2 decimales -->
              <template #item.limiteInfCorretaje="{ item }">
                {{ item.limiteInfCorretaje.toFixed(2) }}
              </template>
              <template #item.limiteSupCorretaje="{ item }">
                {{ item.limiteSupCorretaje.toFixed(2) }}
              </template>

              <!-- Checkbox activo -->
              <template #item.corActivo="{ item }">
                <v-checkbox
                  :model-value="item.corActivo"
                  @update:model-value="toggleRowActiva(item)"
                  hide-details
                  density="compact"
                />
              </template>

              <!-- Editar -->
              <template #item.editar="{ item }">
                <v-icon class="edit" size="large" @click="editRow(item)">
                  mdi-pencil
                </v-icon>
              </template>

            </v-data-table>
          </v-col>

        </v-form>
      </v-container>
    </v-card-text>
  </v-card>

  <!-- !! DIÁLOGO — Carga masiva CSV -->
  <v-dialog v-model="showCsvDialog" max-width="900" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-4">
        Corretajes cargados desde archivo
      </v-card-title>

      <v-card-text>
        <!-- Filtro por intermediario -->
        <v-select
          v-model="csvFilterIntermediario"
          :items="csvNombresIntermediariosUnicos"
          label="Filtrar por intermediario"
          clearable
          density="compact"
          variant="outlined"
          class="mb-2"
        />

        <!-- Filtro por reaseguradora (solo cuando aplica) -->
        <v-select
          v-if="hayEscalonadoPorReaseg"
          v-model="csvFilterReaseg"
          :items="csvNombresReasegUnicos"
          label="Filtrar por reaseguradora"
          clearable
          density="compact"
          variant="outlined"
          class="mb-4"
        />

        <v-data-table
          :headers="csvTableHeaders"
          :items="csvRowsFiltradas"
          density="compact"
          striped="odd"
          show-select
          v-model="csvSelectedRows"
          return-object
        >
          <template #top>
            <v-toolbar flat density="compact">
              <v-btn
                variant="text"
                size="small"
                @click="toggleSelectAllCsv(csvSelectedRows.length !== csvRows.length)"
              >
                {{ csvSelectedRows.length === csvRows.length ? "Desmarcar todas" : "Seleccionar todas" }}
              </v-btn>
              <v-spacer />
              <span class="text-caption text-medium-emphasis pr-2">
                {{ csvSelectedRows.length }} de {{ csvRows.length }} seleccionados
              </span>
            </v-toolbar>
          </template>

          <template #no-data>Sin registros en el archivo</template>

          <template #item.porcentajeCorretajeDef="{ item }">
            {{ item.porcentajeCorretajeDef != null ? `${item.porcentajeCorretajeDef.toFixed(2)} %` : '—' }}
          </template>
          <template #item.montoCorretajeDef="{ item }">
            {{ item.montoCorretajeDef != null ? formatCurrency(item.montoCorretajeDef) : '—' }}
          </template>
          <template #item.limiteInfCorretaje="{ item }">
            {{ item.limiteInfCorretaje?.toFixed(2) ?? '—' }}
          </template>
          <template #item.limiteSupCorretaje="{ item }">
            {{ item.limiteSupCorretaje?.toFixed(2) ?? '—' }}
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="justify-end pa-4 gap-2">
        <v-btn variant="outlined" @click="handleCsvCancel">Cancelar</v-btn>
        <v-btn
          variant="outlined"
          class="btn-guardar"
          :disabled="csvSelectedRows.length === 0"
          @click="handleCsvAccept"
        >
          Aceptar ({{ csvSelectedRows.length }} seleccionados)
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import type { CorretajeDisplay } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/corretajes/useCorretajeSection";
import { useCorretajeSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/corretajes/useCorretajeSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  limiteInf,
  limiteSup,
  porcentajeCorretajeDef,
  montoCorretajeDef,
  onInputGeneric,
  onBlurGeneric,
  intermediariosData,
  reaseguradoraData,
  hayEscalonadoPorReaseg,
  csvRows,
  csvSelectedRows,
  csvLoading,
  showCsvDialog,
  handleFileUpload,
  handleFileChange,
  handleCsvAccept,
  handleCsvCancel,
  toggleSelectAllCsv,
  tableHeaders,
  dataTable,
  handleAgregarCorretaje,
  handleGuardarCorretaje,
  toggleAllActiva,
  toggleRowActiva,
  editRow,
} = useCorretajeSection();

// Filtros locales del diálogo CSV
const csvFilterIntermediario = ref<string | null>(null);
const csvFilterReaseg        = ref<string | null>(null);

const csvNombresIntermediariosUnicos = computed(() => [
  ...new Set(csvRows.value.map((r: CorretajeDisplay) => r.nombreIntermediario)),
]);

const csvNombresReasegUnicos = computed(() => [
  ...new Set(csvRows.value.map((r: CorretajeDisplay) => r.nombreReasegurador).filter(Boolean)),
]);

const csvRowsFiltradas = computed(() => {
  let rows = csvRows.value;
  if (csvFilterIntermediario.value) {
    rows = rows.filter((r: CorretajeDisplay) => r.nombreIntermediario === csvFilterIntermediario.value);
  }
  if (csvFilterReaseg.value) {
    rows = rows.filter((r: CorretajeDisplay) => r.nombreReasegurador === csvFilterReaseg.value);
  }
  return rows;
});

const toggleSelectAllCsvLocal = () => {
  // delegado al composable
};

// Headers del diálogo CSV
const hp = { style: "font-weight: bold" };
const csvTableHeaders = [
  { title: "Intermediario",              key: "nombreIntermediario",    sortable: true, headerProps: hp },
  { title: "Reaseguradora",              key: "nombreReasegurador",     sortable: true, headerProps: hp },
  { title: "Límite inferior",            key: "limiteInfCorretaje",     sortable: true, headerProps: hp },
  { title: "Límite superior",            key: "limiteSupCorretaje",     sortable: true, headerProps: hp },
  { title: "% Corretaje definitivo",     key: "porcentajeCorretajeDef", sortable: true, headerProps: hp },
  { title: "Monto corretaje definitivo", key: "montoCorretajeDef",      sortable: true, headerProps: hp },
];
</script>