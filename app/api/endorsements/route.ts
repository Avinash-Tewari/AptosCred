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

    const endorsements = await db.getUserEndorsements(userId)

    return NextResponse.json({ success: true, data: endorsements })
  } catch (error) {
    console.error("Error fetching endorsements:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch endorsements",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endorser_id, endorsed_id, skill_badge_id, message, endorser_reputation, weight, transaction_hash } = body

    if (!endorser_id || !endorsed_id || !skill_badge_id || !endorser_reputation || !weight) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const endorsement = await db.createEndorsement({
      endorser_id,
      endorsed_id,
      skill_badge_id,
      message,
      endorser_reputation,
      weight,
      transaction_hash,
    })

    return NextResponse.json({ success: true, data: endorsement }, { status: 201 })
  } catch (error) {
    console.error("Error creating endorsement:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create endorsement",
      },
      { status: 500 },
    )
  }
}
