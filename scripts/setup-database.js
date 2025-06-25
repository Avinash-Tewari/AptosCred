import fs from "fs"
import { createClient } from "@supabase/supabase-js"
import { neon } from "@neondatabase/serverless"

const DATABASE_PROVIDER = process.env.DATABASE_PROVIDER || "supabase"

async function setupSupabase() {
  console.log("🔧 Setting up Supabase database...")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Read and execute schema
    const schema = fs.readFileSync("database/schema.sql", "utf8")
    const { error: schemaError } = await supabase.rpc("exec_sql", { sql: schema })

    if (schemaError) {
      console.error("Schema error:", schemaError)
      throw schemaError
    }

    console.log("✅ Schema created successfully")

    // Read and execute seed data
    const seedData = fs.readFileSync("database/seed-data.sql", "utf8")
    const { error: seedError } = await supabase.rpc("exec_sql", { sql: seedData })

    if (seedError) {
      console.error("Seed error:", seedError)
      throw seedError
    }

    console.log("✅ Seed data inserted successfully")

    // Create RPC function for SQL execution (if not exists)
    const rpcFunction = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$;
    `

    const { error: rpcError } = await supabase.rpc("exec_sql", { sql: rpcFunction })
    if (rpcError) {
      console.warn("RPC function creation warning:", rpcError.message)
    }
  } catch (error) {
    console.error("❌ Supabase setup failed:", error)
    throw error
  }
}

async function setupNeon() {
  console.log("🔧 Setting up Neon database...")

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable")
  }

  const sql = neon(databaseUrl)

  try {
    // Read and execute schema
    const schema = fs.readFileSync("database/schema.sql", "utf8")

    // Split schema into individual statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    console.log(`Executing ${statements.length} schema statements...`)

    for (const statement of statements) {
      try {
        await sql(statement)
      } catch (error) {
        if (!error.message.includes("already exists")) {
          console.error("Statement error:", statement.substring(0, 100) + "...")
          throw error
        }
      }
    }

    console.log("✅ Schema created successfully")

    // Read and execute seed data
    const seedData = fs.readFileSync("database/seed-data.sql", "utf8")
    const seedStatements = seedData
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    console.log(`Executing ${seedStatements.length} seed statements...`)

    for (const statement of seedStatements) {
      try {
        await sql(statement)
      } catch (error) {
        if (!error.message.includes("duplicate key")) {
          console.error("Seed statement error:", statement.substring(0, 100) + "...")
          throw error
        }
      }
    }

    console.log("✅ Seed data inserted successfully")
  } catch (error) {
    console.error("❌ Neon setup failed:", error)
    throw error
  }
}

async function setupDatabase() {
  console.log(`🚀 Setting up AptosCred database with ${DATABASE_PROVIDER}...`)

  try {
    if (DATABASE_PROVIDER === "supabase") {
      await setupSupabase()
    } else if (DATABASE_PROVIDER === "neon") {
      await setupNeon()
    } else {
      throw new Error(`Unsupported database provider: ${DATABASE_PROVIDER}`)
    }

    console.log("🎉 Database setup completed successfully!")
    console.log(`📊 Database provider: ${DATABASE_PROVIDER}`)

    // Test database connection
    console.log("🧪 Testing database connection...")

    if (DATABASE_PROVIDER === "supabase") {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

      const { data, error } = await supabase.from("skill_categories").select("count")
      if (error) throw error

      console.log("✅ Supabase connection test passed")
    } else if (DATABASE_PROVIDER === "neon") {
      const sql = neon(process.env.DATABASE_URL)
      const result = await sql`SELECT COUNT(*) FROM skill_categories`

      console.log("✅ Neon connection test passed")
      console.log(`📈 Found ${result[0].count} skill categories`)
    }
  } catch (error) {
    console.error("💥 Database setup failed:", error)
    process.exit(1)
  }
}

// Run setup
setupDatabase()
