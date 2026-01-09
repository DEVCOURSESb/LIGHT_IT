<!-- pages/insumos/cargas/SiniestrosPage.vue -->
<template>
  <div>
    <!-- Sección de Carga de Archivos -->
    <CargarArchivosPage
      titulo="Siniestros"
      titulo-formulario="Cargar Archivo de Siniestros"
      titulo-tabla="Archivos de Siniestros Cargados"
      :breadcrumbs="['Siniestros', 'Cargar Archivos']"
      :composable="cargaSiniestros"
    />

    <!-- Sección de Transformación -->
    <TransformacionInsumoCard
      titulo="Transformar a Siniestro Contable"
      text-boton="Transformar Insumo a Siniestro Contable"
      :composable="transformacionSiniestros"
      texto-info="Seleccione el año y mes del insumo de siniestros que desea transformar a formato contable."
    />
  </div>
</template>

<script setup lang="ts">
import type {
  RegistroTabla,
  SiniestroResponse,
} from "@/API/generic/carga-archivos";
import { SiniestrosActions } from "@/API/insumos/siniestro/siniestro.actions";
import { useCargaArchivos } from "@/composables/archivos/useCargaArchivos";
import { useTransformacionInsumos } from "@/composables/archivos/useTransformacionInsumos";
import CargarArchivosPage from "./CargarArchivosPage.vue";
import TransformacionInsumoCard from "@/components/TransformacionInsumoCard.vue";
import { columnsValidationsFiles } from "@/utils/catalogos/columsValidationsFiles";
import { mesesAnio } from "@/utils/catalogos/mesesAnio";

const siniestrosAPI = SiniestrosActions();

const {columnasEsperadasSiniestros} = columnsValidationsFiles();

const transformarDatosSiniestros = (
  data: SiniestroResponse
): RegistroTabla[] => {
  if (!data || !data.dataExtra || data.dataExtra.length === 0) {
    return [];
  }

  // CORRECCIÓN: Acceder directamente a dataExtra sin flatMap
  return data.dataExtra.map((siniestro) => {
    const partes = siniestro.aniomesCarga.split("/");
    const anio = partes[0] || "";
    const mes = partes[1] || "";
    const {meses} = mesesAnio();

    return {
      anio: parseInt(anio) || 0,
      mes: meses[parseInt(mes) - 1] || "N/A",
      nombreArchivo: siniestro.origen || "N/A",
      numeroRegistros: siniestro.rows,
      aniomesCarga: siniestro.aniomesCarga,
    };
  });
};

// Composable para carga de archivos
const cargaSiniestros = useCargaArchivos({
  fetchAction: siniestrosAPI.fetch,
  uploadAction: siniestrosAPI.upload,
  columnasEsperadas: columnasEsperadasSiniestros,
  transformarDatos: transformarDatosSiniestros,
});

// Composable para transformación
const transformacionSiniestros = useTransformacionInsumos({
  transformAction: siniestrosAPI.transform,
  nombreInsumo: "siniestros",
});
</script>