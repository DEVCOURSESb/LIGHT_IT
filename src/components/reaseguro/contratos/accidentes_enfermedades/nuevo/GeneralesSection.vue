<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="handleSubmit">
          <!-- ! ROW-->
          <v-row>
            <!-- ID CONTRATO -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Identificador de contrato"
                variant="solo-filled"
                :model-value="formData['idContrato']"
                @update:model-value="setFieldValue('idContrato', $event.toUpperCase())"
                :error-messages="showErrors ? formErrors['idContrato'] : undefined"
              />
            </v-col>

            <!-- FECHA INICIO CONTRATO -->
            <v-col cols="12" md="3">
              <v-date-input
                label="Fecha inicio contrato"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                required
                variant="solo-filled"
                :model-value="formData['fechaInicioContrato']"
                @update:model-value="setFieldValue('fechaInicioContrato', $event)"
                :error-messages="showErrors ? formErrors['fechaInicioContrato'] : undefined"
              />
            </v-col>

            <!-- FECHA FIN CONTRATO -->
            <v-col cols="12" md="3">
              <v-date-input
                label="Fecha fin contrato"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                required
                variant="solo-filled"
                :model-value="formData['fechaFinContrato']"
                @update:model-value="setFieldValue('fechaFinContrato', $event)"
                :error-messages="showErrors ? formErrors['fechaFinContrato'] : undefined"
              />
            </v-col>

            <!-- ORDEN DE COBERTURA -->
            <v-col cols="12" md="3">
              <v-text-field
                label="Orden de cobertura"
                type="number"
                variant="solo-filled"
                :model-value="formData['ordenCobertura']"
                @update:model-value="setFieldValue('ordenCobertura', Number($event))"
                :error-messages="showErrors ? formErrors['ordenCobertura'] : undefined"
              />
            </v-col>
            
            <!-- CONTRATO RETENCION-->
            <v-col cols="12" md="3">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-select
                      :disabled="formData['ordenCobertura'] == 1"
                      :items="[
                        { title: 'SÍ', value: 1 },
                        { title: 'NO', value: 0 }
                      ]"
                      item-title="title"
                      item-value="value"
                      label="Contrato retención"
                      variant="solo-filled"
                      clearable
                      :model-value="formData['contratoRetencion']"
                      @update:model-value="setFieldValue('contratoRetencion', $event)"
                      :error-messages="showErrors ? formErrors['contratoRetencion'] : undefined"
                    />
                  </div>
                </template>

                <span>
                  Indicador que permite señalar si el contrato cubre la retención del contrato con orden de cobertura anterior
                </span>
              </v-tooltip>
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row>
            <v-col cols="12" md="3">
              <!-- TIPO DE REASEGURO -->
              <v-select
                :items="queryTiposReaseguro.data.value || []"
                item-title="descTreaseg"
                item-value="cveTreaseg"
                label="Tipo de reaseguro"
                variant="solo-filled"
                clearable
                :disabled="queryTiposReaseguro.isLoading.value"
                :model-value="formData['cveTreaseg']"
                @update:model-value="setFieldValue('cveTreaseg', $event)"
                :error-messages="showErrors ? formErrors['cveTreaseg'] : undefined"
              />
            </v-col>

            <!-- TIPO DE CONTRATO -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryTiposContrato.data.value?.filter(row => row.cveTreasegRaw == formData['cveTreaseg']) || []"
                item-title="descTcontrato"
                item-value="idTcontrato"
                label="Tipo de contrato"
                variant="solo-filled"
                clearable
                :disabled="queryTiposContrato.isLoading.value"
                :model-value="formData['idTContrato']"
                @update:model-value="setFieldValue('idTContrato', $event)"
                :error-messages="showErrors ? formErrors['idTContrato'] : undefined"
              />
            </v-col>

            <!-- FORMA CONTRACTUAL -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryFormaContractual.data.value || []"
                item-title="descFcontrac"
                item-value="cveFcontrac"
                label="Forma contractual"
                variant="solo-filled"
                clearable
                :disabled="queryFormaContractual.isLoading.value"
                :model-value="formData['cveFContrac']"
                @update:model-value="setFieldValue('cveFContrac', $event)"
                :error-messages="showErrors ? formErrors['cveFContrac'] : undefined"
              />
            </v-col>

            <!-- CRITERIO DE COBERTURA si reaseguro es proporcional-->
            <v-col cols="12" md="3" v-if="formData['cveTreaseg'] == 0">
              <v-select
                :items="queryCriterioCobertura.data.value || []"
                item-title="descCriterioCob"
                item-value="cveCriterioCob"
                label="Criterio de cobertura"
                variant="solo-filled"
                clearable
                :disabled="queryCriterioCobertura.isLoading.value"
                :model-value="formData['cveCriterioCob']"
                @update:model-value="setFieldValue('cveCriterioCob', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioCob'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row>
            <!-- TRASPASO DE CARTERA si reaseguro es proporcional-->
            <v-col cols="12" md="3" v-if="formData['cveTreaseg'] == 0">
              <v-select
                :items="[{title: 'SÍ', value: 1},{title: 'NO', value: 0}]"
                item-title="title"
                item-value="value"
                label="¿Traspaso de cartera?"
                variant="solo-filled"
                clearable
                :model-value="formData['traspasoCartera']"
                @update:model-value="setFieldValue('traspasoCartera', $event)"
                :error-messages="showErrors ? formErrors['traspasoCartera'] : undefined"
              />
            </v-col>

            <!-- ENTIDAD FEDERATIVA si forma contractual es facultativa-->
            <v-col cols="12" md="3" v-if="formData['cveFContrac'] == 1">
              <v-select
                :items="queryEntidadFederativa.data.value || []"
                item-title="nombreEntidad"
                item-value="cveEntidad"
                label="Entidad federativa"
                variant="solo-filled"
                clearable
                :disabled="queryEntidadFederativa.isLoading.value"
                :model-value="formData['cveEntidad']"
                @update:model-value="setFieldValue('cveEntidad', $event)"
                :error-messages="showErrors ? formErrors['cveEntidad'] : undefined"
              />
            </v-col>

            <!-- MUNICIPIO si forma contractual es facultativa-->
            <v-col cols="12" md="3" v-if="formData['cveFContrac'] == 1">
              <v-text-field 
                label="Municipio" 
                variant="solo-filled" 
                :model-value="formData['municipio']"
                @update:model-value="setFieldValue('municipio', $event.toUpperCase())"
                :error-messages="showErrors ? formErrors['municipio'] : undefined"
              />
            </v-col>

            <!-- TIPO DE SECTOR si forma contractual es facultativa-->
            <v-col cols="12" md="3" v-if="formData['cveFContrac'] == 1">
              <v-select
                :items="queryRr6Sector.data.value || []"
                item-title="descSector"
                item-value="cveSector"
                label="Tipo de sector"
                variant="solo-filled"
                clearable
                :disabled="queryRr6Sector.isLoading.value"
                :model-value="formData['cveSector']"
                @update:model-value="setFieldValue('cveSector', $event)"
                :error-messages="showErrors ? formErrors['cveSector'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- !row -->
          <v-row>
            <!-- ASEGURADO si forma contractual es facultativa-->
            <v-col cols="12" md="3" v-if="formData['cveFContrac'] == 1">
              <v-text-field
                label="Asegurado"
                variant="solo-filled"
                :model-value="formData['asegurado']"
                @update:model-value="setFieldValue('asegurado', $event.toUpperCase())"
                :error-messages="showErrors ? formErrors['asegurado'] : undefined"
              />
            </v-col>

            <!-- NEGOCIOS CUBIERTOS -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Negocios cubiertos"
                variant="solo-filled"
                :model-value="formData['negociosCubiertos']"
                @update:model-value="setFieldValue('negociosCubiertos', $event.toUpperCase())"
                :error-messages="showErrors ? formErrors['negociosCubiertos'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row align="center">
            <!-- MONEDA -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryMoneda.data.value || []"
                item-title="descMoneda"
                item-value="cveMoneda"
                label="Agregar moneda"
                variant="solo-filled"
                clearable
                multiple
                :disabled="queryMoneda.isLoading.value"
                :model-value="formData['cveMonedaContrato']"
                @update:model-value="setFieldValue('cveMonedaContrato', $event)"
              />
            </v-col>

            <!-- AGREGAR MONEDA -->
            <v-col cols="12" md="2">
              <v-btn size="large"  @click="sendSelectToTableMoneda">
                Agregar moneda
              </v-btn>
            </v-col>

            <!-- TIPO DE OPERACION / RAMO -->
            <v-col cols="12" md="2">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-select
                      :items="opcionesExtCoberDisponibles"
                      item-title="descExtCober"
                      item-value="cveExtCober"
                      item-disabled="disabled"
                      label="Tipo de operación / ramo"
                      variant="solo-filled"
                      clearable
                      :disabled="queryExtensionesCobertura.isLoading.value"
                      :model-value="formData['cveExtCoberContrato']"
                      @update:model-value="setFieldValue('cveExtCoberContrato', $event)"
                      :error-messages="showErrors ? formErrors['cveExtCoberContrato'] : undefined"
                    />
                  </div>
                </template>

                <span>
                  Indica si el contrato cubre por Operación / Ramo / Subramo / Subsubramo
                </span>
              </v-tooltip>
            </v-col>

            <!-- OPERACION / RAMO -->
            <v-col cols="12" md="2">
              <v-select
                :items="opcionesOperRamoFiltradas"
                item-title="descOperacionRamos"
                item-value="cveCobertura"
                label="Operación / ramo"
                variant="solo-filled"
                clearable
                multiple
                :disabled="queryOperacionesRamos.isLoading.value || formData['cveExtCoberContrato'] == null"
                :model-value="formData['cveOperRamo']"
                @update:model-value="setFieldValue('cveOperRamo', $event)"
              />
            </v-col>

            <!-- AGREGAR OPERACION / RAMO -->
            <v-col cols="12" md="3">
              <v-btn size="large"  @click="sendSelectToTableOperacionRamo">
                Agregar Operación / Ramo
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-checkbox
              label="Contrato activo"
              :model-value="formData['contratoActivo']"
              @update:model-value="setFieldValue('contratoActivo', !!$event)"
              :error-messages="showErrors ? formErrors['contratoActivo'] : undefined"
            ></v-checkbox>
          </v-row>

          <!-- ! ROW-->
          <v-row>
            <!-- table moneda activa -->
            <v-col cols="12" md="6">
              <v-data-table
                class="mt-4"
                :headers="headerMoneda"
                :items="dataMonedaToShow"
                :loading="false"
                striped="odd"
              >
                <template #item.monActiva="{ item }">
                  <v-checkbox
                    :model-value="item?.monActiva"
                    @update:model-value="() => toggleMonActiva(item)"
                    hide-details
                    density="compact"
                  />
                </template>

              </v-data-table>
              <div style="color: red; text-align: center; font-size: 12px;" v-if="showErrors && errorTablaMonedas">{{ errorTablaMonedas }}</div>
            </v-col>

            <!-- table operaciones ramo activas -->
            <v-col cols="12" md="6">
              <v-data-table
                class="mt-4"
                :headers="headerOperaciones"
                :items="dataOperacionesRamosShow"
                :loading="false"
                striped="odd"
              >
                <template #item.operRamoActivo="{ item }">
                  <v-checkbox
                    :model-value="item?.operRamoActivo"
                    @update:model-value="() => toggleOperRamoActivo(item)"
                    hide-details
                    density="compact"
                  />
                </template>

              </v-data-table>
              <div style="color: red; text-align: center; font-size: 12px;" v-if="showErrors && errorTablaOperacionRamo">{{ errorTablaOperacionRamo }}</div>
            </v-col>
          </v-row>

          <!-- ! ROW-->
          <v-row class="flex justify-end">
            <v-btn class="btn-guardar" size="large" @click="handleSubmit">
              Guardar generales
            </v-btn>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useGeneralSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/general/useGeneralSection";

const {
  /* formulario */
  formData,
  formErrors,
  setFieldValue,
  handleSubmit,
  showErrors,

  /* tablas */
  headerMoneda,
  dataTableMoneda,
  sendSelectToTableMoneda,
  toggleMonActiva,
  errorTablaMonedas,
  dataMonedaToShow,
  
  headerOperaciones,
  dataTableOperacionRamo,
  dataOperacionesRamosShow,
  sendSelectToTableOperacionRamo,
  toggleOperRamoActivo,
  errorTablaOperacionRamo,
 
  // catalogos a utilizar
  queryTiposReaseguro,
  queryTiposContrato,
  queryFormaContractual,
  queryCriterioCobertura,
  queryEntidadFederativa,
  queryRr6Sector,
  queryMoneda,
  queryExtensionesCobertura,
  queryOperacionesRamos,
  opcionesExtCoberDisponibles,
  opcionesOperRamoFiltradas,
} = useGeneralSection();
</script>
