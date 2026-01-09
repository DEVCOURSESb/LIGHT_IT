<!-- pages/insumos/cargas/EmisionPage.vue -->
<template>
  <div>
    <!-- Sección de Carga de Archivos -->
    <cargar-archivos-page
      titulo="Emisión de Datos"
      titulo-formulario="Cargar Archivo de Emisión"
      titulo-tabla="Archivos Cargados"
      :breadcrumbs="['Emisión', 'Cargar Archivos']"
      :composable="cargaEmision"
    />

    <!-- Sección de Transformación -->
    <transformacion-insumo-card
      titulo="Transformar a Emisión Contable"
      text-boton="Transformar Insumo a Emisión Contable"
      :composable="transformacionEmision"
      texto-info="Seleccione el año y mes del insumo de emisión que desea transformar a formato contable."
    />
  </div>
</template>

<script setup lang="ts">
import type {
  EmisionResponse,
  RegistroTabla,
} from "@/API/generic/carga-archivos";
import { EmisionActions } from "@/API/insumos/emision/emision.actions";
import { useCargaArchivos } from "@/composables/archivos/useCargaArchivos";
import { useTransformacionInsumos } from "@/composables/archivos/useTransformacionInsumos";
import CargarArchivosPage from "./CargarArchivosPage.vue";
import TransformacionInsumoCard from "@/components/TransformacionInsumoCard.vue";
import { columnsValidationsFiles } from "@/utils/catalogos/columsValidationsFiles";
import { mesesAnio } from "@/utils/catalogos/mesesAnio";

const emisionAPI = EmisionActions();

const { columnasEsperadasEmision } = columnsValidationsFiles();

const transformarDatosEmision = (data: EmisionResponse): RegistroTabla[] => {
  if (!data || !data.dataExtra || data.dataExtra.length === 0) {
    return [];
  }

  return data.dataExtra.map((emision) => {
    const partes = emision.aniomesCarga.split("-");
    const anio = partes[0] || "";
    const mes = partes[1] || "";
    const { meses } = mesesAnio();

      return {
        anio: parseInt(anio) || 0,
        mes: meses[parseInt(mes) - 1] || "N/A",
        nombreArchivo: emision.origen || "N/A",
        numeroRegistros: emision.rows,
        aniomesCarga: emision.aniomesCarga,
      };
    });
};

// Composable para carga de archivos
const cargaEmision = useCargaArchivos({
  fetchAction: emisionAPI.fetch,
  uploadAction: emisionAPI.upload,
  columnasEsperadas: columnasEsperadasEmision,
  transformarDatos: transformarDatosEmision,
});

// Composable para transformación
const transformacionEmision = useTransformacionInsumos({
  transformAction: emisionAPI.transform,
  nombreInsumo: "emisión",
});
</script>