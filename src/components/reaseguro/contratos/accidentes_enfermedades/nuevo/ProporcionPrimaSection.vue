<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <v-row>

            <!-- ASIGNACIÓN DE PROPORCIÓN DE PRIMA -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formData.cveCriterioAsigPrimaPropor"
                @update:model-value="setFieldValue('cveCriterioAsigPrimaPropor', $event)"
                :items="queryCriterioAsignacion.data.value?.filter(row => [1,0,4,3,6,7,8,9].includes(row.cveCriterioAsig)) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Asignación de proporción de prima "
                variant="solo-filled"
                clearable
                :disabled="criterioEstaFijo"
                :error-messages="showErrors ? formErrors.cveCriterioAsigPrimaPropor : ''"
              />
            </v-col>

            <!-- REASEGURADORA -->
            <v-col v-if="showReasegurador" cols="12" md="3">
              <v-select
                :model-value="formData.cveReaseguradorPrimaPropor"
                @update:model-value="setFieldValue('cveReaseguradorPrimaPropor', $event)"
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora "
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveReaseguradorPrimaPropor : ''"
              />
            </v-col>

            <!-- OPERACIÓN / RAMO -->
            <v-col v-if="showOperRamo" cols="12" md="3">
              <v-select
                :model-value="formData.cveOperRamoPrimaPropor"
                @update:model-value="setFieldValue('cveOperRamoPrimaPropor', $event)"
                :items="operacionesRamosData"
                item-title="title"
                item-value="value"
                label="Operación / Ramo "
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveOperRamoPrimaPropor : ''"
              />
            </v-col>

            <!-- COBERTURA -->
            <v-col v-if="showCobertura" cols="12" md="3">
              <v-select
                :model-value="formData.cveCobAyEPrimaPropor"
                @update:model-value="setFieldValue('cveCobAyEPrimaPropor', $event)"
                :items="coberturasDisponibles"
                item-title="descCobaye"
                item-value="cveCobAyE"
                label="Cobertura "
                variant="solo-filled"
                clearable
                :error-messages="showErrors ? formErrors.cveCobAyEPrimaPropor : ''"
              />
            </v-col>

            <!-- NÚMERO DE DÍAS CUBIERTOS -->
            <v-col cols="12" md="3">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-text-field
                      :model-value="formData.noDiasCubiertos"
                      @update:model-value="setFieldValue('noDiasCubiertos', $event ? parseInt($event): 0)"
                      label="Número de días cubiertos "
                      variant="solo-filled"
                      type="number"
                      min="0"
                      step="1"
                      :error-messages="showErrors ? formErrors.noDiasCubiertos : ''"
                    />
                  </div>
                </template>

                <span>
                  Indica el número de días de vigencia de la póliza a los cuales se le aplicará la proporción de la prima cedida
                </span>
              </v-tooltip>
            </v-col>

            <!-- % PRIMA ANUAL -->
            <v-col cols="12" md="3">
              <v-text-field
                :model-value="porcentajePrimaAnual"
                @update:model-value="porcentajePrimaAnual = $event !== '' ? parseFloat($event) : null"
                label="% Prima anual "
                variant="solo-filled"
                type="number"
                min="0"
                max="100"
                step="0.01"
                :suffix="porcentajePrimaAnual != null ? '%' : ''"
                :error-messages="showErrors ? formErrors.porcentajePrimaAnual : ''"
              />
              <v-slider
                :model-value="porcentajePrimaAnual ?? 0"
                @update:model-value="porcentajePrimaAnual = $event"
                min="0"
                max="100"
                step="0.01"
                color="primary"
                thumb-label
                class="mt-1"
              />
            </v-col>

          </v-row>

          <!-- BOTONES -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleAgregarProporcion">
              Agregar proporción
            </v-btn>
            <v-btn
              size="large"
              variant="outlined"
              class="btn-guardar"
              @click="handleGuardarProporciones"
            >
              Guardar proporciones
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
                  <v-toolbar-title class="text-secondary">
                    Solo los registros de esta tabla se registrarán
                  </v-toolbar-title>
                  <v-spacer />
                </v-toolbar>
              </template>

              <template #no-data>No hay datos disponibles</template>

              <!-- % Prima anual con símbolo -->
              <template #item.porcentajePrimaAnual="{ item }">
                {{ item.porcentajePrimaAnual != null ? `${item.porcentajePrimaAnual.toFixed(2)} %` : '—' }}
              </template>

              <!-- Checkbox activo -->
              <template #item.proporcionActiva="{ item }">
                <v-checkbox
                  :model-value="item.proporcionActiva"
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
import { useProporcionPrimas } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/proporcion_primas/useProporcionPrimas";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  porcentajePrimaAnual,
  criterioEstaFijo,
  showReasegurador,
  showOperRamo,
  showCobertura,
  queryCriterioAsignacion,
  reaseguradoraData,
  operacionesRamosData,
  coberturasDisponibles,
  tableHeaders,
  dataTable,
  handleAgregarProporcion,
  handleGuardarProporciones,
  toggleRowActiva,
  editRow,
} = useProporcionPrimas();
</script>