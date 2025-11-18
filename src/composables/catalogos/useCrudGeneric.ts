// composables/catalogos/useCrudGeneric.ts
import { ref, onMounted } from "vue";
import { useForm } from "vee-validate";

interface CrudConfig {
  fields: any[];
  validationSchema: any;
  apiActions: {
    fetch: () => Promise<any[]>;
    create: (data: any) => Promise<any>;
    update: (id: number, data: any) => Promise<any>;
    delete: (id: number) => Promise<void>;
  };
}

export const useCrudGeneric = (config: CrudConfig) => {
  const items = ref<any[]>([]);
  const loading = ref(false);
  const activeModal = ref(false);
  const formData = ref<Record<string, any>>({});
  const editingId = ref<number | null>(null);

  // Inicializar campos del formulario
  config.fields.forEach((field: any) => {
    if (!field.hidden) {
      formData.value[field.name] = field.defaultValue || "";
    }
  });

  const { handleSubmit: handleFormSubmit, resetForm, setFieldValue } = useForm({
    validationSchema: config.validationSchema,
  });

  // Cargar items del API
  const loadItems = async () => {
    loading.value = true;
    try {
      const response = await config.apiActions.fetch();
      items.value = response;
    } catch (error) {
      console.error("Error cargando items:", error);
    } finally {
      loading.value = false;
    }
  };

  // Mapear datos del API al formulario
  const mapAPIToForm = (item: any) => {
    const mapped: Record<string, any> = { id: item.id };

    config.fields.forEach((field: any) => {
      if (field.hidden) return;

      const apiKey = field.dataKey || field.name;
      let value = item[apiKey];

      // Aplicar transformación si existe
      if (field.transformFromAPI) {
        value = field.transformFromAPI(value);
      }

      mapped[field.name] = value;
    });

    return mapped;
  };

  // Mapear datos del formulario al API
  const mapFormToAPI = (formValues: any) => {
    const mapped: Record<string, any> = {};

    config.fields.forEach((field: any) => {
      const apiKey = field.dataKey || field.name;
      let value = formValues[field.name];

      // Aplicar transformación si existe
      if (field.transformToAPI) {
        value = field.transformToAPI(value);
      }

      mapped[apiKey] = value;
    });

    return mapped;
  };

  const toggleModal = () => {
    if (activeModal.value) {
      resetForm();
      editingId.value = null;
      // Limpiar formData
      config.fields.forEach((field: any) => {
        if (!field.hidden) {
          formData.value[field.name] = field.defaultValue || "";
        }
      });
    }
    activeModal.value = !activeModal.value;
  };

  const handleSubmit = handleFormSubmit(async (values) => {
    loading.value = true;
    try {
      const apiData = mapFormToAPI(values);

      if (editingId.value) {
        // Actualizar
        await config.apiActions.update(editingId.value, apiData);
        console.log("Actualizado:", apiData);
      } else {
        // Crear
        await config.apiActions.create(apiData);
        console.log("Creado:", apiData);
      }

      // Recargar items
      await loadItems();
      toggleModal();
    } catch (error) {
      console.error("Error guardando:", error);
      alert("Error al guardar. Por favor intenta nuevamente.");
    } finally {
      loading.value = false;
    }
  });

  const editItem = (item: any) => {
    editingId.value = item.id;
    const mappedData = mapAPIToForm(item);

    // Setear valores en el formulario
    Object.keys(mappedData).forEach((key) => {
      setFieldValue(key, mappedData[key]);
      formData.value[key] = mappedData[key];
    });

    toggleModal();
  };

  const deleteItem = async (item: any) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      loading.value = true;
      try {
        await config.apiActions.delete(item.id);
        await loadItems();
      } catch (error) {
        console.error("Error eliminando:", error);
        alert("Error al eliminar. Por favor intenta nuevamente.");
      } finally {
        loading.value = false;
      }
    }
  };

  // Cargar items al montar
  onMounted(() => {
    loadItems();
  });

  return {
    items,
    formData,
    loading,
    activeModal,
    editingId,
    toggleModal,
    handleSubmit,
    editItem,
    deleteItem,
    loadItems,
  };
};