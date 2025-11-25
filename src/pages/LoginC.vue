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
          <v-sheet class="content text-center" height="250" width="450">
            <v-form fast-fail @submit.prevent="validate">
              <v-text-field
                v-model="firstName"
                class="text-overline"
                label="Usuario"
                :rules="firstNameRules"
              />
              <v-text-field
                v-model="password"
                class="text-overline"
                label="Contraseña"
                :rules="lastNameRules"
                type="password"
              />
              <div class="d-flex flex-column">
                <v-btn class="mt-4" color="primary" @click="navigate">Ingresar</v-btn>
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

  const routes = useRouter()
  const form = ref()

  const firstName = ref('')
  const password = ref('')

  const firstNameRules = ref([
    v => !!v || 'El nombre de usuario es requerido',
  ])
  const lastNameRules = ref([
    v => !!v || 'La contraseña es requerida',
  ])
  async function validate () {
    if (form.value) {
      const { valid } = await form.value.validate()
      if (valid) {
        alert('Información incorrecta, inténtalo de nuevo')
      }
    }
  }
  function navigate () {
    routes.push('/autenticacion')
  }
</script>
