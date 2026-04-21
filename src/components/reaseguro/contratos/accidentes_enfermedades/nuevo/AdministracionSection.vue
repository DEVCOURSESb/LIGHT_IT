<template>
  <v-card>
    <v-card-text>
      <v-container>

        <!-- 
             SECCIÓN 1 — FORMA DE PAGO
         -->
        <v-divider class="mb-4" />
        <div class="text-subtitle-1 font-weight-bold mb-3">Forma de pago</div>

        <v-form @submit.prevent="">
          <v-row>

            <!-- FORMA DE PAGO -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formPago.cveFormaPago"
                @update:model-value="setFieldPago('cveFormaPago', $event)"
                :items="queryFormaPago?.data.value ?? []"
                item-title="descFormaPago"
                item-value="cveFormaPago"
                label="Forma de pago"
                variant="solo-filled"
                clearable
                :error-messages="showErrorsPago ? errorsPago.cveFormaPago : ''"
              />
            </v-col>

            <!-- % DE PAGO (solo cuando ESPECÍFICA = 7) -->
            <v-col v-if="formPago.cveFormaPago === 7" cols="12" md="3">
              <v-text-field
                :model-value="porcentajePago"
                @update:model-value="
                  porcentajePago = $event !== '' ? parseFloat($event) : null;
                  setFieldPago('porcentajePago', porcentajePago);
                "
                label="% de pago"
                variant="solo-filled"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                :suffix="porcentajePago != null ? '%' : ''"
                :error-messages="showErrorsPago ? errorsPago.porcentajePago : ''"
              />
              <v-slider
                :model-value="porcentajePago ?? 0"
                @update:model-value="
                  porcentajePago = $event;
                  setFieldPago('porcentajePago', $event);
                "
                min="0.01"
                max="100"
                step="0.01"
                color="primary"
                thumb-label
                class="mt-1"
              />
            </v-col>

            <!-- FECHA DE PAGO (solo cuando ESPECÍFICA = 7) -->
            <v-col v-if="formPago.cveFormaPago === 7" cols="12" md="3">
              <v-text-field
                :model-value="formPago.fechaPago"
                @update:model-value="setFieldPago('fechaPago', $event)"
                label="Fecha de pago"
                variant="solo-filled"
                type="date"
                :min="fechaMinIso"
                :error-messages="showErrorsPago ? errorsPago.fechaPago : ''"
              />
            </v-col>

          </v-row>

          <v-row class="d-flex justify-end mb-2">
            <v-btn size="large" variant="outlined" @click="handleAgregarPago">
              Agregar pago
            </v-btn>
          </v-row>

          <!-- Indicador suma % -->
          <div
            v-if="tablaPagos.some(p => p.cveFormaPago === 7)"
            class="text-caption mb-2"
            :class="Math.abs(sumaPorcentajePagos - 100) < 0.001 ? 'text-success' : 'text-error'"
          >
            Suma de pagos activos: {{ sumaPorcentajePagos.toFixed(2) }}% / 100%
          </div>

          <v-data-table
            class="mt-2"
            :headers="headersPago"
            :items="tablaPagos"
            density="compact"
            striped="odd"
          >
            <template #no-data>No hay pagos registrados</template>
            <template #item.porcentajePago="{ item }">
              {{ item.porcentajePago != null ? `${item.porcentajePago.toFixed(2)} %` : '—' }}
            </template>
            <template #item.pagoActivo="{ item }">
              <v-checkbox :model-value="item.pagoActivo" @update:model-value="togglePagoActivo(item)" hide-details density="compact" />
            </template>
            <template #item.editar="{ item }">
              <v-icon class="edit" size="large" @click="editPago(item)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-form>

        <!-- 
             SECCIÓN 2 — ESTADOS DE CUENTA
         -->
        <v-divider class="my-6" />
        <div class="text-subtitle-1 font-weight-bold mb-3">Estados de cuenta</div>

        <v-form @submit.prevent="">
          <v-row>

            <!-- PERIODICIDAD EDO -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formEdo.cvePeriodicidadEdo"
                @update:model-value="setFieldEdo('cvePeriodicidadEdo', $event)"
                :items="OPCIONES_PERIODICIDAD"
                item-title="title"
                item-value="value"
                label="Periodo de estados de cuenta"
                variant="solo-filled"
                clearable
                :error-messages="showErrorsEdo ? errorsEdo.cvePeriodicidadEdo : ''"
              />
            </v-col>

            <!-- FECHA EDO (solo ESPECÍFICA = 7) -->
            <v-col v-if="formEdo.cvePeriodicidadEdo === 7" cols="12" md="3">
              <v-text-field
                :model-value="formEdo.fechaEdo"
                @update:model-value="setFieldEdo('fechaEdo', $event)"
                label="Fecha estado de cuenta"
                variant="solo-filled"
                type="date"
                :min="fechaMinIso"
                :error-messages="showErrorsEdo ? errorsEdo.fechaEdo : ''"
              />
            </v-col>

          </v-row>

          <v-row class="d-flex justify-end mb-2">
            <v-btn size="large" variant="outlined" @click="handleAgregarEdo">
              Agregar estados de cuenta
            </v-btn>
          </v-row>

          <v-data-table
            class="mt-2"
            :headers="headersEdo"
            :items="tablaEdo"
            density="compact"
            striped="odd"
          >
            <template #no-data>No hay estados de cuenta registrados</template>
            <template #item.edoActivo="{ item }">
              <v-checkbox :model-value="item.edoActivo" @update:model-value="toggleEdoActivo(item)" hide-details density="compact" />
            </template>
            <template #item.editar="{ item }">
              <v-icon class="edit" size="large" @click="editEdo(item)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-form>

        <!-- 
             SECCIÓN 3 — BORDEREAUX PRIMAS
         -->
        <v-divider class="my-6" />
        <div class="text-subtitle-1 font-weight-bold mb-3">Bordereaux primas</div>

        <v-form @submit.prevent="">
          <v-row>

            <!-- PERIODICIDAD PRIMAS -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formPrimas.cvePeriodicidadPrimas"
                @update:model-value="setFieldPrimas('cvePeriodicidadPrimas', $event)"
                :items="OPCIONES_PERIODICIDAD"
                item-title="title"
                item-value="value"
                label="Envío bordereaux primas"
                variant="solo-filled"
                clearable
                :error-messages="showErrorsPrimas ? errorsPrimas.cvePeriodicidadPrimas : ''"
              />
            </v-col>

            <!-- FECHA PRIMAS (solo ESPECÍFICA = 7) -->
            <v-col v-if="formPrimas.cvePeriodicidadPrimas === 7" cols="12" md="3">
              <v-text-field
                :model-value="formPrimas.fechaPrimas"
                @update:model-value="setFieldPrimas('fechaPrimas', $event)"
                label="Fecha de bordereaux primas"
                variant="solo-filled"
                type="date"
                :min="fechaMinIso"
                :error-messages="showErrorsPrimas ? errorsPrimas.fechaPrimas : ''"
              />
            </v-col>

          </v-row>

          <v-row class="d-flex justify-end mb-2">
            <v-btn size="large" variant="outlined" @click="handleAgregarBorPrimas">
              Agregar bordereaux primas
            </v-btn>
          </v-row>

          <v-data-table
            class="mt-2"
            :headers="headersBorPrimas"
            :items="tablaBorPrimas"
            density="compact"
            striped="odd"
          >
            <template #no-data>No hay bordereaux primas registrados</template>
            <template #item.primasActivo="{ item }">
              <v-checkbox :model-value="item.primasActivo" @update:model-value="togglePrimasActivo(item)" hide-details density="compact" />
            </template>
            <template #item.editar="{ item }">
              <v-icon class="edit" size="large" @click="editBorPrimas(item)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-form>

        <!-- 
             SECCIÓN 4 — BORDEREAUX SINIESTROS
         -->
        <v-divider class="my-6" />
        <div class="text-subtitle-1 font-weight-bold mb-3">Bordereaux siniestros</div>

        <v-form @submit.prevent="">
          <v-row>

            <!-- PERIODICIDAD SINIESTROS -->
            <v-col cols="12" md="3">
              <v-select
                :model-value="formSiniestros.cvePeriodicidadSiniestros"
                @update:model-value="setFieldSiniestros('cvePeriodicidadSiniestros', $event)"
                :items="OPCIONES_PERIODICIDAD"
                item-title="title"
                item-value="value"
                label="Envío bordereaux siniestros"
                variant="solo-filled"
                clearable
                :error-messages="showErrorsSiniestros ? errorsSiniestros.cvePeriodicidadSiniestros : ''"
              />
            </v-col>

            <!-- FECHA SINIESTROS (solo ESPECÍFICA = 7) -->
            <v-col v-if="formSiniestros.cvePeriodicidadSiniestros === 7" cols="12" md="3">
              <v-text-field
                :model-value="formSiniestros.fechaSiniestros"
                @update:model-value="setFieldSiniestros('fechaSiniestros', $event)"
                label="Fecha de bordereaux siniestros"
                variant="solo-filled"
                type="date"
                :min="fechaMinIso"
                :error-messages="showErrorsSiniestros ? errorsSiniestros.fechaSiniestros : ''"
              />
            </v-col>

          </v-row>

          <v-row class="d-flex justify-end mb-2">
            <v-btn size="large" variant="outlined" @click="handleAgregarBorSiniestros">
              Agregar bordereaux siniestros
            </v-btn>
          </v-row>

          <v-data-table
            class="mt-2"
            :headers="headersBorSiniestros"
            :items="tablaBorSiniestros"
            density="compact"
            striped="odd"
          >
            <template #no-data>No hay bordereaux siniestros registrados</template>
            <template #item.siniestrosActivo="{ item }">
              <v-checkbox :model-value="item.siniestrosActivo" @update:model-value="toggleSiniestrosActivo(item)" hide-details density="compact" />
            </template>
            <template #item.editar="{ item }">
              <v-icon class="edit" size="large" @click="editBorSiniestros(item)">mdi-pencil</v-icon>
            </template>
          </v-data-table>
        </v-form>

        <!-- 
             BOTONES FINALES
         -->
        <v-divider class="my-6" />
        <v-row class="d-flex gap-2 justify-end">
          <v-btn size="large" variant="outlined" class="btn-guardar" @click="handleGuardarAdministracion">
            Guardar administración
          </v-btn>
          <!-- <v-btn size="large" variant="elevated" color="primary" @click="handleCrearContrato"> -->
          <v-btn size="large" variant="elevated" color="primary" @click="() => { showModal = true }">
            Crear contrato
          </v-btn>
        </v-row>

      </v-container>
    </v-card-text>
  </v-card>
  <modal-resumen v-model="showModal" />
</template>

<script lang="ts" setup>
import {
  useAdministracionSection,
  OPCIONES_PERIODICIDAD,
} from "@/composables/reaseguro/contratos/accicentes_enfermedades/nuevo/administracion/useAdministracionSection";

import ModalResumen from "@/pages/reaseguro/Contratos/accidentes-enfermedades/modal_final/ModalResumen.vue"
import { ref } from "vue";

const showModal = ref(false);

const {
  queryFormaPago,
  fechaMinIso,
  // pagos
  formPago, errorsPago, showErrorsPago, setFieldPago,
  porcentajePago,
  tablaPagos, sumaPorcentajePagos,
  headersPago,
  handleAgregarPago, togglePagoActivo, editPago,
  // edo cuenta
  formEdo, errorsEdo, showErrorsEdo, setFieldEdo,
  tablaEdo,
  headersEdo,
  handleAgregarEdo, toggleEdoActivo, editEdo,
  // bor primas
  formPrimas, errorsPrimas, showErrorsPrimas, setFieldPrimas,
  tablaBorPrimas,
  headersBorPrimas,
  handleAgregarBorPrimas, togglePrimasActivo, editBorPrimas,
  // bor siniestros
  formSiniestros, errorsSiniestros, showErrorsSiniestros, setFieldSiniestros,
  tablaBorSiniestros,
  headersBorSiniestros,
  handleAgregarBorSiniestros, toggleSiniestrosActivo, editBorSiniestros,
  // guardar / crear
  handleGuardarAdministracion,
  handleCrearContrato,
} = useAdministracionSection();
</script>