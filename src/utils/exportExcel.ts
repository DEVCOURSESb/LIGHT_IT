import * as XLSX from "xlsx";

interface ExportExcelOptions {
  data: any[];
  fileName: string;
  sheetName?: string;
}

export const exportExcel = ({ data, fileName, sheetName = "Sheet1" } : ExportExcelOptions) => {
  // crear hoja
  const worksheet = XLSX.utils.json_to_sheet(data);

  // crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // exportar archivo
  XLSX.writeFile(workbook, fileName);
};
