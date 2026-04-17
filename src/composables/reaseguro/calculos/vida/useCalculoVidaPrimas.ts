import { OperacionesRamosActions } from "@/API/catalogos/operaciones-ramos/operaciones-ramos.actions";
import { calculoPrimasActions } from "@/API/reaseguro/calculos/calculo_primas.actions";
import type { CalculoPrimasVidas } from "@/API/reaseguro/calculos/calculo_primas.interface";
import { useDialog } from "@/stores/general/dialogStore";
import { useSnackbar } from "@/stores/general/snackbarStore";
import { downloadFileFromBase64 } from "@/utils/downloadFileFromBase64";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";

export const useCalculoVidaPrimas = () => {
  const { fetchOperacionesRamosFiltered } = OperacionesRamosActions();
  const dialog = useDialog();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const block = ref<boolean>(false);

  const { fetch, calcular, deleteCalculo } = calculoPrimasActions();

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
    return querySubramos.data.value?.filter((item) =>  item.cveCobertura ===  idRamo)[0]?.descOperacionRamos;
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

    snackbar.mostrarMensajeSnackbar("Realizando cálculo de primas...", "success",);

    const response = await calcular( subramo.value?.cveCobertura, fechaEvaluada.value );

    if(response?.status === 200) {
      queryClient.invalidateQueries({ queryKey: ["calculo-vida-primas-history"] })
      snackbar.mostrarMensajeSnackbar("Cálculo ralizado con éxito", "success");
      subramo.value = null;
      fechaEvaluada.value = undefined;
    } else if (response?.status === 208) {
      dialog.show({
        title: "Cálculo existente",
        message: `El cálculo con el ${subramo.value?.cveCobertura} y fecha ${fechaEvaluada.value} ya existe. ¿Desea agregar uno nuevo?`,
        ExtraAction: {
          text: "Sí, agregar uno nuevo",
          handler: async () => {
            try {
              await deleteCalculo(subramo.value?.cveCobertura, fechaEvaluada.value!)
              calcularPrimas();
            } catch (error) {
              snackbar.mostrarMensajeSnackbar(
                "Ocurrio un error al agregar un nuevo cálculo, verifique la información",
                "error"
              );
            }
          },
          color: "primary"
        }
      });
    }
    
    block.value = false;
  };

  const descargarItem = (item: CalculoPrimasVidas) => {
    downloadFileFromBase64(
      item.documentBytes,
      item.nombreArchivo,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  };


  return {
    querySubramos,
    subramo,
    fechaCalculo: fechaEvaluada,
    headers,
    calcularPrimas,
    descargarItem,
    queryHistory,
    block,
    getSubramoName,
  };
};
