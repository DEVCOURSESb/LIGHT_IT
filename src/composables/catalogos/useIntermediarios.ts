import type { Intermediario } from "@/API/catalogos/intermediarios/intermediario.interfaces";
import { IntermediariosActions } from "@/API/catalogos/intermediarios/intermediarios.actions";
import { formatDate } from "@/utils/formatDate";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";

export const useIntermediarios = () => {
  const { fetchIntermediarios } = IntermediariosActions();

  const getIntermediarios = async () => fetchIntermediarios();

  const headers = [
    { title: "Clave intermediario", key: "cveIntermediario", sortable: true },
    { title: "Activo", key: "esActivo", sortable: true },
    { title: "Fecha de registro", key: "fechaRegistro", sortable: true },
    { title: "Nombre intermediario", key: "nombreIntermediario", sortable: false, },
    { title: "Acciones", key: "actions", sortable: false },
  ];

  const intermediarios = ref([
    {
      id: 1,
      cveIntermediario: "cve-1",
      esActivo: 1,
      fechaRegistro: formatDate("2025-11-04"),
      nombreIntermediario: "nombre kmk",
    },
    {
      id: 2,
      cveIntermediario: "cvea-2",
      esActivo: 0,
      fechaRegistro: formatDate("2025-11-04"),
      nombreIntermediario: "nombre kmk",
    },
    {
      id: 3,
      cveIntermediario: "cvez-3",
      esActivo: 1,
      fechaRegistro: formatDate("2025-11-04"),
      nombreIntermediario: "nombre kmk",
    },
  ]);

  const { handleSubmit, resetForm } = useForm({
    validationSchema: {
      clave: (value: string) => {
        if (value?.length > 3) return true;
        return "La clave es requerida";
      },
      nombre: (value: string) => {
        if (value?.length > 0) return true;
        return "El nombre es requerido";
      },
      activo: (value: string) => {
        if (value) return true;
        return "El campo activo es requerido";
      },
    },
  });

  const itemsSelect = ["Sí", "No"];

  const id = useField("id");
  const clave = useField("clave");
  const nombre = useField("nombre");
  const activo = useField("activo");

  const submit = handleSubmit((values) => {
    if (values.id) {
      console.log("Actualizar:", values);
    } else {
      console.log("Crear:", values);
    }
    alert(JSON.stringify(values, null, 2));
  });

  const editItem = (item: Partial<Intermediario>) => {
    console.log("Editar:", item);
    id.value.value = item.id;
    clave.value.value = item.cveIntermediario;
    nombre.value.value = item.nombreIntermediario;
    activo.value.value = item.esActivo === 1 ? "Sí" : "No";
    changeActiveModal();
  };

  const deleteItem = (item: Partial<Intermediario>) => {
    alert(`Eliminar: ${item.id}`);
  };

  const activeModal = ref(false);

  const changeActiveModal = () => {
    if (activeModal.value) {
      resetForm();
    }

    activeModal.value = !activeModal.value;
  };

  return {
    getIntermediarios,
    headers,
    intermediarios,
    id,
    clave,
    nombre,
    activo,
    itemsSelect,
    submit,
    editItem,
    deleteItem,
    activeModal,
    changeActiveModal,
  };
};
