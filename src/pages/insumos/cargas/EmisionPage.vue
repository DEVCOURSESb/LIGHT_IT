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

const emisionAPI = EmisionActions();

// Columnas esperadas del CSV de emisión
const columnasEsperadasEmision = [
  "ID_COTIZACION",
  "NUM_POLIZA",
  "NUM_RENOV_POL",
  "ID_VERSION_POL",
  "SIT_POLIZA",
  "ENDOSO",
  "T_ENDOSO",
  "ID_FORMA_PAGO",
  "F_CONTAB_POL",
  "FH_EMISION_POL",
  "F_INI_VIG_POL",
  "F_FIN_VIG_POL",
  "F_PROX_VEN",
  "ID_PRODUCTO",
  "PRODUCTO",
  "ID_LIN_NEGOCIO",
  "LIN_NEG",
  "CVE_T_BIEN",
  "ID_VERSION_RBO",
  "F_CUBRE_DESDE",
  "F_CUBRE_HASTA",
  "F_CONTAB",
  "CVE_T_APLIC",
  "ID_PROG_PAGO",
  "NUM_FOLIO_RBO",
  "ID_FILIAL",
  "NUM_CERTIFICADO",
  "NUM_ASEGURADO",
  "ID_INCISO",
  "NOMBRE_ASEGURADO",
  "APE_PATERNO_ASEGURADO",
  "APE_MATERNO_ASEGURADO",
  "F_INI_VIGENCIA_INCISO",
  "F_FIN_VIGENCIA_INCISO",
  "AAAAMM",
  "ANIVER",
  "SIT_INCISO_POL",
  "MOT_SIT_INC_POL",
  "ID_CATEGORIA",
  "ID_COBERTURA",
  "CVEL_T_COBERTURA",
  "COBERTURA",
  "SA_AMPARADA",
  "SIT_RECIBO",
  "TIPOCAMBIO_MENSUAL",
  "TIPOCAMBIO_DIARIO",
  "PRIMA_NETA_EMITIDA",
  "PRIMA_TOTAL",
  "PRIMA_PAGADA",
  "ID_DOCTO_VERS",
  "ID_MONEDA",
  "F_ALTA_ORIGINAL",
  "F_NACIMIENTO",
  "EDAD_REAL",
  "EDAD_CALCULO",
  "CVE_SEXO",
  "B_FUMADOR",
  "PCT_SUBNORMALID",
  "RFC",
  "CURP",
  "CVE_T_REASEGURO",
  "POLIZA_MODALIDAD",
  "TIPO_VENTA",
  "ESTADO",
  "TIPO_DIVIDENTO",
  "MONTO_DIVIDENDO",
  "ANIO_POLIZA",
  "INICIO_COBERTURA",
  "SUBTIPO_SEGURO",
  "NIVEL_HOSPITALARIO",
  "PROMOTOR",
  "GASTO_ADQ",
  "GASTO_ADMON",
  "UTILIDAD",
  "CVE_RAMO",
  "RAMO",
  "CVE_SUBRAMO",
  "SUNRAMO",
  "CVEL_AGRUP_EDOCT",
  "ID_AGENTE",
  "ID_SUPERVISOR",
  "F_INI_REG",
  "F_TER_REG",
  "F_CONTAB_EMI",
  "NOMFILIAL",
  "CVE_T_RECIBO",
  "SERIE_FOLIO_RBO",
  "STI_ACT_RBO",
  "F_ACT_RBO",
  "ASF_GEN_INFORMACION",
  "ID_SUPERVISORIA_VENTAS",
  "NOM_SUPERVISORIA_VENTAS",
  "ID_OFICINA_VENTAS",
  "NOM_OFICINA_VENTAS",
  "LICITACION",
  "POBLACION",
  "TIPO_SEGURO",
  "F_BAJA",
  "DESC_REQ_ELEGIBI",
  "GM_HONORARIOS_QUIRURGICOS",
  "GM_COASEGURO_POR_EVENTO",
  "GM_DEDUCIBLE_POR_EVENTO",
];

const transformarDatosEmision = (data: EmisionResponse): RegistroTabla[] => {
  if (!data || !data.dataExtra || data.dataExtra.length === 0) {
    return [];
  }

  return data.dataExtra.map((emision) => {
    const partes = emision.aniomesCarga.split("-");
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