import { useForm } from "vee-validate";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { ref, computed, watch } from "vue";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { formatCurrency } from "@/utils/formatCurrency";
import { formattNumber } from "@/utils/formattNumber";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useCoberturasValidations } from "./useCoberturasValidations";

// TODO: 

const COBERTURAS_POR_OPER_RAMO: Record<string, string[]> = {
  "3000": [], 
  "030":  [], 
  "331":  ["3000", "030", "331", "0031", "0032", "0033"],
  "332":  ["3000", "030", "332", "0034", "0035", "0036"],
  "333":  ["3000", "030", "333", "0037", "0038", "0039"],
  "0031": ["3000", "030", "331", "0031"],
  "0032": ["3000", "030", "331", "0032"],
  "0033": ["3000", "030", "331", "0033"],
  "0034": ["3000", "030", "332", "0034"],
  "0035": ["3000", "030", "332", "0035"],
  "0036": ["3000", "030", "332", "0036"],
  "0037": ["3000", "030", "333", "0037"],
  "0038": ["3000", "030", "333", "0038"],
  "0039": ["3000", "030", "333", "0039"],
};

interface CoberturaForm {
  cveCriterioAsigCobertura: number | null;
  cveReaseguradorCobertura: number | null;
  cveOperRamoCobertura: string | null;
  cveCobaye: number | null;
  propiaSaMax: number;
  saMax: number | null;
}

interface CoberturaRow extends CoberturaForm {
  nombreReasegurador: string;
  descOperRamo: string;
  descCobaye: string;
  coberActiva: boolean; 
}

export const useCoberturasSection = () => {
  const aeStore = useContratoAEStore();
  const { isTypeProporcional } = storeToRefs(aeStore);
  const dialog = useDialog();

  const {
    queryCriterioAsignacion,
    queryOperacionesRamos,
    queryCoberturasAyE,
    queryReaseguradoras,
  } = useAccidentesEnfermedades();

  
  const dataTable = ref<CoberturaRow[]>(aeStore.recuperarCoberturas());

  const saMax = ref("");

  const {
    validate,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
  } = useForm<CoberturaForm>({
    validationSchema: useCoberturasValidations(),
    validateOnMount: false,
  });

  const showErrors = ref(false);
  
  const criterioFijo = computed(() => {
    const activos = dataTable.value.filter((r) => r.coberActiva);
    return activos.length > 0 ? activos[0]!.cveCriterioAsigCobertura : null;
  });

  const criterioEstaFijo = computed(() => criterioFijo.value != null);

  const operacionesRamosData = ref<{ title: string; value: string }[]>([]);

  watch(
    [
      isTypeProporcional,
      () => queryOperacionesRamos.data.value,
      () => queryOperacionesRamos.isLoading.value,
    ],
    ([proporcional, _, isLoading]) => {
      if (proporcional == null || isLoading) return;

      // array de ayuda
      const helper: { title: string; value: string }[] = [];

      // fnc agrega al helper operaciones buscando en el query de operaciones ramos
      const pushOperacion = (cveCobertura: string) => {
        const operacion = queryOperacionesRamos.data.value?.find(
          (el) => el.cveCobertura === cveCobertura
        );
        if (operacion) {
          helper.push({
            title: operacion.descOperacionRamos,
            value: operacion.cveCobertura,
          });
        }
      };

      // si es no proporcional el contrato entonces
      if (!proporcional) {
        
        // recupera los registros de la tabla y los agrega al helper por medio de la funcion
        aeStore.recuperarTablaOperacionRamoContrato().forEach((row) => {
          console.log(row.cveOperRamo)
          pushOperacion(row.cveOperRamo);
        });

        // si es proporcional
      } else {
        const detalles = aeStore.obtenerDetallesProporcionales();
        const tieneDetalleOperRamo = detalles[0]?.detallesOperRamo === 1;

        if (tieneDetalleOperRamo) {
          
          detalles.forEach((row) => {
            console.log(row.cveOperRamoDetalles)
            pushOperacion(row.cveOperRamoDetalles);
          });
        } //else {
          /* aeStore.recuperarTablaOperacionRamoContrato().forEach((row) => {
            pushOperacion(row.cveOperRamo);
          }); */
        //}
      }

      operacionesRamosData.value = helper.filter(
        (item, index, self) => self.findIndex((t) => t.value === item.value) === index
      );
    },
    { immediate: true }
  );

  const coberturasDisponibles = computed(() => {
    const todasLasCoberturas = queryCoberturasAyE.data.value ?? [];
    const criterio = formData.cveCriterioAsigCobertura;
    
    // helper para almacenar las claves
    let cvesOperRamo: string[] = [];

    // si cveCriterioAsigCobertura es 3 o 6 debe de recuperarse
    // los valores de la columna cveOperRamoCobertura
    if ([3, 6].includes(criterio!)) {
      
      if (formData.cveOperRamoCobertura) {
        cvesOperRamo = [formData.cveOperRamoCobertura];
        console.log("claves porque es 3 o 6 el criterio asignacion", cvesOperRamo);
      }
    } else {
      // recupera los valores de operacionesRamosData ya que ya tienen un filtrado
      cvesOperRamo = operacionesRamosData.value.map((o) => o.value);
      console.log("claves porque depende de detallesOperRamo y son parte del filtro anterior", {cvesOperRamo})
    }

    if (cvesOperRamo.length === 0) return todasLasCoberturas;

    // si en los recuperados hay 3000 o 030 se muestran todos
    if (cvesOperRamo.some((c) => ["3000", "030"].includes(c))) {
      return todasLasCoberturas;
    }

    // set que no permite duplicados
    const cvesPermitidos = new Set<string>();

    cvesOperRamo.forEach((cve) => {
      const permitidos = COBERTURAS_POR_OPER_RAMO[cve];
      console.log("permitidos", permitidos)
      if (permitidos) {
        permitidos.forEach((permitido) => cvesPermitidos.add(permitido));
      }
    });

    if (cvesPermitidos.size === 0) return todasLasCoberturas;

    return todasLasCoberturas.filter((c) =>
      {
        return cvesPermitidos.has(String(c.cveCobertura))
      }
    );
  });
  
  watch(
    () => formData.cveCriterioAsigCobertura,
    () => {
      setFieldValue("cveReaseguradorCobertura", null);
      setFieldValue("cveOperRamoCobertura", null);
      setFieldValue("cveCobaye", null);
    }
  );

  watch(
    () => formData.cveOperRamoCobertura,
    () => {
      setFieldValue("cveCobaye", null);
    }
  );

  watch(
    () => formData.propiaSaMax,
    (newValue) => {
      if (newValue !== 1) {
        setFieldValue("saMax", null);
        saMax.value = "";
      }
    }
  );

  const onInputSaMax = (value: string) => {
    const clean = formattNumber(value);
    saMax.value = clean;
    setFieldValue("saMax", clean === "" ? null : parseFloat(clean));
  };

  const onBlurSaMax = () => {
    if (!saMax.value) {
      setFieldValue("saMax", null);
      return;
    }
    const numeric = parseFloat(saMax.value);
    if (isNaN(numeric)) {
      saMax.value = "";
      setFieldValue("saMax", null);
      return;
    }
    setFieldValue("saMax", numeric);
    saMax.value = formatCurrency(numeric);
  };

  const getNombreReasegurador = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryReaseguradoras.data.value ?? []).find(
        (r) => r.cveReasegurador === cve
      )?.nombreReasegurador ?? ""
    );
  };

  const getDescOperRamo = (cve: string | null): string => {
    if (!cve) return "";
    return (
      operacionesRamosData.value.find((o) => o.value === cve)?.title ?? ""
    );
  };

  const getDescCobaye = (cve: number | null): string => {
    if (cve == null) return "";
    return (
      (queryCoberturasAyE.data.value ?? []).find(
        (c) => c.cveCobaye === cve
      )?.descCobaye ?? ""
    );
  };
  
  const resetFormAndRefs = () => {
    
    const criterioActual = criterioFijo.value ?? formData.cveCriterioAsigCobertura;
    resetForm();
    setFieldValue("cveCriterioAsigCobertura", criterioActual);
    setFieldValue("propiaSaMax", 0);
    saMax.value = "";
    showErrors.value = false;
  };
  
  const handleAgregarCobertura = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar las coberturas capturadas?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: confirmAgregarCobertura,
      },
    });
  };

  const confirmAgregarCobertura = async () => {
    showErrors.value = true;
    const { valid } = await validate();
    if (!valid) return;

    const newRow: CoberturaRow = {
      cveCriterioAsigCobertura: formData.cveCriterioAsigCobertura,
      cveReaseguradorCobertura: formData.cveReaseguradorCobertura,
      cveOperRamoCobertura: formData.cveOperRamoCobertura,
      cveCobaye: formData.cveCobaye,
      propiaSaMax: formData.propiaSaMax,
      saMax: formData.saMax,
      nombreReasegurador: getNombreReasegurador(formData.cveReaseguradorCobertura),
      descOperRamo: getDescOperRamo(formData.cveOperRamoCobertura),
      descCobaye: getDescCobaye(formData.cveCobaye),
      coberActiva: true,
    };

    dataTable.value.push(newRow);
    resetFormAndRefs();
  };

  const toggleRowActiva = (item: CoberturaRow) => {
    const index = dataTable.value.indexOf(item);
    if (index !== -1) {
      dataTable.value[index]!.coberActiva = !dataTable.value[index]!.coberActiva;
    }
  };

  const editRow = (row: CoberturaRow) => {
    const index = dataTable.value.indexOf(row);
    if (index !== -1) dataTable.value.splice(index, 1);

    setFieldValue("cveCriterioAsigCobertura", row.cveCriterioAsigCobertura);
    setFieldValue("cveReaseguradorCobertura", row.cveReaseguradorCobertura);
    setFieldValue("cveOperRamoCobertura", row.cveOperRamoCobertura);
    setFieldValue("cveCobaye", row.cveCobaye);
    setFieldValue("propiaSaMax", row.propiaSaMax);
    setFieldValue("saMax", row.saMax);

    saMax.value = row.saMax != null ? formatCurrency(row.saMax) : "";
  };

  const handleGuardarCoberturas = () => {
    if (dataTable.value.length === 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe contener al menos un registro para continuar. Verifique por favor.",
        type: DialogType.ERROR,
      });
      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de coberturas del contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Continuar",
        color: "primary",
        handler: validarYGuardar,
      },
    });
  };

  const validarYGuardar = () => {
    const criterio = dataTable.value[0]?.cveCriterioAsigCobertura;
    const activas = dataTable.value.filter((r) => r.coberActiva);
    const error = ejecutarValidacionPorCriterio(criterio, activas);

    if (error) {
      dialog.show({
        title: "Error",
        message: error,
        type: DialogType.ERROR,
      });
      return;
    }

    doGuardarCoberturas();
  };

  /**
   * Ejecuta la validación correspondiente según CVE_CRITERIOASIG_COBERTURA
   * Devuelve el mensaje de error o null si pasa.
   */
  const ejecutarValidacionPorCriterio = (
    criterio: number | null | undefined,
    activas: CoberturaRow[]
  ): string | null => {

    
    if (criterio === 1) {
      const cvesCobertura = activas.map((r) => r.cveCobaye);
      const hayDuplicados = cvesCobertura.length !== new Set(cvesCobertura).size;
      if (hayDuplicados) {
        return "Solo se permite un registro por cobertura para el contrato.";
      }
      return null;
    }

    
    if (criterio === 0) {
      const reaseguradoresContrato = (aeStore.recuperarReaseguradores() as any[]).map(
        (r) => r.cveReasegurador
      );
      const cvesEnTabla = [...new Set(activas.map((r) => r.cveReaseguradorCobertura))];
      const faltantes = reaseguradoresContrato.filter((cve) => !cvesEnTabla.includes(cve));

      if (faltantes.length > 0) {
        return "Se debe registrar al menos una cobertura por cada reaseguradora.";
      }
      return null;
    }

    
    if (criterio === 3) {
      const cvesOperRamoRequeridos = _obtenerCvesOperRamoRequeridos();
      const cvesEnTabla = [...new Set(activas.map((r) => r.cveOperRamoCobertura))];
      const faltantes = cvesOperRamoRequeridos.filter((cve) => !cvesEnTabla.includes(cve));

      if (faltantes.length > 0) {
        return "Se debe registrar al menos una cobertura por cada operación / ramo.";
      }
      return null;
    }

    
    if (criterio === 6) {
      const cvesOperRamoRequeridos = _obtenerCvesOperRamoRequeridos();
      const reaseguradoresContrato = (aeStore.recuperarReaseguradores() as any[]).map(
        (r) => r.cveReasegurador as number
      );

      
      const combinacionesFaltantes: string[] = [];

      reaseguradoresContrato.forEach((cveReaseg) => {
        cvesOperRamoRequeridos.forEach((cveOper) => {
          const existe = activas.some(
            (r) =>
              r.cveReaseguradorCobertura === cveReaseg &&
              r.cveOperRamoCobertura === cveOper
          );
          if (!existe) {
            combinacionesFaltantes.push(`Reaseg ${cveReaseg} – Oper/Ramo ${cveOper}`);
          }
        });
      });

      if (combinacionesFaltantes.length > 0) {
        return "Se debe registrar al menos una cobertura por cada operación / ramo.";
      }
      return null;
    }

    return null;
  };

  /**
   * Obtiene los CVE_OPER_RAMO requeridos según tipo de reaseguro y detalles del contrato.
   * Reutilizado para criterios 3 y 6.
   */
  const _obtenerCvesOperRamoRequeridos = (): string[] => {
    if (!isTypeProporcional.value) {
      
      return (aeStore.recuperarTablaOperacionRamoContrato() as any[]).map(
        (r) => r.cveOperRamo as string
      );
    }

    
    const detalles = aeStore.obtenerDetallesProporcionales() as any[];
    const tieneDetalleOperRamo = detalles[0]?.detallesOperRamo === 1;

    if (tieneDetalleOperRamo) {
      
      return detalles.map((d) => d.cveOperRamoDetalles as string);
    } else {
      
      return (aeStore.recuperarTablaOperacionRamoContrato() as any[]).map(
        (r) => r.cveOperRamo as string
      );
    }
  };

  const doGuardarCoberturas = () => {
    aeStore.guardarCoberturas(dataTable.value);

    dialog.show({
      title: "Atención",
      message: "Información de coberturas guardadas con éxito",
    })

    dialog.cerrar();
  };
  
  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "Reaseguradora",       key: "nombreReasegurador",    sortable: true,  headerProps },
    { title: "Operación / Ramo",    key: "descOperRamo",          sortable: true,  headerProps },
    { title: "Cobertura",           key: "descCobaye",            sortable: true,  headerProps },
    { title: "¿Propia SA máx.?",    key: "propiaSaMax",           sortable: true,  headerProps },
    { title: "Suma asegurada máx.", key: "saMax",                 sortable: true,  headerProps },
    { title: "Activa",              key: "coberActiva",           sortable: true,  headerProps },
    { title: "Editar",              key: "editar",                sortable: false, headerProps },
  ];
  
  const reaseguradoraData = computed(() => {
    const reaseguradoresContrato = aeStore.recuperarReaseguradores() as Array<{
      cveReasegurador: number;
      nombreReasegurador?: string;
    }>;

    const cvesContrato = reaseguradoresContrato.map((r) => r.cveReasegurador);

    return (queryReaseguradoras.data.value ?? []).filter((r) =>
      cvesContrato.includes(r.cveReasegurador)
    );
  });

  return {
    
    formData,
    formErrors,
    showErrors,
    setFieldValue,
    
    saMax,
    onInputSaMax,
    onBlurSaMax,
    
    queryCriterioAsignacion,
    reaseguradoraData,
    operacionesRamosData,
    coberturasDisponibles,
    
    tableHeaders,
    dataTable,
    
    criterioEstaFijo,
    
    handleAgregarCobertura,
    handleGuardarCoberturas,
    toggleRowActiva,
    editRow,
  };
};