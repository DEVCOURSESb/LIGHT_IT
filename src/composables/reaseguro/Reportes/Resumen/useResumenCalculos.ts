import { ref, computed } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { BaseAPI } from "@/API/BaseAPI";
import { useSnackbar } from "@/stores/useSnackbar";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";

export const useResumenCalculos = () => {
  const baseAPI = BaseAPI({ prefix: "ws_resumenes_contrato_reaseguro/api/v1/ResumenCalculosReaseguroRest/" });
  const downloadAPI = BaseAPI({ prefix: "ws_calculo_primas_reaseg_vida_grupo/api/v1/CalculoPrimasReasegVidaRest/" });
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const block = ref(false);

  const tab = ref('PRIMAS');
  const tipoReporteSeleccionado = ref(null);

  const opcionesReporte = [
    { label: 'Resumen de Primas', value: 'PRIMAS' },
    { label: 'Resumen de Siniestros', value: 'SINIESTROS' }
  ];

  const fetchResumenes = async () => {
    const { data } = await baseAPI.post("getAllResumeFiles", {});
    return data;
  };

  const downloadFile = async (id: number) => {
    const { data } = await downloadAPI.post("getStringFile", { id });
    return typeof data === "string" ? data : data?.documentBytes;
  };

  const queryHistory = useQuery({
    queryKey: ["reportes-resumen-history"],
    queryFn: fetchResumenes,
  });

  const headers = [
    { title: "SUBRAMO", key: "idRamo", sortable: true },
    { title: "NOMBRE DEL ARCHIVO", key: "nombreArchivo", sortable: true },
    { title: "FECHA DE EVALUACIÓN", key: "fechaCalculo", sortable: true },
    { title: "FECHA DE REGISTRO", key: "fechaRegistro", sortable: true },
    { title: "ACCIONES", key: "actions", sortable: false },
  ];

  const reportesFiltrados = computed(() => {
    const data = queryHistory.data.value || [];
    return data.filter((item: any) =>
      item.nombreArchivo.toUpperCase().includes(tab.value)
    );
  });

  const ejecutarGeneracion = async () => {
    block.value = true;
    try {
      const response = tipoReporteSeleccionado.value === 'PRIMAS'
        ? await baseAPI.post("getFilePrimas", {})
        : await baseAPI.post("getFileSiniestros", {});

      if (response.status === 200) {
        snackbar.mostrarMensajeSnackbar("Resumen generado con éxito", "success");
        queryClient.invalidateQueries({ queryKey: ["reportes-resumen-history"] });
      }
    } catch (error) {
      snackbar.mostrarMensajeSnackbar("Error al generar el resumen", "error");
    } finally {
      block.value = false;
    }
  };

  const descargarItem = async (item: any) => {
    block.value = true;
    try {
      const response = await downloadFile(item.id);
      const base64Data = typeof response === "string" ? response : response?.documentBytes;

      if (base64Data) {
        downloadFileFromBase64(
          base64Data,
          item.nombreArchivo || `reporte_${item.id}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        snackbar.mostrarMensajeSnackbar("Descarga exitosa", "success");
      }
    } catch (e) {
      snackbar.mostrarMensajeSnackbar("Error al descargar", "error");
    } finally {
      block.value = false;
    }
  };

  return {
    tab,
    tipoReporteSeleccionado,
    opcionesReporte,
    queryHistory,
    headers,
    block,
    reportesFiltrados,
    descargarItem,
    ejecutarGeneracion
  };
};