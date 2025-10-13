import { generateExcelBlob } from "@/lib/excelUtils";
import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const questionsWithAnswers = await request.json();

//     // Here you would typically save to a database
//     // For now, we'll trigger a download of the updated Excel file
//     writeExcelFile(questionsWithAnswers, "mcq_results.xlsx");

//     return NextResponse.json({
//       success: true,
//       message: "Answers submitted successfully",
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to submit answers" },
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

    // Generate Excel blob
    const excelBlob = generateExcelBlob(questionsWithAnswers);

    if (!excelBlob) {
      throw new Error("Failed to generate Excel file");
    }

    // Convert blob to base64 for sending in response
    const buffer = await excelBlob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({
      success: true,
      message: "Answers submitted successfully",
      file: {
        data: base64,
        filename: `mcq_results_${Date.now()}.xlsx`,
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
