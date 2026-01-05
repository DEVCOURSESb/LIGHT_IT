
/**
 * Parser CSV robusto que maneja comillas, escapado y comas dentro de valores
 */

/**
 * Parsea una línea CSV considerando comillas y escapes
 * @param line - Línea CSV a parsear
 * @returns Array de valores parseados
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : null;

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Comilla escapada ""
        current += '"';
        i += 2;
        continue;
      } else {
        // Toggle estado de comillas
        inQuotes = !inQuotes;
        i++;
        continue;
      }
    }

    if (char === ',' && !inQuotes) {
      // Fin de campo
      result.push(current.trim());
      current = '';
      i++;
      continue;
    }

    // Agregar caracter al campo actual
    current += char;
    i++;
  }

  // Agregar último campo
  result.push(current.trim());

  return result;
}

/**
 * Limpia un valor CSV de comillas circundantes
 * @param value - Valor a limpiar
 * @returns Valor limpio
 */
export function cleanCSVValue(value: string): string {
  let cleaned = value.trim();
  
  // Remover comillas dobles al inicio y final
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
    // Reemplazar comillas escapadas "" por "
    cleaned = cleaned.replace(/""/g, '"');
  }
  
  return cleaned;
}

/**
 * Cuenta las columnas en un header CSV correctamente
 * @param header - Línea de header
 * @returns Número de columnas
 */
export function countCSVColumns(header: string): number {
  return parseCSVLine(header).length;
}

/**
 * Obtiene los nombres de columnas de un header CSV
 * @param header - Línea de header
 * @returns Array de nombres de columnas limpios
 */
export function getCSVColumns(header: string): string[] {
  return parseCSVLine(header).map(col => cleanCSVValue(col));
}

/**
 * Valida que una línea tenga el número correcto de columnas
 * @param line - Línea a validar
 * @param expectedColumns - Número esperado de columnas
 * @returns true si es válida
 */
export function validateCSVLineColumns(line: string, expectedColumns: number): boolean {
  const columns = parseCSVLine(line);
  return columns.length === expectedColumns;
}
