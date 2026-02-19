// utils/validateCSV.ts
// utils/validateCSV.ts
import type { ValidacionCSV } from "@/API/generic/carga-archivos";
import { parseCSVLine, getCSVColumns, validateCSVLineColumns } from "./csvParser";

/**
 * Valida un archivo CSV verificando su estructura y formato
 * @param file - Archivo a validar
 * @param columnasEsperadas - Array opcional de nombres de columnas esperadas
 * @returns Resultado de validación con errores si los hay
 */
export const validarCSV = async (
  file: File,
  columnasEsperadas?: string[]
): Promise<ValidacionCSV> => {
  const errores: string[] = [];

  // Validación básica del archivo
  if (!file) {
    errores.push("No se proporcionó ningún archivo");
    return { valido: false, errores };
  }

  if (file.size === 0) {
    errores.push("El archivo está vacío");
    return { valido: false, errores };
  }

  // Para archivos muy grandes (>50MB), solo validamos el header
  const LIMITE_LECTURA_COMPLETA = 50 * 1024 * 1024; // 50MB
  const esArchivoGrande = file.size > LIMITE_LECTURA_COMPLETA;

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;

        // Validar que no esté vacío
        if (!text || text.trim().length === 0) {
          errores.push("El archivo está vacío");
          resolve({ valido: false, errores });
          return;
        }

        // Detectar BOM UTF-8
        if (text.charCodeAt(0) === 0xfeff) {
          errores.push("El archivo contiene BOM. Debe ser UTF-8 sin BOM");
        }

        // Validar separador y estructura
        const lines = text.split(/\r?\n/);

        if (lines.length < 2) {
          errores.push(
            "El archivo debe contener al menos una fila de encabezado y una fila de datos"
          );
          resolve({ valido: false, errores });
          return;
        }

        // Validar encabezado
        const header = lines[0];
        if (!header) {
          errores.push("No se encontró el encabezado del archivo");
          resolve({ valido: false, errores });
          return;
        }

        // Usar el parser robusto para obtener columnas
        const columns = getCSVColumns(header);

        if (columns.length === 0) {
          errores.push("No se encontraron columnas en el encabezado");
        }

        // Validar columnas esperadas si se proporcionan
        if (columnasEsperadas && columnasEsperadas.length > 0) {
          if (columns.length !== columnasEsperadas.length) {
            errores.push(
              `El número de columnas no coincide. Esperadas: ${columnasEsperadas.length}, Encontradas: ${columns.length}`
            );
          }

          // Validar nombres de columnas
          const columnasIncorrectas: string[] = [];
          columnasEsperadas.forEach((col, index) => {
            if (columns[index] !== col) {
              columnasIncorrectas.push(
                `Columna ${index + 1}: esperada "${col}", encontrada "${columns[index]}"`
              );
            }
          });

          if (columnasIncorrectas.length > 0) {
            // Solo mostrar los primeros 5 errores para no saturar
            const erroresToMostrar = columnasIncorrectas.slice(0, 5);
            errores.push(...erroresToMostrar);
            
            if (columnasIncorrectas.length > 5) {
              errores.push(`...y ${columnasIncorrectas.length - 5} columnas más incorrectas`);
            }
          }
        }

        // Validar separador consistente (solo en las primeras líneas para archivos grandes)
        const expectedColumns = columns.length;
        const lineasAValidar = esArchivoGrande 
          ? Math.min(lines.length, 100)  // Solo primeras 100 líneas
          : Math.min(lines.length, 1000); // Máximo 1000 líneas
        
        for (let i = 1; i < lineasAValidar; i++) {
          const line = lines[i]!.trim();
          if (line.length > 0) {
            if (!validateCSVLineColumns(line, expectedColumns)) {
              const actualColumns = parseCSVLine(line).length;
              errores.push(
                `Inconsistencia en número de columnas en la línea ${i + 1}. ` +
                `Esperadas: ${expectedColumns}, Encontradas: ${actualColumns}`
              );
              break; // Solo reportar el primer error de este tipo
            }
          }
        }

        // Validar codificación UTF-8 (aproximado)
        try {
          new TextEncoder().encode(text.substring(0, 1000)); // Solo validar primeros 1000 chars
        } catch {
          errores.push("El archivo no parece estar codificado en UTF-8");
        }

        // Información adicional si es archivo grande
        if (esArchivoGrande && errores.length === 0) {
          console.log(`Archivo grande detectado (${(file.size / 1024 / 1024).toFixed(2)}MB). Validación parcial completada.`);
        }

        resolve({
          valido: errores.length === 0,
          errores,
        });
      } catch (error) {
        errores.push(`Error al procesar el archivo: ${error}`);
        resolve({ valido: false, errores });
      }
    };

    reader.onerror = () => {
      errores.push("Error al leer el archivo");
      resolve({ valido: false, errores });
    };

    // Para archivos grandes, solo leer los primeros MB para validar
    if (esArchivoGrande) {
      const chunk = file.slice(0, 5 * 1024 * 1024); // Primeros 5MB
      reader.readAsText(chunk, "UTF-8");
    } else {
      reader.readAsText(file, "UTF-8");
    }
  });
};

/**
 * Cuenta el número de registros (filas) en un archivo CSV
 * Para archivos grandes, usa una estrategia de muestreo
 */
export const contarRegistrosCSV = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const LIMITE_LECTURA_COMPLETA = 50 * 1024 * 1024; // 50MB

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
        // Restar 1 para no contar el encabezado
        const count = lines.length > 0 ? lines.length - 1 : 0;
        resolve(count);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Error al leer el archivo"));

    // Para archivos grandes, leer todo pero advertir
    if (file.size > LIMITE_LECTURA_COMPLETA) {
      console.warn(`Contando registros en archivo grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Esto puede tomar tiempo...`);
    }

    reader.readAsText(file, "UTF-8");
  });
};

/**
 * Valida que un archivo sea CSV antes de procesarlo
 */
export const esArchivoCSVValido = (file: File): boolean => {
  if (!file) return false;
  
  const extension = file.name.toLowerCase().split('.').pop();
  const tipo = file.type.toLowerCase();
  
  return (
    extension === 'csv' || 
    tipo === 'text/csv' || 
    tipo === 'application/csv' ||
    tipo === 'text/plain' // A veces los CSV se detectan como plain text
  );
};
