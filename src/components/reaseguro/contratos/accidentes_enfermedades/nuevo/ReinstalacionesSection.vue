<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <v-row>

            <!-- ¿REINSTALACIÓN? -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formData.reinstalacion"
                @update:model-value="setFieldValue('reinstalacion', $event)"
                :items="[{ title: 'NO', value: 0 }, { title: 'SI', value: 1 }]"
                item-title="title"
                item-value="value"
                label="¿Reinstalación?"
                variant="solo-filled"
                :disabled="!moduloHabilitado"
                :error-messages="showErrors ? formErrors.reinstalacion : ''"
              />
            </v-col>

            <!-- ASIGNACIÓN DE REINSTALACIÓN -->
            <v-col v-if="reinstalacionSI" cols="12" md="3">
              <v-select
                :model-value="formData.cveCriterioAsigReinstalacion"
                @update:model-value="setFieldValue('cveCriterioAsigReinstalacion', $event)"
                :items="[
                  { title: 'POR REASEGURADORA', value: 0 },
                  { title: 'POR CONTRATO',      value: 1 },
                ]"
                item-title="title"
                item-value="value"
                label="Asignación de reinstalación"
                variant="solo-filled"
                :disabled="criterioBloqueado || criterioEstaFijo"
                :error-messages="showErrors ? formErrors.cveCriterioAsigReinstalacion : ''"
              />
            </v-col>

            <!-- REASEGURADORA -->
            <v-col v-if="showReasegurador" cols="12" md="3">
              <v-select
                :model-value="formData.cveReaseguradorReinstalacion"
                @update:model-value="setFieldValue('cveReaseguradorReinstalacion', $event)"
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveReaseguradorReinstalacion : ''"
              />
            </v-col>

            <!-- NO. REINSTALACIÓN (display solo lectura) -->
            <v-col v-if="reinstalacionSI" cols="12" md="2">
              <v-text-field
                :model-value="noReinstalacionPreview"
                label="No. Reinstalación"
                variant="solo-filled"
                readonly
              />
            </v-col>

            <!-- CUOTA DE AJUSTE -->
            <v-col v-if="showCuotaAjuste" cols="12" md="3">
              <v-text-field
                :model-value="cuotaAjuste"
                @update:model-value="onInputGeneric('cuotaAjusteReinstalacion', $event)"
                @blur="onBlurGeneric('cuotaAjusteReinstalacion')"
                label="Cuota de ajuste (%)"
                variant="solo-filled"
                :suffix="cuotaAjuste ? '%' : ''"
                :error-messages="showErrors ? formErrors.cuotaAjusteReinstalacion : ''"
              />
            </v-col>

            <!-- COSTO DE REINSTALACIÓN -->
            <v-col v-if="showCostoReinstalacion" cols="12" md="3">
              <v-text-field
                :model-value="costoReinstalacion"
                @update:model-value="onInputGeneric('costoReinstalacion', $event)"
                @blur="onBlurGeneric('costoReinstalacion')"
                label="Costo de reinstalación"
                variant="solo-filled"
                :error-messages="showErrors ? formErrors.costoReinstalacion : ''"
              />
            </v-col>

            <!-- MONTO REINSTALADO -->
            <v-col v-if="showMontoReinstalado" cols="12" md="3">
              <v-text-field
                :model-value="montoReinstalado"
                @update:model-value="onInputGeneric('montoReinstalado', $event)"
                @blur="onBlurGeneric('montoReinstalado')"
                label="Monto reinstalado"
                variant="solo-filled"
                :error-messages="showErrors ? formErrors.montoReinstalado : ''"
              />
            </v-col>

          </v-row>

          <!-- BOTONES -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn
              size="large"
              variant="outlined"
              :disabled="!moduloHabilitado"
              @click="handleAgregarReinstalacion"
            >
              Agregar reinstalación
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              class="btn-guardar"
              :disabled="!moduloHabilitado"
              @click="handleGuardarReinstalaciones"
            >
              Guardar reinstalaciones
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

              <!-- Cuota de ajuste con % -->
              <template #item.cuotaAjusteReinstalacion="{ item }">
                {{ item.cuotaAjusteReinstalacion != null ? `${item.cuotaAjusteReinstalacion.toFixed(2)} %` : '—' }}
              </template>

              <!-- Costo y monto con formato de moneda -->
              <template #item.costoReinstalacion="{ item }">
                {{ item.costoReinstalacion != null ? formatCurrency(item.costoReinstalacion) : '—' }}
              </template>

              <template #item.montoReinstalado="{ item }">
                {{ item.montoReinstalado != null ? formatCurrency(item.montoReinstalado) : '—' }}
              </template>

              <!-- Checkbox activo -->
              <template #item.reinstalacionActiva="{ item }">
                <v-checkbox
                  :model-value="item.reinstalacionActiva"
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
import { formatCurrency } from "@/utils/formatCurrency";
import { useReinstalacionesSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/reinstalaciones/useReinstalacionesSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  cuotaAjuste,
  costoReinstalacion,
  montoReinstalado,
  onInputGeneric,
  onBlurGeneric,
  moduloHabilitado,
  reinstalacionSI,
  showReasegurador,
  showCuotaAjuste,
  showCostoReinstalacion,
  showMontoReinstalado,
  criterioBloqueado,
  criterioEstaFijo,
  noReinstalacionPreview,
  reaseguradoraData,
  tableHeaders,
  dataTable,
  handleAgregarReinstalacion,
  handleGuardarReinstalaciones,
  toggleRowActiva,
  editRow,
} = useReinstalacionesSection();
</script>