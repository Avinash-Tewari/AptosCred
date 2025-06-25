import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "user_id parameter required",
        },
        { status: 400 },
      )
    }

    const requests = await db.getUserVerificationRequests(userId)

    return NextResponse.json({ success: true, data: requests })
  } catch (error) {
    console.error("Error fetching verification requests:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch verification requests",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, skill_id, verification_type, level, verification_data } = body

    if (!user_id || !skill_id || !verification_type || !level || !verification_data) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const request = await db.createVerificationRequest({
      user_id,
      skill_id,
      verification_type,
      level,
      verification_data,
    })

    return NextResponse.json({ success: true, data: request }, { status: 201 })
  } catch (error) {
    console.error("Error creating verification request:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create verification request",
      },
      { status: 500 },
    )
  }
}
