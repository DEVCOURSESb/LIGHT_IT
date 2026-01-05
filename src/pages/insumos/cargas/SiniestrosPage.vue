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

const siniestrosAPI = SiniestrosActions();

// Columnas esperadas del CSV de siniestros
const columnasEsperadasSiniestros = [
  "MOT_SIT_RECL",
  "ANIO_REPORTE",
  "NUM_RECLAMACION",
  "FH_REGISTRO",
  "NUM_COMPLEM_RECL",
  "CVE_T_MOVTO_SIN",
  "NUM_POLIZA",
  "NUM_RENOV_POL",
  "ID_INCISO",
  "F_NACIMIENTO",
  "CVE_T_REASEGURO",
  "ESTADO_EMISION",
  "ESTADO_SINIESTRO",
  "AAAAMMCONTAB",
  "F_CONTAB",
  "FH_OCURRIDO",
  "FH_REPORTADO",
  "F_PRIMER_PAGO",
  "SIT_RECLAM",
  "CVEL_DIR_REEMB",
  "ID_CAUSA_SIN",
  "RVAINI",
  "TOTAL_AJUSTERES",
  "AJUSTE_MENOS",
  "AJUSTE_MAS",
  "OCURRIDO",
  "RECLAMADO",
  "PAGAUTORIZADO",
  "DEDUCIBLE",
  "COASEGURO",
  "PAGIVA",
  "PAGAUTYDEDYCOAS",
  "TOTALCHEQUE",
  "ID_MOVTO_RECL",
  "ID_COBERTURA",
  "ID_LIN_NEGOCIO",
  "ID_REPORTE_SIN",
  "ID_SIN_UNICO",
  "ID_MONEDA",
  "NUM_ASEGURADO",
  "NOM_LINEA_NEG",
  "CVE_DIVISION",
  "CVE_T_OPERACION",
  "NUM_CERTIFICADO",
  "F_FIRMA_CONSENT",
  "F_INI_VIGENCIA",
  "NOM_COBERTURA",
  "AGENTE",
  "PROMOTORIA",
  "NOM_OFICINA",
  "F_POL_INI_VIG",
  "F_POL_FIN_VIG",
  "CAUSA_SINIESTRO",
  "ID_ICD",
  "ID_RAMO_CONTABLE",
  "ID_SUBR_CONTABLE",
  "ID_FILIAL",
  "SA_AMPARADA",
  "CVE_T_ASEG",
  "DESCPOBLACION",
];

const transformarDatosSiniestros = (
  data: SiniestroResponse[]
): RegistroTabla[] => {
  if (!data || data.length === 0) return [];

  return data.flatMap((response) =>
    response.dataExtra.map((siniestro) => {
      const partes = siniestro.aniomesCarga.split("-");
      const anio = partes[0] || "";
      const mes = partes[1] || "";
      const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];

      return {
        anio: parseInt(anio) || 0,
        mes: meses[parseInt(mes) - 1] || "N/A",
        nombreArchivo: siniestro.origen || "N/A",
        numeroRegistros: siniestro.rows,
        aniomesCarga: siniestro.aniomesCarga,
      };
    })
  );
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