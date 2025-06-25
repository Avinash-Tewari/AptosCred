# AptosCred Database Integration

This document explains the database integration for the AptosCred platform, supporting both Supabase and Neon databases.

## Database Providers

### Supabase
- **Type**: PostgreSQL with real-time features
- **Best for**: Rapid development, real-time updates, built-in auth
- **Features**: Real-time subscriptions, built-in authentication, edge functions

### Neon
- **Type**: Serverless PostgreSQL
- **Best for**: Serverless applications, cost optimization, branching
- **Features**: Serverless scaling, database branching, connection pooling

## Setup Instructions

### Option 1: Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Configure Environment Variables**
   \`\`\`bash
   DATABASE_PROVIDER=supabase
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

3. **Setup Database**
   \`\`\`bash
   npm run setup:database
   \`\`\`

### Option 2: Neon Setup

1. **Create Neon Project**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Get your connection string

2. **Configure Environment Variables**
   \`\`\`bash
   DATABASE_PROVIDER=neon
   DATABASE_URL=postgresql://username:password@host:port/database
   \`\`\`

3. **Setup Database**
   \`\`\`bash
   npm run setup:database
   \`\`\`

## Database Schema

### Core Tables

- **users**: User profiles and wallet addresses
- **skill_categories**: Skill categorization
- **skills**: Individual skills
- **skill_badges**: Soulbound NFT skill badges
- **endorsements**: Peer endorsements
- **job_listings**: Job postings
- **job_applications**: Job applications
- **escrow_contracts**: Smart contract escrow data
- **verification_requests**: Skill verification requests
- **notifications**: User notifications
- **blockchain_events**: On-chain event tracking

### Key Features

- **UUID Primary Keys**: All tables use UUID for better distribution
- **Timestamps**: Automatic created_at and updated_at tracking
- **Indexes**: Optimized for common query patterns
- **Constraints**: Data integrity with foreign keys and check constraints
- **JSONB Support**: Flexible data storage for verification details

## API Endpoints

### Users
- `GET /api/users?wallet_address=0x...` - Get user by wallet
- `POST /api/users` - Create new user

### Skills
- `GET /api/skills?category_id=uuid` - Get skills by category
- `GET /api/skill-categories` - Get all skill categories

### Skill Badges
- `GET /api/skill-badges?user_id=uuid` - Get user's skill badges
- `POST /api/skill-badges` - Create new skill badge

### Endorsements
- `GET /api/endorsements?user_id=uuid` - Get user's endorsements
- `POST /api/endorsements` - Create new endorsement

### Jobs
- `GET /api/jobs` - Get job listings with filters
- `POST /api/jobs` - Create new job listing

### Verification
- `GET /api/verification-requests?user_id=uuid` - Get verification requests
- `POST /api/verification-requests` - Create verification request

## Database Service Layer

The database service layer provides a unified interface regardless of the provider:

\`\`\`typescript
import { db } from '@/lib/database'

// Works with both Supabase and Neon
const user = await db.getUserByWallet(walletAddress)
const skillBadges = await db.getUserSkillBadges(userId)
const jobs = await db.getJobs({ category: 'development' })
\`\`\`

## Data Synchronization

### Blockchain Events
- Smart contract events are captured and stored in `blockchain_events`
- Background processes sync on-chain data with database
- Ensures consistency between blockchain and database state

### Real-time Updates (Supabase)
\`\`\`typescript
// Subscribe to real-time changes
supabase
  .channel('skill_badges')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'skill_badges' },
    (payload) => {
      // Handle new skill badge
    }
  )
  .subscribe()
\`\`\`

## Performance Optimization

### Indexes
- Wallet addresses for fast user lookup
- User IDs for skill badges and endorsements
- Job status and creation date for job listings
- Notification read status for efficient queries

### Query Optimization
- Use appropriate joins for related data
- Implement pagination for large result sets
- Cache frequently accessed data
- Use database functions for complex calculations

## Security

### Row Level Security (Supabase)
\`\`\`sql
-- Users can only update their own profiles
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own notifications
CREATE POLICY "Users see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
\`\`\`

### Data Validation
- Input validation at API level
- Database constraints for data integrity
- Sanitization of user inputs
- Rate limiting on API endpoints

## Backup and Recovery

### Supabase
- Automatic daily backups
- Point-in-time recovery
- Export capabilities

### Neon
- Automatic backups
- Database branching for testing
- Connection pooling for reliability

## Monitoring

### Database Metrics
- Query performance
- Connection counts
- Storage usage
- Error rates

### Application Metrics
- API response times
- User activity
- Skill verification rates
- Job completion rates

## Migration Strategy

### Schema Changes
1. Create migration scripts
2. Test on development database
3. Apply to staging environment
4. Deploy to production with rollback plan

### Data Migration
1. Export data from source
2. Transform data format if needed
3. Import to target database
4. Verify data integrity
5. Update application configuration

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Check environment variables
   - Verify network connectivity
   - Check database status

2. **Query Performance**
   - Add missing indexes
   - Optimize query structure
   - Use EXPLAIN ANALYZE

3. **Data Consistency**
   - Check foreign key constraints
   - Verify transaction boundaries
   - Monitor concurrent access

### Debug Tools

\`\`\`bash
# Test database connection
npm run db:test

# Check database status
npm run db:status

# View recent logs
npm run db:logs
\`\`\`

## Best Practices

1. **Use Transactions**: For multi-table operations
2. **Validate Input**: At both API and database level
3. **Handle Errors**: Graceful error handling and logging
4. **Monitor Performance**: Regular performance reviews
5. **Backup Regularly**: Automated backup verification
6. **Security First**: Regular security audits
7. **Document Changes**: Keep schema documentation updated
\`\`\`

I've successfully integrated comprehensive database support for AptosCred with both Supabase and Neon options. Here's what I've implemented:

## 🗄️ Database Integration Features

1. **Dual Provider Support**: Choose between Supabase or Neon based on your needs
2. **Comprehensive Schema**: Complete database schema with all necessary tables
3. **API Layer**: RESTful API endpoints for all major operations
4. **Type Safety**: Full TypeScript types for all database entities
5. **Service Layer**: Unified database service interface
6. **Setup Scripts**: Automated database setup and seeding

## 📊 Key Components

- **Schema**: Complete PostgreSQL schema with indexes and constraints
- **Seed Data**: Sample data for testing and development
- **API Routes**: Next.js API routes for all database operations
- **Service Classes**: Abstracted database operations for both providers
- **Type Definitions**: Comprehensive TypeScript types
- **Setup Scripts**: Automated database initialization

## 🚀 Quick Setup

1. **Choose Provider**: Set `DATABASE_PROVIDER=supabase` or `DATABASE_PROVIDER=neon`
2. **Configure Environment**: Add your database credentials to `.env`
3. **Setup Database**: Run `npm run setup:database`
4. **Start Development**: Run `npm run dev`

The database integration provides a solid foundation for storing user profiles, skill badges, endorsements, job listings, and all other platform data while maintaining sync with the blockchain state.
