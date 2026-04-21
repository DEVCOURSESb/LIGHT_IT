<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <!-- ! ROW — Campos de captura -->
          <v-row>
            <!-- ASIGNACIÓN DE CAPA -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter((item) => [1, 4].includes(item.cveCriterioAsig)) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Asignación de capa"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioAsignacion.isLoading.value || criterioEstaFijo"
                :model-value="formData['cveCriterioAsigCapa']"
                @update:model-value="setFieldValue('cveCriterioAsigCapa', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigCapa'] : undefined"
              />
            </v-col>

            <!-- COBERTURA (solo si criterio = 4 POR COBERTURA) -->
            <v-col cols="12" md="3" v-if="formData['cveCriterioAsigCapa'] === 4">
              <v-select
                :items="coberturasDisponibles"
                item-title="descCobaye"
                item-value="cveCobAyE"
                label="Cobertura"
                variant="solo-filled"
                clearable
                :model-value="formData['cveCobAyECapa']"
                @update:model-value="setFieldValue('cveCobAyECapa', $event)"
                :error-messages="showErrors ? formErrors['cveCobAyECapa'] : undefined"
              />
            </v-col>

            <!-- NÚMERO DE CAPA (solo lectura, asignado automáticamente) -->
            <v-col cols="12" md="2">
              <v-text-field
                label="No. de capa"
                variant="solo-filled"
                :model-value="noCapa"
                readonly
              />
            </v-col>

            <!-- RETENCIÓN CAPA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Retención capa"
                variant="solo-filled"
                :model-value="retencionCapa"
                @update:model-value="onInputGeneric('retencionCapa', $event)"
                @blur="onBlurGeneric('retencionCapa')"
                :error-messages="showErrors ? formErrors['retencionCapa'] : undefined"
              />
            </v-col>

            <!-- CESIÓN CAPA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Cesión capa"
                variant="solo-filled"
                :model-value="cesionCapa"
                @update:model-value="onInputGeneric('cesionCapa', $event)"
                @blur="onBlurGeneric('cesionCapa')"
                :error-messages="showErrors ? formErrors['cesionCapa'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Botones principales -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleAgregarExcedente">
              Agregar excedente
            </v-btn>
            <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarExcedente">
              Guardar excedente
            </v-btn>
          </v-row>

          <br /><br />

          <!-- ! ROW — Tabla principal -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                class="mt-2"
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

                <template #item.retencionCapa="{ item }">
                  {{ item.retencionCapa != null
                      ? item.retencionCapa.toLocaleString("es-MX", { minimumFractionDigits: 2 })
                      : "—" }}
                </template>

                <template #item.cesionCapa="{ item }">
                  {{ item.cesionCapa != null
                      ? item.cesionCapa.toLocaleString("es-MX", { minimumFractionDigits: 2 })
                      : "—" }}
                </template>

                <template #item.capaActiva="{ item }">
                  <v-checkbox
                    :model-value="item.capaActiva"
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
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useExcedentesSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/excedentes/useExcedentesSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  retencionCapa,
  cesionCapa,
  onInputGeneric,
  onBlurGeneric,
  queryCriterioAsignacion,
  tableHeaders,
  dataTable,
  criterioEstaFijo,
  handleAgregarExcedente,
  handleGuardarExcedente,
  toggleRowActiva,
  editRow,
  coberturasDisponibles
} = useExcedentesSection();

// noCapa se calcula en el template como preview antes de agregar
// sigue la misma lógica que calcularNoCapa del composable
const noCapa = computed(() => {
  const criterio = formData.cveCriterioAsigCapa;
  const cobaye   = formData.cveCobAyECapa;

  if (criterio === 1) {
    return dataTable.value.length + 1;
  }
  if (criterio === 4 && cobaye != null) {
    return dataTable.value.filter((r) => r.cveCobAyECapa === cobaye).length + 1;
  }
  return "—";
});
</script>