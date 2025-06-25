import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const categories = await db.getSkillCategories()

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching skill categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skill categories",
      },
      { status: 500 },
    )
  }
}
