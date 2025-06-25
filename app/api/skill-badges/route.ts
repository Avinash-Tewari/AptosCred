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

    const skillBadges = await db.getUserSkillBadges(userId)

    return NextResponse.json({ success: true, data: skillBadges })
  } catch (error) {
    console.error("Error fetching skill badges:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch skill badges",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      skill_id,
      level,
      verification_type,
      verification_data,
      nft_token_id,
      metadata_ipfs,
      transaction_hash,
    } = body

    if (!user_id || !skill_id || !level || !verification_type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const skillBadge = await db.createSkillBadge({
      user_id,
      skill_id,
      level,
      verification_type,
      verification_data,
      nft_token_id,
      metadata_ipfs,
      transaction_hash,
      is_verified: !!transaction_hash,
    })

    return NextResponse.json({ success: true, data: skillBadge }, { status: 201 })
  } catch (error) {
    console.error("Error creating skill badge:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create skill badge",
      },
      { status: 500 },
    )
  }
}
