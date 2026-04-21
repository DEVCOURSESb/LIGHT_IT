/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/VDateInput";
import { es } from "vuetify/locale";
import 'vuetify/styles'

// Styles
import "@mdi/font/css/materialdesignicons.css";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  locale: {
    locale: "es",
    fallback: "es",
    messages: { es },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "rgb(255, 255, 0)",
          secondary: "#6b6c6e",
          third: "rgb(246, 246, 246)",
        },
      },
    },
  },
  components: {
    VDateInput,
  },
});
