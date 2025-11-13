/**
 * formatear una fecha en formato "día de mes de año" en español (México)
 * @param date 
 * @returns 
 */
export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};