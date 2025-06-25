import { AptosClient, AptosAccount, FaucetClient } from "aptos"
import { execSync } from "child_process"
import fs from "fs"

// Configuration
const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1"
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com"

const client = new AptosClient(NODE_URL)
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)

async function deployContract() {
  console.log("🚀 Starting AptosCred contract deployment to Aptos devnet...")

  try {
    // Step 1: Create or load deployer account
    let deployerAccount
    const accountFile = "deployer-account.json"

    if (fs.existsSync(accountFile)) {
      console.log("📁 Loading existing deployer account...")
      const accountData = JSON.parse(fs.readFileSync(accountFile, "utf8"))
      deployerAccount = AptosAccount.fromAptosAccountObject(accountData)
    } else {
      console.log("🔑 Creating new deployer account...")
      deployerAccount = new AptosAccount()

      // Save account for future use
      fs.writeFileSync(accountFile, JSON.stringify(deployerAccount.toPrivateKeyObject()))
      console.log(`💾 Deployer account saved to ${accountFile}`)
    }

    const deployerAddress = deployerAccount.address().hex()
    console.log(`👤 Deployer address: ${deployerAddress}`)

    // Step 2: Fund the account
    console.log("💰 Funding deployer account from faucet...")
    try {
      await faucetClient.fundAccount(deployerAccount.address(), 100_000_000) // 1 APT
      console.log("✅ Account funded successfully")
    } catch (error) {
      console.log("⚠️  Faucet funding failed, account might already be funded")
    }

    // Check balance
    const balance = await client.getAccountBalance(deployerAddress)
    console.log(`💳 Current balance: ${balance} APT`)

    if (balance < 1000000) {
      // Less than 0.01 APT
      throw new Error("Insufficient balance for deployment")
    }

    // Step 3: Compile the Move package
    console.log("🔨 Compiling Move package...")

    // Update Move.toml with deployer address
    const moveTomlPath = "contracts/Move.toml"
    let moveTomlContent = fs.readFileSync(moveTomlPath, "utf8")
    moveTomlContent = moveTomlContent.replace('aptoscred = "_"', `aptoscred = "${deployerAddress}"`)
    fs.writeFileSync(moveTomlPath, moveTomlContent)

    try {
      execSync("aptos move compile --package-dir contracts", { stdio: "inherit" })
      console.log("✅ Move package compiled successfully")
    } catch (error) {
      console.error("❌ Compilation failed:", error.message)
      throw error
    }

    // Step 4: Deploy the contract
    console.log("📦 Deploying contract to Aptos devnet...")

    try {
      const deployResult = execSync(
        `aptos move publish --package-dir contracts --private-key ${deployerAccount.privateKey.hex()} --url ${NODE_URL} --assume-yes`,
        { encoding: "utf8" },
      )

      console.log("✅ Contract deployed successfully!")
      console.log("📋 Deploy result:", deployResult)
    } catch (error) {
      console.error("❌ Deployment failed:", error.message)
      throw error
    }

    // Step 5: Initialize the contract
    console.log("🔧 Initializing contract...")

    try {
      // The init_module function is called automatically during deployment
      // But we can verify the deployment by checking if resources exist

      await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait for transaction to be processed

      // Check if JobBoard resource exists
      try {
        const jobBoardResource = await client.getAccountResource(
          deployerAddress,
          `${deployerAddress}::soulbound_nft::JobBoard`,
        )
        console.log("✅ Contract initialized successfully - JobBoard resource found")
      } catch (resourceError) {
        console.log("⚠️  JobBoard resource not found, contract might need manual initialization")
      }
    } catch (error) {
      console.error("❌ Contract initialization failed:", error.message)
    }

    // Step 6: Save deployment info
    const deploymentInfo = {
      contractAddress: deployerAddress,
      deployerAddress: deployerAddress,
      network: "devnet",
      nodeUrl: NODE_URL,
      deployedAt: new Date().toISOString(),
      moduleNames: ["soulbound_nft"],
    }

    fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2))
    console.log("💾 Deployment info saved to deployment-info.json")

    // Step 7: Update client configuration
    console.log("🔄 Updating client configuration...")
    updateClientConfig(deployerAddress)

    console.log("\n🎉 Deployment completed successfully!")
    console.log(`📍 Contract Address: ${deployerAddress}`)
    console.log(`🌐 Network: Aptos Devnet`)
    console.log(`🔗 Explorer: https://explorer.aptoslabs.com/account/${deployerAddress}?network=devnet`)

    return deploymentInfo
  } catch (error) {
    console.error("💥 Deployment failed:", error)
    process.exit(1)
  }
}

function updateClientConfig(contractAddress) {
  const clientConfigPath = "lib/aptos-client.ts"

  if (fs.existsSync(clientConfigPath)) {
    let clientConfig = fs.readFileSync(clientConfigPath, "utf8")

    // Update the contract address
    clientConfig = clientConfig.replace(
      'export const APTOSCRED_MODULE_ADDRESS = "0x1"',
      `export const APTOSCRED_MODULE_ADDRESS = "${contractAddress}"`,
    )

    fs.writeFileSync(clientConfigPath, clientConfig)
    console.log("✅ Client configuration updated")
  }
}

// Run deployment
deployContract().catch(console.error)
