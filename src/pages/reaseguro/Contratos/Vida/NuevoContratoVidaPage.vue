<template>
  <div>
    <v-breadcrumbs :items="['Reaseguro', 'Contratos de reaseguro', 'Vida', 'Nuevo contrato']" />
    <v-card-title class="d-flex align-center">Nuevo Contrato Vida</v-card-title>
    <v-spacer class="mb-4" />
    <br />

    <div>
      <v-expansion-panels v-model="panelAbierto" class="panel">

        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-row no-gutters>
              <v-col class="d-flex justify-start text-h6" cols="4">Datos</v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormDatosPage @on-save-complete="irAPanelReaseguradores" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel
          @click="revisarExistenciaContrato"
          :disabled="deshabilitarReasegurador">
          <v-expansion-panel-title>
            <v-row no-gutters>
              <v-col class="d-flex justify-start text-h6" cols="4">Configuración de Reaseguradores</v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormConfiguracionReaseguradoresPage @on-save-complete="irAPanelIntermediarios" />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel
          @click="checkParticipationReaseg"
          :disabled="disabledIntermediario">
          <v-expansion-panel-title>
            <v-row no-gutters>
              <v-col class="d-flex justify-start text-h6" cols="4">Configuración de Intermediarios</v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormConfiguracionIntermediariosPage />
          </v-expansion-panel-text>
        </v-expansion-panel>

      </v-expansion-panels>
    </div>
    <v-spacer class="mb-4" />
  </div>
</template>

<script lang="ts" setup>
import { useContratoStore } from "@/stores/contratoStore";
import FormConfiguracionIntermediariosPage from "./NuevoContratoVida/FormConfiguracionIntermediariosPage.vue";
import FormConfiguracionReaseguradoresPage from "./NuevoContratoVida/FormConfiguracionReaseguradoresPage.vue";
import FormDatosPage from "./NuevoContratoVida/FormDatosPage.vue";
import { computed, ref, watch } from "vue";
import { DialogType, useDialog } from "@/stores/dialogStore";

const contratoStore = useContratoStore();
const dialog = useDialog();

const panelAbierto = ref<number | null>(0);

const esFacultativo = computed(() => {
  const forma = contratoStore.general?.cveFormaContractual;
  const valor = typeof forma === 'object' ? forma?.value : forma;
  return Number(valor) === 1;
});

const deshabilitarReasegurador = computed(() => {
  const tieneDatosGenerales = !!contratoStore.general?.idContrato;
  const polizas = contratoStore.poli?.polizas || [];
  const tienePolizas = polizas.length > 0;

  if (!tieneDatosGenerales) return true;

  if (esFacultativo.value) {
    return !tienePolizas;
  }

  return false;
});

const disabledIntermediario = computed(() => {
  if (deshabilitarReasegurador.value) return true;
  return contratoStore.totalParticipacion < 100;
});

const irAPanelReaseguradores = () => {
  setTimeout(() => {
    if (!deshabilitarReasegurador.value) {
      panelAbierto.value = 1;
    }
  }, 100);
};

const irAPanelIntermediarios = () => {
  setTimeout(() => {
    if (!disabledIntermediario.value) {
      panelAbierto.value = 2;
    }
  }, 100);
};

const revisarExistenciaContrato = () => {
  if (!contratoStore.general?.idContrato) {
    dialog.show({
      type: DialogType.ERROR,
      title: "Faltan Datos",
      message: "Debe guardar 'Datos del Contrato' antes de continuar.",
    });
    return;
  }

  if (esFacultativo.value && (contratoStore.poli?.polizas?.length || 0) === 0) {
    dialog.show({
      type: DialogType.ERROR,
      title: "Pólizas Requeridas",
      message: "Este es un contrato Facultativo. Debe agregar al menos una póliza.",
    });
  }
};

const checkParticipationReaseg = () => {
  if (contratoStore.totalParticipacion < 100) {
    dialog.show({
      type: DialogType.ERROR,
      title: "Participación Incompleta",
      message: `La participación actual es del ${contratoStore.totalParticipacion}%. Debe llegar al 100% para habilitar este panel.`,
    });
  }
};

watch(() => contratoStore.general?.cveFormaContractual, (newForma) => {
  const valor = typeof newForma === 'object' ? newForma?.value : newForma;
  const idContrato = contratoStore.general?.idContrato;

  if (idContrato && Number(valor) !== 1) {
    if ((contratoStore.poli?.polizas?.length || 0) > 0) {
      contratoStore.setPolizas({
        idContrato: idContrato,
        polizas: []
      });
    }
  }
}, { deep: true });

</script>
