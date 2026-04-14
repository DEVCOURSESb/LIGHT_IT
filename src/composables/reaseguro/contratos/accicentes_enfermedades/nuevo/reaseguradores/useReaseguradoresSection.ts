import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";
import { useAccidentesEnfermedades } from "../useAccidentesEnfermedades";
import { useReaseguradoresSectionValidations } from "./useReaseguradoresSectionValidations";
import { useForm } from "vee-validate";
import { computed, nextTick, ref, watch, type Ref } from "vue";
import { formattNumber } from "@/utils/formattNumber";
import { formatCurrency } from "@/utils/formatCurrency";
import { DialogType, useDialog } from "@/stores/dialogStore";
import type { ReaseguradoresSection } from "@/components/reaseguro/contratos/accidentes_enfermedades/nuevo/contrato.interfaces";

interface FormatNumberOptions {
  [key: string]: Ref<string>;
}

interface dataTableToDisplay extends ReaseguradoresSection {
  nombreReasegurador: string;
  descComisionRolReaseguro: string;
}

export const useReaseguradoresSection = () => {
  const aeStore = useContratoAEStore();
  const { isTypeProporcional, reaseguradores } = storeToRefs(aeStore);


  const {
    queryReaseguradoras,
    queryPtu,
    queryTipoAsignacion,
    queryCalculoComision,
    queryCriterioAsignacion,
  } = useAccidentesEnfermedades();

  const dataTableOriginal = ref<ReaseguradoresSection[]>([...reaseguradores.value]);

  const dataTable = computed(() => {
    return dataTableOriginal.value.map((r) => {
      const reaseguradora = queryReaseguradoras.data.value?.find((reaseg) => reaseg.cveReasegurador === r.cveReasegurador);
      return {
        ...r,
        nombreReasegurador: reaseguradora?.nombreReasegurador || "",
        descComisionRolReaseguro: r.comisRolReaseguro == 1 ? "SÍ" : "NO"
      };
    })
  });

  const dialog = useDialog();

  const participacion = ref("");
  const porcentajePtu = ref("");
  const porcentajeK = ref("");
  const gastos = ref("");
  const comisRolFija = ref("");
  const comisRolProvisional = ref("");
  const comisRolMin = ref("");
  const comisRolMax = ref("");
  const prioridad = ref("");
  const limResponsabilidad = ref("");
  const limAgregado = ref("");
  const costoFijo = ref("");
  const pmd = ref("");
  const primaMin = ref("");
  const primaMax = ref("");
  const noClaims = ref("");

  const formatNumberOptions: FormatNumberOptions = {
    participacion,
    porcentajePtu,
    porcentajeK,
    gastos,
    comisRolFija,
    comisRolProvisional,
    comisRolMin,
    comisRolMax,
    prioridad,
    limResponsabilidad,
    limAgregado,
    costoFijo,
    pmd,
    primaMin,
    primaMax,
    noClaims,
  };

  const {
    setFieldValue,
    values: formData,
    errors: formErrors,
    validate,
    resetForm,
  } = useForm({
    validationSchema: useReaseguradoresSectionValidations({
      isTypeProporcional: isTypeProporcional.value,
    }),
    validateOnMount: false,
  });

  const showErrors = ref(false);

  const onInputGeneric = (key: string, value: string) => {
    // Solo limpiar el valor, no formatear aún
    const clean = formattNumber(value);
    const option = formatNumberOptions[key];

    if (option) {
      // actualiza el valor del campo correspondiente
      option.value = clean;
      // Actualizar el formulario con el número sin formato
      const numericValue = clean === "" ? null : parseFloat(clean);
      setFieldValue(key, numericValue);
    }
  };

  const onBlurGeneric = (key: string) => {
    const option = formatNumberOptions[key];
    if (!option?.value || option?.value === "") {
      setFieldValue(key, null);
      return;
    }

    // Convertir a número
    const numericValue = parseFloat(option.value);

    // Si el valor no es válido, limpiar
    if (isNaN(numericValue)) {
      option.value = "";
      setFieldValue(key, null);
      return;
    }
    // Almacenar en el formulario
    setFieldValue(key, numericValue);
    // Formatear para visualización con comas y dos decimales
    option.value = formatCurrency(numericValue);
  };

  watch(
    () => participacion.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        participacion.value = "0";
      } else if (Number(newValue) > 100) {
        participacion.value = "100";
      }
    },
  );

  watch(
    () => porcentajePtu.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        porcentajePtu.value = "0";
      } else if (Number(newValue) > 100) {
        porcentajePtu.value = "100";
      }
    },
  );

  watch(
    () => porcentajeK.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        porcentajeK.value = "0";
      } else if (Number(newValue) > 100) {
        porcentajeK.value = "100";
      }
    },
  );

  watch(
    () => gastos.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        gastos.value = "0";
      } else if (Number(newValue) > 100) {
        gastos.value = "100";
      }
    },
  );

  watch(
    () => comisRolFija.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolFija.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolFija.value = "100";
      }
    },
  );

  watch(
    () => comisRolProvisional.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolProvisional.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolProvisional.value = "100";
      }
    },
  );

  watch(
    () => comisRolMin.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolMin.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolMin.value = "100";
      }
    },
  );

  watch(
    () => comisRolMax.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        comisRolMax.value = "0";
      } else if (Number(newValue) > 100) {
        comisRolMax.value = "100";
      }
    },
  );

  watch(
    () => noClaims.value,
    (newValue) => {
      if (Number(newValue) < 0) {
        noClaims.value = "0";
      } else if (Number(newValue) > 100) {
        noClaims.value = "100";
      }
    },
  );

  //! Reset de form cuando cambie isTypeProporcional
  watch(
    () => isTypeProporcional,
    (newValue) => {
      /* si es no proporcional */
      if (newValue) {
        setFieldValue("otorgaPtu", null);
        setFieldValue("capa", null);
        setFieldValue("prioridad", null);
        setFieldValue("limResponsabilidad", null);
        setFieldValue("limAgregado", null);
        setFieldValue("cveCriterioAsigLimAgregado", null);
        setFieldValue("cveAsignacionCosto", null);
        setFieldValue("noClaims", null);
      }
    },
    { immediate: true }
  );

  watch(
    () => formData.otorgaPtu,
    (newValue) => {
      if (newValue == null || newValue === "NO") {
        setFieldValue("porcentajePtu", null);
        setFieldValue("cvePtu", null);
      }
    }
  );

  watch(
    () => formData.cvePtu,
    (newValue) => {
      if (newValue == null || newValue != 2) {
        setFieldValue("porcentajeK", null);
      }
      if (newValue == null || ![5, 6, 7].includes(newValue)) {
        setFieldValue("gastos", null);
      }
      if (newValue == null || ![0, 3, 5, 6].includes(newValue)) {
        setFieldValue("aniosArrastre", null);
      }
    }
  );

  watch(
    () => formData.comisRolReaseguro,
    (newValue) => {
      if (newValue == null || newValue === "NO") {
        setFieldValue("cveAsignacionComisRol", null);
      }
    }
  );

  watch(
    () => formData.cveAsignacionComisRol,
    (newValue) => {
      if (newValue == null || newValue != 0) {
        setFieldValue("comisRolFija", null);
      }
      if (newValue == null || newValue != 1) {
        setFieldValue("cveCalcomis", null);
        setFieldValue("comisRolProvisional", null);
        setFieldValue("comisRolMin", null);
        setFieldValue("comisRolMax", null);
      }
      if (newValue != 2) {
        setFieldValue("comisRolProvisional", null);
      }
    }
  );

  watch(
    () => formData.cveAsignacionCosto,
    (newValue) => {
      if (newValue == null || newValue != 1) {
        setFieldValue("primaMin", null);
        setFieldValue("primaMax", null);
        setFieldValue("facAjusteDividendo", null);
        setFieldValue("facAjusteDivisor", null);
        setFieldValue("pmd", null);
      }
      if (newValue == null || newValue != 0) {
        setFieldValue("costoFijo", null);
      }
    }
  );

  const headerProps = { style: "font-weight: bold" };

  const tableHeaders = [
    { title: "REASEGURADORA", key: "nombreReasegurador", sortable: true, headerProps },
    { title: "PARTICIPACIÓN", key: "participacion", sortable: true, headerProps },
    { title: "COMISIÓN RATE ONLINE", key: "descComisionRolReaseguro", sortable: true, headerProps },
    { title: "LÍMITE RESPONSABILIDAD", key: "limResponsabilidad", sortable: true, headerProps },
    { title: "ACTIVA", key: "reasegActiva", sortable: true, headerProps },
    { title: "EDITAR", key: "editar", sortable: false, headerProps },
  ];

  const toggleActive = (item: ReaseguradoresSection) => {
      // const someActive = dataTable.value.some( row => row.reasegActiva && row.cveReasegurador != item.cveReasegurador );

    //if( !someActive ) {
      /* dialog.show({
        title: "Atención",
        message:"Debe existir almenos una reaseguradora activa para el contrato",
        type: DialogType.ERROR
      }); */
      //return;
    //}
    const index = dataTableOriginal.value.findIndex(row => row.cveReasegurador === item.cveReasegurador);

    if (index !== -1) {
      dataTableOriginal.value[index]!.reasegActiva = !dataTableOriginal.value[index]!.reasegActiva;
    }
  };

  const compareRows = (row: dataTableToDisplay, compare: dataTableToDisplay) => {
      return (row.cveReasegurador === compare.cveReasegurador &&
        row.participacion === compare.participacion &&
        row.otorgaPtu === compare.otorgaPtu &&
        row.porcentajePtu === compare.porcentajePtu &&
        row.cvePtu === compare.cvePtu &&
        row.gastos === compare.gastos &&
        row.porcentajeK === compare.porcentajeK &&
        row.aniosArrastre === compare.aniosArrastre &&
        row.comisRolReaseguro === compare.comisRolReaseguro &&
        row.cveAsignacionComisRol === compare.cveAsignacionComisRol &&
        row.cveCalcomis === compare.cveCalcomis &&
        row.comisRolFija === compare.comisRolFija &&
        row.comisRolProvisional === compare.comisRolProvisional &&
        row.comisRolMin === compare.comisRolMin &&
        row.comisRolMax === compare.comisRolMax &&
        row.capa === compare.capa &&
        row.prioridad === compare.prioridad &&
        row.limResponsabilidad === compare.limResponsabilidad &&
        row.limAgregado === compare.limAgregado &&
        row.cveCriterioAsigLimAgregado === compare.cveCriterioAsigLimAgregado &&
        row.cveAsignacionCosto === compare.cveAsignacionCosto &&
        row.costoFijo === compare.costoFijo &&
        row.pmd === compare.pmd &&
        row.primaMin === compare.primaMin &&
        row.primaMax === compare.primaMax &&
        row.facAjusteDividendo === compare.facAjusteDividendo &&
        row.facAjusteDivisor === compare.facAjusteDivisor &&
        row.noClaims === compare.noClaims &&
        row.nombreReasegurador === compare.nombreReasegurador &&
        row.reasegActiva === compare.reasegActiva)
  }

  const resetFormAndRefs = () => {
  resetForm();

  const numericFields: (keyof FormatNumberOptions)[] = [
    "participacion",
    "porcentajePtu",
    "porcentajeK",
    "gastos",
    "comisRolFija",
    "comisRolProvisional",
    "comisRolMin",
    "comisRolMax",
    "prioridad",
    "limResponsabilidad",
    "limAgregado",
    "costoFijo",
    "pmd",
    "primaMin",
    "primaMax",
    "noClaims",
  ];

  numericFields.forEach((key) => {
    const ref = formatNumberOptions[key];
    if (ref) {
      ref.value = "";
    }
  });
};

  const editRow = (row: dataTableToDisplay) => {
    /* console.log(row); */
    // elimina de la tabla
    dataTableOriginal.value = dataTable.value.filter(rowT => !compareRows(rowT, row));

    // llena el form
    setFieldValue("cveReasegurador", row?.cveReasegurador);
    setFieldValue("participacion", row?.participacion);
    setFieldValue("otorgaPtu", row?.otorgaPtu);
    setFieldValue("porcentajePtu", row?.porcentajePtu);
    setFieldValue("cvePtu", row?.cvePtu);
    setFieldValue("gastos", row?.gastos);
    setFieldValue("porcentajeK", row?.porcentajeK);
    setFieldValue("aniosArrastre", row?.aniosArrastre);
    setFieldValue("comisRolReaseguro", row?.comisRolReaseguro);
    setFieldValue("cveAsignacionComisRol", row?.cveAsignacionComisRol);
    setFieldValue("cveCalcomis", row?.cveCalcomis);
    setFieldValue("comisRolFija", row?.comisRolFija);
    setFieldValue("comisRolProvisional", row?.comisRolProvisional);
    setFieldValue("comisRolMin", row?.comisRolMin);
    setFieldValue("comisRolMax", row?.comisRolMax);
    setFieldValue("capa", row?.capa);
    setFieldValue("prioridad", row?.prioridad);
    setFieldValue("limResponsabilidad", row?.limResponsabilidad);
    setFieldValue("limAgregado", row?.limAgregado);
    setFieldValue("cveCriterioAsigLimAgregado", row?.cveCriterioAsigLimAgregado);
    setFieldValue("cveAsignacionCosto", row?.cveAsignacionCosto);
    setFieldValue("costoFijo", row?.costoFijo);
    setFieldValue("pmd", row?.pmd);
    setFieldValue("primaMin", row?.primaMin);
    setFieldValue("primaMax", row?.primaMax);
    setFieldValue("facAjusteDividendo", row?.facAjusteDividendo);
    setFieldValue("facAjusteDivisor", row?.facAjusteDivisor);
    setFieldValue("noClaims", row?.noClaims);
    setFieldValue("reasegActiva", row?.reasegActiva);

    const numericFields: (keyof FormatNumberOptions)[] = [
      "participacion",
      "porcentajePtu",
      "porcentajeK",
      "gastos",
      "comisRolFija",
      "comisRolProvisional",
      "comisRolMin",
      "comisRolMax",
      "prioridad",
      "limResponsabilidad",
      "limAgregado",
      "costoFijo",
      "pmd",
      "primaMin",
      "primaMax",
      "noClaims",
    ];

    numericFields.forEach((key) => {
      const value = row[key as keyof dataTableToDisplay];
      const ref = formatNumberOptions[key];
      if (ref) {
        ref.value = value != null ? formatCurrency(value as number) : "";
      }
    });
  };

  const handleSendToTable = () => {
    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que desea agregar la reaseguradora capturada?",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Sí, agregar",
        color: "primary",
        handler: confirmSend
      }
    });
  };

  const confirmSend = async () => {
    showErrors.value = true;
    const { valid } = await validate();

    if (valid) {
    
      const newRow: ReaseguradoresSection = {
        idContrato: "",
        cveReasegurador: formData.cveReasegurador,
        participacion: formData.participacion,
        otorgaPtu: formData.otorgaPtu ?? null,
        porcentajePtu: formData.porcentajePtu ?? null,
        cvePtu: formData.cvePtu ?? null,
        gastos: formData.gastos ?? null,
        porcentajeK: formData.porcentajeK ?? null,
        aniosArrastre: formData.aniosArrastre ?? null,
        comisRolReaseguro: formData.comisRolReaseguro ?? null,
        cveAsignacionComisRol: formData.cveAsignacionComisRol ?? null,
        cveCalcomis: formData.cveCalcomis ?? null,
        comisRolFija: formData.comisRolFija ?? null,
        comisRolProvisional: formData.comisRolProvisional ?? null,
        comisRolMin: formData.comisRolMin ?? null,
        comisRolMax: formData.comisRolMax ?? null,
        capa: formData.capa ?? null,
        prioridad: formData.prioridad ?? null,
        limResponsabilidad: formData.limResponsabilidad ?? null,
        limAgregado: formData.limAgregado ?? null,
        cveCriterioAsigLimAgregado: formData.cveCriterioAsigLimAgregado ?? null,
        cveAsignacionCosto: formData.cveAsignacionCosto ?? null,
        costoFijo: formData.costoFijo ?? null,
        pmd: formData.pmd ?? null,
        primaMin: formData.primaMin ?? null,
        primaMax: formData.primaMax ?? null,
        facAjusteDividendo: formData.facAjusteDividendo ?? null,
        facAjusteDivisor: formData.facAjusteDivisor ?? null,
        noClaims: formData.noClaims ?? null,
        reasegActiva: true,
      };

      // SI ES PROPORCIONAL, no se debe agregar una reaseguradora duplicada
      if (isTypeProporcional.value) {
        const isAlreadyAdded = dataTableOriginal.value.some(row => row.cveReasegurador === newRow.cveReasegurador);

        if (isAlreadyAdded) {
          dialog.show({
            title: "Error",
            message: "La reaseguradora que intenta agregar ya existe, verifique la información...",
            type: DialogType.ERROR,
          });

          return;
        }
        // si es NO PROPORCIONAL no se debe agregar un mismo reasegurador con misma capa
      } else {
        const exist = dataTableOriginal.value.some(row => row.cveReasegurador === newRow.cveReasegurador && row.capa === newRow.capa )
        if (exist) {
          dialog.show({
            title: "Atención",
            message: `La capa para la reaseguradora que intenta agregar ya fue registrada anteriormente, verifique la información...`,
            type: DialogType.ERROR
          });

          return
        }

        /* SI LA CAPA NO ES LA PRIMERA, ENTONCES SE VALIDA PAG 50 */
        if(newRow.capa && newRow.capa != 1) {
          /* console.log({ dataTableOriginal }) */
          const arrayCapas = dataTableOriginal.value.filter(row => row.cveReasegurador === newRow.cveReasegurador).sort((a, b) => a.capa! - b.capa!);

          const lastCapa = arrayCapas[arrayCapas.length - 1];

          if (!lastCapa) {
              dialog.show({
              title: "Atención",
              message: `No existe una capa anterior a la que desea registrar, favor de verificar.`,
              type: DialogType.ERROR,
            })
            return;
          }

          const prioridadEsperada = lastCapa?.prioridad! + lastCapa?.limResponsabilidad!;
          /* console.log(lastCapa?.prioridad, lastCapa?.limResponsabilidad) */
          // si la prioridad es distinto de la suma de prioridad y limite de responsabilidad anterior
          if( newRow.prioridad != prioridadEsperada ) {
            dialog.show({
              title: "Atención",
              message: `La prioridad no coincide con el registro de la capa anterior, favor de verificar. ${prioridadEsperada}`,
              type: DialogType.ERROR
            });

            return;
          }
        }

        if(!(newRow?.prioridad! + newRow?.limResponsabilidad! <= newRow?.limAgregado!)){
          dialog.show({
            title: "Atención",
            message: `El limite agregado es menor a la capacidad total del contrato, favor de verificar.`,
            type: DialogType.ERROR,
          });

          return;
        }
        
      }

      dataTableOriginal.value.push(newRow);
      resetFormAndRefs();
    }
  };

  
  const checkAgregarStore = () => {
    const reaseguradoresActivos = dataTableOriginal.value.filter(row => row.reasegActiva);

    const sumaParticipacion = reaseguradoresActivos.reduce((acc, currentRow) => {
      return acc + currentRow.participacion;
    }, 0);

    // si es PROPORCIONAL
   if (isTypeProporcional.value && sumaParticipacion < 100) {
    dialog.cerrar();

    nextTick(() => {
      dialog.show({
        title: "Atención",
        message: `¿Desea continuar sin que el contrato esté cubierto al 100%?. Participación actual de ${sumaParticipacion}%`,
        type: DialogType.ERROR,
        ExtraAction: {
          text: "Sí, continuar",
          color: "primary",
          handler: () => {
            aeStore.guardarReaseguradores(reaseguradoresActivos);
          }
        }
      });
    });

    return;
  }else if( !isTypeProporcional.value) {
      reaseguradoresActivos.sort((a, b) => a.capa! - b.capa!)

      let messages: string[] = [];

      for (let index = 0; index < reaseguradoresActivos[reaseguradoresActivos.length - 1]?.capa!; index++) {
        if (!reaseguradoresActivos[index] || reaseguradoresActivos[index]?.participacion === null ) {
          messages.push(`La capa ${index + 1} no existe o su participación es nula, verifique antes de continuar...`)
        }

        if (reaseguradoresActivos[index]?.participacion! < 100){
          messages.push(`La participación de la capa ${index + 1} no esta cubierta al 100%, verifique antes de continuar por favor...`)
        }
      }

      if ( messages.length > 0  ) {
        const messagesText = messages.join("<br/><br/>");

        dialog.show({
          title: "Atención",
          message: messagesText,
          type: DialogType.ERROR
        });

        return;
      }
      aeStore.guardarReaseguradores(reaseguradoresActivos)
      dialog.cerrar();
      return;
    }
      aeStore.guardarReaseguradores(reaseguradoresActivos)
      dialog.cerrar();
  };

  const handleSubmit = async () => {
    if (dataTableOriginal.value.length <= 0) {
      dialog.show({
        title: "Error",
        message: "La tabla debe de contener almenos un registro para continuar, verifique por favor...",
        type: DialogType.ERROR,
      });

      return;
    }

    dialog.show({
      title: "Confirmación",
      message: "¿Confirma que los datos ingresados de reaseguradoras del contrato son correctos?",
      type: DialogType.ERROR,
      autoCloseExtraAction: false,
      ExtraAction: {
        text: "Sí, agregar",
        color: "primary",
        handler: checkAgregarStore
      }
    });
  };

  return {
    queryReaseguradoras,
    queryPtu,
    queryTipoAsignacion,
    queryCalculoComision,
    queryCriterioAsignacion,
    participacion,
    porcentajePtu,
    setFieldValue,
    formData,
    formErrors,
    showErrors,
    handleSendToTable,
    handleSubmit,
    onInputGeneric,
    onBlurGeneric,
    isTypeProporcional,
    porcentajeK,
    gastos,
    comisRolFija,
    comisRolProvisional,
    comisRolMin,
    comisRolMax,
    prioridad,
    limResponsabilidad,
    limAgregado,
    costoFijo,
    pmd,
    primaMin,
    primaMax,
    noClaims,
    tableHeaders,
    dataTable,
    toggleActive,
    editRow,
  };
};