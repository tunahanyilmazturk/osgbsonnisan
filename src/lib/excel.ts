import * as XLSX from 'xlsx';

export interface ExcelExportOptions {
  fileName?: string;
  sheetName?: string;
}

export interface ExcelImportResult<T> {
  data: T[];
  error?: string;
}

/**
 * Verileri Excel dosyası olarak dışa aktarır
 */
export function exportToExcel<T>(
  data: T[],
  options: ExcelExportOptions = {}
): void {
  const { fileName = 'export.xlsx', sheetName = 'Sheet1' } = options;

  if (!data || data.length === 0) {
    console.warn('Dışa aktarılacak veri bulunamadı');
    return;
  }

  // Verileri worksheet'e dönüştür
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Workbook oluştur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Dosyayı indir
  XLSX.writeFile(workbook, fileName);
}

/**
 * Verileri Excel dosyası olarak dışa aktarır (gelişmiş özellikler)
 */
export function exportToExcelAdvanced<T>(
  data: T[],
  headers: { key: string; label: string }[],
  options: ExcelExportOptions = {}
): void {
  const { fileName = 'export.xlsx', sheetName = 'Sheet1' } = options;

  if (!data || data.length === 0) {
    console.warn('Dışa aktarılacak veri bulunamadı');
    return;
  }

  // Verileri header label'larına göre dönüştür
  const transformedData = data.map((item) => {
    const transformed: any = {};
    headers.forEach((header) => {
      transformed[header.label] = (item as any)[header.key];
    });
    return transformed;
  });

  // Worksheet oluştur
  const worksheet = XLSX.utils.json_to_sheet(transformedData);
  
  // Sütun genişliklerini ayarla
  const columnWidths = headers.map((header) => ({
    wch: Math.max(header.label.length, ...data.map((item) => String((item as any)[header.key] || '').length))
  }));
  worksheet['!cols'] = columnWidths;

  // Workbook oluştur
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Dosyayı indir
  XLSX.writeFile(workbook, fileName);
}

/**
 * Excel dosyasını içe aktarır
 */
export async function importFromExcel<T>(file: File): Promise<ExcelImportResult<T>> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({ data: [], error: 'Dosya okunamadı' });
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet);

        resolve({ data: jsonData });
      } catch (error) {
        resolve({ data: [], error: 'Dosya ayrıştırılamadı' });
      }
    };

    reader.onerror = () => {
      resolve({ data: [], error: 'Dosya okuma hatası' });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Excel dosyasını içe aktarır (gelişmiş özellikler)
 */
export async function importFromExcelAdvanced<T>(
  file: File,
  headers: { key: string; label: string }[]
): Promise<ExcelImportResult<T>> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({ data: [], error: 'Dosya okunamadı' });
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Verileri header key'lerine göre dönüştür
        const transformedData = jsonData.map((item: any) => {
          const transformed: any = {};
          headers.forEach((header) => {
            transformed[header.key] = item[header.label];
          });
          return transformed as T;
        });

        resolve({ data: transformedData });
      } catch (error) {
        resolve({ data: [], error: 'Dosya ayrıştırılamadı' });
      }
    };

    reader.onerror = () => {
      resolve({ data: [], error: 'Dosya okuma hatası' });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Birden fazla sheet'i içeren Excel dosyası oluşturur
 */
export function exportToExcelMultipleSheets<T>(
  data: { sheetName: string; data: T[]; headers?: { key: string; label: string }[] }[],
  fileName: string = 'export.xlsx'
): void {
  if (!data || data.length === 0) {
    console.warn('Dışa aktarılacak veri bulunamadı');
    return;
  }

  const workbook = XLSX.utils.book_new();

  data.forEach((sheetData) => {
    let worksheet;
    
    if (sheetData.headers) {
      // Header'larla export
      const transformedData = sheetData.data.map((item) => {
        const transformed: any = {};
        sheetData.headers!.forEach((header) => {
          transformed[header.label] = (item as any)[header.key];
        });
        return transformed;
      });
      worksheet = XLSX.utils.json_to_sheet(transformedData);
    } else {
      // Basit export
      worksheet = XLSX.utils.json_to_sheet(sheetData.data);
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetData.sheetName);
  });

  XLSX.writeFile(workbook, fileName);
}
