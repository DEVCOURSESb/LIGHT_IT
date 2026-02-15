import { useQuery } from "@tanstack/vue-query";
import { emisionCobtableAYEActions } from "./emisionContableAYE.actions";

// otros "cataogos" para el contrato de accidentes y enfermedades
export const othersActions = () => {
  const queryEmisionContableAYE = useQuery({
    queryKey: ["emisionContableAYE"],
    queryFn: async () => {
      const { fetch } = emisionCobtableAYEActions();
      return fetch();
    },
  });

  return {
    queryEmisionContableAYE,
  };
};
