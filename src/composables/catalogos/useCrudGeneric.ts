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
  const editingId = ref<number | null>(null);

  // Inicializar valores por defecto
  const getInitialValues = () => {
    const initialValues: Record<string, any> = {};
    config.fields.forEach((field: any) => {
      if (!field.hidden) {
        initialValues[field.name] = field.defaultValue || "";
      }
    });
    return initialValues;
  };

  // useForm con valores iniciales y esquema de validación
  const {
    handleSubmit: handleFormSubmit,
    resetForm,
    setFieldValue,
    values: formData,
    errors: formErrors,
    setErrors,
  } = useForm({
    validationSchema: config.validationSchema,
    initialValues: getInitialValues(),
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

      if (field.transformFromAPI) {
        value = field.transformFromAPI(value);
      }

      mapped[field.name] = value ?? field.defaultValue ?? "";
    });

    return mapped;
  };

  // Mapear datos del formulario al API
  const mapFormToAPI = (formValues: any) => {
    const mapped: Record<string, any> = {};

    config.fields.forEach((field: any) => {
      const apiKey = field.dataKey || field.name;
      let value = formValues[field.name];

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
    }
    activeModal.value = !activeModal.value;
  };

  const handleSubmit = handleFormSubmit(async (values) => {
    loading.value = true;
    try {
      const apiData = mapFormToAPI(values);

      if (editingId.value) {
        await config.apiActions.update(editingId.value, apiData);
      } else {
        await config.apiActions.create(apiData);
      }

      await loadItems();
      toggleModal();
    } catch (error: any) {
      console.error("Error guardando:", error);

      // Manejar errores de validación del servidor
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Error al guardar. Por favor intenta nuevamente.");
      }
    } finally {
      loading.value = false;
    }
  });

  const editItem = (item: any) => {
    editingId.value = item.id;
    const mappedData = mapAPIToForm(item);

    // Resetear el formulario con los nuevos valores
    resetForm({ values: mappedData });

    activeModal.value = true;
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

  onMounted(() => {
    loadItems();
  });

  return {
    items,
    formData,
    formErrors,
    loading,
    activeModal,
    editingId,
    setFieldValue,
    toggleModal,
    handleSubmit,
    editItem,
    deleteItem,
    loadItems,
  };
};
