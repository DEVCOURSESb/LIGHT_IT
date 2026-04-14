import { ref } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { BaseAPI } from "@/API/BaseAPI";
import { useSnackbar } from "@/stores/useSnackbar";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";

export const useResumenCalculos = () => {
  const baseAPI = BaseAPI({ prefix: "ws_resumenes_contrato_reaseguro/api/v1/ResumenCalculosReaseguroRest/" });
  const downloadAPI = BaseAPI({ prefix: "ws_calculo_primas_reaseg_vida_grupo/api/v1/CalculoPrimasReasegVidaRest/" });
  const snackbar = useSnackbar();
  const block = ref(false);

  const fetchResumenes = async () => {
    const { data } = await baseAPI.post("getAllResumeFiles", {});
    return data;
  };

  const downloadFile = async (id: number) => {
    const { data } = await downloadAPI.post("getStringFile", { id });
    return typeof data === "string" ? data : data?.documentBytes;
  };

  const generarPrimas = () => baseAPI.post("getFilePrimas", {});
  const generarSiniestros = () => baseAPI.post("getFileSiniestros", {});

  const queryHistory = useQuery({
    queryKey: ["reportes-resumen-history"],
    queryFn: fetchResumenes,
  });

  const headers = [
    { title: "SUBRAMO", key: "idRamo", sortable: true },
    { title: "NOMBRE DEL ARCHIVO", key: "nombreArchivo", sortable: true },
    { title: "FECHA EVALUACIÓN", key: "fechaCalculo", sortable: true },
    { title: "FECHA REGISTRO", key: "fechaRegistro", sortable: true },
    { title: "ACCIONES", key: "actions", sortable: false },
  ];

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
    queryHistory,
    headers,
    block,
    descargarItem,
    generarPrimas,
    generarSiniestros
  };
};