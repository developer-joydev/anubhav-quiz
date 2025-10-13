import { readdir, stat } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const resultsDir = path.join(process.cwd(), "public", "results");

    let files = [];
    try {
      files = await readdir(resultsDir);
    } catch (error) {
      // Directory doesn't exist yet, return empty array
      if (error.code === "ENOENT") {
        return NextResponse.json([]);
      }
      throw error;
    }

    // Filter for Excel files and get file info
    const excelFiles = files.filter((file) => file.endsWith(".xlsx"));

    const filesWithInfo = await Promise.all(
      excelFiles.map(async (filename) => {
        const filePath = path.join(resultsDir, filename);
        const fileStat = await stat(filePath);

        return {
          filename,
          path: `/results/${filename}`,
          timestamp: fileStat.mtime.toISOString(),
          size: fileStat.size,
        };
      })
    );

    // Sort by timestamp, newest first
    filesWithInfo.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json(filesWithInfo);
  } catch (error) {
    console.error("Error reading results directory:", error);
    return NextResponse.json(
      { error: "Failed to read results directory" },
      { status: 500 }
    );
  }
}
