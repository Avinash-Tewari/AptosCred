import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("wallet_address")

    if (walletAddress) {
      const user = await db.getUserByWallet(walletAddress)
      return NextResponse.json({ success: true, data: user })
    }

    // If no specific wallet address, return error
    return NextResponse.json(
      {
        success: false,
        error: "wallet_address parameter required",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet_address, username, email, full_name, bio, avatar_url, profile_metadata_ipfs } = body

    if (!wallet_address) {
      return NextResponse.json(
        {
          success: false,
          error: "wallet_address is required",
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await db.getUserByWallet(wallet_address)
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
        },
        { status: 409 },
      )
    }

    const user = await db.createUser({
      wallet_address,
      username,
      email,
      full_name,
      bio,
      avatar_url,
      profile_metadata_ipfs,
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
      },
      { status: 500 },
    )
  }
}
