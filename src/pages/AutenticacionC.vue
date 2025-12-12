<template>
  <v-img
    class="bg-fondo"
    cover
    src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png"
  />

  <div class="main-container">
    <div class="form-container text-overline">
      <v-card class="my-8" elevation="20" max-width="500">
        <v-card-item class="card-item">
          <v-img
            aspect-ratio="1"
            class="mx-auto"
            src="/src/assets/logo/latino-seguros-logo-blanco.png"
            :width="120"
          />
          <v-label class="title">Autenticación de usuario</v-label>
        </v-card-item>

        <v-card-text>
          <v-sheet class="content text-center" height="280" width="420">
            <v-form fast-fail @submit.prevent="validate">
              <v-label class="text-subtitle-1 mb-4">
                Ingresa el código de verificación enviado<br>
                al correo electrónico del usuario ingresado
              </v-label>

              <v-otp-input
                v-model="codigo"
                length="8"
                :rules="codigoRules"
                separator=""
              />

              <div class="d-flex flex-column">
                <v-btn block class="mt-4" color="primary" @click="validate">
                  Continuar
                </v-btn>
                <v-btn block class="mt-4" @click="navigate2">Regresar</v-btn>
              </div>
            </v-form>
          </v-sheet>
        </v-card-text>
      </v-card>
    </div>
  </div>

  <FooterComponent />
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import FooterComponent from '@/layouts/FooterComponent.vue'

  import { useDialog } from '@/stores/dialogStore'
import { AuthActions } from '@/API/auth/Auth.actions'

  const { verificarCodigo } = AuthActions()
  const dialog = useDialog()

  const router = useRouter()
  const codigo = ref('')

  const codigoRules = [
    v => !!v || 'Debes ingresar el código',
    v => v.length === 8 || 'Debe contener 8 caracteres',
  ]

  async function validate () {
    const correo = localStorage.getItem('tmpCorreo')

    const result = await verificarCodigo(correo, codigo.value)

    if (!result.success) {
      dialog.show({
        title: 'Código incorrecto',
        message: result.message || 'El código no coincide.',
        type: 'error',
      })
      return
    }

    localStorage.removeItem('tmpCorreo')
    localStorage.setItem('token', result.token)

    dialog.show({
      title: 'Validación exitosa',
      message: 'Bienvenido.',
      type: 'success',
    })

    setTimeout(() => {
      dialog.cerrar()
      router.push('/home')
    }, 1000)
  }
  function navigate2 () {
    router.push('/')
  }
</script>
