// drizzle/schema.ts
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  decimal,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';

// Users
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: text('wallet_address').unique().notNull(),
  username: text('username').unique(),
  email: text('email').unique(),
  fullName: text('full_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  profileMetadataIpfs: text('profile_metadata_ipfs'),
  reputationScore: integer('reputation_score').default(100),
  totalEarnings: decimal('total_earnings', { precision: 20, scale: 8 }).default('0'),
  jobsCompleted: integer('jobs_completed').default(0),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Skill categories
export const skillCategories = pgTable('skill_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Skills
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => skillCategories.id, { onDelete: 'cascade' }),
  name: text('name').notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Skill Badges
export const skillBadges = pgTable('skill_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  skillId: uuid('skill_id').references(() => skills.id, { onDelete: 'cascade' }),
  level: text('level').notNull(),
  verificationType: text('verification_type').notNull(),
  verificationData: jsonb('verification_data'),
  nftTokenId: text('nft_token_id'),
  metadataIpfs: text('metadata_ipfs'),
  transactionHash: text('transaction_hash'),
  isVerified: boolean('is_verified').default(false),
  endorsementCount: integer('endorsement_count').default(0),
  issuedAt: timestamp('issued_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

