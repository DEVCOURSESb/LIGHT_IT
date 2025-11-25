<template>
  <v-menu>
    <template #activator='{ props }'>
      <v-btn v-bind='props' variant='text'>
        Catálogos
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="item in listItems"
        :key="item.name"
        :to="`/catalogos/${item.name}`"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang='ts' setup>

  interface ListItem {
    name: string
    title: string
  }

  const listItems: ListItem[] = [
    { name: 'intermediarios', title: 'Intermediarios' },
    { name: 'reaseguradores', title: 'Reaseguradores' },
    { name: 'operaciones_ramos', title: 'Operaciones y ramos'},
    { name: 'tipos_contrato', title: 'Tipos contrato' },
    { name: 'monedas', title: 'Moneda' },
    { name: 'tipos_captura', title: 'Tipos captura' },
    { name: 'extensiones', title: 'Extensiones' },
    { name: 'clasificacion_cobertura', title: 'Clasificación cobertura' },
    { name: 'cobertura', title: 'Cobertura' },
    { name: 'distribucion_cesion', title: 'Distribución cesión' },
    { name: 'forma_contractual', title: 'Forma contractual' },
    { name: 'ptu', title: 'PTU' },
    { name: 'tipo_asignacion', title: 'Tipo asignación' },
    { name: 'tipo_reaseguro', title: 'Tipo reaseguro' },
    { name: 'tipo_tarifa', title: 'Tipo tarifa' },
    { name: 'perfil', title: 'Perfil' },
  ]
</script>
