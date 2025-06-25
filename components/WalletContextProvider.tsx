'use client'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { PetraWallet } from 'petra-plugin-wallet-adapter'
import React from 'react'

export default function WalletContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const wallets = [new PetraWallet()]

  return (
    <AptosWalletAdapterProvider wallets={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  )
}
