// Función para formatear números con comas y 2 decimales
export const formatCurrency = (value: number | null): string => {
  if (!value) return '-';

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
