<template>
  <v-breadcrumbs :items="breadcrumbs" />

  <v-card-title class="d-flex align-center">
    Visualizar contratos accidentes y enfermedades
  </v-card-title>

  <v-row justify="end">
    <v-col cols="5" md="5">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar contrato"
        single-line
        hide-details
        class="mb-4"
        variant="solo-filled"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="dataToShow || []"
        :loading="data.isLoading.value"
        :search="search"
        item-value="title"
        striped="even"
      >
      </v-data-table>
    </v-col>
  </v-row>

  <v-spacer class="mb-4" />
</template>

<script lang="ts" setup>
import { contratoAYEActions } from "@/API/reaseguro/contratos/accidentes_enfermedades/nuevo/contratoAYE.actions";
import { formatDate } from "@/utils/formatters/formatDate";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";

const breadcrumbs = [
  "Reaseguro",
  "Contratos de reaseguro",
  "Accidentes y Enfermedades",
  "Visualizar contrato",
];

const search = ref("");

const headerProps = {
  style: "font-weight: bold",
};

const headers = [
  {
    title: "FECHA REGISTRO",
    key: "fechaRegistro",
    headerProps,
  },
  {
    title: "ID CONTRATO",
    key: "idContrato",
    headerProps,
  },
  {
    title: "ENTIDAD",
    key: "entidad",
    headerProps,
  },
  {
    title: "MUNICIPIO",
    key: "municipio",
    headerProps,
  },
];

const { getAllContracts } = contratoAYEActions();

const data = useQuery({
  queryKey: ["AYE-All-Contracts"],
  queryFn: getAllContracts,
});

const dataToShow = computed(() => {
  return data.data.value?.map((row) => {
    return { ...row, fechaRegistro: formatDate(row.fechaRegistro) };
  });
});
</script>
