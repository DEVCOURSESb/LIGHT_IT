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
            <FormGeneralDatosPage
              @actualizarFormaContractual="actualizarFormaContractual"
              @on-success-register="onSuccessRegisterDatosGenerales"
            />
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-2" v-if="esFacultativo">
        <v-card flat>
          <v-card-text>
            <FormPolizasFacultativasPage
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
import FormGeneralDatosPage from './FormGeneralDatosPage.vue'
import FormPolizasFacultativasPage from './FormPolizasFacultativasPage.vue'
import { useContratoStore } from "@/stores/reaseguro/contratos/vidaStore";

const contratoStore = useContratoStore();
const activeTab = ref('tab-1')
const esFacultativo = ref(false)

const emits = defineEmits(['on-save-complete']);


const actualizarFormaContractual = (valor: number) => {
  const antesEraFacultativo = esFacultativo.value;
  esFacultativo.value = valor === 1;

  if (antesEraFacultativo && !esFacultativo.value) {
    const idContrato = contratoStore.general?.idContrato;

    contratoStore.setPolizas({
      idContrato: idContrato || '',
      polizas: []
    });

    console.log("Se han eliminado las pólizas porque el contrato ya no es facultativo.");
  }
}

const onSuccessRegisterDatosGenerales = () => {
  if (esFacultativo.value) {
    activeTab.value = 'tab-2'
  } else {
    emits('on-save-complete');
  }
}

const onSuccessRegisterPolizasFacultativas = () => {
  emits('on-save-complete');
}
</script>
