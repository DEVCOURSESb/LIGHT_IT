<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <!-- ! ROW — Campos de captura -->
          <v-row>
            <!-- ASIGNACIÓN DE COBERTURAS -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter((item) => [0, 1, 3, 6].includes(item.cveCriterioAsig)) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Asignación de coberturas"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioAsignacion.isLoading.value || criterioEstaFijo"
                :model-value="formData['cveCriterioAsigCobertura']"
                @update:model-value="setFieldValue('cveCriterioAsigCobertura', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigCobertura'] : undefined"
              />
            </v-col>

            <!-- REASEGURADORA (solo si criterio = 0 o 6) -->
            <v-col cols="12" md="3" v-if="[0, 6].includes(formData['cveCriterioAsigCobertura']!)">
              <v-select
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :model-value="formData['cveReaseguradorCobertura']"
                @update:model-value="setFieldValue('cveReaseguradorCobertura', $event)"
                :error-messages="showErrors ? formErrors['cveReaseguradorCobertura'] : undefined"
              />
            </v-col>

            <!-- OPERACIÓN / RAMO (solo si criterio = 3 o 6) -->
            <v-col cols="12" md="3" v-if="[3, 6].includes(formData['cveCriterioAsigCobertura']!)">
              <v-select
                :items="operacionesRamosData"
                item-title="title"
                item-value="value"
                label="Operación / Ramo"
                variant="solo-filled"
                clearable
                :model-value="formData['cveOperRamoCobertura']"
                @update:model-value="setFieldValue('cveOperRamoCobertura', $event)"
                :error-messages="showErrors ? formErrors['cveOperRamoCobertura'] : undefined"
              />
            </v-col>

            <!-- COBERTURA -->
            <v-col cols="12" md="3">
              <v-select
                :items="coberturasDisponibles"
                item-title="descCobaye"
                item-value="cveCobaye"
                label="Cobertura"
                variant="solo-filled"
                clearable
                :model-value="formData['cveCobaye']"
                @update:model-value="setFieldValue('cveCobaye', $event)"
                :error-messages="showErrors ? formErrors['cveCobaye'] : undefined"
              />
            </v-col>

            <!-- ¿PROPIA SUMA ASEGURADA MÁXIMA? -->
            <v-col cols="12" md="3">
              <v-select
                :items="[{ title: 'SÍ', value: 'SÍ' }, { title: 'NO', value: 'NO' }]"
                item-title="title"
                item-value="value"
                label="¿Propia suma asegurada máxima?"
                variant="solo-filled"
                :model-value="formData['propiaSaMax']"
                @update:model-value="setFieldValue('propiaSaMax', $event)"
                :error-messages="showErrors ? formErrors['propiaSaMax'] : undefined"
              />
            </v-col>

            <!-- SUMA ASEGURADA MÁXIMA (solo si propiaSaMax = SI) -->
            <v-col cols="12" md="3" v-if="formData['propiaSaMax'] === 'SÍ'">
              <v-text-field
                label="Suma asegurada máxima"
                variant="solo-filled"
                :model-value="saMax"
                @update:model-value="onInputSaMax($event)"
                @blur="onBlurSaMax"
                :error-messages="showErrors ? formErrors['saMax'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Botones principales -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleAgregarCobertura">
              Agregar coberturas
            </v-btn>
            <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarCoberturas">
              Guardar coberturas
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

                <template #item.saMax="{ item }">
                  {{ item.saMax != null ? item.saMax.toLocaleString("es-MX", { minimumFractionDigits: 2 }) : "—" }}
                </template>

                <template #item.coberActiva="{ item }">
                  <v-checkbox
                    :model-value="item.coberActiva"
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
import { useCoberturasSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/coberturas/useCoberturasSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  saMax,
  onInputSaMax,
  onBlurSaMax,
  queryCriterioAsignacion,
  reaseguradoraData,
  operacionesRamosData,
  coberturasDisponibles,
  tableHeaders,
  dataTable,
  criterioEstaFijo,
  handleAgregarCobertura,
  handleGuardarCoberturas,
  toggleRowActiva,
  editRow,
} = useCoberturasSection();
</script>