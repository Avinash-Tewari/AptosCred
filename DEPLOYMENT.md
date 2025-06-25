# AptosCred Smart Contract Deployment Guide

This guide will help you deploy the AptosCred smart contract to Aptos devnet.

## Prerequisites

1. **Install Aptos CLI**
   \`\`\`bash
   curl -fsSL https://aptos.dev/scripts/install_cli.py | python3
   \`\`\`

2. **Verify Installation**
   \`\`\`bash
   aptos --version
   \`\`\`

3. **Install Node.js Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

## Deployment Steps

### 1. Initialize Aptos Configuration

\`\`\`bash
aptos init --network devnet
\`\`\`

This will create a new account and save the configuration to `~/.aptos/config.yaml`.

### 2. Run Setup Script

\`\`\`bash
chmod +x scripts/setup.sh
./scripts/setup.sh
\`\`\`

### 3. Deploy the Contract

\`\`\`bash
npm run deploy:contract
\`\`\`

This script will:
- Create or load a deployer account
- Fund the account from the devnet faucet
- Compile the Move package
- Deploy the contract to Aptos devnet
- Initialize the contract resources
- Update the client configuration with the deployed address

### 4. Verify Deployment

\`\`\`bash
npm run verify:deployment
\`\`\`

This will check:
- Account existence
- Deployed modules
- Contract resources
- View function functionality

## Manual Deployment (Alternative)

If the automated script fails, you can deploy manually:

### 1. Compile the Package

\`\`\`bash
cd contracts
aptos move compile
\`\`\`

### 2. Deploy to Devnet

\`\`\`bash
aptos move publish --assume-yes
\`\`\`

### 3. Update Configuration

Update the `APTOSCRED_MODULE_ADDRESS` in `lib/aptos-client.ts` with your deployed address.

## Deployment Configuration

The deployment uses the following configuration:

- **Network**: Aptos Devnet
- **Node URL**: `https://fullnode.devnet.aptoslabs.com/v1`
- **Faucet URL**: `https://faucet.devnet.aptoslabs.com`
- **Explorer**: `https://explorer.aptoslabs.com`

## Post-Deployment

After successful deployment:

1. **Save Important Information**
   - Contract address is saved in `deployment-info.json`
   - Deployer account is saved in `deployer-account.json`
   - Keep these files secure and backed up

2. **Test the Contract**
   \`\`\`bash
   npm run test:contract
   \`\`\`

3. **Start the Frontend**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **View on Explorer**
   Visit: `https://explorer.aptoslabs.com/account/YOUR_CONTRACT_ADDRESS?network=devnet`

## Troubleshooting

### Common Issues

1. **Insufficient Balance**
   \`\`\`bash
   node scripts/fund-account.js YOUR_ADDRESS 2.0
   \`\`\`

2. **Compilation Errors**
   - Check Move.toml configuration
   - Ensure all dependencies are correct
   - Verify Move syntax

3. **Deployment Failures**
   - Check account balance
   - Verify network connectivity
   - Ensure unique module names

4. **Resource Not Found**
   - Contract might not be initialized
   - Check if init_module was called
   - Verify resource types

### Getting Help

- Check the Aptos documentation: https://aptos.dev
- Join the Aptos Discord: https://discord.gg/aptoslabs
- Review transaction details on the explorer

## Environment Variables

For production deployment, consider setting:

\`\`\`bash
export APTOS_NETWORK=devnet
export APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1
export APTOS_FAUCET_URL=https://faucet.devnet.aptoslabs.com
\`\`\`

## Security Notes

- Never commit private keys to version control
- Use environment variables for sensitive data
- Keep deployer account secure
- Regularly backup important files

## Next Steps

After deployment:
1. Test all contract functions
2. Set up monitoring and alerts
3. Prepare for testnet/mainnet deployment
4. Implement proper key management
5. Set up CI/CD for automated deployments
