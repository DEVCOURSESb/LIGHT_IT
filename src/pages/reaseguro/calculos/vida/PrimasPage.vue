<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-card-title class="d-flex align-center"> Cálculo de Primas </v-card-title>

    <v-card class="mt-4" elevation="0" outlined>
      <v-card-title>
        <v-form ref="formRef">
          <v-row align="center" justify="center" class="mb-4">
            <v-col cols="12" md="3">
              <v-select
                v-model="subramo"
                :items="dataSelec"
                item-title="descOperacionRamos"
                item-value="cveCobertura"
                label="Subramo"
                :disabled="isLoadingSelectOptions"
                return-object
                variant="solo-filled"
                clearable
                required
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-date-input
                v-model="fechaEvaluada"
                label="Fecha de evaluación"
                variant="solo-filled"
                clearable
                required
              />
            </v-col>

            <v-col cols="8" md="2" class="title-center">
              <v-btn size="small" class="btn-guardar" @click="calcularPrimas">
                Calcular
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-divider class="mb-4" />

        <div class="mb-2">
          <h6>Historico de Primas</h6>
        </div>
        <!-- <btn @click="exportarExcel"> Exportar a Excel </btn> -->
        <v-data-table
          :headers="headers"
          :items="items"
          class="elevation-1"
          hide-default-footer
        >
          <template #item.actions="{ item }">
            <v-icon class="edit" size="large" @click="descargarItem(item)">
              mdi-download
            </v-icon>
            <v-icon class="delete" size="large" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card-title>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { OperacionesRamosActions } from "@/API/catalogos/operaciones-ramos/operaciones-ramos.actions";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useSnackbar } from "@/stores/useSnackbar";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

const { fetchOperacionesRamosFiltered } = OperacionesRamosActions();
const dialog = useDialog();
const snackbar = useSnackbar();

const breadcrumbs = ["Reaseguro", "Cálculos", "Vida", "Primas"];

const { data: dataSelec, isLoading: isLoadingSelectOptions } = useQuery({
  queryKey: ["operaciones-ramos", "list", "CVE_EXT_COBER-2", "RAMO-010"],
  queryFn: fetchOperacionesRamosFiltered,
});

const items = [
  { subramo: "Vida Individual", fechaEvaluada: "2024-05-31" },
  { subramo: "Vida Colectivo", fechaEvaluada: "2024-05-31" },
  { subramo: "Vida Grupo", fechaEvaluada: "2024-05-31" },
];

const subramo = ref("");
const fechaEvaluada = ref("");

const headers = [
  {
    title: "Subramo",
    key: "subramo",
    sortable: true,
  },
  {
    title: "Fecha de cálculo",
    key: "fechaEvaluada",
    sortable: true,
  },
  {
    title: "Acciones",
    key: "actions",
  },
];

const calcularPrimas = () => {
  if (!subramo.value || !fechaEvaluada.value) {
    snackbar.mostrarMensajeSnackbar(
      "Por favor complete todos los campos correctamente para calcular las primas.",
      "error",
    );
    return;
  }

  snackbar.mostrarMensajeSnackbar("Realizando cálculo de primas...", "success");
  console.log(subramo.value);
  console.log(fechaEvaluada.value);
};

const descargarItem = (item: any) => {
  console.log("descargar item:", item);
};

const deleteItem = (item: any) => {
  dialog.show({
    title: "Confirmar eliminación",
    message: `¿Está seguro de que desea eliminar el cálculo de primas para el subramo "${item.subramo}" con fecha evaluada "${item.fechaEvaluada}"?`,
    type: DialogType.ERROR,
    ExtraAction: {
      text: "Confirmar",
      color: "secondary",
      handler: () => {
        console.log("Eliminar item:", item);
        snackbar.mostrarMensajeSnackbar(
          `Eliminando cálculo de primas para el subramo "${item.subramo}" con fecha evaluada "${item.fechaEvaluada}"...`,
          "info",
        );
      },
    },
  });
};

/* const exportarExcel = () => {
  const data = items.map((item) => ({
    Subramo: item.subramo,
    "Fecha Evaluada": item.fechaEvaluada,
  }));

  exportExcel({
    data,
    fileName: "Calculo_Primas_Vida.xlsx",
    sheetName: "Primas Vida",
  });
}; */
</script>
