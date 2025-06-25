-- AptosCred Database Schema
-- Compatible with both Supabase and Neon

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    profile_metadata_ipfs TEXT, -- IPFS hash for additional profile data
    reputation_score INTEGER DEFAULT 100,
    total_earnings DECIMAL(20, 8) DEFAULT 0,
    jobs_completed INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill categories table
CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES skill_categories(id) ON DELETE CASCADE,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill badges (Soulbound NFTs)
CREATE TABLE skill_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    verification_type TEXT NOT NULL CHECK (verification_type IN ('test', 'peer', 'project')),
    verification_data JSONB, -- Store verification details
    nft_token_id TEXT, -- On-chain token ID
    metadata_ipfs TEXT, -- IPFS hash for NFT metadata
    transaction_hash TEXT, -- Blockchain transaction hash
    is_verified BOOLEAN DEFAULT FALSE,
    endorsement_count INTEGER DEFAULT 0,
    issued_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill_id) -- One badge per skill per user
);

-- Endorsements table
CREATE TABLE endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endorser_id UUID REFERENCES users(id) ON DELETE CASCADE,
    endorsed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_badge_id UUID REFERENCES skill_badges(id) ON DELETE CASCADE,
    message TEXT,
    endorser_reputation INTEGER NOT NULL,
    weight DECIMAL(5, 2) NOT NULL, -- Calculated endorsement weight
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(endorser_id, skill_badge_id) -- One endorsement per skill per endorser
);

-- Job categories table
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job listings table
CREATE TABLE job_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES job_categories(id),
    job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance')),
    location TEXT,
    is_remote BOOLEAN DEFAULT FALSE,
    min_reputation INTEGER DEFAULT 0,
    payment_amount DECIMAL(20, 8) NOT NULL,
    payment_currency TEXT DEFAULT 'APT',
    escrow_amount DECIMAL(20, 8),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled', 'disputed')),
    freelancer_id UUID REFERENCES users(id),
    deadline TIMESTAMP WITH TIME ZONE,
    blockchain_job_id BIGINT, -- On-chain job ID
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job required skills junction table
CREATE TABLE job_required_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, skill_id)
);

-- Job applications table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_rate DECIMAL(20, 8),
    estimated_duration TEXT,
    portfolio_links TEXT[], -- Array of URLs
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

-- Escrow contracts table
CREATE TABLE escrow_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    employer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(20, 8) NOT NULL,
    currency TEXT DEFAULT 'APT',
    is_released BOOLEAN DEFAULT FALSE,
    dispute_raised BOOLEAN DEFAULT FALSE,
    blockchain_escrow_id TEXT, -- On-chain escrow ID
    transaction_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    released_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(job_id)
);

-- Verification requests table
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('test', 'peer', 'project')),
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    verification_data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    reviewer_id UUID REFERENCES users(id),
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- 'hackerrank', 'codility', etc.
    test_id TEXT NOT NULL, -- Platform-specific test ID
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage DECIMAL(5, 2) GENERATED ALWAYS AS (ROUND((score::DECIMAL / max_score::DECIMAL) * 100, 2)) STORED,
    certificate_url TEXT,
    verification_hash TEXT,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peer verification requests table
CREATE TABLE peer_verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    evidence_ipfs TEXT[], -- Array of IPFS hashes
    required_approvals INTEGER DEFAULT 3,
    current_approvals INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Peer verification responses table
CREATE TABLE peer_verification_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES peer_verification_requests(id) ON DELETE CASCADE,
    peer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    approved BOOLEAN NOT NULL,
    feedback TEXT,
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(request_id, peer_id)
);

-- Project submissions table
CREATE TABLE project_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    project_type TEXT NOT NULL,
    live_url TEXT,
    repository_url TEXT,
    documentation_url TEXT,
    files_ipfs TEXT[], -- Array of IPFS hashes
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'in_review', 'approved', 'rejected', 'needs_revision')),
    reviewer_id UUID REFERENCES users(id),
    review_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'endorsement', 'job_application', 'verification_complete', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blockchain events table (for syncing with on-chain events)
CREATE TABLE blockchain_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    transaction_hash TEXT NOT NULL,
    block_number BIGINT,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_reputation_score ON users(reputation_score DESC);
CREATE INDEX idx_skill_badges_user_id ON skill_badges(user_id);
CREATE INDEX idx_skill_badges_skill_id ON skill_badges(skill_id);
CREATE INDEX idx_skill_badges_verified ON skill_badges(is_verified);
CREATE INDEX idx_endorsements_endorsed_id ON endorsements(endorsed_id);
CREATE INDEX idx_endorsements_endorser_id ON endorsements(endorser_id);
CREATE INDEX idx_job_listings_employer_id ON job_listings(employer_id);
CREATE INDEX idx_job_listings_status ON job_listings(status);
CREATE INDEX idx_job_listings_created_at ON job_listings(created_at DESC);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_blockchain_events_processed ON blockchain_events(processed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_badges_updated_at BEFORE UPDATE ON skill_badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON job_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_peer_verification_requests_updated_at BEFORE UPDATE ON peer_verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_submissions_updated_at BEFORE UPDATE ON project_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
