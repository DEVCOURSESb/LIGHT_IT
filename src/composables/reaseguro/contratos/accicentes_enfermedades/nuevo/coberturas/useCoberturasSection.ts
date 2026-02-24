import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";

export const useCoberturasSection = () => {
  const aeStore = useContratoAEStore();
  const { isTypeProporcional } = storeToRefs(aeStore);

  const { queryCriterioAsignacion, queryOperacionesRamos, queryCoberturasAyE } =
    useAccidentesEnfermedades();

  const operacionesRamosData = ref<{ title: string; value: string }[]>([]);

  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm({
    validationSchema: {},
  });

  const showErrors = ref(false);

  watch(
    [
      isTypeProporcional,
      () => queryOperacionesRamos.data.value,
      () => queryOperacionesRamos.isLoading.value,
    ],
    (newValue) => {
      const [isTypeProporcional, _, isLoading] = newValue;

      if (isTypeProporcional == null || isLoading) {
        return;
      }

      let arrayHelper: { title: string; value: string }[] = [];

      // ! NO ES PROPORCIONAL
      if (!isTypeProporcional) {
        const tablaOperacionesRamosContrato =
          aeStore.recuperarTablaOperacionRamoContrato();

        // por cada registro de la tabla
        tablaOperacionesRamosContrato.forEach((row) => {
          // busca su registro completo en la query
          const operacion = queryOperacionesRamos?.data.value?.find(
            (element) => element.cveCobertura === row.cveOperRamo,
          );

          // si no es nulo
          if (!!operacion) {
            arrayHelper.push({
              title: operacion.descOperacionRamos,
              value: operacion.cveCobertura,
            });
          }
        });
        operacionesRamosData.value = arrayHelper;
        arrayHelper = [];

        // ! PROPORCIONAL
      } else {
        const dataDetallesContrato = aeStore.obtenerDetallesProporcionales();
        //const detallesOperRamo = dataDetallesContrato[0]?.detallesOperRamo === "SI";

        console.log("ñsjbackjsbdvlsfvjfl");
        dataDetallesContrato.forEach((row) => {
          // busca su registro completo en la query
          const operacion = queryOperacionesRamos?.data.value?.find(
            (element) => element.cveCobertura === row.cveOperRamoDetalles,
          );

          // si no es nulo
          if (!!operacion) {
            arrayHelper.push({
              title: operacion.descOperacionRamos,
              value: operacion.cveCobertura,
            });
          }
        });

        operacionesRamosData.value = arrayHelper;
        arrayHelper = [];
      }
    },
    { immediate: true },
  );

  /** */

  watch(
    () => formData.cveCriterioAsigCobertura,
    (newValue) => {
      let valuesRecuperados;

      /**
       * Si el valor del campo cveCriterioAsigCobertura es: (3) POR OPERACIÓN o (6) POR REASEGURADOR Y OPERACIÓN / RAMO
       * El sistema deberá recuperar los valores registrados en la columna cveCriterioAsigCobertura
       */
      if ([3, 6].includes(newValue)) {
        valuesRecuperados = formData.cveCriterioAsigCobertura;
      } else {
        // !NO PROPORCIONAL
        if (!isTypeProporcional) {
          // El sistema deberá consulta la tabla DETALLES_CONTRATO y recuperar el valor del campo DETALLES_OPER_RAMO
          /* valuesRecuperados = aeStore
            .obtenerDetallesProporcionales()
            .map(({ detallesOperRamo }) => ({ detallesOperRamo })); */
        } else {
          const detalle = aeStore.obtenerDetallesProporcionales()[0]?.detallesOperRamo == "SI";

          if (detalle) {
          } else {
          }
        }
      }
    },
  );

  return {
    setFieldValue,
    formData,
    formErrors,
    showErrors,
    queryCriterioAsignacion,
    reaseguradoraData: aeStore.recuperarReaseguradores(),
    operacionesRamosData,
  };
};
