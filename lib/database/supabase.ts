import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient<Database>(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Database helper functions
export class SupabaseService {
  private client = supabase

  // User operations
  async createUser(userData: {
    wallet_address: string
    username?: string
    email?: string
    full_name?: string
    bio?: string
    avatar_url?: string
    profile_metadata_ipfs?: string
  }) {
    const { data, error } = await this.client.from("users").insert(userData).select().single()

    if (error) throw error
    return data
  }

  async getUserByWallet(walletAddress: string) {
    const { data, error } = await this.client.from("users").select("*").eq("wallet_address", walletAddress).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  }

  async updateUserReputation(userId: string, reputationScore: number) {
    const { data, error } = await this.client
      .from("users")
      .update({ reputation_score: reputationScore })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Skill badge operations
  async createSkillBadge(badgeData: {
    user_id: string
    skill_id: string
    level: string
    verification_type: string
    verification_data: any
    nft_token_id?: string
    metadata_ipfs?: string
    transaction_hash?: string
    is_verified?: boolean
  }) {
    const { data, error } = await this.client
      .from("skill_badges")
      .insert(badgeData)
      .select(`
        *,
        skill:skills(*),
        user:users(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async getUserSkillBadges(userId: string) {
    const { data, error } = await this.client
      .from("skill_badges")
      .select(`
        *,
        skill:skills(*),
        endorsements:endorsements(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async verifySkillBadge(badgeId: string, transactionHash: string) {
    const { data, error } = await this.client
      .from("skill_badges")
      .update({
        is_verified: true,
        transaction_hash: transactionHash,
        issued_at: new Date().toISOString(),
      })
      .eq("id", badgeId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Endorsement operations
  async createEndorsement(endorsementData: {
    endorser_id: string
    endorsed_id: string
    skill_badge_id: string
    message?: string
    endorser_reputation: number
    weight: number
    transaction_hash?: string
  }) {
    const { data, error } = await this.client
      .from("endorsements")
      .insert(endorsementData)
      .select(`
        *,
        endorser:endorser_id(*),
        endorsed:endorsed_id(*),
        skill_badge:skill_badges(*)
      `)
      .single()

    if (error) throw error

    // Update endorsement count on skill badge
    await this.client.rpc("increment_endorsement_count", {
      badge_id: endorsementData.skill_badge_id,
    })

    return data
  }

  async getUserEndorsements(userId: string) {
    const { data, error } = await this.client
      .from("endorsements")
      .select(`
        *,
        endorser:endorser_id(*),
        skill_badge:skill_badges(
          *,
          skill:skills(*)
        )
      `)
      .eq("endorsed_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Job operations
  async createJob(jobData: {
    employer_id: string
    title: string
    description: string
    category_id?: string
    job_type: string
    location?: string
    is_remote?: boolean
    min_reputation?: number
    payment_amount: number
    payment_currency?: string
    deadline?: string
    required_skills: string[]
  }) {
    const { required_skills, ...jobInfo } = jobData

    const { data: job, error: jobError } = await this.client.from("job_listings").insert(jobInfo).select().single()

    if (jobError) throw jobError

    // Insert required skills
    if (required_skills.length > 0) {
      const skillRequirements = required_skills.map((skillId) => ({
        job_id: job.id,
        skill_id: skillId,
      }))

      const { error: skillsError } = await this.client.from("job_required_skills").insert(skillRequirements)

      if (skillsError) throw skillsError
    }

    return job
  }

  async getJobs(filters?: {
    category?: string
    job_type?: string
    min_reputation?: number
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = this.client
      .from("job_listings")
      .select(`
        *,
        employer:employer_id(*),
        category:job_categories(*),
        required_skills:job_required_skills(
          skill:skills(*)
        ),
        applications:job_applications(count)
      `)
      .eq("status", "open")

    if (filters?.category) {
      query = query.eq("category_id", filters.category)
    }

    if (filters?.job_type) {
      query = query.eq("job_type", filters.job_type)
    }

    if (filters?.min_reputation) {
      query = query.gte("min_reputation", filters.min_reputation)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    query = query.order("created_at", { ascending: false }).limit(filters?.limit || 20)

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  async applyForJob(applicationData: {
    job_id: string
    applicant_id: string
    cover_letter?: string
    proposed_rate?: number
    estimated_duration?: string
    portfolio_links?: string[]
  }) {
    const { data, error } = await this.client
      .from("job_applications")
      .insert(applicationData)
      .select(`
        *,
        job:job_listings(*),
        applicant:applicant_id(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Skills and categories
  async getSkillCategories() {
    const { data, error } = await this.client
      .from("skill_categories")
      .select(`
        *,
        skills:skills(*)
      `)
      .eq("is_active", true)
      .order("name")

    if (error) throw error
    return data
  }

  async getSkills(categoryId?: string) {
    let query = this.client.from("skills").select("*").eq("is_active", true)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query.order("name")

    if (error) throw error
    return data
  }

  // Verification requests
  async createVerificationRequest(requestData: {
    user_id: string
    skill_id: string
    verification_type: string
    level: string
    verification_data: any
  }) {
    const { data, error } = await this.client
      .from("verification_requests")
      .insert(requestData)
      .select(`
        *,
        user:users(*),
        skill:skills(*)
      `)
      .single()

    if (error) throw error
    return data
  }

  async getUserVerificationRequests(userId: string) {
    const { data, error } = await this.client
      .from("verification_requests")
      .select(`
        *,
        skill:skills(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Notifications
  async createNotification(notificationData: {
    user_id: string
    type: string
    title: string
    message: string
    data?: any
  }) {
    const { data, error } = await this.client.from("notifications").insert(notificationData).select().single()

    if (error) throw error
    return data
  }

  async getUserNotifications(userId: string, limit = 20) {
    const { data, error } = await this.client
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await this.client
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const db = new SupabaseService()
