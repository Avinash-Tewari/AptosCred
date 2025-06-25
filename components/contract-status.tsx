"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from "lucide-react"
import { aptosClient, APTOSCRED_MODULE_ADDRESS, CURRENT_NETWORK } from "@/lib/aptos-client"

interface ContractStatus {
  isDeployed: boolean
  address: string
  totalJobs: number
  moduleCount: number
  lastChecked: Date
  error?: string
}

export function ContractStatus() {
  const [status, setStatus] = useState<ContractStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkContractStatus = async () => {
    setLoading(true)
    try {
      // Check if account exists
      const accountInfo = await aptosClient.getAccount(APTOSCRED_MODULE_ADDRESS)

      // Check modules
      const modules = await aptosClient.getAccountModules(APTOSCRED_MODULE_ADDRESS)
      const hasOurModule = modules.some((m) => m.abi.name === "soulbound_nft")

      if (!hasOurModule) {
        throw new Error("AptosCred module not found")
      }

      // Get total jobs
      let totalJobs = 0
      try {
        const result = await aptosClient.view({
          function: `${APTOSCRED_MODULE_ADDRESS}::soulbound_nft::get_total_jobs`,
          type_arguments: [],
          arguments: [],
        })
        totalJobs = Number.parseInt(result[0] as string)
      } catch (error) {
        console.warn("Could not fetch total jobs:", error)
      }

      setStatus({
        isDeployed: true,
        address: APTOSCRED_MODULE_ADDRESS,
        totalJobs,
        moduleCount: modules.length,
        lastChecked: new Date(),
      })
    } catch (error) {
      setStatus({
        isDeployed: false,
        address: APTOSCRED_MODULE_ADDRESS,
        totalJobs: 0,
        moduleCount: 0,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkContractStatus()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Clock className="w-6 h-6 animate-spin mr-2" />
            <span>Checking contract status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Smart Contract Status</span>
          <Button variant="outline" size="sm" onClick={checkContractStatus}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>AptosCred smart contract deployment status on {CURRENT_NETWORK}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Deployment Status</span>
          <div className="flex items-center space-x-2">
            {status?.isDeployed ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <Badge className="bg-green-100 text-green-800">Deployed</Badge>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <Badge variant="destructive">Not Deployed</Badge>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Contract Address</span>
          <div className="flex items-center space-x-2">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {status?.address.slice(0, 8)}...{status?.address.slice(-6)}
            </code>
            <Button variant="ghost" size="sm" asChild>
              <a
                href={`https://explorer.aptoslabs.com/account/${status?.address}?network=${CURRENT_NETWORK}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>

        {status?.isDeployed && (
          <>
            <div className="flex items-center justify-between">
              <span className="font-medium">Deployed Modules</span>
              <Badge variant="outline">{status.moduleCount}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Total Jobs</span>
              <Badge variant="outline">{status.totalJobs}</Badge>
            </div>
          </>
        )}

        {status?.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {status.error}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500">Last checked: {status?.lastChecked.toLocaleString()}</div>

        {!status?.isDeployed && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Deploy Contract</h4>
            <p className="text-sm text-blue-800 mb-3">
              The AptosCred smart contract needs to be deployed before you can use the platform.
            </p>
            <div className="space-y-2 text-sm text-blue-800">
              <p>
                1. Install Aptos CLI: <code>curl -fsSL https://aptos.dev/scripts/install_cli.py | python3</code>
              </p>
              <p>
                2. Run deployment script: <code>npm run deploy:contract</code>
              </p>
              <p>
                3. Verify deployment: <code>npm run verify:deployment</code>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
