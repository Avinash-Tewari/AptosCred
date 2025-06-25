import { neon } from "@neondatabase/serverless"
import type { User, SkillBadge, Endorsement, JobListing } from "./types"

const sql = neon(process.env.DATABASE_URL!)

export class NeonService {
  // User operations
  async createUser(userData: {
    wallet_address: string
    username?: string
    email?: string
    full_name?: string
    bio?: string
    avatar_url?: string
    profile_metadata_ipfs?: string
  }): Promise<User> {
    const result = await sql`
      INSERT INTO users (
        wallet_address, username, email, full_name, bio, avatar_url, profile_metadata_ipfs
      ) VALUES (
        ${userData.wallet_address},
        ${userData.username || null},
        ${userData.email || null},
        ${userData.full_name || null},
        ${userData.bio || null},
        ${userData.avatar_url || null},
        ${userData.profile_metadata_ipfs || null}
      )
      RETURNING *
    `
    return result[0] as User
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users 
      WHERE wallet_address = ${walletAddress}
    `
    return (result[0] as User) || null
  }

  async updateUserReputation(userId: string, reputationScore: number): Promise<User> {
    const result = await sql`
      UPDATE users 
      SET reputation_score = ${reputationScore}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING *
    `
    return result[0] as User
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
  }): Promise<SkillBadge> {
    const result = await sql`
      INSERT INTO skill_badges (
        user_id, skill_id, level, verification_type, verification_data,
        nft_token_id, metadata_ipfs, transaction_hash, is_verified
      ) VALUES (
        ${badgeData.user_id},
        ${badgeData.skill_id},
        ${badgeData.level},
        ${badgeData.verification_type},
        ${JSON.stringify(badgeData.verification_data)},
        ${badgeData.nft_token_id || null},
        ${badgeData.metadata_ipfs || null},
        ${badgeData.transaction_hash || null},
        ${badgeData.is_verified || false}
      )
      RETURNING *
    `
    return result[0] as SkillBadge
  }

  async getUserSkillBadges(userId: string): Promise<SkillBadge[]> {
    const result = await sql`
      SELECT 
        sb.*,
        s.name as skill_name,
        s.description as skill_description,
        sc.name as category_name
      FROM skill_badges sb
      JOIN skills s ON sb.skill_id = s.id
      JOIN skill_categories sc ON s.category_id = sc.id
      WHERE sb.user_id = ${userId}
      ORDER BY sb.created_at DESC
    `
    return result as SkillBadge[]
  }

  async verifySkillBadge(badgeId: string, transactionHash: string): Promise<SkillBadge> {
    const result = await sql`
      UPDATE skill_badges 
      SET 
        is_verified = true,
        transaction_hash = ${transactionHash},
        issued_at = NOW(),
        updated_at = NOW()
      WHERE id = ${badgeId}
      RETURNING *
    `
    return result[0] as SkillBadge
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
  }): Promise<Endorsement> {
    const result = await sql`
      INSERT INTO endorsements (
        endorser_id, endorsed_id, skill_badge_id, message,
        endorser_reputation, weight, transaction_hash
      ) VALUES (
        ${endorsementData.endorser_id},
        ${endorsementData.endorsed_id},
        ${endorsementData.skill_badge_id},
        ${endorsementData.message || null},
        ${endorsementData.endorser_reputation},
        ${endorsementData.weight},
        ${endorsementData.transaction_hash || null}
      )
      RETURNING *
    `

    // Update endorsement count
    await sql`
      UPDATE skill_badges 
      SET endorsement_count = endorsement_count + 1
      WHERE id = ${endorsementData.skill_badge_id}
    `

    return result[0] as Endorsement
  }

  async getUserEndorsements(userId: string): Promise<Endorsement[]> {
    const result = await sql`
      SELECT 
        e.*,
        endorser.username as endorser_username,
        endorser.full_name as endorser_name,
        endorser.avatar_url as endorser_avatar,
        s.name as skill_name
      FROM endorsements e
      JOIN users endorser ON e.endorser_id = endorser.id
      JOIN skill_badges sb ON e.skill_badge_id = sb.id
      JOIN skills s ON sb.skill_id = s.id
      WHERE e.endorsed_id = ${userId}
      ORDER BY e.created_at DESC
    `
    return result as Endorsement[]
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
  }): Promise<JobListing> {
    const { required_skills, ...jobInfo } = jobData

    const result = await sql`
      INSERT INTO job_listings (
        employer_id, title, description, category_id, job_type,
        location, is_remote, min_reputation, payment_amount,
        payment_currency, deadline
      ) VALUES (
        ${jobInfo.employer_id},
        ${jobInfo.title},
        ${jobInfo.description},
        ${jobInfo.category_id || null},
        ${jobInfo.job_type},
        ${jobInfo.location || null},
        ${jobInfo.is_remote || false},
        ${jobInfo.min_reputation || 0},
        ${jobInfo.payment_amount},
        ${jobInfo.payment_currency || "APT"},
        ${jobInfo.deadline || null}
      )
      RETURNING *
    `

    const job = result[0] as JobListing

    // Insert required skills
    if (required_skills.length > 0) {
      const skillInserts = required_skills.map(
        (skillId) => sql`INSERT INTO job_required_skills (job_id, skill_id) VALUES (${job.id}, ${skillId})`,
      )
      await Promise.all(skillInserts)
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
  }): Promise<JobListing[]> {
    let whereClause = "WHERE jl.status = 'open'"
    const params: any[] = []

    if (filters?.category) {
      whereClause += ` AND jl.category_id = $${params.length + 1}`
      params.push(filters.category)
    }

    if (filters?.job_type) {
      whereClause += ` AND jl.job_type = $${params.length + 1}`
      params.push(filters.job_type)
    }

    if (filters?.min_reputation) {
      whereClause += ` AND jl.min_reputation >= $${params.length + 1}`
      params.push(filters.min_reputation)
    }

    if (filters?.search) {
      whereClause += ` AND (jl.title ILIKE $${params.length + 1} OR jl.description ILIKE $${params.length + 1})`
      params.push(`%${filters.search}%`)
    }

    const limit = filters?.limit || 20
    const offset = filters?.offset || 0

    const query = `
      SELECT 
        jl.*,
        u.username as employer_username,
        u.full_name as employer_name,
        jc.name as category_name,
        COUNT(ja.id) as application_count
      FROM job_listings jl
      JOIN users u ON jl.employer_id = u.id
      LEFT JOIN job_categories jc ON jl.category_id = jc.id
      LEFT JOIN job_applications ja ON jl.id = ja.job_id
      ${whereClause}
      GROUP BY jl.id, u.username, u.full_name, jc.name
      ORDER BY jl.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    params.push(limit, offset)

    const result = await sql(query, params)
    return result as JobListing[]
  }

  // Skills and categories
  async getSkillCategories() {
    const result = await sql`
      SELECT 
        sc.*,
        COUNT(s.id) as skill_count
      FROM skill_categories sc
      LEFT JOIN skills s ON sc.id = s.category_id AND s.is_active = true
      WHERE sc.is_active = true
      GROUP BY sc.id
      ORDER BY sc.name
    `
    return result
  }

  async getSkills(categoryId?: string) {
    let query = `
      SELECT * FROM skills 
      WHERE is_active = true
    `
    const params: any[] = []

    if (categoryId) {
      query += ` AND category_id = $1`
      params.push(categoryId)
    }

    query += ` ORDER BY name`

    const result = await sql(query, params)
    return result
  }

  // Analytics and stats
  async getUserStats(userId: string) {
    const result = await sql`
      SELECT 
        u.reputation_score,
        u.jobs_completed,
        u.total_earnings,
        COUNT(DISTINCT sb.id) as skill_badges_count,
        COUNT(DISTINCT e.id) as endorsements_received,
        AVG(e.weight) as avg_endorsement_weight
      FROM users u
      LEFT JOIN skill_badges sb ON u.id = sb.user_id AND sb.is_verified = true
      LEFT JOIN endorsements e ON u.id = e.endorsed_id
      WHERE u.id = ${userId}
      GROUP BY u.id, u.reputation_score, u.jobs_completed, u.total_earnings
    `
    return result[0]
  }

  async getPlatformStats() {
    const result = await sql`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT sb.id) as total_skill_badges,
        COUNT(DISTINCT jl.id) as total_jobs,
        COUNT(DISTINCT e.id) as total_endorsements,
        SUM(jl.payment_amount) as total_job_value
      FROM users u
      LEFT JOIN skill_badges sb ON u.id = sb.user_id AND sb.is_verified = true
      LEFT JOIN job_listings jl ON u.id = jl.employer_id
      LEFT JOIN endorsements e ON u.id = e.endorsed_id
    `
    return result[0]
  }
}

export const neonDb = new NeonService()
