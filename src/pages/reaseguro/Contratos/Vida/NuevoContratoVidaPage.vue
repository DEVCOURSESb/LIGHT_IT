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
      <v-expansion-panels class="panel">
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

        <v-expansion-panel
          @click="revisarExistenciaContrato"
          :disabled="deshabilitarReasegurador">
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
const deshabilitarReasegurador = ref(true);

/*const revisarExistenciaContrato = () => {
  const datosContratos = contratoStore.general?.idContrato;

  const polizasFacultativas = contratoStore.poli?.polizas;

  if (!datosContratos) {
    dialog.show({
      type: DialogType.ERROR,
      title: "Advertencia",
      message:
        "No se encontro algun contrato configurado en el apartado de Datos.",
    });
    // aqui esta bien y mal pues aunque el contrato no sea Facultativo este sigue esperando para tener datos en el store, y si desbloquea el segundo panel pero aparece el mensaje de error
  } /*else if (!polizasFacultativas) {
    dialog.show({
      type: DialogType.ERROR,
      title: "Advertencia",
      message:
        "No se agregaron datos en el apartado de polizas facultativas.",
    });
  }

  deshabilitarReasegurador.value = !datosContratos;
  // aqui si se comprueba que si existen datos en el store lo habilite en automatico y abra el segundo panel de expansion
  // esto es lo que esta en ese tab en el archivo FormConfiguracionReaseguradores
};*/

const revisarExistenciaContrato = () => {
  const tieneDatosGenerales = !!contratoStore.general?.idContrato;
  const esFacultativo = Number(contratoStore.general?.idTContrato) === 1; // Asumiendo que 1 es Facultativo, ajusta el ID según corresponda
  //const tienePolizas = contratoStore.poli?.polizas.length > 0;
  const tienePolizas = contratoStore.poli?.polizas;

  if (!tieneDatosGenerales) {
    deshabilitarReasegurador.value = true;
    return dialog.show({
      type: DialogType.ERROR,
      title: "Faltan Datos",
      message: "Debe configurar y guardar el apartado de 'Datos del Contrato' antes de continuar.",
    });
  }

  if (esFacultativo && !tienePolizas) {
    deshabilitarReasegurador.value = true;
    return dialog.show({
      type: DialogType.ERROR,
      title: "Pólizas Requeridas",
      message: "Para contratos Facultativos, debe agregar al menos una póliza en el apartado correspondiente.",
    });
  }

  deshabilitarReasegurador.value = false;

};

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
