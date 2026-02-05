import { createPinia } from "pinia";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import "unfonts.css";
import "./styles/estilosglobales.css";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 30, // 30 minutos
      gcTime: 60 * 1000 * 35,     // 35 minutos
      retry: 1, // Reintentar 1 vez
      refetchOnWindowFocus: true, // Refetch al enfocar la ventana
      refetchOnReconnect: true, // Refetch al reconectar
    },
  },
})

const app = createApp(App);

app.use(createPinia());

app.use(VueQueryPlugin, {
  queryClient,
})

registerPlugins(app);

app.mount("#app");
