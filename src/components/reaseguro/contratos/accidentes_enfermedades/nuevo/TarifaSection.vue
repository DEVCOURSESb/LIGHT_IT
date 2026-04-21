<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">

          <!-- ! ROW — Campos de captura -->
          <v-row>
            <!-- ASIGNACIÓN DE TARIFA -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter((item) => [0, 1, 3, 4, 6, 7, 8, 9].includes(item.cveCriterioAsig)) ?? []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                label="Asignación de tarifa"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioAsignacion.isLoading.value || criterioEstaFijo"
                :model-value="formData['cveCriterioAsigTarifa']"
                @update:model-value="setFieldValue('cveCriterioAsigTarifa', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigTarifa'] : undefined"
              />
            </v-col>

            <!-- REASEGURADORA (criterio 0, 6, 7, 9) -->
            <v-col cols="12" md="3" v-if="[0, 6, 7, 9].includes(formData['cveCriterioAsigTarifa']!)">
              <v-select
                :items="reaseguradoraData"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :model-value="formData['cveReaseguradorTarifa']"
                @update:model-value="setFieldValue('cveReaseguradorTarifa', $event)"
                :error-messages="showErrors ? formErrors['cveReaseguradorTarifa'] : undefined"
              />
            </v-col>

            <!-- OPERACIÓN / RAMO (criterio 3, 6, 8, 9) -->
            <v-col cols="12" md="3" v-if="[3, 6, 8, 9].includes(formData['cveCriterioAsigTarifa']!)">
              <v-select
                :items="operacionesRamosData"
                item-title="title"
                item-value="value"
                label="Operación / Ramo"
                variant="solo-filled"
                clearable
                :model-value="formData['cveOperRamoTarifa']"
                @update:model-value="setFieldValue('cveOperRamoTarifa', $event)"
                :error-messages="showErrors ? formErrors['cveOperRamoTarifa'] : undefined"
              />
            </v-col>

            <!-- COBERTURA (criterio 4, 7, 8, 9) -->
            <v-col cols="12" md="3" v-if="[4, 7, 8, 9].includes(formData['cveCriterioAsigTarifa']!)">
              <v-select
                :items="coberturasDisponibles"
                item-title="descCobaye"
                item-value="cveCobAyE"
                label="Cobertura"
                variant="solo-filled"
                clearable
                :model-value="formData['cveCobAyETarifa']"
                @update:model-value="setFieldValue('cveCobAyETarifa', $event)"
                :error-messages="showErrors ? formErrors['cveCobAyETarifa'] : undefined"
              />
            </v-col>

            <!-- TIPO DE TARIFA -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryTipoTarifa?.data.value ?? []"
                item-title="descTarifa"
                item-value="cveTarifa"
                label="Tipo de tarifa"
                variant="solo-filled"
                clearable
                :loading="queryTipoTarifa?.isLoading.value"
                :model-value="formData['cveTarifa']"
                @update:model-value="setFieldValue('cveTarifa', $event)"
                :error-messages="showErrors ? formErrors['cveTarifa'] : undefined"
              />
            </v-col>

            <!-- PRIMA DE TARIFA FIJA (cveTarifa = 0 o 4) -->
            <v-col cols="12" md="3" v-if="[0, 4].includes(formData['cveTarifa']!)">
              <v-text-field
                label="Prima de tarifa fija"
                variant="solo-filled"
                :model-value="primaTarifaReaseg"
                @update:model-value="onInputGeneric('primaTarifaReaseg', $event)"
                @blur="onBlurGeneric('primaTarifaReaseg')"
                :error-messages="showErrors ? formErrors['primaTarifaReaseg'] : undefined"
              />
            </v-col>

            <!-- % SOBRE PRIMA EMITIDA (cveTarifa = 1) -->
            <v-col cols="12" md="3" v-if="formData['cveTarifa'] === 1">
              <v-text-field
                label="% Sobre prima emitida"
                variant="solo-filled"
                :model-value="porcentajePrimaEmi"
                @update:model-value="onInputGeneric('porcentajePrimaEmi', $event)"
                @blur="onBlurGeneric('porcentajePrimaEmi')"
                :error-messages="showErrors ? formErrors['porcentajePrimaEmi'] : undefined"
                suffix="%"
              />
            </v-col>

            <!-- TARIFA FIJA AL MILLAR (cveTarifa = 2 o 3) -->
            <v-col cols="12" md="3" v-if="[2, 3].includes(formData['cveTarifa']!)">
              <v-text-field
                label="Tarifa fija al millar"
                variant="solo-filled"
                :model-value="tarifaMillar"
                @update:model-value="onInputGeneric('tarifaMillar', $event)"
                @blur="onBlurGeneric('tarifaMillar')"
                :error-messages="showErrors ? formErrors['tarifaMillar'] : undefined"
              />
            </v-col>

            <!-- EDAD (cveTarifa = 2 o 4) -->
            <v-col cols="12" md="2" v-if="[2, 4].includes(formData['cveTarifa']!)">
              <v-text-field
                label="Edad"
                variant="solo-filled"
                :model-value="edad"
                @update:model-value="onInputGeneric('edad', $event)"
                @blur="onBlurGeneric('edad')"
                :error-messages="showErrors ? formErrors['edad'] : undefined"
              />
            </v-col>

            <!-- SEXO (cveTarifa = 2 o 4) -->
            <v-col cols="12" md="2" v-if="[2, 4].includes(formData['cveTarifa']!)">
              <v-select
                :items="querySexo?.data.value ?? []"
                item-title="descSexo"
                item-value="cveSexo"
                label="Sexo"
                variant="solo-filled"
                clearable
                :loading="querySexo?.isLoading.value"
                :model-value="formData['cveSexo']"
                @update:model-value="setFieldValue('cveSexo', $event)"
                :error-messages="showErrors ? formErrors['cveSexo'] : undefined"
              />
            </v-col>

            <!-- ¿PROPORCIÓN POR DÍAS DE VIGENCIA? -->
            <v-col cols="12" md="3">
              <v-select
                :items="[{ title: 'SÍ', value: 1 }, { title: 'NO', value: 0 }]"
                item-title="title"
                item-value="value"
                label="¿Proporción por días de vigencia?"
                variant="solo-filled"
                :model-value="formData['proporcionDias']"
                @update:model-value="setFieldValue('proporcionDias', $event)"
                :error-messages="showErrors ? formErrors['proporcionDias'] : undefined"
              />
            </v-col>

            <!-- MONEDA TARIFA (cveTarifa = 0 o 4) -->
            <v-col cols="12" md="3" v-if="[0, 4].includes(formData['cveTarifa']!)">
              <v-select
                :items="queryMonedas?.data.value ?? []"
                item-title="descMoneda"
                item-value="cveMoneda"
                label="Moneda tarifa"
                variant="solo-filled"
                clearable
                :loading="queryMonedas?.isLoading.value"
                :model-value="formData['cveMonedaTarifa']"
                @update:model-value="setFieldValue('cveMonedaTarifa', $event)"
                :error-messages="showErrors ? formErrors['cveMonedaTarifa'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW — Botones principales -->
          <v-row class="d-flex gap-2 justify-end">
            <v-btn size="large" variant="outlined" @click="handleAgregarTarifa">
              Agregar tarifa
            </v-btn>
            <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarTarifa">
              Guardar tarifa
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

                <template #item.proporcionDias="{ item }">
                  <v-checkbox
                    :model-value="item.proporcionDias"
                    hide-details
                    density="compact"
                  />
                </template>

                <template #item.primaTarifaReaseg="{ item }">
                  {{ item.primaTarifaReaseg != null
                      ? item.primaTarifaReaseg.toLocaleString("es-MX", { minimumFractionDigits: 2 })
                      : "—" }}
                </template>

                <template #item.porcentajePrimaEmi="{ item }">
                  {{ item.porcentajePrimaEmi != null ? `${item.porcentajePrimaEmi.toFixed(2)} %` : "—" }}
                </template>

                <template #item.tarifaMillar="{ item }">
                  {{ item.tarifaMillar != null ? item.tarifaMillar.toFixed(2) : "—" }}
                </template>

                <template #item.edad="{ item }">
                  {{ item.edad ?? "—" }}
                </template>
                <template #item.cveSexo="{ item }">
                  {{ item.cveSexo ?? "—" }}
                </template>

                <template #item.tarifaActiva="{ item }">
                  <v-checkbox
                    :model-value="item.tarifaActiva"
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
import { useTarifasSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/tarifas/useTarifasSection";

const {
  formData,
  formErrors,
  showErrors,
  setFieldValue,
  primaTarifaReaseg,
  porcentajePrimaEmi,
  tarifaMillar,
  edad,
  onInputGeneric,
  onBlurGeneric,
  queryCriterioAsignacion,
  queryTipoTarifa,
  queryMonedas,
  querySexo,
  reaseguradoraData,
  operacionesRamosData,
  coberturasDisponibles,
  tableHeaders,
  dataTable,
  criterioEstaFijo,
  handleAgregarTarifa,
  handleGuardarTarifa,
  toggleRowActiva,
  editRow,
} = useTarifasSection();
</script>