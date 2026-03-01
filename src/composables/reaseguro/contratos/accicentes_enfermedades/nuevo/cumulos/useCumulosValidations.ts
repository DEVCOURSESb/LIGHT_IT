import { validationsHandler } from "@/utilities/validations/validationsHandler";

export const useCumulosValidations = () => {
  const val = validationsHandler();

  return {
    cveOperRamoCumulo: (value: string | null, context: any) => {
      const detallesOperRamo = context.form?.detallesOperRamo;
      if (detallesOperRamo === "SI") {
        return (
          (value != null && value !== "") ||
          "La operación / ramo es obligatoria."
        );
      }
      return true;
    },

    montoCumulo: (value: number | null) => {
      if (value === null || value === undefined)
        return "El monto cúmulo es obligatorio.";
      return (
        val.minMax(value, 0, 9999999999999999999.99) ||
        "El monto cúmulo debe ser un número positivo."
      );
    },
  };
};
