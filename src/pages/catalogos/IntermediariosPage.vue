<template>
  <CrudTablePage :config="intermediariosConfig">
    <v-file-input
      accept=".csv"
      label="Cargar archivo"
      density="compact"
      prepend-icon=""
      @change="handleFileChange"
    ></v-file-input>
  </CrudTablePage>
</template>

<script lang="ts" setup>
import { intermediariosConfig } from "@/components/config/intermediarios/intermediarios.config";
import { useFiles } from "@/composables/catalogos/useFiles";

const { handleCSVReader } = useFiles();

const handleFileChange = async (event: Event) => {
  const data = await handleCSVReader(event);
  // validaciones
  // solo 2 columnas: clave y nombre
  const onlyTwoColumns = data.every((row) => Object.keys(row).length === 2);
  console.log({ onlyTwoColumns });
  // data

/*   console.log(data[0]);
  console.log(data[0][0]);
  console.log(data[0][1]);

  ["CVE_INTERMEDIARIO", "NOMBRE_INTERMEDIARIO"].forEach((col, index) => {
    if (col === data[0][index]) {
      console.log(`Columna ${index + 1} es correcta: ${col}`);
    } else {
      console.warn(
        `Columna ${
          index + 1
        } es incorrecta. Se esperaba: ${col}, pero se encontró: ${
          data[0][index]
        }`
      );
    }
  }); */
};
</script>
