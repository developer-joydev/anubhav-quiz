import { readExcelFile } from "@/lib/excelUtils";
import { getSampleQuestions } from "@/lib/sampleData";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject") || "english";

    console.log("🚀 API Route: Fetching questions for subject:", subject);

    // Try to read from subject-specific Excel file
    const excelQuestions = await readExcelFile(
      `http://localhost:3000/questions/${subject}.xlsx`
    );

    let questions;
    if (excelQuestions && excelQuestions.length > 0) {
      console.log("✅ Using questions from Excel file for subject:", subject);
      questions = excelQuestions;
    } else {
      console.log(
        "⚠️ Using sample questions as fallback for subject:",
        subject
      );
      questions = getSampleQuestions(subject);
    }

    console.log(
      `📋 Total questions loaded for ${subject}: ${questions.length}`
    );

    return NextResponse.json(questions);
  } catch (error) {
    console.error("❌ Error in questions API:", error);

    // Fallback to sample data
    const subject =
      new URL(request.url).searchParams.get("subject") || "english";
    return NextResponse.json(getSampleQuestions(subject));
  }
}
