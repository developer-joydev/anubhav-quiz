import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import * as XLSX from "xlsx";

// export async function POST(request) {
//   try {
//     const questionsWithAnswers = await request.json();

//     console.log(
//       "📥 Received submission with",
//       questionsWithAnswers.length,
//       "questions"
//     );

//     // Create worksheet and workbook
//     const worksheet = XLSX.utils.json_to_sheet(questionsWithAnswers);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");

//     // Generate filename with timestamp
//     const timestamp = new Date()
//       .toISOString()
//       .slice(0, 19)
//       .replace(/[:.]/g, "-");
//     const filename = `mcq_results_${timestamp}.xlsx`;

//     // Ensure results directory exists
//     const resultsDir = path.join(process.cwd(), "public", "results");
//     try {
//       await mkdir(resultsDir, { recursive: true });
//     } catch (error) {
//       // Directory might already exist, which is fine
//       if (error.code !== "EEXIST") {
//         throw error;
//       }
//     }

//     // Save file to public/results directory
//     const filePath = path.join(resultsDir, filename);
//     XLSX.writeFile(workbook, filePath);

//     console.log("✅ Results saved to:", filePath);

//     return NextResponse.json({
//       success: true,
//       message: "Answers submitted successfully",
//       fileInfo: {
//         filename: filename,
//         path: `/results/${filename}`,
//         savedAt: new Date().toISOString(),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error in submit API:", error);
//     return NextResponse.json(
//       { error: "Failed to submit answers: " + error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request) {
  try {
    const questionsWithAnswers = await request.json();

    console.log(
      "📥 Received submission with",
      questionsWithAnswers.length,
      "questions"
    );

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(questionsWithAnswers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, "-");
    const filename = `mcq_results_${timestamp}.xlsx`;

    // Ensure results directory exists
    const resultsDir = path.join(process.cwd(), "public", "results");
    try {
      await mkdir(resultsDir, { recursive: true });
      console.log("✅ Results directory ensured:", resultsDir);
    } catch (error) {
      // Directory might already exist, which is fine
      if (error.code !== "EEXIST") {
        console.error("❌ Error creating directory:", error);
        throw error;
      }
    }

    // Save file to public/results directory using Node.js file system
    const filePath = path.join(resultsDir, filename);

    // Use XLSX.write with buffer and then write to file system
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Write the buffer to file
    await writeFile(filePath, excelBuffer);

    console.log("✅ Results saved to:", filePath);

    return NextResponse.json({
      success: true,
      message: "Answers submitted successfully",
      fileInfo: {
        filename: filename,
        path: `/results/${filename}`,
        savedAt: new Date().toISOString(),
        fullPath: filePath,
      },
    });
  } catch (error) {
    console.error("❌ Error in submit API:", error);
    return NextResponse.json(
      { error: "Failed to submit answers: " + error.message },
      { status: 500 }
    );
  }
}
