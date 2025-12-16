<template>
  <v-btn @click="handleLogout"> Cerrar Sesión </v-btn>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { useAuth } from "@/composables/auth/useAuth";

const router = useRouter();
const auth = useAuth();
const dialog = useDialog();

const handleLogout = async () => {
  dialog.show({
    title: "Cerrar sesión",
    message: "¿Estás seguro de que deseas cerrar sesión?",
    type: DialogType.INFO,
    ExtraAction: {
      text: "Sí, cerrar sesión",
      handler: async () => {
        try {
          await auth.logout();

          dialog.show({
            title: "Sesión cerrada",
            message: "Has cerrado sesión correctamente",
            type: DialogType.SUCCESS,
          });

          setTimeout(() => {
            dialog.cerrar();
            router.replace({ path: "/" });
          }, 500);
        } catch (error) {
          dialog.show({
            title: "Error",
            message: "No se pudo cerrar sesión. Inténtalo de nuevo.",
            type: DialogType.ERROR,
          });
        }
      },
    },
  });
};
</script>
