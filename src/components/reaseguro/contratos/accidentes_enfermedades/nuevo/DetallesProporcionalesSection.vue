<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <!-- ! ROW — Campos de captura fila 1 -->
          <v-row>
            <!-- ¿DETALLES POR OPERACIÓN / RAMO? -->
            <v-col cols="12" md="3">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-select
                      :items="[{ title: 'SÍ', value: 1 }, { title: 'NO', value: 0 }]"
                      item-title="title"
                      item-value="value"
                      label="¿Detalles por operación / ramo?"
                      variant="solo-filled"
                      clearable
                      :model-value="formData['detallesOperRamo']"
                      @update:model-value="setFieldValue('detallesOperRamo', $event)"
                      :error-messages="showErrors ? formErrors['detallesOperRamo'] : undefined"
                      :disabled="isDetallesOperacionRamoDisabled"
                    />
                  </div>
                </template>

                <span>
                  ¿El contrato tiene diferentes condiciones de cobertura entre cada ramo / subramo / subsubramo?
                </span>
              </v-tooltip>
            </v-col>   

            <!-- TIPO DE OPERACIÓN / RAMO (DETALLADA) -->
            <v-col cols="12" md="3" v-show="formData['detallesOperRamo'] === 1">
              <v-select
                :items="extensionesCoberturaToShow"
                item-title="descExtCober"
                item-value="cveExtCober"
                label="Tipo de operación / ramo (detallada)"
                variant="solo-filled"
                clearable
                :disabled="queryExtensionesCobertura.isLoading.value"
                :model-value="formData['cveExtCoberDetalles']"
                @update:model-value="setFieldValue('cveExtCoberDetalles', $event)"
                :error-messages="showErrors ? formErrors['cveExtCoberDetalles'] : undefined"
              />
            </v-col>

            <!-- OPERACIÓN / RAMO (DETALLADA) -->
            <v-col cols="12" md="3" v-show="formData['detallesOperRamo'] === 1">
              <v-select
                :items="queryOperacionesRamos.data.value?.filter((op) => String(op.cveExtCober) == String(formData['cveExtCoberDetalles'])) ?? []"
                item-title="descOperacionRamos"
                item-value="cveCobertura"
                label="Operación / ramo (detallada)"
                variant="solo-filled"
                clearable
                :disabled="queryOperacionesRamos.isLoading.value || formData['cveExtCoberDetalles'] == null"
                :model-value="formData['cveOperRamoDetalles']"
                @update:model-value="setFieldValue('cveOperRamoDetalles', $event)"
                :error-messages="showErrors ? formErrors['cveOperRamoDetalles'] : undefined"
              />
            </v-col>

            <!-- % RETENCIÓN (input + slider) -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Retención"
                variant="solo-filled"
                type="number"
                v-model.number="porcentajeRetencion"
                min="0"
                max="100"
                step="0.01"
                suffix="%"
                :error-messages="showErrors ? formErrors['porcentajeRetencion'] : undefined"
              />
              <v-slider
                v-model.number="porcentajeRetencionSlider"
                min="0"
                max="100"
                step="0.01"
                thumb-label
                color="primary"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Campos de captura fila 2 -->
          <v-row>
            <!-- % CESIÓN — solo lectura, calculado automáticamente -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Cesión"
                variant="solo-filled"
                :model-value="porcentajeCesion != null ? porcentajeCesion.toFixed(2) : ''"
                readonly
                suffix="%"
              />
            </v-col>

            <!-- MONTO RETENCIÓN -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Monto retención"
                variant="solo-filled"
                :model-value="montoRetencion"
                @update:model-value="onInputGeneric('montoRetencion', $event)"
                @blur="onBlurGeneric('montoRetencion')"
                :error-messages="showErrors ? formErrors['montoRetencion'] : undefined"
              />
            </v-col>

            <!-- MONTO CESIÓN -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Monto cesión"
                variant="solo-filled"
                :model-value="montoCesion"
                @update:model-value="onInputGeneric('montoCesion', $event)"
                @blur="onBlurGeneric('montoCesion')"
                :error-messages="showErrors ? formErrors['montoCesion'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Campos de captura fila 3 -->
          <v-row>
            <!-- CAPACIDAD DE CONTRATO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Capacidad de contrato"
                variant="solo-filled"
                :model-value="capacidadContrato"
                @update:model-value="onInputGeneric('capacidadContrato', $event)"
                @blur="onBlurGeneric('capacidadContrato')"
                :error-messages="showErrors ? formErrors['capacidadContrato'] : undefined"
              />
            </v-col>

            <!-- CRITERIO DE CAPACIDAD (solo opciones 5 y 10) -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter((item) => [5, 10].includes(item.cveCriterioAsig)) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Criterio de capacidad"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioAsignacion.isLoading.value"
                :model-value="formData['cveCriterioAsigCapacidad']"
                @update:model-value="setFieldValue('cveCriterioAsigCapacidad', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigCapacidad'] : undefined"
              />
            </v-col>

            <!-- DISTRIBUCIÓN DE LA CESIÓN -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryDistribucionCesion.data.value ?? []"
                item-title="descDistrcesion"
                item-value="cveDistrcesion"
                label="Distribución de la cesión"
                variant="solo-filled"
                clearable
                :loading="queryDistribucionCesion.isLoading.value"
                :disabled="queryDistribucionCesion.isLoading.value"
                :model-value="formData['cveDistrCesion']"
                @update:model-value="setFieldValue('cveDistrCesion', $event)"
                :error-messages="showErrors ? formErrors['cveDistrCesion'] : undefined"
              />
            </v-col>

            <!-- MONEDA DETALLES -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryMoneda.data.value ?? []"
                item-title="descMoneda"
                item-value="cveMoneda"
                label="Moneda detalles"
                variant="solo-filled"
                clearable
                :loading="queryMoneda.isLoading.value"
                :disabled="queryMoneda.isLoading.value"
                :model-value="formData['cveMonedaDetalles']"
                @update:model-value="setFieldValue('cveMonedaDetalles', $event)"
                :error-messages="showErrors ? formErrors['cveMonedaDetalles'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW -->
          <v-row>
            <!-- CÚMULOS -->
            <v-col cols="12" md="3">
              <v-select
                :items="[{ title: 'SÍ', value: 1 }, { title: 'NO', value: 0 }]"
                item-title="title"
                item-value="value"
                label="¿Cúmulos?"
                variant="solo-filled"
                clearable
                :model-value="formData['cumulos']"
                @update:model-value="setFieldValue('cumulos', $event)"
                :error-messages="showErrors ? formErrors['cumulos'] : undefined"
              />
            </v-col>

            <v-col cols="12" md="6" />

            <!-- BOTONES -->
            <v-col cols="12" md="3" class="d-flex gap-2 justify-end">
              <v-btn size="large" variant="outlined" @click="sendDataToTable">
                Agregar detalles
              </v-btn>
              <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleSubmit">
                Guardar detalles
              </v-btn>
            </v-col>
          </v-row>

          <br />

          <!-- ! ROW — Tabla -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                class="mt-2"
                :headers="detallesProporcionalesTableHeaders"
                :items="detallesProporcionalesTableDisplay"
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

                <!-- % Retención formateado -->
                <template #item.porcentajeRetencion="{ item }">
                  {{ item.porcentajeRetencion != null ? `${item.porcentajeRetencion.toFixed(2)} %` : "—" }}
                </template>

                <!-- % Cesión formateado -->
                <template #item.porcentajeCesion="{ item }">
                  {{ item.porcentajeCesion != null ? `${item.porcentajeCesion.toFixed(2)} %` : "—" }}
                </template>

                <!-- Cúmulos legible -->
                <template #item.cumulos="{ item }">
                  {{ item.cumulos === 1 ? "SÍ" : "NO" }}
                </template>

                <!-- Checkbox activo -->
                <template #item.detalleActivo="{ item }">
                  <v-checkbox
                    :model-value="item.detalleActivo"
                    @update:model-value="toggleActive(item)"
                    hide-details
                    density="compact"
                  />
                </template>

                <!-- Botón editar -->
                <template #item.actions="{ item }">
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
import { useDetallesProporcionalesSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/detalles_proporcionales/useDetallesProporcionalesSection";

const {
  formData,
  setFieldValue,
  formErrors,
  showErrors,
  handleSubmit,
  // catálogos
  queryExtensionesCobertura,
  extensionesCoberturaToShow,
  queryOperacionesRamos,
  queryCriterioAsignacion,
  queryDistribucionCesion,
  queryMoneda,
  // porcentajes
  porcentajeRetencion,
  porcentajeCesion,
  // montos
  montoRetencion,
  montoCesion,
  capacidadContrato,
  onInputGeneric,
  onBlurGeneric,
  // tabla
  detallesProporcionalesTableDisplay,
  detallesProporcionalesTableHeaders,
  sendDataToTable,
  editRow,
  toggleActive,
  isDetallesOperacionRamoDisabled,
  porcentajeRetencionSlider
} = useDetallesProporcionalesSection();
</script>