export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";

  // Normalizar string: reemplazar espacio por T para compatibilidad
  const normalized =
    typeof date === "string" ? date.trim().replace(" ", "T") : date;

  const d = typeof normalized === "string" ? new Date(normalized) : normalized;

  if (Number.isNaN(d.getTime())) return "";

  const hasTime =
    typeof date === "string"
      ? /(?:T|\s)\d{1,2}:\d{2}/.test(date)
      : d.getHours() !== 0 ||
        d.getMinutes() !== 0 ||
        d.getSeconds() !== 0 ||
        d.getMilliseconds() !== 0;

  const formattedDate = d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!hasTime) return formattedDate;

  const formattedTime = d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};
