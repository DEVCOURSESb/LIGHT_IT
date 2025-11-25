<template>
  <v-img class="bg-fondo" cover src="/src/assets/logo/Banner-web-Fraude-Yote-presto.png" />
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
          <v-sheet
            class="content text-center"
            height="280"
            width="420"
          >
            <v-form fast-fail @submit.prevent="validate">
              <v-label class="text-subtitle-1 mb-4">Ingresa el código de verificación enviado
                <br>
                al correo electrónico del usuario ingresado</v-label>
              <v-otp-input
                v-model="codigo"
                error
                length="8"
                :rules="codigoRules"
                separator=""
              />
              <div class="d-flex flex-column">
                <v-btn block class="mt-4" color="primary" @click="navigate1">Continuar</v-btn>
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

  const router = useRouter()
  const form = ref()

  const codigo = ref('')
  async function validate () {
    const { valid } = await form.value.validate()
    if (valid) {
      alert('Validación incorrecta')
    }
  }

  function navigate1 () {
    router.push('/home')
  }

  function navigate2 () {
    router.push('/')
  }
</script>
