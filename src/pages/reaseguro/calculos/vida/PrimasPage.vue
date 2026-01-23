<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" />
    <v-card-title>
      <v-row class="w-100">
        <v-col cols="4"></v-col>

        <v-col cols="4" class="d-flex align-center justify-center">
          <h1>Cálculo de Primas de Vida</h1>
        </v-col>

        <v-col cols="4" class="d-flex justify-end align-top gap-2"></v-col>
      </v-row>
    </v-card-title>

    <v-card class="mt-4" elevation="0" outlined>
      <v-toolbar class="encabezado" flat>
        <v-toolbar-title></v-toolbar-title>
      </v-toolbar>

      <v-card-title class="pt-6">
        <v-form ref="formRef">
          <v-row>
            <v-col cols="12" md="3">
              <v-select
                label="Seleccione un subramo"
                :items="itemsToSelect"
                  item-title="text"
                  item-value="value"
                v-model="subramo"
                density="compact"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Seleccione fecha de evaluación"
                type="date"
                density="compact"
                v-model="fechaEvaluada"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="2" class="d-flex align-center">
              <v-btn block class="btn-modificar" @click="calcularPrimas">
                Cálcular
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-title>
    </v-card>

    <v-card class="mt-4" elevation="0" outlined>
      <v-toolbar class="encabezado" flat>
        <v-toolbar-title>Resultados del Cálculo</v-toolbar-title>
      </v-toolbar>

      <v-data-table
        class="mt-4"
        :headers="headers"
        :items="items"
        striped="odd"
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
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useSnackbar } from "@/stores/useSnackbar";
import { ref } from "vue";

const itemsToSelect = [
  { text: "Vida Individual", value: "VIDA_IND" },
  { text: "Vida Colectivo", value: "VIDA_COL" },
  { text: "Vida Grupo", value: "VIDA_GRU" },
];


const items = [
  { subramo: "Vida Individual", fechaEvaluada: "2024-05-31" },
  { subramo: "Vida Colectivo", fechaEvaluada: "2024-05-31" },
  { subramo: "Vida Grupo", fechaEvaluada: "2024-05-31" },
];

const dialog = useDialog();
const snackbar = useSnackbar();
const subramo = ref("");
const fechaEvaluada = ref("");

const breadcrumbs = ["Reaseguro", "Cálculos", "Vida", "Primas"];

const headers = [
  {
    title: "Subramo",
    key: "subramo",
    sortable: true,
  },
  {
    title: "Fecha Evaluada",
    key: "fechaEvaluada",
    sortable: true,
  },
  {
    title: "ACCIONES",
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

  snackbar.mostrarMensajeSnackbar(
    "Realizando cálculo de primas...",
    "success",
  );
  console.log(subramo.value);
  console.log(fechaEvaluada.value);
};

const descargarItem = (item: any) => {
  console.log("Editar item:", item);
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
</script>
