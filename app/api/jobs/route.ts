import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const jobType = searchParams.get("job_type")
    const minReputation = searchParams.get("min_reputation")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const jobs = await db.getJobs({
      category: category || undefined,
      job_type: jobType || undefined,
      min_reputation: minReputation ? Number.parseInt(minReputation) : undefined,
      search: search || undefined,
      limit,
      offset,
    })

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch jobs",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employer_id,
      title,
      description,
      category_id,
      job_type,
      location,
      is_remote,
      min_reputation,
      payment_amount,
      payment_currency,
      deadline,
      required_skills,
    } = body

    if (!employer_id || !title || !description || !job_type || !payment_amount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const job = await db.createJob({
      employer_id,
      title,
      description,
      category_id,
      job_type,
      location,
      is_remote: is_remote || false,
      min_reputation: min_reputation || 0,
      payment_amount,
      payment_currency: payment_currency || "APT",
      deadline,
      required_skills: required_skills || [],
    })

    return NextResponse.json({ success: true, data: job }, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create job",
      },
      { status: 500 },
    )
  }
}
