<template>
  <div>
    <v-tabs v-model="activeTab" align-tabs="center" color="primary">
      <v-tab value="tab-1">General</v-tab>
      <v-tab value="tab-2" v-if="esFacultativo">Pólizas Facultativas</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <v-window-item value="tab-1">
        <v-card flat>
          <v-card-text>
            <FormGeneralDatosPageM
              @actualizarFormaContractual="actualizarFormaContractual"
              @on-success-register="onSuccessRegisterDatosGenerales"
            />
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-2" v-if="esFacultativo">
        <v-card flat>
          <v-card-text>
            <FormPolizasFacultativasPageM
              @on-sucess-register="onSuccessRegisterPolizasFacultativas"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import FormGeneralDatosPageM from './FormGeneralDatosPageV.vue'
import FormPolizasFacultativasPageM from './FormPolizasFacultativasPageV.vue'

const activeTab = ref('tab-1')
const esFacultativo = ref(false)

const emits = defineEmits(['on-save-complete']);

const actualizarFormaContractual = (valor: number) => {
  esFacultativo.value = valor === 1
}

const onSuccessRegisterDatosGenerales = () => {
  if (esFacultativo.value) {
    activeTab.value = 'tab-2'
  } else {
    emits('on-save-complete', 'reaseguradores');
  }
}

const onSuccessRegisterPolizasFacultativas = () => {
  emits('on-save-complete', 'reaseguradores');
}

// existe un nuevo detalle pues si el usuario decide que no va a llevar polizas facultativas en la selección de
// contrato, si ya se asigno con anterioridad polizas pero se cambia la seleccion en general, entonces este
// debera eliminarse del localstorage
</script>
