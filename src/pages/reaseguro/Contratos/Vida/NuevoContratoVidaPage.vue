<template>
  <div>
    <v-breadcrumbs
      :items="['Reaseguro', 'Contratos de reaseguro', 'Vida', 'Nuevo contrato']"
    />
    <v-card-title class="d-flex align-center">
      Nuevo Contrato Vida
    </v-card-title>
    <v-spacer class="mb-4" />
    <br />
    <div>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="">
              <v-row no-gutters>
                <v-col class="d-flex justify-start text-h6" cols="4">
                  Datos
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormDatosPage />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            <template #default="">
              <v-row no-gutters>
                <v-col class="d-flex justify-start text-h6" cols="4">
                  Configuración de Reaseguradores
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <FormConfiguracionReaseguradoresPage />
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel
          @click="checkParticipationReaseg"
          :disabled="disabledIntermediario"
        >
          <v-expansion-panel-title>
            <template #default="">
              <v-row no-gutters>
                <v-col class="d-flex justify-start text-h6" cols="4">
                  Configuración de Intermediarios
                </v-col>
              </v-row>
            </template>
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
import { ref } from "vue";
import { DialogType, useDialog } from "@/stores/dialogStore";

const contratoStore = useContratoStore();
const dialog = useDialog();
const disabledIntermediario = ref(true);

const checkParticipationReaseg = () => {
  const isFullParticipation = contratoStore.totalParticipacion >= 100;

  if (!isFullParticipation) {
    dialog.show({
      type: DialogType.ERROR,
      title: "Participación de Reaseguradores",
      message:
        "La participación total de reaseguradores no alcanza el 100%. Por favor, revise las configuraciones.",
    });
  }

  disabledIntermediario.value = !isFullParticipation;
};
</script>
