<template>
  <menu-submenus-component
    :list-items="listItems"
    prefix-path="catalogos"
    menu-title="Catálogos"
  />
</template>

<script lang="ts" setup>
/*const listItems = [
  { name: "intermediarios", title: "Intermediarios" },
  { name: "reaseguradores", title: "Reaseguradores" },
  { name: "operaciones_ramos", title: "Operaciones y ramos" },
  { name: "tipos_contrato", title: "Tipos contrato" },
  { name: "monedas", title: "Moneda" },
  { name: "tipos_captura", title: "Tipos captura" },
  { name: "extensiones", title: "Extensiones" },
  { name: "clasificacion_cobertura", title: "Clasificación cobertura" },
  { name: "coberturas", title: "Coberturas" },
  { name: "distribucion_cesion", title: "Distribución cesión" },
  { name: "forma_contractual", title: "Forma contractual" },
  { name: "ptu", title: "PTU" },
  { name: "asignacion", title: "Tipo asignación" },
  { name: "tipo_reaseguro", title: "Tipo reaseguro" },
  { name: "tipo_tarifa", title: "Tipo tarifa" },
  { name: "perfil", title: "Perfil" },
  { name: "criterios_de_asignacion", title: "Criterios de asignación" },
  { name: "estatus_recibo", title: "Estatus recibo" },
  { name: "tipo_endoso", title: "Tipo endoso" },
  { name: "forma_de_pago", title: "Forma de pago" },
  { name: "sexo", title: "Sexo" },
  { name: "estatus", title: "Estatus" },
  { name: "fumador", title: "Fumador" },
  { name: "tipo_cambio", title: "Tipo cambio" },
  { name: "entidad_federativa", title: "Entidad federativa" },
  { name: "criterio_cobertura", title: "Criterios de cobertura" },
];*/

const listItems = [
  { name: "clasificacion_cobertura", title: "Clasificación cobertura" },
  { name: "coberturas", title: "Coberturas" },
  { name: "criterios_de_asignacion", title: "Criterios de asignación" },
  { name: "criterio_cobertura", title: "Criterio de cobertura" },
  { name: "distribucion_cesion", title: "Distribución de la cesión" },
  { name: "entidad_federativa", title: "Entidad federativa" },
  { name: "estatus", title: "Estatus" },
  { name: "estatus_recibo", title: "Estatus del recibo" },
  { name: "extensiones", title: "Extensión de cobertura" },
  { name: "forma_contractual", title: "Forma contractual" },
  { name: "forma_de_pago", title: "Forma de pago" },
  { name: "fumador", title: "Fumador" },
  { name: "intermediarios", title: "Intermediarios" },
  { name: "ptu", title: "Método cálculo PTU" },
  { name: "monedas", title: "Moneda" },
  { name: "operaciones_ramos", title: "Operación y ramos" },
  { name: "perfil", title: "Perfil" },
  { name: "reaseguradores", title: "Reaseguradoras" },
  { name: "sexo", title: "Sexo" },
  { name: "asignacion", title: "Tipo de asignación" },
  { name: "tipo_cambio", title: "Tipo de cambio" },
  { name: "tipos_captura", title: "Tipo de captura" },
  { name: "tipos_contrato", title: "Tipo de contrato" },
  { name: "tipo_endoso", title: "Tipo de endoso" },
  { name: "tipo_reaseguro", title: "Tipo de reaseguro" },
  { name: "tipo_tarifa", title: "Tipo de tarifa" },
];
</script>
