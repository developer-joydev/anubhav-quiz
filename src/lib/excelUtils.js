import * as XLSX from "xlsx";

// export const readExcelFile = async (filePath) => {
//   try {
//     console.log("Reading Excel file from:", filePath);

//     const response = await fetch(filePath);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const data = new Uint8Array(arrayBuffer);

//     // Read the Excel file
//     const workbook = XLSX.read(data, { type: "array" });
//     console.log("Sheet names:", workbook.SheetNames);

//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     // Convert to JSON
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);
//     console.log("Parsed data:", jsonData);

//     return jsonData;
//   } catch (error) {
//     console.error("Error reading Excel file:", error);
//     return [];
//   }
// };

export const readExcelFile = async (filePath) => {
  try {
    console.log("🔍 Attempting to read Excel file from:", filePath);

    const response = await fetch(filePath, {
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("Empty file received");
    }

    const data = new Uint8Array(arrayBuffer);

    // Read the Excel file
    const workbook = XLSX.read(data, {
      type: "array",
    });

    console.log("📊 Workbook Sheet Names:", workbook.SheetNames);

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("No sheets found in Excel file");
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error("Worksheet not found");
    }

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log("📈 Parsed data length:", jsonData.length);

    if (jsonData.length === 0) {
      throw new Error("No data found in worksheet");
    }

    return jsonData;
  } catch (error) {
    console.error("❌ Error reading Excel file:", error);
    return null;
  }
};

export const writeExcelFile = (data, filename = "mcq_results.xlsx") => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

    // Generate and download Excel file
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (error) {
    console.error("Error writing Excel file:", error);
    return false;
  }
};

// This function now returns the Excel file as a blob
export const generateExcelBlob = (data) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");

    // Generate Excel file as binary string
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create blob from the buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return blob;
  } catch (error) {
    console.error("❌ Error generating Excel blob:", error);
    return null;
  }
};
