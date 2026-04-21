<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <v-row>

            <!-- ¿INTERMEDIARIO? -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formData.intermediario"
                @update:model-value="setFieldValue('intermediario', $event)"
                :items="[{ title: 'NO', value: 0 }, { title: 'SI', value: 1 }]"
                item-title="title"
                item-value="value"
                label="¿Intermediario?"
                variant="solo-filled"
                :error-messages="showErrors ? formErrors.intermediario : ''"
              />
            </v-col>

            <!-- ASIGNACIÓN DE INTERMEDIARIO -->
            <v-col v-if="intermediarioSI" cols="12" md="3">
              <v-select
                :model-value="formData.cveCriterioAsigIntermediario"
                @update:model-value="setFieldValue('cveCriterioAsigIntermediario', $event)"
                :items="[
                  { title: 'POR REASEGURADORA', value: 0 },
                  { title: 'POR CONTRATO',      value: 1 },
                ]"
                item-title="title"
                item-value="value"
                label="Asignación de intermediario"
                variant="solo-filled"
                :disabled="criterioEstaFijo"
                :error-messages="showErrors ? formErrors.cveCriterioAsigIntermediario : ''"
              />
            </v-col>

            <!-- REASEGURADORA (solo cuando criterio = 0) -->
            <v-col v-if="showReasegurador" cols="12" md="3">
              <v-select
                :model-value="formData.cveReaseguradorIntermediario"
                @update:model-value="setFieldValue('cveReaseguradorIntermediario', $event)"
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveReaseguradorIntermediario : ''"
              />
            </v-col>

            <!-- INTERMEDIARIO (catálogo) -->
            <v-col v-if="intermediarioSI" cols="12" md="3">
              <v-select
                :model-value="formData.cveIntermediario"
                @update:model-value="setFieldValue('cveIntermediario', $event)"
                :items="queryIntermediarios?.data.value ?? []"
                item-title="nombreIntermediario"
                item-value="cveIntermediario"
                label="Intermediario"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveIntermediario : ''"
              />
            </v-col>

            <!-- ¿CORRETAJE? -->
            <v-col v-if="intermediarioSI" cols="12" md="3">
              <v-select
                :model-value="formData.corretaje"
                @update:model-value="setFieldValue('corretaje', $event)"
                :items="[{ title: 'NO', value: 0 }, { title: 'SI', value: 1 }]"
                item-title="title"
                item-value="value"
                label="¿Corretaje?"
                variant="solo-filled"
                :error-messages="showErrors ? formErrors.corretaje : ''"
              />
            </v-col>

            <!-- TIPO DE CORRETAJE -->
            <v-col v-if="corretajeSI" cols="12" md="3">
              <v-select
                :model-value="formData.cveAsignacionCorretaje"
                @update:model-value="setFieldValue('cveAsignacionCorretaje', $event)"
                :items="queryTipoAsignacion?.data.value ?? []"
                item-title="descAsignacion"
                item-value="cveAsignacion"
                label="Tipo de corretaje"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveAsignacionCorretaje : ''"
              />
            </v-col>

            <!-- % CORRETAJE FIJO (tipo = 0 FIJA, mutuamente excluyente con monto) -->
            <v-col v-if="showCorretajeFijo" cols="12" md="3">
              <v-text-field
                :model-value="porcentajeCorretajeFijo"
                @update:model-value="onInputGeneric('porcentajeCorretajeFijo', $event)"
                @blur="onBlurGeneric('porcentajeCorretajeFijo')"
                label="% Corretaje fijo"
                variant="solo-filled"
                :suffix="porcentajeCorretajeFijo ? '%' : ''"
                :disabled="formData.montoCorretajeFijo != null"
                :error-messages="showErrors ? formErrors.porcentajeCorretajeFijo : ''"
              />
              <v-slider
                :model-value="formData.porcentajeCorretajeFijo ?? 0"
                @update:model-value="setFieldValue('porcentajeCorretajeFijo', $event); porcentajeCorretajeFijo = $event.toFixed(4)"
                min="0"
                max="100"
                step="0.0001"
                color="primary"
                thumb-label
                :disabled="formData.montoCorretajeFijo != null"
                class="mt-1"
              />
            </v-col>

            <!-- MONTO CORRETAJE FIJO (tipo = 0 FIJA, mutuamente excluyente con %) -->
            <v-col v-if="showCorretajeFijo" cols="12" md="3">
              <v-text-field
                :model-value="montoCorretajeFijo"
                @update:model-value="onInputGeneric('montoCorretajeFijo', $event)"
                @blur="onBlurGeneric('montoCorretajeFijo')"
                label="Monto corretaje fijo"
                variant="solo-filled"
                :disabled="formData.porcentajeCorretajeFijo != null"
                :error-messages="showErrors ? formErrors.montoCorretajeFijo : ''"
              />
            </v-col>

            <!-- FÓRMULA LÍMITE CORRETAJE (tipo = 1 VARIABLE) -->
            <v-col v-if="showLimCorretaje" cols="12" md="3">
              <v-select
                :model-value="formData.cveLimCorretaje"
                @update:model-value="setFieldValue('cveLimCorretaje', $event)"
                :items="queryLimiteCorretaje?.data.value ?? []"
                item-title="limiteCorretaje"
                item-value="cveLimCorretaje"
                label="Fórmula límite corretaje"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveLimCorretaje : ''"
              />
            </v-col>

            <!-- % CORRETAJE PROVISIONAL (tipo = 1 VARIABLE o 2 ESCALONADA) -->
            <v-col v-if="showCorretajeProvisional" cols="12" md="3">
              <v-text-field
                :model-value="porcentajeCorretajeProvisional"
                @update:model-value="onInputGeneric('porcentajeCorretajeProvisional', $event)"
                @blur="onBlurGeneric('porcentajeCorretajeProvisional')"
                label="% Corretaje provisional"
                variant="solo-filled"
                :suffix="porcentajeCorretajeProvisional ? '%' : ''"
                :disabled="formData.montoCorretajeProvisional != null"
                :error-messages="showErrors ? formErrors.porcentajeCorretajeProvisional : ''"
              />
              <v-slider
                :model-value="formData.porcentajeCorretajeProvisional ?? 0"
                @update:model-value="setFieldValue('porcentajeCorretajeProvisional', $event); porcentajeCorretajeProvisional = $event.toFixed(4)"
                min="0"
                max="100"
                step="0.0001"
                color="primary"
                thumb-label
                :disabled="formData.montoCorretajeProvisional != null"
                class="mt-1"
              />
            </v-col>

            <!-- MONTO CORRETAJE PROVISIONAL (tipo = 1 o 2) -->
            <v-col v-if="showCorretajeProvisional" cols="12" md="3">
              <v-text-field
                :model-value="montoCorretajeProvisional"
                @update:model-value="onInputGeneric('montoCorretajeProvisional', $event)"
                @blur="onBlurGeneric('montoCorretajeProvisional')"
                label="Monto corretaje provisional"
                variant="solo-filled"
                :disabled="formData.porcentajeCorretajeProvisional != null"
                :error-messages="showErrors ? formErrors.montoCorretajeProvisional : ''"
              />
            </v-col>

          </v-row>

          <!-- BOTONES -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleAgregarIntermediario">
              Agregar intermediario
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              class="btn-guardar"
              @click="handleGuardarIntermediarios"
            >
              Guardar Intermediarios
            </v-btn>
          </v-row>

          <!-- TABLA -->
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
                  <v-toolbar-title>
                    Solo los registros de esta tabla se registrarán
                  </v-toolbar-title>
                  <v-spacer />
                </v-toolbar>
              </template>

              <template #no-data>No hay datos disponibles</template>

              <!-- ¿Corretaje? -->
              <template #item.corretaje="{ item }">
                {{ item.corretaje === 1 ? 'SI' : 'NO' }}
              </template>

              <!-- % Corretaje fijo -->
              <template #item.porcentajeCorretajeFijo="{ item }">
                {{ item.porcentajeCorretajeFijo != null ? `${item.porcentajeCorretajeFijo.toFixed(4)} %` : '—' }}
              </template>

              <!-- Monto corretaje fijo -->
              <template #item.montoCorretajeFijo="{ item }">
                {{ item.montoCorretajeFijo != null ? formatCurrency(item.montoCorretajeFijo) : '—' }}
              </template>

              <!-- % Corretaje provisional -->
              <template #item.porcentajeCorretajeProvisional="{ item }">
                {{ item.porcentajeCorretajeProvisional != null ? `${item.porcentajeCorretajeProvisional.toFixed(4)} %` : '—' }}
              </template>

              <!-- Monto corretaje provisional -->
              <template #item.montoCorretajeProvisional="{ item }">
                {{ item.montoCorretajeProvisional != null ? formatCurrency(item.montoCorretajeProvisional) : '—' }}
              </template>

              <!-- Checkbox activo -->
              <template #item.interActivo="{ item }">
                <v-checkbox
                  :model-value="item.interActivo"
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
</template>

<script lang="ts" setup>
import { formatCurrency } from "@/utils/formatters/formatCurrency";
import { useIntermediariosSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/intermediarios/useIntermediariosSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  porcentajeCorretajeFijo,
  montoCorretajeFijo,
  porcentajeCorretajeProvisional,
  montoCorretajeProvisional,
  onInputGeneric,
  onBlurGeneric,
  intermediarioSI,
  corretajeSI,
  showReasegurador,
  showCorretajeFijo,
  showCorretajeProvisional,
  showLimCorretaje,
  criterioEstaFijo,
  queryTipoAsignacion,
  queryLimiteCorretaje,
  queryIntermediarios,
  reaseguradoraData,
  tableHeaders,
  dataTable,
  handleAgregarIntermediario,
  handleGuardarIntermediarios,
  toggleRowActiva,
  editRow,
} = useIntermediariosSection();
</script>