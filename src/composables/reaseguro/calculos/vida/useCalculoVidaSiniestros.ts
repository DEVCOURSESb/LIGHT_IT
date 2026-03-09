import { BaseAPI } from "@/API/BaseAPI";
import { OperacionesRamosActions } from "@/API/catalogos/operaciones-ramos/operaciones-ramos.actions";
import { calculoSiniestrosActions } from "@/API/reaseguro/calculos/calculo_siniestros.actions";
import type { CalculoSiniestrosVida } from "@/API/reaseguro/calculos/calculo_siniestros.interface";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useSnackbar } from "@/stores/useSnackbar";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { format, parseISO } from "date-fns";
import { ref, watch } from "vue";

export const useCalculoVidaSiniestros = () => {
  const dialog = useDialog();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const block = ref<boolean>(false);
  const baseAPI = BaseAPI({ prefix: 'ws_latino/reaseguro', isBase: false, isPrivate: true });


  const { fetch, calcular, deleteCalculo } = calculoSiniestrosActions();

  const queryHistory = useQuery({
    queryKey: ["calculo-vida-siniestros-history"],
    queryFn: fetch,
  });

  const fechaEvaluada = ref<Date>();

  function obtenerUltimoDiaMes(fecha: Date): Date {
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();
    return new Date(anio, mes + 1, 0);
  }

  watch(fechaEvaluada, (nuevaFecha) => {
    if (nuevaFecha) {
      const ultimo = obtenerUltimoDiaMes(nuevaFecha);

      if (nuevaFecha.getDate() !== ultimo.getDate()) {
        fechaEvaluada.value = ultimo;
      }
    }
  });

  const headers = [
    // falta normalizar esta fecha pues viene tal y como esta en base
    {
      title: "FECHA REGISTRO",
      key: "fechaRegistro",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    {
      title: "FECHA EVALUADA",
      key: "fechaEvaluacion",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
    },
    // hacer que aparezca el checkbox deshabilitado
    {
      title: "PRIMAS",
      key: "primas",
      sortable: true,
      headerProps: {
        style: "font-weight: bold",
      },
      fields: [
        {
          name: "primas",
          label: "Primas",
          type: "Checkbox",
          required: true,
          dataKey: "primas",
          displayType: "checkbox",
          defaultValue: true,
        },
      ]
    },
    {
      title: "ACCIONES",
      key: "actions",
      sortable: false,
      headerProps: {
        style: "font-weight: bold",
      },
    },
  ];

  const verificarExistencia = async (fechaEval: Date | string) => {
    try {
      const historial = await fetch();

      if (!historial || !Array.isArray(historial)) return false;

      const fechaBusqueda = new Date(fechaEval).toISOString().split('T')[0];

      const existe = historial.some((item: any) => {
        if (!item.fechaEvaluacion) return false;

        const fechaDB = new Date(item.fechaEvaluacion).toISOString().split('T')[0];
        return fechaDB === fechaBusqueda;
      });

      return existe;
    } catch (error) {
      console.error("Error al verificar existencia:", error);
      return false;
    }
  };

  const ejecutarProcesoCalculo = async (fechaParaCalcular: Date | string) => {
    block.value = true;

    try {
      const fechaFinal = typeof fechaParaCalcular === 'string'
        ? new Date(fechaParaCalcular)
        : fechaParaCalcular;

      const response = await calcular(fechaFinal);

      if (response?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["calculo-vida-siniestros-history"] });
        snackbar.mostrarMensajeSnackbar("Cálculo realizado con éxito", "success");
        fechaEvaluada.value = undefined;
      } else {
        snackbar.mostrarMensajeSnackbar("El proceso de cálculo no pudo completarse.", "error");
      }
    } catch (error) {
      snackbar.mostrarMensajeSnackbar("Error al ejecutar el nuevo cálculo.", "error");
    } finally {
      block.value = false;
    }
  };

  const calcularSiniestros = async () => {
    if (!fechaEvaluada.value) {
      snackbar.mostrarMensajeSnackbar("Seleccione una fecha de evaluación.", "error");
      return;
    }
    block.value = true;

    try {
      const yaExiste = await verificarExistencia(fechaEvaluada.value);

      if (yaExiste) {
        mostrarDialogoReemplazo();
      } else {
        await ejecutarProcesoCalculo(fechaEvaluada.value);
      }
    } catch (error) {
      snackbar.mostrarMensajeSnackbar("Error al conectar con el servidor.", "error");
    } finally {
      block.value = false;
    }
  };

  const ejecutarBajaPorFecha = async (fecha: Date | string) => {
    const fechaISO = new Date(fecha).toISOString().split('T')[0];
    return await baseAPI.post(`deleteByFechaEvaluacion/${fechaISO}`);
  };

  const mostrarDialogoReemplazo = () => {
    const fechaRespaldada = fechaEvaluada.value!;
    const fecha = fechaRespaldada.toISOString().split('T')[0];
    dialog.show({
      title: "Cálculo existente",
      message: `Ya existe un registro para esta fecha "${fecha}". ¿Desea reemplazarlo?`,
      type: DialogType.CONFIRM,
      onConfirm: async () => {
          try {
            block.value = true;

            const response = await ejecutarBajaPorFecha(fechaRespaldada);

            if (response.status === 200 || response.status === 204) {
              await ejecutarProcesoCalculo(fechaRespaldada);
            } else {
              snackbar.mostrarMensajeSnackbar("No se pudo eliminar el registro anterior.", "error");
            }
          } catch (error) {
            snackbar.mostrarMensajeSnackbar("Error en el proceso de reemplazo.", "error");
          } finally {
            block.value = false;
          }
        }
      })
  };

  const descargarItem = (item: CalculoSiniestrosVida) => {
    const nombreArchivo = `CALCULO_SINIESTROS_VIDA_${item.fechaEvaluacion}`;
    downloadFileFromBase64(
      item.base64,
      nombreArchivo,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };


  return {
    fechaCalculo: fechaEvaluada,
    headers,
    calcularSiniestros,
    descargarItem,
    deleteCalculo,
    queryHistory,
    block,
  };
};
