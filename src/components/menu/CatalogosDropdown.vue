<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" variant="text">
        <v-icon start>mdi-book-open-variant</v-icon>
        Catálogos
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="item in listItems"
        :key="item.name"
        :to="`/catalogos/${item.name}`"
        :prepend-icon="item.icon"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>

interface ListItem {
  name: string;
  title: string;
  icon: string;
}

const listItems: ListItem[] = [
  { name: "intermediarios", title: "Intermediarios", icon: "mdi-account-multiple", },
  { name: "reaseguradores", title: "Reaseguradores", icon: "mdi-domain" },
  { name: "operaciones_ramos", title: "Operaciones y ramos", icon: "mdi-file-tree", },
  { name: "tipos_contrato", title: "Tipos contrato", icon: "mdi-file-document", },
  { name: "monedas", title: "Moneda", icon: "mdi-currency-usd" },
  { name: "tipos_captura", title: "Tipos captura", icon: "mdi-form-select" },
  { name: "extensiones", title: "Extensiones", icon: "mdi-puzzle" },
  { name: "clasificacion_cobertura", title: "Clasificación cobertura", icon: "mdi-shield-check", },
  { name: "cobertura", title: "Cobertura", icon: "mdi-shield" },
  { name: "distribucion_cesion", title: "Distribución cesión", icon: "mdi-chart-pie", },
  { name: "forma_contractual", title: "Forma contractual", icon: "mdi-chart-pie", },
  { name: "ptu", title: "PTU", icon: "mdi-chart-pie" },
  { name: "tipo_asignacion", title: "Tipo asignación", icon: "mdi-chart-pie" },
  { name: "tipo_reaseguro", title: "Tipo reaseguro", icon: "mdi-chart-pie" },
  { name: "tipo_tarifa", title: "Tipo tarifa", icon: "mdi-chart-pie" },
  { name: "perfil", title: "Perfil", icon: "mdi-chart-pie" },
];
</script>
