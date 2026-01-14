import { DialogType, useDialog } from "@/stores/dialogStore";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useSnackbar } from "@/stores/useSnackbar";

interface CrudConfig {
  entity: string;
  fields: any[];
  validationSchema: any;
  apiActions: {
    fetch: () => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (data: any) => Promise<any>;
    delete: (id: number) => Promise<any>;
  };
}

export function useCrudGeneric(config: CrudConfig) {
  const queryClient = useQueryClient();
  const activeModal = ref(false);
  const editingId = ref<number | null>(null);
  const dialog = useDialog();
  const isSubmitting = ref(false);
  const snackbar = useSnackbar();

  // query key
  const queryKey = [config.entity, "list"];

  // query para obtener datos
  const {
    data: items,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: config.apiActions.fetch
  });

  const itemsArray = computed(() => items.value || []);
  const loading = computed(() => isLoading.value || isSubmitting.value);

  // Inicializar valores por defecto
  const getInitialValues = () => {
    const initialValues: Record<string, any> = {};
    config.fields.forEach((field: any) => {
      if (!field.hidden) {
        initialValues[field.name] = field.defaultValue !== undefined 
          ? field.defaultValue 
          : "";
      }
    });
    return initialValues;
  };

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
    validateOnMount: false,
  });

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
      resetForm({
        values: getInitialValues(),
        errors: {},
        touched: {},
      });
      editingId.value = null;
    }
    activeModal.value = !activeModal.value;
  };

  const handleSubmit = handleFormSubmit(async (values) => {
    isSubmitting.value = true;
    try {
      const apiData = mapFormToAPI(values);
      let data;
      
      if (editingId.value) {
        data = await config.apiActions.update(apiData);
      } else {
        data = await config.apiActions.create(apiData);
      }
      
      // actualizar cache
      queryClient.setQueryData(queryKey, data);
      snackbar.mostrarMensajeSnackbar(`${config.entity} guardado / actualizado exitosamente`, "success");
      toggleModal();
    } catch (error: any) {
      snackbar.mostrarMensajeSnackbar(`Error guardando ${config.entity}`, "error");
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      isSubmitting.value = false;
    }
  });

  const editItem = (item: any) => {
    editingId.value = item.id;
    const mappedData = mapAPIToForm(item);
    resetForm({
      values: mappedData,
      errors: {},
      touched: {},
    });
    activeModal.value = true;
  };

  const deleteItem = async (item: any) => {
    dialog.show({
      title: "Eliminar registro",
      message: "¿Está seguro de que desea eliminar este registro? Esta acción no se podrá deshacer.",
      type: DialogType.ERROR,
      ExtraAction: {
        text: "Confirmar eliminación",
        handler: async () => {
          isSubmitting.value = true;
          try {
            const data = await config.apiActions.delete(item.id);
            queryClient.setQueryData(queryKey, data);
            snackbar.mostrarMensajeSnackbar(`${config.entity} eliminado exitosamente`, "success");
          } catch (error) {
            snackbar.mostrarMensajeSnackbar(`Error eliminando ${config.entity}`, "error");
          } finally {
            isSubmitting.value = false;
          }
        },
        color: "primary",
      },
    });
  };

  return {
    items: itemsArray,
    formData,
    formErrors,
    loading,
    activeModal,
    editingId,
    isError,
    error,
    setFieldValue,
    toggleModal,
    handleSubmit,
    editItem,
    deleteItem,
    loadItems: refetch,
  };
}