<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-form @submit.prevent="">
          <!-- !ROW -->
          <v-row>
            <!-- REASEGURADORA -->
            <v-col cols="12" md="3">
              <v-select
                :items="queryReaseguradoras.data.value ?? []"
                item-title="nombreReasegurador"
                item-value="cveReasegurador"
                :disabled="queryReaseguradoras.isLoading.value"
                label="Reaseguradora"
                variant="solo-filled"
                clearable
                :model-value="formData['cveReasegurador']"
                @update:model-value="setFieldValue('cveReasegurador', $event)"
                :error-messages="showErrors ? formErrors['cveReasegurador'] : undefined"
              />
            </v-col>

            <!-- PARTICIPACION -->
            <v-col cols="12" md="3">
              <v-text-field
                label="% Participación"
                variant="solo-filled"
                type="text"
                :model-value="participacion"
                @update:model-value="onInputGeneric('participacion', $event)"
                @blur="onBlurGeneric('participacion')"
                :error-messages="showErrors ? formErrors['participacion'] : undefined"
                suffix="%"
              />
              <v-slider
                v-model="participacion"
                min="0.00"
                max="100.00"
                step=".01"
                thumb-label
                color="primary"
              />
            </v-col>

            <!-- ¿OTORGA PTU?  si es proporcional el contrato-->
            <v-col cols="12" md="3" v-if="isTypeProporcional">
              <v-select
                :items="[{title: 'SÍ', value: 1},{title: 'NO', value: 0}]"
                item-title="title"
                item-value="value"
                :disabled="false"
                label="¿Otorga PTU?"
                variant="solo-filled"
                clearable
                :model-value="formData['otorgaPtu']"
                @update:model-value="setFieldValue('otorgaPtu', $event)"
                :error-messages="showErrors ? formErrors['otorgaPtu'] : undefined"
              />
            </v-col>

            <!-- PORCENTAJE PTU si otorga ptu -->
            <v-col cols="12" md="3" v-if="formData['otorgaPtu'] == 1">
              <v-text-field
                label="% PTU"
                variant="solo-filled"
                type="text"
                :model-value="porcentajePtu"
                @update:model-value="onInputGeneric('porcentajePtu', $event)"
                @blur="onBlurGeneric('porcentajePtu')"
                :error-messages="showErrors ? formErrors['porcentajePtu'] : undefined"
                suffix="%"
              />
              <v-slider
                v-model="porcentajePtu"
                min="0.00"
                max="100.00"
                step=".01"
                thumb-label
                color="primary"
              />
            </v-col>

             <!-- FÓRMULA CÁLCULO PTU si otorga ptu-->
            <v-col cols="12" md="3" v-if="formData['otorgaPtu'] == 1">
              <v-select
                :items="queryPtu.data.value || []"
                item-title="formulaPtu"
                item-value="cvePtu"
                :disabled="false"
                label="Fórmula cálculo PTU"
                variant="solo-filled"
                clearable
                :model-value="formData['cvePtu']"
                @update:model-value="setFieldValue('cvePtu', $event)"
                :error-messages="showErrors ? formErrors['cvePtu'] : undefined"
              />
            </v-col>
            
            <!-- PORCENTAJE K si la formula de ptu es 2-->
            <v-col cols="12" md="3" v-if="formData['cvePtu'] == 2">
              <v-text-field
                label="% K"
                variant="solo-filled"
                type="text"
                :model-value="porcentajeK"
                @update:model-value="onInputGeneric('porcentajeK', $event)"
                @blur="onBlurGeneric('porcentajeK')"
                :error-messages="showErrors ? formErrors['porcentajeK'] : undefined"
                suffix="%"
              />
            </v-col>

            <!-- GASTOS si la formula de ptu de ptu es 5, 6 o 7 -->
            <v-col cols="12" md="3" v-if="[5, 6, 7].includes(formData['cvePtu'])">
              <v-text-field
                label="Gastos"
                variant="solo-filled"
                type="text"
                :model-value="gastos"
                @update:model-value="onInputGeneric('gastos', $event)"
                @blur="onBlurGeneric('gastos')"
                :error-messages="showErrors ? formErrors['gastos'] : undefined"
              />
            </v-col>

            <!-- AÑOS DE ARRASTRE si la formaula de ptu es 0, 3, 5 o 6 -->
            <v-col cols="12" md="3" v-if="[0, 3, 5, 6].includes(formData['cvePtu'])">
              <v-text-field
                label="Años de arrastre"
                variant="solo-filled"
                type="number"
                min="0"
                max="99"
                :model-value="formData['aniosArrastre']"
                @update:model-value="setFieldValue('aniosArrastre', $event)"
                :error-messages="showErrors ? formErrors['aniosArrastre'] : undefined"
              />
            </v-col>

            <!-- COMISION / RATE ON LINE -->
            <v-col cols="12" md="3">
              <v-select
                :items="[{title: 'SÍ', value: 1},{title: 'NO', value: 0}]"
                item-title="title"
                item-value="value"
                :disabled="false"
                label="¿Comisión / rate on line?"
                variant="solo-filled"
                clearable
                :model-value="formData['comisRolReaseguro']"
                @update:model-value="setFieldValue('comisRolReaseguro', $event)"
                :error-messages="showErrors ? formErrors['comisRolReaseguro'] : undefined"
              />
            </v-col>

            <!-- TIPO DE COMISION / RATE ON LINE si comision / rate on line -->
            <v-col cols="12" md="3" v-if="formData['comisRolReaseguro'] === 1">
              <v-select
                :items="queryTipoAsignacion.data.value || []"
                item-title="descAsignacion"
                item-value="cveAsignacion"
                :disabled="queryTipoAsignacion.isLoading.value"
                label="Tipo de comisión / rate on line"
                variant="solo-filled"
                clearable
                :model-value="formData['cveAsignacionComisRol']"
                @update:model-value="setFieldValue('cveAsignacionComisRol', $event)"
                :error-messages="showErrors ? formErrors['cveAsignacionComisRol'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- FÓRMULA COMISIÓN / RATE ON LINE si tipo de comision / rate online es 1 variable -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionComisRol'] == 1">
              <v-select
                :items="queryCalculoComision.data.value || []"
                item-title="formulaComision"
                item-value="cveCalComis"
                :disabled="queryCalculoComision.isLoading.value"
                label="Fórmula comisión / rate on line"
                variant="solo-filled"
                clearable
                :model-value="formData['cveCalComis']"
                @update:model-value="setFieldValue('cveCalComis', $event)"
                :error-messages="showErrors ? formErrors['cveCalComis'] : undefined"
              />
            </v-col>

            <!-- COMISIÓN / RATE ON LINE FIJA cuando tipo de comision es fija  -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionComisRol'] == 0">
              <v-text-field
                label="% Comisión / rate on line fija"
                variant="solo-filled"
                type="text"
                :model-value="comisRolFija"
                @update:model-value="onInputGeneric('comisRolFija', $event)"
                @blur="onBlurGeneric('comisRolFija')"
                :error-messages="showErrors ? formErrors['comisRolFija'] : undefined"
                suffix="%"
              />
              <v-slider
                v-model="comisRolFija"
                min="0.00"
                max="100.00"
                step=".01"
                thumb-label
                color="primary"
              />
            </v-col>
            
            <!-- % COMISIÓN / RATE ON LINE PROVISIONAL si tipo de comision / rate online es 1 variable o 2 escalonada  -->
            <v-col cols="12" md="3" v-if="[1, 2].includes(formData['cveAsignacionComisRol'])">
             <v-text-field
               label="% Comisión / rate on line provisional"
               variant="solo-filled"
               type="text"
               :model-value="comisRolProvisional"
               @update:model-value="onInputGeneric('comisRolProvisional', $event)"
               @blur="onBlurGeneric('comisRolProvisional')"
               :error-messages="showErrors ? formErrors['comisRolProvisional'] : undefined"
               suffix="%"
             />
             <v-slider
               v-model="comisRolProvisional"
               min="0.00"
               max="100.00"
               step=".01"
               thumb-label
               color="primary"
             />
            </v-col>
            

            <!-- % COMISIÓN / RATE ON LINE MÍNIMA si tipo de comision / rate online es 1 variable -->
            <v-col cols="12" md="3" v-if="[1].includes(formData['cveAsignacionComisRol'])">
             <v-text-field
               label="% Comisión / rate on line mínima"
               variant="solo-filled"
               type="text"
               :model-value="comisRolMin"
               @update:model-value="onInputGeneric('comisRolMin', $event)"
               @blur="onBlurGeneric('comisRolMin')"
               :error-messages="showErrors ? formErrors['comisRolMin'] : undefined"
               suffix="%"
             />
             <v-slider
               v-model="comisRolMin"
               min="0.00"
               max="100.00"
               step=".01"
               thumb-label
               color="primary"
             />
            </v-col>

            <!-- % COMISIÓN / RATE ON LINE MÁXIMA si tipo de comision / rate online es 1 variable -->
           <v-col cols="12" md="3" v-if="[1].includes(formData['cveAsignacionComisRol'])">
             <v-text-field
               label="% Comisión / rate on line máxima"
               variant="solo-filled"
               type="text"
               :model-value="comisRolMax"
               @update:model-value="onInputGeneric('comisRolMax', $event)"
               @blur="onBlurGeneric('comisRolMax')"
               :error-messages="showErrors ? formErrors['comisRolMax'] : undefined"
               suffix="%"
             />
             <v-slider
               v-model="comisRolMax"
               min="0.00"
               max="100.00"
               step=".01"
               thumb-label
               color="primary"
             />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- CAPA si el contrato es no proporcional -->
            <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-text-field
                label="Capa"
                variant="solo-filled"
                type="number"
                min="0"
                max="99999"
                :model-value="formData['capa']"
                @update:model-value="setFieldValue('capa', $event)"
                :error-messages="showErrors ? formErrors['capa'] : undefined"
              />
            </v-col>

            <!-- PRIORIDAD si el contrato es no proporcional -->
            <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-text-field
                label="Prioridad"
                variant="solo-filled"
                type="text"
                :model-value="prioridad"
                @update:model-value="onInputGeneric('prioridad', $event)"
                @blur="onBlurGeneric('prioridad')"
                :error-messages="showErrors ? formErrors['prioridad'] : undefined"
              />
            </v-col>

            <!-- LÍMITE DE RESPONSABILIDAD si el contrato es no proporcional -->
            <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-text-field
                label="Límite de responsabilidad"
                variant="solo-filled"
                type="text"
                :model-value="limResponsabilidad"
                @update:model-value="onInputGeneric('limResponsabilidad', $event)"
                @blur="onBlurGeneric('limResponsabilidad')"
                :error-messages="showErrors ? formErrors['limResponsabilidad'] : undefined"
              />
            </v-col>

            <!-- LÍMITE AGREGADO si el contrato es no proporcional -->
             <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-text-field
                label="Límite agregado"
                variant="solo-filled"
                type="text"
                :model-value="limAgregado"
                @update:model-value="onInputGeneric('limAgregado', $event)"
                @blur="onBlurGeneric('limAgregado')"
                :error-messages="showErrors ? formErrors['limAgregado'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- TIPO LIMITE AGREGADO si el contrato es no proporcional -->
            <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-select
                :items="queryCriterioAsignacion.data.value?.filter(item => [1,2,5,10].includes(item.cveCriterioAsig)) || []"
                item-title="descCriterioAsig"
                item-value="cveCriterioAsig"
                :disabled="queryCriterioAsignacion.isLoading.value"
                label="Tipo de límite agregado"
                variant="solo-filled"
                clearable
                :model-value="formData['cveCriterioAsigLimAgregado']"
                @update:model-value="setFieldValue('cveCriterioAsigLimAgregado', $event)"
                :error-messages="showErrors ? formErrors['cveCriterioAsigLimAgregado'] : undefined"
              />
            </v-col>

            <!-- TIPO DE COSTO si el contrato es no proporcional -->
            <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-select
                :items="queryTipoAsignacion.data.value?.filter(item => [0,1].includes(item.cveAsignacion)) || []"
                item-title="descAsignacion"
                item-value="cveAsignacion"
                :disabled="queryTipoAsignacion.isLoading.value"
                label="Tipo de costo"
                variant="solo-filled"
                clearable
                :model-value="formData['cveAsignacionCosto']"
                @update:model-value="setFieldValue('cveAsignacionCosto', $event)"
                :error-messages="showErrors ? formErrors['cveAsignacionCosto'] : undefined"
              />
            </v-col>

            <!-- COSTO FIJO si tipo de costo es fijo -->
             <v-col cols="12" md="3" v-if="formData['cveAsignacionCosto'] === 0">
              <v-text-field
                label="Costo fijo"
                variant="solo-filled"
                type="text"
                :model-value="costoFijo"
                @update:model-value="onInputGeneric('costoFijo', $event)"
                @blur="onBlurGeneric('costoFijo')"
                :error-messages="showErrors ? formErrors['costoFijo'] : undefined"
              />
            </v-col>

            <!-- PRIMA MÍNIMA Y DE DEPOSITO si tipo de costo es variable -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionCosto'] === 1">
              <v-text-field
                label="Prima mínima y de deposito"
                variant="solo-filled"
                type="text"
                :model-value="pmd"
                @update:model-value="onInputGeneric('pmd', $event)"
                @blur="onBlurGeneric('pmd')"
                :error-messages="showErrors ? formErrors['pmd'] : undefined"
              />
            </v-col>

            <!-- PRIMA MÍNIMA si tipo de costo es variable -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionCosto'] === 1">
              <v-text-field
                label="Prima mínima"
                variant="solo-filled"
                type="text"
                :model-value="primaMin"
                @update:model-value="onInputGeneric('primaMin', $event)"
                @blur="onBlurGeneric('primaMin')"
                :error-messages="showErrors ? formErrors['primaMin'] : undefined"
              />
            </v-col>
          </v-row>

          <!-- !ROW -->
          <v-row>
            <!-- PRIMA MÁXIMA si tipo de costo es variable -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionCosto'] === 1">
              <v-text-field
                label="Prima máxima"
                variant="solo-filled"
                type="text"
                :model-value="primaMax"
                @update:model-value="onInputGeneric('primaMax', $event)"
                @blur="onBlurGeneric('primaMax')"
                :error-messages="showErrors ? formErrors['primaMax'] : undefined"
              />
            </v-col>

            <!-- FACTOR DE AJUSTE DIVIDENDO si tipo de costo es variable -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionCosto'] === 1">
              <v-text-field
                label="Factor de ajuste dividendo"
                variant="solo-filled"
                type="number"
                min="0"
                max="99999"
                :model-value="formData['facAjusteDividendo']"
                @update:model-value="setFieldValue('facAjusteDividendo', $event)"
                :error-messages="showErrors ? formErrors['facAjusteDividendo'] : undefined"
              />
            </v-col>

            <!-- FACTOR DE AJUSTE DIVISOR -->
            <v-col cols="12" md="3" v-if="formData['cveAsignacionCosto'] === 1">
              <v-text-field
                label="Factor de ajuste divisor"
                variant="solo-filled"
                type="number"
                min="0"
                max="99999"
                :model-value="formData['facAjusteDivisor']"
                @update:model-value="setFieldValue('facAjusteDivisor', $event)"
                :error-messages="showErrors ? formErrors['facAjusteDivisor'] : undefined"
              />
            </v-col>

            <!-- BONO POR NO RECLAMACIONES -->
            <v-col cols="12" md="3" v-if="!isTypeProporcional">
              <v-text-field
                label="% Bono por no reclamaciones"
                variant="solo-filled"
                type="number"
                min="0.00"
                max="100.00"
                step=".01"
                :model-value="noClaims"
                @update:model-value="onInputGeneric('noClaims', $event)"
                @blur="onBlurGeneric('noClaims')"
                :error-messages="showErrors ? formErrors['noClaims'] : undefined"
                suffix="%"
              />
            </v-col>
          </v-row>

          <!-- !ROW BUTTONS -->
          <v-row class="flex justify-end">
            <!-- AGREGAR REASEGURADOR -->
            <v-col cols="12" md="3" class="d-flex gap-2 justify-end">
              <v-btn size="large" variant="outlined" @click="handleSendToTable">
                Agregar reasegurador
              </v-btn>
              <!-- GUARDAR REASEGURADORES -->
              <v-btn
                size="large"
                variant="outlined"
                class="btn-guardar"
                @click="handleSubmit"
              >
                Guardar reaseguradores
              </v-btn>
            </v-col>
          </v-row>

          <!-- !ROW TABLE -->
          
           <v-row>
            <v-col cols="12" md="12">
              <v-data-table class="mt-4" :headers="tableHeaders" :items="dataTable"
                :loading="false" striped="odd">
                <template #top>
                  <v-toolbar class="encabezado" flat>
                    <v-toolbar-title class="text-secondary">Solo los registros de esta tabla se registrarán</v-toolbar-title>
                    <v-spacer />
                  </v-toolbar>
                </template>
                <template #no-data> No hay datos disponibles </template>
                <template #item.reasegActiva="{ item }">
                  <v-checkbox :model-value="item?.reasegActiva" @update:model-value="toggleActive(item)" hide-details
                    density="compact" />
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
import { useReaseguradoresSection } from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/reaseguradores/useReaseguradoresSection";

const {
  queryReaseguradoras,
  queryPtu,
  queryTipoAsignacion,
  queryCalculoComision,
  queryCriterioAsignacion,
  participacion,
  formData,
  setFieldValue,
  formErrors,
  showErrors,
  handleSendToTable,
  handleSubmit,
  onInputGeneric,
  onBlurGeneric,
  isTypeProporcional,
  porcentajePtu,
  porcentajeK,
  gastos,
  comisRolFija,
  comisRolProvisional,
  comisRolMin,
  comisRolMax,
  prioridad,
  limResponsabilidad,
  limAgregado,
  costoFijo, 
  pmd,
  primaMin,
  primaMax,
  noClaims,
  dataTable,
  tableHeaders,
  toggleActive,
  editRow,
} = useReaseguradoresSection();
</script>
