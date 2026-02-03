<template>
  <menu-submenus-component
    :list-items="listItems"
    prefix-path="catalogos"
    menu-title="Catálogos"
  />
</template>

<script lang="ts" setup>
const listItems = [
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
  { name: "rr6_sector", title: "RR6 Sector" },
  { name: "coberturas_aye", title: "Coberturas AYE" },
  { name: "lim_corretaje", title: "Límite Corretaje" },
  { name: "calculo_comision", title: "Cálculo comisión" },
];
</script>
