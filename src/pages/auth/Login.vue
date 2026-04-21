<template>
    <v-img
    class="bg-fondo"
    src="/src/assets/logo/light-it.svg"
    />

  <div class="main-container">
    <div class="form-container">
      <v-card class="loginCorreo">
        <v-card-item class="card-item">
          <v-img
            aspect-ratio="1"
            class="mx-auto"
            src="/src/assets/logo/light-it-logo.svg"
            :width="180"
          />
          <v-label class="title">Bienvenido</v-label>
        </v-card-item>
        <v-card-text>
          <v-sheet class="content text-center" height="auto" width="280">
            <v-form fast-fail @submit.prevent="validate">
              <v-text-field
                v-model="correo"
                label="Correo electronico"
              />
              <div class="d-flex flex-column">
                <v-btn color="primary" @click="validate"
                  >Ingresar</v-btn
                >
              </div>
            </v-form>
          </v-sheet>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import FooterComponent from "@/components/general/FooterComponent.vue";
import { DialogType, useDialog } from "@/stores/general/dialogStore";
import { useAuth } from "@/composables/auth/useAuth";

const { sendEmail, logout } = useAuth();
const dialog = useDialog();

const router = useRouter();

const correo = ref("");

async function validate() {
  if (!correo.value) return;

  const result = await sendEmail(correo.value);

  if (!result.success) {

    if(result.code === 423) {
      dialog.show({
        title: "Sesión iniciada",
        message: result.message || "Tu cuenta ha sido bloqueada. Contacta al soporte.",
        type: DialogType.ERROR,
        ExtraAction: {
          text: "Cerrar sesiones",
          handler: async () => {
            const result = await logout();
            if(!result.success) {
              dialog.show({
                title: "Error",
                message: result.message || "No se pudieron cerrar las sesiones.",
                type: DialogType.ERROR,
              });
              return;
            }

            dialog.show({
              title: "Sesiones cerradas",
              message: "Se han cerrado las sesiones activas. Por favor, intenta iniciar sesión de nuevo.",
              type: DialogType.SUCCESS,
            });

          },
          color: "primary",
        }
      });
    } else {
      dialog.show({
        title: "Error",
        message: result.message || "El correo no está registrado.",
        type: DialogType.ERROR,
      });
    }

    return;
  }

  dialog.show({
    title: "Código enviado",
    message: "Se ha enviado el código de validación al correo.",
    type: DialogType.SUCCESS,
  });

  setTimeout(() => {
    dialog.cerrar();
    router.replace({ path: "/login" });
  }, 800);
}
</script>
