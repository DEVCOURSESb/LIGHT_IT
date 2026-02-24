<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <!-- ! ROW — Campos de captura -->
          <v-row>
            <!-- REASEGURADORA -->
            <v-col cols="12" md="3">
              <v-select
                :items="reaseguradoresEscalonadas"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :model-value="formData.cveReaseguradorComisRol"
                @update:model-value="setFieldValue('cveReaseguradorComisRol', $event)"
                :error-messages="showErrors ? formErrors['cveReaseguradorComisRol'] : undefined"
              />
            </v-col>

            <!-- LÍMITE INFERIOR -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Límite inferior"
                variant="solo-filled"
                :model-value="limiteInf"
                @update:model-value="onInputGeneric('limiteInf', $event)"
                @blur="onBlurGeneric('limiteInf')"
                :error-messages="showErrors ? formErrors['limiteInf'] : undefined"
                persistent-hint
              />
            </v-col>

            <!-- LÍMITE SUPERIOR -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Límite superior"
                variant="solo-filled"
                :model-value="limiteSup"
                @update:model-value="onInputGeneric('limiteSup', $event)"
                @blur="onBlurGeneric('limiteSup')"
                :error-messages="showErrors ? formErrors['limiteSup'] : undefined"
                persistent-hint
              />
            </v-col>

            <!-- COMISIÓN / RATE ON LINE DEFINITIVO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Comisión / rate on line definitivo (%)"
                variant="solo-filled"
                :model-value="comisRolDefinitiva"
                @update:model-value="onInputGeneric('comisRolDefinitiva', $event)"
                @blur="onBlurGeneric('comisRolDefinitiva')"
                :error-messages="showErrors ? formErrors['comisRolDefinitiva'] : undefined"
                persistent-hint
              />
              <v-slider
                :model-value="formData.comisRolDefinitiva ?? 0"
                @update:model-value="(v) => { setFieldValue('comisRolDefinitiva', v); comisRolDefinitiva = String(v); }"
                min="0"
                max="100"
                step="0.01"
                thumb-label
                color="primary"
                class="mt-1"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Botones principales -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleFileUpload">
              Carga comisiones
            </v-btn>
            <v-btn size="large" variant="outlined" @click="handleAgregarComision">
              Agregar comisión
            </v-btn>
            <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarComisiones">
              Guardar comisiones
            </v-btn>
          </v-row>

          <br /><br />

          <!-- ! ROW — File input + botón desactivar -->
          <v-row align="center">
            <v-col cols="12" md="7">
              <v-file-input
                id="file-input"
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
                Activar / desactivar comisiones
              </v-btn>
            </v-col>
          </v-row>

          <!-- ! ROW — Tabla principal -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                class="mt-4"
                :headers="tableHeaders"
                :items="dataTable"
                striped="odd"
              >
                <template #top>
                  <v-toolbar class="encabezado" flat>
                    <v-toolbar-title>
                      Solo los registros de esta tabla se registrarán
                    </v-toolbar-title>
                    <v-spacer />
                  </v-toolbar>
                </template>

                <template #no-data>No hay datos disponibles</template>

                <template #item.limiteInf="{ item }">
                  {{ item.limiteInf?.toFixed(2) ?? "—" }}
                </template>

                <template #item.limiteSup="{ item }">
                  {{ item.limiteSup?.toFixed(2) ?? "—" }}
                </template>

                <template #item.comisRolDefinitiva="{ item }">
                  {{ item.comisRolDefinitiva?.toFixed(2) ?? "—" }} %
                </template>

                <template #item.comisRolActiva="{ item }">
                  <v-checkbox
                    :model-value="item.comisRolActiva"
                    @update:model-value="toggleRowActiva(item)"
                    hide-details
                    density="compact"
                  />
                </template>

                <template #item.editar="{ item }">
                  <v-icon class="edit" size="large" @click="editRow(item)">
                    mdi-pencil
                  </v-icon>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

        </v-form>
      </v-container>
    </v-card-text>
  </v-card>

  <!-- !! DIÁLOGO — Carga masiva CSV -->
  <v-dialog v-model="showCsvDialog" max-width="900" persistent>
    <v-card>
      <v-card-title class="text-h6 pa-4">
        Comisiones cargadas desde archivo
      </v-card-title>

      <v-card-text>
        <!-- Filtro por reaseguradora -->
        <v-select
          v-model="csvFilterReaseg"
          :items="csvNombresUnicos"
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
                {{ csvSelectedRows.length }} de {{ csvRows.length }} seleccionadas
              </span>
            </v-toolbar>
          </template>

          <template #no-data>Sin registros en el archivo</template>

          <template #item.limiteInf="{ item }">
            {{ item.limiteInf?.toFixed(2) }}
          </template>
          <template #item.limiteSup="{ item }">
            {{ item.limiteSup?.toFixed(2) }}
          </template>
          <template #item.comisRolDefinitiva="{ item }">
            {{ item.comisRolDefinitiva?.toFixed(2) }} %
          </template>
          <template #item.comisRolActiva="{ item }">
            <v-checkbox
              :model-value="item.comisRolActiva"
              @update:model-value="toggleRowActiva(item)"
              hide-details
              density="compact"
              :disabled="true"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions class="justify-end pa-4 gap-2">
        <v-btn variant="outlined" @click="handleCsvCancel">Cancelar</v-btn>
        <v-btn
          variant="outlined" class="btn-guardar"
          :disabled="csvSelectedRows.length === 0"
          @click="handleCsvAccept"
        >
          Aceptar ({{ csvSelectedRows.length }} seleccionadas)
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useComisionesRateOnLine } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/comisiones_rate_on_line/useComisionesRateOnLine";

const {
  dataTable,
  showErrors,
  formData,
  formErrors,
  limiteInf,
  limiteSup,
  comisRolDefinitiva,
  reaseguradoresEscalonadas,
  tableHeaders,
  showCsvDialog,
  csvRows,
  csvSelectedRows,
  csvTableHeaders,
  csvLoading,
  setFieldValue,
  onInputGeneric,
  onBlurGeneric,
  handleFileUpload,
  handleFileChange,
  handleCsvAccept,
  handleCsvCancel,
  toggleSelectAllCsv,
  handleAgregarComision,
  handleGuardarComisiones,
  toggleAllActiva,
  toggleRowActiva,
  editRow,
} = useComisionesRateOnLine();

// Filtro local del diálogo CSV (solo afecta la visualización, no la selección)
const csvFilterReaseg = ref<string | null>(null);

const csvNombresUnicos = computed(() => [
  ...new Set(csvRows.value.map((r) => r.nombreReasegurador)),
]);

const csvRowsFiltradas = computed(() =>
  csvFilterReaseg.value
    ? csvRows.value.filter((r) => r.nombreReasegurador === csvFilterReaseg.value)
    : csvRows.value
);
</script>