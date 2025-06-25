import { AptosClient } from "aptos"
import fs from "fs"

const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1"
const client = new AptosClient(NODE_URL)

async function verifyDeployment() {
  console.log("🔍 Verifying AptosCred contract deployment...")

  try {
    // Load deployment info
    if (!fs.existsSync("deployment-info.json")) {
      throw new Error("Deployment info not found. Please deploy the contract first.")
    }

    const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"))
    const contractAddress = deploymentInfo.contractAddress

    console.log(`📍 Verifying contract at: ${contractAddress}`)

    // Check if account exists
    try {
      const accountInfo = await client.getAccount(contractAddress)
      console.log("✅ Account exists")
      console.log(`   Sequence Number: ${accountInfo.sequence_number}`)
    } catch (error) {
      console.error("❌ Account not found")
      return false
    }

    // Check deployed modules
    try {
      const modules = await client.getAccountModules(contractAddress)
      console.log(`✅ Found ${modules.length} deployed modules:`)

      modules.forEach((module, index) => {
        console.log(`   ${index + 1}. ${module.abi.name}`)
      })

      // Check for our specific module
      const soulboundNftModule = modules.find((m) => m.abi.name === "soulbound_nft")
      if (soulboundNftModule) {
        console.log("✅ soulbound_nft module found")
        console.log(`   Functions: ${soulboundNftModule.abi.exposed_functions.length}`)
        console.log(`   Structs: ${soulboundNftModule.abi.structs.length}`)
      } else {
        console.error("❌ soulbound_nft module not found")
        return false
      }
    } catch (error) {
      console.error("❌ Failed to fetch modules:", error.message)
      return false
    }

    // Check contract resources
    try {
      const resources = await client.getAccountResources(contractAddress)
      console.log(`✅ Found ${resources.length} resources`)

      // Check for JobBoard resource
      const jobBoardResource = resources.find((r) => r.type.includes("JobBoard"))

      if (jobBoardResource) {
        console.log("✅ JobBoard resource initialized")
        console.log(`   Total Jobs: ${jobBoardResource.data.total_jobs}`)
        console.log(`   Next Job ID: ${jobBoardResource.data.next_job_id}`)
      }

      // Check for GlobalEvents resource
      const eventsResource = resources.find((r) => r.type.includes("GlobalEvents"))

      if (eventsResource) {
        console.log("✅ GlobalEvents resource initialized")
      }
    } catch (error) {
      console.error("❌ Failed to fetch resources:", error.message)
    }

    // Test view functions
    console.log("\n🧪 Testing view functions...")

    try {
      // Test get_total_jobs
      const totalJobs = await client.view({
        function: `${contractAddress}::soulbound_nft::get_total_jobs`,
        type_arguments: [],
        arguments: [],
      })
      console.log(`✅ get_total_jobs(): ${totalJobs[0]}`)

      // Test get_user_reputation with a dummy address
      const dummyAddress = "0x1"
      const reputation = await client.view({
        function: `${contractAddress}::soulbound_nft::get_user_reputation`,
        type_arguments: [],
        arguments: [dummyAddress],
      })
      console.log(`✅ get_user_reputation(${dummyAddress}): ${reputation[0]}`)
    } catch (error) {
      console.error("❌ View function test failed:", error.message)
    }

    console.log("\n🎉 Contract verification completed!")
    console.log(`🔗 View on Explorer: https://explorer.aptoslabs.com/account/${contractAddress}?network=devnet`)

    return true
  } catch (error) {
    console.error("💥 Verification failed:", error)
    return false
  }
}

// Run verification
verifyDeployment().catch(console.error)
