// Database types for AptosCred platform

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<User, "id" | "created_at">>
      }
      skill_categories: {
        Row: SkillCategory
        Insert: Omit<SkillCategory, "id" | "created_at">
        Update: Partial<Omit<SkillCategory, "id" | "created_at">>
      }
      skills: {
        Row: Skill
        Insert: Omit<Skill, "id" | "created_at">
        Update: Partial<Omit<Skill, "id" | "created_at">>
      }
      skill_badges: {
        Row: SkillBadge
        Insert: Omit<SkillBadge, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<SkillBadge, "id" | "created_at">>
      }
      endorsements: {
        Row: Endorsement
        Insert: Omit<Endorsement, "id" | "created_at">
        Update: Partial<Omit<Endorsement, "id" | "created_at">>
      }
      job_categories: {
        Row: JobCategory
        Insert: Omit<JobCategory, "id" | "created_at">
        Update: Partial<Omit<JobCategory, "id" | "created_at">>
      }
      job_listings: {
        Row: JobListing
        Insert: Omit<JobListing, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<JobListing, "id" | "created_at">>
      }
      job_required_skills: {
        Row: JobRequiredSkill
        Insert: Omit<JobRequiredSkill, "id" | "created_at">
        Update: Partial<Omit<JobRequiredSkill, "id" | "created_at">>
      }
      job_applications: {
        Row: JobApplication
        Insert: Omit<JobApplication, "id" | "applied_at" | "updated_at">
        Update: Partial<Omit<JobApplication, "id" | "applied_at">>
      }
      escrow_contracts: {
        Row: EscrowContract
        Insert: Omit<EscrowContract, "id" | "created_at">
        Update: Partial<Omit<EscrowContract, "id" | "created_at">>
      }
      verification_requests: {
        Row: VerificationRequest
        Insert: Omit<VerificationRequest, "id" | "submitted_at" | "created_at" | "updated_at">
        Update: Partial<Omit<VerificationRequest, "id" | "submitted_at" | "created_at">>
      }
      test_results: {
        Row: TestResult
        Insert: Omit<TestResult, "id" | "created_at">
        Update: Partial<Omit<TestResult, "id" | "created_at">>
      }
      peer_verification_requests: {
        Row: PeerVerificationRequest
        Insert: Omit<PeerVerificationRequest, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<PeerVerificationRequest, "id" | "created_at">>
      }
      peer_verification_responses: {
        Row: PeerVerificationResponse
        Insert: Omit<PeerVerificationResponse, "id" | "responded_at">
        Update: Partial<Omit<PeerVerificationResponse, "id" | "responded_at">>
      }
      project_submissions: {
        Row: ProjectSubmission
        Insert: Omit<ProjectSubmission, "id" | "submitted_at" | "created_at" | "updated_at">
        Update: Partial<Omit<ProjectSubmission, "id" | "submitted_at" | "created_at">>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, "id" | "created_at">
        Update: Partial<Omit<Notification, "id" | "created_at">>
      }
      blockchain_events: {
        Row: BlockchainEvent
        Insert: Omit<BlockchainEvent, "id" | "created_at">
        Update: Partial<Omit<BlockchainEvent, "id" | "created_at">>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_endorsement_count: {
        Args: { badge_id: string }
        Returns: void
      }
    }
    Enums: {
      skill_level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
      verification_type: "test" | "peer" | "project"
      job_status: "open" | "in_progress" | "completed" | "cancelled" | "disputed"
      job_type: "full-time" | "part-time" | "contract" | "freelance"
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      verification_status: "pending" | "in_review" | "approved" | "rejected"
      review_status: "pending" | "in_review" | "approved" | "rejected" | "needs_revision"
    }
  }
}

export interface User {
  id: string
  wallet_address: string
  username?: string
  email?: string
  full_name?: string
  bio?: string
  avatar_url?: string
  profile_metadata_ipfs?: string
  reputation_score: number
  total_earnings: number
  jobs_completed: number
  is_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SkillCategory {
  id: string
  name: string
  description?: string
  icon_url?: string
  is_active: boolean
  created_at: string
}

export interface Skill {
  id: string
  category_id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface SkillBadge {
  id: string
  user_id: string
  skill_id: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  verification_type: "test" | "peer" | "project"
  verification_data: any
  nft_token_id?: string
  metadata_ipfs?: string
  transaction_hash?: string
  is_verified: boolean
  endorsement_count: number
  issued_at?: string
  created_at: string
  updated_at: string
}

export interface Endorsement {
  id: string
  endorser_id: string
  endorsed_id: string
  skill_badge_id: string
  message?: string
  endorser_reputation: number
  weight: number
  transaction_hash?: string
  created_at: string
}

export interface JobCategory {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface JobListing {
  id: string
  employer_id: string
  title: string
  description: string
  category_id?: string
  job_type: "full-time" | "part-time" | "contract" | "freelance"
  location?: string
  is_remote: boolean
  min_reputation: number
  payment_amount: number
  payment_currency: string
  escrow_amount?: number
  status: "open" | "in_progress" | "completed" | "cancelled" | "disputed"
  freelancer_id?: string
  deadline?: string
  blockchain_job_id?: number
  transaction_hash?: string
  created_at: string
  updated_at: string
}

export interface JobRequiredSkill {
  id: string
  job_id: string
  skill_id: string
  is_required: boolean
  created_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  applicant_id: string
  cover_letter?: string
  proposed_rate?: number
  estimated_duration?: string
  portfolio_links?: string[]
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  applied_at: string
  updated_at: string
}

export interface EscrowContract {
  id: string
  job_id: string
  employer_id: string
  freelancer_id: string
  amount: number
  currency: string
  is_released: boolean
  dispute_raised: boolean
  blockchain_escrow_id?: string
  transaction_hash?: string
  created_at: string
  released_at?: string
}

export interface VerificationRequest {
  id: string
  user_id: string
  skill_id: string
  verification_type: "test" | "peer" | "project"
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  verification_data: any
  status: "pending" | "in_review" | "approved" | "rejected"
  reviewer_id?: string
  feedback?: string
  submitted_at: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface TestResult {
  id: string
  user_id: string
  skill_id: string
  platform: string
  test_id: string
  score: number
  max_score: number
  percentage: number
  certificate_url?: string
  verification_hash: string
  completed_at: string
  created_at: string
}

export interface PeerVerificationRequest {
  id: string
  requester_id: string
  skill_id: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  evidence_ipfs: string[]
  required_approvals: number
  current_approvals: number
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface PeerVerificationResponse {
  id: string
  request_id: string
  peer_id: string
  approved: boolean
  feedback?: string
  responded_at: string
}

export interface ProjectSubmission {
  id: string
  user_id: string
  skill_id: string
  title: string
  description: string
  project_type: string
  live_url?: string
  repository_url?: string
  documentation_url?: string
  files_ipfs: string[]
  review_status: "pending" | "in_review" | "approved" | "rejected" | "needs_revision"
  reviewer_id?: string
  review_feedback?: string
  submitted_at: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data?: any
  is_read: boolean
  created_at: string
}

export interface BlockchainEvent {
  id: string
  event_type: string
  transaction_hash: string
  block_number?: number
  event_data: any
  processed: boolean
  created_at: string
  processed_at?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Extended types with relations
export interface UserWithStats extends User {
  skill_badges_count: number
  endorsements_received: number
  avg_endorsement_weight: number
}

export interface SkillBadgeWithDetails extends SkillBadge {
  skill: Skill
  user: User
  endorsements: Endorsement[]
}

export interface JobListingWithDetails extends JobListing {
  employer: User
  category?: JobCategory
  required_skills: (JobRequiredSkill & { skill: Skill })[]
  applications: JobApplication[]
  application_count: number
}

export interface EndorsementWithDetails extends Endorsement {
  endorser: User
  endorsed: User
  skill_badge: SkillBadgeWithDetails
}
