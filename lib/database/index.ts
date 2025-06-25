// Database abstraction layer - choose between Supabase or Neon

import { db as supabaseDb } from "./supabase"
import { neonDb } from "./neon"

// Environment variable to choose database provider
const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || "supabase" // 'supabase' | 'neon'

// Export the appropriate database service
export const db = DATABASE_PROVIDER === "neon" ? neonDb : supabaseDb

// Re-export types
export * from "./types"

// Database configuration
export const DATABASE_CONFIG = {
  provider: DATABASE_PROVIDER,
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  neon: {
    databaseUrl: process.env.DATABASE_URL,
  },
}

// Utility functions
export const getDatabaseProvider = () => DATABASE_PROVIDER

export const isDatabaseConfigured = () => {
  if (DATABASE_PROVIDER === "supabase") {
    return !!(DATABASE_CONFIG.supabase.url && DATABASE_CONFIG.supabase.anonKey)
  } else if (DATABASE_PROVIDER === "neon") {
    return !!DATABASE_CONFIG.neon.databaseUrl
  }
  return false
}
