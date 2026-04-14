import { OperacionesRamosActions } from "@/API/catalogos/operaciones-ramos/operaciones-ramos.actions";
import { calculoPrimasActions } from "@/API/reaseguro/calculos/calculo_primas.actions";
import type { CalculoPrimasVidas } from "@/API/reaseguro/calculos/calculo_primas.interface";
import { useDialog } from "@/stores/dialogStore";
import { useSnackbar } from "@/stores/useSnackbar";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";

export const useCalculoVidaPrimas = () => {
  const { fetchOperacionesRamosFiltered } = OperacionesRamosActions();
  const dialog = useDialog();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const block = ref<boolean>(false);

  const { fetch, calcular, deleteCalculo, downloadFile, makeFileCsv, saveFileCsv } = calculoPrimasActions();

  const querySubramos = useQuery({
    queryKey: ["operaciones-ramos", "list", "CVE_EXT_COBER-2", "RAMO-010"],
    queryFn: fetchOperacionesRamosFiltered,
  });

  const queryHistory = useQuery({
    queryKey: ["calculo-vida-primas-history"],
    queryFn: fetch,
  });

  const subramo = ref();
  const fechaEvaluada = ref<Date>();

  const headers = [
    {
      title: "SUBRAMO",
      key: "idRamo",
      sortable: true,
    },
    {
      title: "FECHA DE EVALUACIÓN",
      key: "fechaCalculo",
      sortable: true,
    },
    {
      title: "FECHA DE REGISTRO",
      key: "fechaRegistro",
      sortable: true,
    },
    {
      title: "NOMBRE DEL ARCHIVO",
      key: "nombreArchivo",
      sortable: true,
    },
    {
      title: "ACCIONES",
      key: "actions",
      sortable: false
    },
  ];

  const getSubramoName = (idRamo: string) => {
    const list = (querySubramos.data.value as any[]) || [];
    return list.find((item: any) => item.cveCobertura === idRamo)?.descOperacionRamos;
  }

  const calcularPrimas = async () => {
    block.value = true;
    if (!subramo.value || !fechaEvaluada.value) {
      snackbar.mostrarMensajeSnackbar(
        "Por favor complete todos los campos correctamente para calcular las primas.",
        "error",
      );
      block.value = false;
      return;
    }

    snackbar.mostrarMensajeSnackbar("Realizando cálculo de primas y generando archivo...", "success");

    try {
      const response = await calcular(subramo.value.cveCobertura, fechaEvaluada.value);

      if (response?.status === 200) {
        const payload = {
          idRamo: subramo.value.cveCobertura,
          fechaEvaluacion: fechaEvaluada.value
        };

        await makeFileCsv(payload);

        await saveFileCsv(payload);

        queryClient.invalidateQueries({ queryKey: ["calculo-vida-primas-history"] });
        snackbar.mostrarMensajeSnackbar("Cálculo y archivo generados con éxito", "success");

        subramo.value = null;
        fechaEvaluada.value = undefined;
      } else if (response?.status === 208) {
        dialog.show({
          title: "Cálculo existente",
          message: `El cálculo con el subramo ${subramo.value?.cveCobertura} ya existe. ¿Desea reemplazarlo por uno nuevo?`,
          ExtraAction: {
            text: "Sí, agregar uno nuevo",
            handler: async () => {
              try {
                await deleteCalculo(subramo.value?.cveCobertura, fechaEvaluada.value!);
                calcularPrimas();
              } catch (error) {
                snackbar.mostrarMensajeSnackbar(
                  "Ocurrió un error al intentar reemplazar el cálculo.",
                  "error"
                );
              }
            },
            color: "primary"
          }
        });
      }
    } catch (error) {
      snackbar.mostrarMensajeSnackbar("Ocurrió un error de red o de servidor.", "error");
    } finally {
      block.value = false;
    }
  };

  const descargarItem = async (item: CalculoPrimasVidas) => {
    block.value = true;
    try {
      const response = await downloadFile(String(item.id));
      const base64Data = typeof response === "string" ? response : response?.documentBytes;
      if (base64Data) {
        downloadFileFromBase64(
          base64Data,
          item.nombreArchivo || `calculo_${item.id}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
      } else {
        snackbar.mostrarMensajeSnackbar("No se recibieron datos válidos del archivo", "error");
      }
    } catch (error) {
      console.error("Error en la descarga:", error);
      snackbar.mostrarMensajeSnackbar("Error al descargar el archivo", "error");
    } finally {
      block.value = false;
    }
  };

  const generarCsv = async (item?: { idRamo?: string; fechaEvaluacion?: string | Date; nombreArchivo?: string }) => {
    block.value = true;
    try {
      const payload: any = item || { idRamo: subramo.value?.cveCobertura, fechaEvaluacion: fechaEvaluada.value };
      await makeFileCsv(payload);
      snackbar.mostrarMensajeSnackbar("El servidor ha procesado el archivo CSV", "success");
    } catch (error) {
      console.error("Error ejecutando proceso CSV:", error);
      snackbar.mostrarMensajeSnackbar("Error al procesar CSV", "error");
    } finally {
      block.value = false;
    }
  };

  const guardarCsv = async (payload: { idRamo?: string; fechaEvaluacion?: string | Date; nombreArchivo?: string; documentBytes?: string }) => {
    block.value = true;
    try {
      const data = await saveFileCsv(payload);
      snackbar.mostrarMensajeSnackbar("Registro guardado correctamente", "success");
      return data;
    } catch (error) {
      console.error("Error guardando CSV:", error);
      snackbar.mostrarMensajeSnackbar("Error al guardar CSV", "error");
    } finally {
      block.value = false;
    }
  };

  const borrarItem = (item: CalculoPrimasVidas) => {
    dialog.show({
      title: "Confirmar eliminación",
      message: `¿Eliminar cálculo de ${getSubramoName(item.idRamo)}?`,
      ExtraAction: {
        text: "Eliminar",
        color: "error",
        handler: async () => {
          block.value = true;
          try {
            await deleteCalculo(item.idRamo, item.fechaCalculo);
            queryClient.invalidateQueries({ queryKey: ["calculo-vida-primas-history"] });
            snackbar.mostrarMensajeSnackbar("Eliminado correctamente", "success");
          } finally {
            block.value = false;
          }
        }
      }
    });
  };

  return {
    querySubramos,
    subramo,
    fechaCalculo: fechaEvaluada,
    headers,
    calcularPrimas,
    descargarItem,
    generarCsv,
    guardarCsv,
    borrarItem,
    queryHistory,
    block,
    getSubramoName,
  };
};