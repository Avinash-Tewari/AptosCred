import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("category_id")

    const skills = await db.getSkills(categoryId || undefined)

    return NextResponse.json({ success: true, data: skills })
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skills",
      },
      { status: 500 },
    )
  }
}
