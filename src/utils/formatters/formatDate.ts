export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";

  const dateStr = typeof date === "string" ? date.trim() : null;

  // Detectar si es solo fecha (sin hora)
  const isDateOnly = dateStr ? /^\d{4}-\d{2}-\d{2}$/.test(dateStr) : false;

  let d: Date;

  if (isDateOnly && dateStr) {
    // Parsear manualmente para evitar interpretación UTC
    const [year, month, day] = dateStr.split("-").map(Number);
    d = new Date(year!, month! - 1, day); // Usa hora local, no UTC
  } else {
    const normalized = dateStr ? dateStr.replace(" ", "T") : date;
    d = typeof normalized === "string" ? new Date(normalized) : (date as Date);
  }

  if (Number.isNaN(d.getTime())) return "";

  const hasTime = isDateOnly
    ? false
    : typeof date === "string"
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