import { useQuery } from "@tanstack/vue-query";
import { emisionCobtableAYEActions } from "./emisionContableAYE.actions";
import { useContratoAEStore } from "@/stores/reaseguro/contratos/AEStore";
import { storeToRefs } from "pinia";

// otros "cataogos" para el contrato de accidentes y enfermedades
export const othersActions = () => {

  const store = useContratoAEStore();

  const { generales } = storeToRefs(store);

  const queryEmisionContableAYE = useQuery({
    queryKey: ["emisionContableAYE"],
    queryFn: async () => {
      const { fetch } = emisionCobtableAYEActions();
      return fetch(generales.value.fechaInicioContrato, generales.value.fechaFinContrato);
    },
    staleTime: 1000 * 30, // 30 segundos
  });

  return {
    queryEmisionContableAYE,
  };
};
