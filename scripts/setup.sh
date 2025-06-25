#!/bin/bash

echo "🚀 Setting up AptosCred development environment..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI not found. Please install it first:"
    echo "   Visit: https://aptos.dev/tools/aptos-cli/install-cli/"
    exit 1
fi

echo "✅ Aptos CLI found"

# Check Aptos CLI version
echo "📋 Aptos CLI version:"
aptos --version

# Initialize Aptos configuration if not exists
if [ ! -f ~/.aptos/config.yaml ]; then
    echo "🔧 Initializing Aptos configuration..."
    aptos init --network devnet
else
    echo "✅ Aptos configuration found"
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create contracts directory if not exists
mkdir -p contracts

# Compile Move package
echo "🔨 Compiling Move package..."
cd contracts
if [ ! -f Move.toml ]; then
    echo "❌ Move.toml not found in contracts directory"
    exit 1
fi

aptos move compile
cd ..

echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run deploy:contract' to deploy the smart contract"
echo "2. Run 'npm run verify:deployment' to verify the deployment"
echo "3. Run 'npm run dev' to start the development server"
