import { AptosClient, AptosAccount, FaucetClient } from "aptos"
// import fs from "fs"

// Aptos client configuration
const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1"
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com"

export const aptosClient = new AptosClient(NODE_URL)
export const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)

// Load contract address from deployment info
let APTOSCRED_MODULE_ADDRESS = "0x1" // Default fallback

try {
  if (typeof window === "undefined" && fs.existsSync("deployment-info.json")) {
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment-info.json", "utf8"))
    APTOSCRED_MODULE_ADDRESS = deploymentInfo.contractAddress
  }
} catch (error) {
  console.warn("Could not load deployment info, using default address")
}

export { APTOSCRED_MODULE_ADDRESS }

// Environment-specific configuration
export const NETWORK_CONFIG = {
  devnet: {
    nodeUrl: "https://fullnode.devnet.aptoslabs.com/v1",
    faucetUrl: "https://faucet.devnet.aptoslabs.com",
    explorerUrl: "https://explorer.aptoslabs.com",
  },
  testnet: {
    nodeUrl: "https://fullnode.testnet.aptoslabs.com/v1",
    faucetUrl: "https://faucet.testnet.aptoslabs.com",
    explorerUrl: "https://explorer.aptoslabs.com",
  },
  mainnet: {
    nodeUrl: "https://fullnode.mainnet.aptoslabs.com/v1",
    faucetUrl: null,
    explorerUrl: "https://explorer.aptoslabs.com",
  },
}

export const CURRENT_NETWORK = "devnet"

// Wallet connection utilities
export class AptosWalletAdapter {
  private account: AptosAccount | null = null

  async connect(): Promise<string> {
    // In a real implementation, this would connect to Petra, Martian, or other wallets
    // For demo purposes, we'll create a new account
    this.account = new AptosAccount()

    // Fund the account from faucet (devnet only)
    await faucetClient.fundAccount(this.account.address(), 100_000_000)

    return this.account.address().hex()
  }

  async disconnect(): Promise<void> {
    this.account = null
  }

  getAccount(): AptosAccount | null {
    return this.account
  }

  isConnected(): boolean {
    return this.account !== null
  }
}

// Smart contract interaction functions
export class AptosCred {
  private client: AptosClient
  private moduleAddress: string

  constructor(client: AptosClient, moduleAddress: string) {
    this.client = client
    this.moduleAddress = moduleAddress
  }

  // Initialize user profile
  async initializeProfile(account: AptosAccount, profileMetadata: string): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::soulbound_nft::initialize_profile`,
      type_arguments: [],
      arguments: [profileMetadata],
    }

    const txnRequest = await this.client.generateTransaction(account.address(), payload)
    const signedTxn = await this.client.signTransaction(account, txnRequest)
    const transactionRes = await this.client.submitTransaction(signedTxn)
    await this.client.waitForTransaction(transactionRes.hash)

    return transactionRes.hash
  }

  // Verify a skill
  async verifySkill(
    account: AptosAccount,
    skillName: string,
    level: string,
    verificationType: number,
    verificationData: string,
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::soulbound_nft::verify_skill`,
      type_arguments: [],
      arguments: [skillName, level, verificationType, verificationData],
    }

    const txnRequest = await this.client.generateTransaction(account.address(), payload)
    const signedTxn = await this.client.signTransaction(account, txnRequest)
    const transactionRes = await this.client.submitTransaction(signedTxn)
    await this.client.waitForTransaction(transactionRes.hash)

    return transactionRes.hash
  }

  // Endorse a skill
  async endorseSkill(account: AptosAccount, endorsedUser: string, skillName: string, message: string): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::soulbound_nft::endorse_skill`,
      type_arguments: [],
      arguments: [endorsedUser, skillName, message],
    }

    const txnRequest = await this.client.generateTransaction(account.address(), payload)
    const signedTxn = await this.client.signTransaction(account, txnRequest)
    const transactionRes = await this.client.submitTransaction(signedTxn)
    await this.client.waitForTransaction(transactionRes.hash)

    return transactionRes.hash
  }

  // Create a job
  async createJob(
    account: AptosAccount,
    title: string,
    description: string,
    requiredSkills: string[],
    minReputation: number,
    paymentAmount: number,
    deadline: number,
  ): Promise<string> {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::soulbound_nft::create_job`,
      type_arguments: [],
      arguments: [title, description, requiredSkills, minReputation, paymentAmount, deadline],
    }

    const txnRequest = await this.client.generateTransaction(account.address(), payload)
    const signedTxn = await this.client.signTransaction(account, txnRequest)
    const transactionRes = await this.client.submitTransaction(signedTxn)
    await this.client.waitForTransaction(transactionRes.hash)

    return transactionRes.hash
  }

  // Get user reputation
  async getUserReputation(userAddress: string): Promise<number> {
    try {
      const resource = await this.client.view({
        function: `${this.moduleAddress}::soulbound_nft::get_user_reputation`,
        type_arguments: [],
        arguments: [userAddress],
      })
      return Number.parseInt(resource[0] as string)
    } catch (error) {
      console.error("Error fetching user reputation:", error)
      return 0
    }
  }

  // Get skill badge count
  async getSkillBadgeCount(userAddress: string): Promise<number> {
    try {
      const resource = await this.client.view({
        function: `${this.moduleAddress}::soulbound_nft::get_skill_badge_count`,
        type_arguments: [],
        arguments: [userAddress],
      })
      return Number.parseInt(resource[0] as string)
    } catch (error) {
      console.error("Error fetching skill badge count:", error)
      return 0
    }
  }
}

// IPFS utilities for storing metadata
export class IPFSClient {
  private apiUrl: string

  constructor(apiUrl = "https://api.pinata.cloud") {
    this.apiUrl = apiUrl
  }

  async uploadJSON(data: any): Promise<string> {
    // In a real implementation, this would upload to IPFS via Pinata or similar
    // For demo purposes, we'll return a mock IPFS hash
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
    console.log("Mock IPFS upload:", { data, hash: mockHash })
    return mockHash
  }

  async uploadFile(file: File): Promise<string> {
    // Mock file upload to IPFS
    const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}`
    console.log("Mock IPFS file upload:", { fileName: file.name, hash: mockHash })
    return mockHash
  }

  getIPFSUrl(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`
  }
}

// Initialize clients
export const walletAdapter = new AptosWalletAdapter()
export const aptosCred = new AptosCred(aptosClient, APTOSCRED_MODULE_ADDRESS)
export const ipfsClient = new IPFSClient()
