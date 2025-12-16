<template>
  <v-img class="bg-fondo" cover src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png" />

  <div class="main-container">
    <div class="form-container text-overline">
      <v-card class="my-8" elevation="20" rounded-xl>
        <v-card-item class="card-item">
          <v-img aspect-ratio="1" class="mx-auto" src="/src/assets/logo/latino-seguros-logo-blanco.png" :width="180" />
          <v-label class="title">Ingrese la informacion solicitada</v-label>
        </v-card-item>
        <v-card-text>
          <v-sheet class="content text-center" height="auto" width="450">
            <v-form fast-fail @submit.prevent="validate">
              <v-text-field
                v-model="usuario"
                class="text-overline"
                label="Usuario"
              />
              <v-text-field
                v-model="password"
                class="text-overline"
                label="Contraseña"
                type="password"
              />
              <v-label class="text-subtitle-1 mb-4">
                Código de verificación enviado al <br>
                correo electrónico ingresado
              </v-label>

              <v-otp-input
                v-model="codigo"
                length="8"
                separator=""
              />
              <div class="d-flex flex-column">
                <v-btn class="mt-4" color="primary" @click="validate">Ingresar</v-btn>
                <v-btn class="mt-4" color="white" @click="retornar">Regresar</v-btn>
              </div>
            </v-form>
          </v-sheet>
        </v-card-text>
      </v-card>
    </div>
  </div>
  <FooterComponent />
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import FooterComponent from '@/layouts/FooterComponent.vue'
  import { DialogType, useDialog } from '@/stores/dialogStore'
import { useAuth } from '@/composables/auth/useAuth'

  const { sendCredentials } = useAuth()
  const dialog = useDialog()
  const router = useRouter()

  const usuario = ref('')
  const password = ref('')
  const codigo = ref('')

  async function validate () {
    if (!usuario.value || !password.value || !codigo.value) {
      dialog.show({ title: 'Atención', message: 'Ingrese usuario, contraseña y código de verificación', type: DialogType.ERROR });
      return
    }

    const result = await sendCredentials({ username: usuario.value, password: password.value, codigoVerificacion: codigo.value })

    if (!result.success) {
      dialog.show({ title: 'Error de autenticación', message: result.message || "Error al validar datos de usuario", type: DialogType.ERROR })
      return
    }

    dialog.show({
      title: 'inicio de sesión exitoso',
      message: result.message || "Usuario validado correctamente",
      type: DialogType.SUCCESS,
    })

    setTimeout(() => {
      dialog.cerrar()
      router.replace({ path: "/home" })
    }, 800)
  }
  function retornar () {
    router.replace({ path: "/" })
  }
</script>
