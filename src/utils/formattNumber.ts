/**
 * Funcion para formatear un numero a partir de una cadena
 * @param value 
 * @returns 
 */
export const formattNumber = (value: string) => {
  // Elimina todo lo que no sea número o punto
  let clean = value.replace(/[^\d.]/g, "");

  // Permite solo un punto decimal
  const parts = clean.split(".");
  if (parts.length > 2) {
    clean = parts[0] + "." + parts.slice(1).join("");
  }

  // Si hay decimales, limita a 2
  if (clean.includes(".")) {
    const [enteros, decimales] = clean.split(".");
    if (decimales && decimales.length > 2) {
      clean = enteros + "." + decimales.slice(0, 2);
    }
  }

  return clean;
};
