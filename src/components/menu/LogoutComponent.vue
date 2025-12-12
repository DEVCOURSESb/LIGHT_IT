<template>
  <v-btn @click="handleLogout"> Cerrar Sesión </v-btn>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { DialogType, useDialog } from "@/stores/dialogStore";
import { AuthActions } from "@/API/auth/Auth.actions";
import { AuthStore } from "@/stores/authStore";

const router = useRouter();
const authActions = AuthActions();
const authStore = AuthStore();
const dialog = useDialog();

const handleLogout = async () => {
  const result = await authActions.logout();

  if (!result.success) {
    dialog.show({
      title: "Error al cerrar sesión",
      message: result.message || "No se pudo cerrar sesión",
      type: DialogType.ERROR,
    });
    return;
  }

  dialog.show({
    title: "Sesión cerrada",
    message: "Has cerrado sesión correctamente",
    type: DialogType.SUCCESS,
  });
  
  authStore.logout();
    
  setTimeout(() => {
    dialog.cerrar();
    router.push("/");
  }, 1500);
};
</script>
