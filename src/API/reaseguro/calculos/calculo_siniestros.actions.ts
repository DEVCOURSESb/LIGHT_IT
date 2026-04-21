import { BaseAPI } from "@/API/BaseAPI";
import type { CalculoSiniestrosVida } from "./calculo_siniestros.interface";
import { DialogType, useDialog } from "@/stores/general/dialogStore";

export const calculoSiniestrosActions = () => {
  const baseAPI = BaseAPI({ prefix: 'ws_latino/reaseguro', isBase: true, isPrivate: true });
  const dialog = useDialog()

  const fetch = async () => {
    try {
      const { data } = await baseAPI.get<{ dataExtra: CalculoSiniestrosVida[] }>("getCalculosSiniestros");
      return data.dataExtra;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const calcular = async (fechaEvaluacion: Date) => {
    const fechaNormalizada = fechaEvaluacion.toISOString().split("T")[0];
    try {
      const response = await baseAPI.post( `execSPCalculoSiniestrovida/${fechaNormalizada}`);
      return response;
    } catch (error) {
      console.error("Error al calcular siniestros:", error);
    }
  };

  const deleteCalculo = async (fechaEvaluacion: Date) =>{
    dialog.show({
      title: 'Advertencia',
      message: `¿Estás seguro de eliminar el cálculo con fecha de evaluación "${fechaEvaluacion}" ?`,
      type: DialogType.CONFIRM,
      onConfirm: async () => {
        try {
          const { data } = await baseAPI.post(`deleteByFechaEvaluacion/${fechaEvaluacion}`);
          dialog.show({
            title: 'ELIMINADO',
            message: 'Registro borrado con éxito.',
            type: DialogType.SUCCESS
          });
          setTimeout(() => {
            window.location.reload();
          },1500)
          return data;
        } catch (error) {
          dialog.show({
            title: 'ERROR',
            message: 'No se pudo eliminar el registro.',
            type: DialogType.ERROR
          });
        }
      }
    });
  }


  return {
    fetch,
    calcular,
    deleteCalculo,
  };
};
