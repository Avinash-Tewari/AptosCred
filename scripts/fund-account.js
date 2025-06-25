import { AptosClient, FaucetClient } from "aptos"

const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1"
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com"

const client = new AptosClient(NODE_URL)
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)

async function fundAccount(address, amount = 100_000_000) {
  console.log(`💰 Funding account ${address} with ${amount / 100_000_000} APT...`)

  try {
    await faucetClient.fundAccount(address, amount)

    // Wait a bit for the transaction to be processed
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const balance = await client.getAccountBalance(address)
    console.log(`✅ Account funded successfully! New balance: ${balance / 100_000_000} APT`)

    return balance
  } catch (error) {
    console.error("❌ Failed to fund account:", error.message)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log("Usage: node fund-account.js <address> [amount_in_apt]")
    console.log("Example: node fund-account.js 0x123... 1.5")
    process.exit(1)
  }

  const address = args[0]
  const amountInApt = args[1] ? Number.parseFloat(args[1]) : 1.0
  const amountInOctas = Math.floor(amountInApt * 100_000_000)

  await fundAccount(address, amountInOctas)
}

main().catch(console.error)
