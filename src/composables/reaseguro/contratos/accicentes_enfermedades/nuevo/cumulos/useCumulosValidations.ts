import { handleValidations } from "@/utils/validations/handleValidations";

export const useCumulosValidations = () => {
  const val = handleValidations();

  return {
    cveOperRamoCumulo: (value: string | null, context: any) => {
      const detallesOperRamo = context.form?.detallesOperRamo;
      if (detallesOperRamo === 1) {
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
