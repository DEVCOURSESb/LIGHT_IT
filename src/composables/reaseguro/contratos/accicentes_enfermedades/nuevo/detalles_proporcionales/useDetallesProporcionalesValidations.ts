import { validationsHandler } from "@/utilities/validations/validationsHandler";

export const useDetallesProporcionalesValidations = () => {
  const val = validationsHandler();

  return {
    detallesOperRamo: (value : string) => (value === "SI" || value === "NO") || "El detalle de operación ramo es obligatorio.",
    
  };
};
