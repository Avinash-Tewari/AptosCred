// Data models for AptosCred platform

export interface User {
  address: string
  profileMetadata: string
  reputationScore: number
  skillBadges: SkillBadge[]
  endorsements: Endorsement[]
  jobsCompleted: number
  totalEarnings: number
  createdAt: Date
  updatedAt: Date
}

export interface SkillBadge {
  id: string
  skillName: string
  level: SkillLevel
  verificationType: VerificationType
  verificationData: string // IPFS hash or verification details
  issuedAt: Date
  endorsementCount: number
  nftTokenId?: string
  metadata: SkillBadgeMetadata
}

export interface SkillBadgeMetadata {
  name: string
  description: string
  image: string // IPFS hash
  attributes: {
    skill: string
    level: string
    verification_method: string
    issuer: string
    issue_date: string
  }
  external_url?: string
}

export interface Endorsement {
  id: string
  endorser: string
  endorsed: string
  skillName: string
  endorserReputation: number
  message: string
  timestamp: Date
  weight: number // Calculated based on endorser's reputation
}

export interface JobListing {
  id: string
  employer: string
  title: string
  description: string
  requiredSkills: string[]
  minReputation: number
  paymentAmount: number
  escrowAmount: number
  status: JobStatus
  freelancer?: string
  createdAt: Date
  deadline: Date
  applicants: JobApplication[]
  category: JobCategory
  jobType: JobType
  location?: string
}

export interface JobApplication {
  id: string
  jobId: string
  applicant: string
  coverLetter: string
  proposedRate?: number
  estimatedDuration?: string
  portfolio: string[] // IPFS hashes
  appliedAt: Date
  status: ApplicationStatus
}

export interface EscrowContract {
  jobId: string
  employer: string
  freelancer: string
  amount: number
  isReleased: boolean
  disputeRaised: boolean
  createdAt: Date
  releasedAt?: Date
  disputeDetails?: DisputeDetails
}

export interface DisputeDetails {
  raisedBy: string
  reason: string
  evidence: string[] // IPFS hashes
  arbitrator?: string
  resolution?: string
  resolvedAt?: Date
}

export interface VerificationRequest {
  id: string
  user: string
  skillName: string
  level: SkillLevel
  verificationType: VerificationType
  verificationData: any
  status: VerificationStatus
  reviewers?: string[]
  submittedAt: Date
  completedAt?: Date
  feedback?: string
}

export interface TestResult {
  id: string
  userId: string
  platform: TestPlatform
  skillName: string
  score: number
  maxScore: number
  completedAt: Date
  certificateUrl?: string
  verificationHash: string
}

export interface PeerVerificationRequest {
  id: string
  requester: string
  skillName: string
  evidence: string[] // IPFS hashes
  peers: string[]
  responses: PeerResponse[]
  requiredApprovals: number
  status: VerificationStatus
  createdAt: Date
}

export interface PeerResponse {
  peer: string
  approved: boolean
  feedback: string
  respondedAt: Date
}

export interface ProjectSubmission {
  id: string
  submitter: string
  skillName: string
  title: string
  description: string
  projectType: ProjectType
  liveUrl?: string
  repositoryUrl?: string
  documentationUrl?: string
  files: string[] // IPFS hashes
  submittedAt: Date
  reviewStatus: ReviewStatus
  reviewFeedback?: string
  reviewedAt?: Date
  reviewer?: string
}

// Enums
export enum SkillLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  EXPERT = "Expert",
}

export enum VerificationType {
  TEST = 1,
  PEER = 2,
  PROJECT = 3,
}

export enum JobStatus {
  OPEN = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  DISPUTED = 4,
  CANCELLED = 5,
}

export enum JobCategory {
  DEVELOPMENT = "Development",
  DESIGN = "Design",
  DATA_SCIENCE = "Data Science",
  MARKETING = "Marketing",
  PROJECT_MANAGEMENT = "Project Management",
  BLOCKCHAIN = "Blockchain",
  OTHER = "Other",
}

export enum JobType {
  FULL_TIME = "Full-time",
  PART_TIME = "Part-time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
}

export enum ApplicationStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  WITHDRAWN = "Withdrawn",
}

export enum VerificationStatus {
  PENDING = "Pending",
  IN_REVIEW = "In Review",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum TestPlatform {
  HACKERRANK = "HackerRank",
  CODILITY = "Codility",
  LEETCODE = "LeetCode",
  COURSERA = "Coursera",
  UDEMY = "Udemy",
}

export enum ProjectType {
  WEB_APP = "Web Application",
  MOBILE_APP = "Mobile Application",
  SMART_CONTRACT = "Smart Contract",
  DATA_ANALYSIS = "Data Analysis",
  DESIGN_PORTFOLIO = "Design Portfolio",
  OTHER = "Other",
}

export enum ReviewStatus {
  PENDING = "Pending",
  IN_REVIEW = "In Review",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  NEEDS_REVISION = "Needs Revision",
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

// Reputation calculation weights
export const REPUTATION_WEIGHTS = {
  SKILL_VERIFICATION: {
    TEST: 50,
    PEER: 30,
    PROJECT: 70,
  },
  ENDORSEMENT_BASE: 0.05, // 5% of endorser's reputation
  JOB_COMPLETION: 25,
  TIME_CONSISTENCY_BONUS: 10, // Per month of consistent activity
  DISPUTE_PENALTY: -100,
}

// Skill categories and subcategories
export const SKILL_CATEGORIES = {
  "Programming Languages": ["JavaScript", "Python", "Java", "C++", "Go", "Rust", "TypeScript", "PHP", "C#", "Swift"],
  "Web Development": ["React", "Vue.js", "Angular", "Node.js", "Express.js", "Next.js", "HTML/CSS", "GraphQL"],
  "Mobile Development": ["React Native", "Flutter", "iOS Development", "Android Development", "Xamarin"],
  "Data Science": ["Machine Learning", "Data Analysis", "Python", "R", "SQL", "TensorFlow", "PyTorch"],
  DevOps: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Terraform", "Jenkins"],
  Design: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Sketch", "Prototyping", "User Research"],
  Blockchain: ["Solidity", "Move", "Web3", "DeFi", "Smart Contracts", "Ethereum", "Aptos"],
  Marketing: ["Digital Marketing", "SEO", "Content Marketing", "Social Media", "PPC", "Analytics"],
}
