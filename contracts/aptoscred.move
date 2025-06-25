module aptoscred::soulbound_nft {
    use std::string::{Self, String};
    use std::vector;
    use std::signer;
    use std::option::{Self, Option};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use aptos_token::token::{Self, TokenId};

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_SKILL_ALREADY_EXISTS: u64 = 2;
    const E_INSUFFICIENT_REPUTATION: u64 = 3;
    const E_INVALID_ENDORSEMENT: u64 = 4;
    const E_JOB_NOT_FOUND: u64 = 5;
    const E_INSUFFICIENT_ESCROW: u64 = 6;

    // Skill verification types
    const VERIFICATION_TEST: u8 = 1;
    const VERIFICATION_PEER: u8 = 2;
    const VERIFICATION_PROJECT: u8 = 3;

    // Job status
    const JOB_OPEN: u8 = 1;
    const JOB_IN_PROGRESS: u8 = 2;
    const JOB_COMPLETED: u8 = 3;
    const JOB_DISPUTED: u8 = 4;

    struct SkillBadge has key, store {
        skill_name: String,
        level: String, // Beginner, Intermediate, Advanced, Expert
        verification_type: u8,
        verification_data: String, // IPFS hash or verification details
        issued_at: u64,
        endorsement_count: u64,
    }

    struct UserProfile has key {
        reputation_score: u64,
        skill_badges: Table<String, SkillBadge>,
        endorsements_received: Table<address, Endorsement>,
        jobs_completed: u64,
        total_earnings: u64,
        profile_metadata: String, // IPFS hash
    }

    struct Endorsement has store {
        endorser: address,
        skill_name: String,
        endorser_reputation: u64,
        message: String,
        timestamp: u64,
    }

    struct JobListing has key, store {
        id: u64,
        employer: address,
        title: String,
        description: String,
        required_skills: vector<String>,
        min_reputation: u64,
        payment_amount: u64,
        escrow_amount: u64,
        status: u8,
        freelancer: Option<address>,
        created_at: u64,
        deadline: u64,
    }

    struct JobBoard has key {
        jobs: Table<u64, JobListing>,
        next_job_id: u64,
        total_jobs: u64,
    }

    struct EscrowAccount has key {
        job_id: u64,
        employer: address,
        freelancer: address,
        amount: u64,
        is_released: bool,
        dispute_raised: bool,
    }

    // Events
    struct SkillVerifiedEvent has drop, store {
        user: address,
        skill_name: String,
        verification_type: u8,
        timestamp: u64,
    }

    struct EndorsementEvent has drop, store {
        endorser: address,
        endorsed: address,
        skill_name: String,
        timestamp: u64,
    }

    struct JobCreatedEvent has drop, store {
        job_id: u64,
        employer: address,
        title: String,
        payment_amount: u64,
    }

    struct JobCompletedEvent has drop, store {
        job_id: u64,
        employer: address,
        freelancer: address,
        payment_amount: u64,
    }

    struct GlobalEvents has key {
        skill_verified_events: EventHandle<SkillVerifiedEvent>,
        endorsement_events: EventHandle<EndorsementEvent>,
        job_created_events: EventHandle<JobCreatedEvent>,
        job_completed_events: EventHandle<JobCompletedEvent>,
    }

    // Initialize the module
    fun init_module(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        move_to(admin, JobBoard {
            jobs: table::new(),
            next_job_id: 1,
            total_jobs: 0,
        });

        move_to(admin, GlobalEvents {
            skill_verified_events: account::new_event_handle<SkillVerifiedEvent>(admin),
            endorsement_events: account::new_event_handle<EndorsementEvent>(admin),
            job_created_events: account::new_event_handle<JobCreatedEvent>(admin),
            job_completed_events: account::new_event_handle<JobCompletedEvent>(admin),
        });
    }

    // Initialize user profile
    public entry fun initialize_profile(
        user: &signer,
        profile_metadata: String
    ) {
        let user_addr = signer::address_of(user);
        
        if (!exists<UserProfile>(user_addr)) {
            move_to(user, UserProfile {
                reputation_score: 100, // Starting reputation
                skill_badges: table::new(),
                endorsements_received: table::new(),
                jobs_completed: 0,
                total_earnings: 0,
                profile_metadata,
            });
        };
    }

    // Verify skill and mint Soulbound NFT
    public entry fun verify_skill(
        user: &signer,
        skill_name: String,
        level: String,
        verification_type: u8,
        verification_data: String
    ) acquires UserProfile, GlobalEvents {
        let user_addr = signer::address_of(user);
        
        if (!exists<UserProfile>(user_addr)) {
            initialize_profile(user, string::utf8(b""));
        };

        let profile = borrow_global_mut<UserProfile>(user_addr);
        
        // Check if skill already exists
        assert!(!table::contains(&profile.skill_badges, skill_name), E_SKILL_ALREADY_EXISTS);

        let skill_badge = SkillBadge {
            skill_name: skill_name,
            level,
            verification_type,
            verification_data,
            issued_at: timestamp::now_seconds(),
            endorsement_count: 0,
        };

        table::add(&mut profile.skill_badges, skill_name, skill_badge);
        
        // Update reputation based on verification type
        let reputation_boost = if (verification_type == VERIFICATION_TEST) {
            50
        } else if (verification_type == VERIFICATION_PEER) {
            30
        } else if (verification_type == VERIFICATION_PROJECT) {
            70
        } else {
            20
        };

        profile.reputation_score = profile.reputation_score + reputation_boost;

        // Emit event
        let events = borrow_global_mut<GlobalEvents>(@aptoscred);
        event::emit_event(&mut events.skill_verified_events, SkillVerifiedEvent {
            user: user_addr,
            skill_name,
            verification_type,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Endorse a user's skill
    public entry fun endorse_skill(
        endorser: &signer,
        endorsed_user: address,
        skill_name: String,
        message: String
    ) acquires UserProfile, GlobalEvents {
        let endorser_addr = signer::address_of(endorser);
        
        // Get endorser's reputation
        let endorser_profile = borrow_global<UserProfile>(endorser_addr);
        let endorser_reputation = endorser_profile.reputation_score;
        
        // Minimum reputation required to endorse
        assert!(endorser_reputation >= 200, E_INSUFFICIENT_REPUTATION);

        let endorsed_profile = borrow_global_mut<UserProfile>(endorsed_user);
        
        // Check if skill exists
        assert!(table::contains(&endorsed_profile.skill_badges, skill_name), E_SKILL_ALREADY_EXISTS);

        let endorsement = Endorsement {
            endorser: endorser_addr,
            skill_name,
            endorser_reputation,
            message,
            timestamp: timestamp::now_seconds(),
        };

        table::upsert(&mut endorsed_profile.endorsements_received, endorser_addr, endorsement);

        // Update skill badge endorsement count
        let skill_badge = table::borrow_mut(&mut endorsed_profile.skill_badges, skill_name);
        skill_badge.endorsement_count = skill_badge.endorsement_count + 1;

        // Update reputation based on endorser's reputation
        let reputation_boost = endorser_reputation / 20; // 5% of endorser's reputation
        endorsed_profile.reputation_score = endorsed_profile.reputation_score + reputation_boost;

        // Emit event
        let events = borrow_global_mut<GlobalEvents>(@aptoscred);
        event::emit_event(&mut events.endorsement_events, EndorsementEvent {
            endorser: endorser_addr,
            endorsed: endorsed_user,
            skill_name,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Create a job listing with escrow
    public entry fun create_job(
        employer: &signer,
        title: String,
        description: String,
        required_skills: vector<String>,
        min_reputation: u64,
        payment_amount: u64,
        deadline: u64
    ) acquires JobBoard, GlobalEvents {
        let employer_addr = signer::address_of(employer);
        let job_board = borrow_global_mut<JobBoard>(@aptoscred);
        
        let job_id = job_board.next_job_id;
        let job = JobListing {
            id: job_id,
            employer: employer_addr,
            title,
            description,
            required_skills,
            min_reputation,
            payment_amount,
            escrow_amount: payment_amount, // Full payment in escrow
            status: JOB_OPEN,
            freelancer: option::none(),
            created_at: timestamp::now_seconds(),
            deadline,
        };

        table::add(&mut job_board.jobs, job_id, job);
        job_board.next_job_id = job_board.next_job_id + 1;
        job_board.total_jobs = job_board.total_jobs + 1;

        // Create escrow account
        move_to(employer, EscrowAccount {
            job_id,
            employer: employer_addr,
            freelancer: @0x0, // Will be set when job is accepted
            amount: payment_amount,
            is_released: false,
            dispute_raised: false,
        });

        // Emit event
        let events = borrow_global_mut<GlobalEvents>(@aptoscred);
        event::emit_event(&mut events.job_created_events, JobCreatedEvent {
            job_id,
            employer: employer_addr,
            title,
            payment_amount,
        });
    }

    // Apply for a job
    public entry fun apply_for_job(
        freelancer: &signer,
        job_id: u64
    ) acquires JobBoard, UserProfile {
        let freelancer_addr = signer::address_of(freelancer);
        let job_board = borrow_global_mut<JobBoard>(@aptoscred);
        
        assert!(table::contains(&job_board.jobs, job_id), E_JOB_NOT_FOUND);
        
        let job = table::borrow_mut(&mut job_board.jobs, job_id);
        assert!(job.status == JOB_OPEN, E_JOB_NOT_FOUND);

        // Check if freelancer meets requirements
        let freelancer_profile = borrow_global<UserProfile>(freelancer_addr);
        assert!(freelancer_profile.reputation_score >= job.min_reputation, E_INSUFFICIENT_REPUTATION);

        // For simplicity, auto-assign the first qualified applicant
        job.freelancer = option::some(freelancer_addr);
        job.status = JOB_IN_PROGRESS;
    }

    // Complete a job and release escrow
    public entry fun complete_job(
        employer: &signer,
        job_id: u64
    ) acquires JobBoard, EscrowAccount, UserProfile, GlobalEvents {
        let employer_addr = signer::address_of(employer);
        let job_board = borrow_global_mut<JobBoard>(@aptoscred);
        
        assert!(table::contains(&job_board.jobs, job_id), E_JOB_NOT_FOUND);
        
        let job = table::borrow_mut(&mut job_board.jobs, job_id);
        assert!(job.employer == employer_addr, E_NOT_AUTHORIZED);
        assert!(job.status == JOB_IN_PROGRESS, E_JOB_NOT_FOUND);

        let freelancer_addr = *option::borrow(&job.freelancer);
        
        // Update job status
        job.status = JOB_COMPLETED;

        // Release escrow
        let escrow = borrow_global_mut<EscrowAccount>(employer_addr);
        escrow.is_released = true;
        escrow.freelancer = freelancer_addr;

        // Update freelancer profile
        let freelancer_profile = borrow_global_mut<UserProfile>(freelancer_addr);
        freelancer_profile.jobs_completed = freelancer_profile.jobs_completed + 1;
        freelancer_profile.total_earnings = freelancer_profile.total_earnings + job.payment_amount;
        freelancer_profile.reputation_score = freelancer_profile.reputation_score + 25; // Job completion bonus

        // Emit event
        let events = borrow_global_mut<GlobalEvents>(@aptoscred);
        event::emit_event(&mut events.job_completed_events, JobCompletedEvent {
            job_id,
            employer: employer_addr,
            freelancer: freelancer_addr,
            payment_amount: job.payment_amount,
        });
    }

    // View functions
    #[view]
    public fun get_user_reputation(user: address): u64 acquires UserProfile {
        if (!exists<UserProfile>(user)) {
            return 0
        };
        let profile = borrow_global<UserProfile>(user);
        profile.reputation_score
    }

    #[view]
    public fun get_skill_badge_count(user: address): u64 acquires UserProfile {
        if (!exists<UserProfile>(user)) {
            return 0
        };
        let profile = borrow_global<UserProfile>(user);
        table::length(&profile.skill_badges)
    }

    #[view]
    public fun get_job_details(job_id: u64): (String, String, u64, u8) acquires JobBoard {
        let job_board = borrow_global<JobBoard>(@aptoscred);
        assert!(table::contains(&job_board.jobs, job_id), E_JOB_NOT_FOUND);
        
        let job = table::borrow(&job_board.jobs, job_id);
        (job.title, job.description, job.payment_amount, job.status)
    }

    #[view]
    public fun get_total_jobs(): u64 acquires JobBoard {
        let job_board = borrow_global<JobBoard>(@aptoscred);
        job_board.total_jobs
    }
}
