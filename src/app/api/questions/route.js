import { readExcelFile } from "@/lib/excelUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Read from public directory
    const questions = await readExcelFile(
      "http://localhost:3000/mcq_questions.xlsx"
    );
    console.log("Questions loaded:", questions);
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read questions" },
      { status: 500 }
    );
  }
}
