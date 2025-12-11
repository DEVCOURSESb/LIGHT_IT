<template>
  <v-img class="bg-fondo" cover src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png" />

  <div class="main-container">
    <div class="form-container text-overline">
      <v-card class="my-8" elevation="20" rounded-xl>
        <v-card-item class="card-item">
          <v-img aspect-ratio="1" class="mx-auto" src="/src/assets/logo/latino-seguros-logo-blanco.png" :width="180" />
          <v-label class="title">Bienvenido</v-label>
        </v-card-item>
        <v-card-text>
          <v-sheet class="content text-center" height="auto" width="450">
            <v-form fast-fail @submit.prevent="validate">
              <v-text-field
                v-model="correo"
                class="text-overline"
                label="Correo electronico"
              />
              <div class="d-flex flex-column">
                <v-btn class="mt-4" color="primary" @click="validate">Ingresar</v-btn>
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
  import { UserActions } from '@/API/user/UserActions'
  import FooterComponent from '@/layouts/FooterComponent.vue'
  import { useDialog } from '@/stores/dialogStore'

  const { validarCorreo } = UserActions()
  const dialog = useDialog()

  const router = useRouter()

  const correo = ref('')

  async function validate () {
    if (!correo.value) return

    const result = await validarCorreo(correo.value)

    if (!result.success) {
      dialog.show({ title: 'Error de autenticación', message: result.message, type: 'error' })
      return
    }

    sessionStorage.setItem('tmpUser', correo.value)

    dialog.show({
      title: 'Código enviado',
      message: 'Se ha enviado el código de validación al correo.',
      type: 'success',
    })

    setTimeout(() => {
      dialog.cerrar()
      router.push('/')
    }, 3200)
  }

</script>
