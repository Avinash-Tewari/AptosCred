// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import WalletContextProvider from '@/components/WalletContextProvider'

export const metadata: Metadata = {
  title: 'AptosCred',
  description: 'Decentralized reputation system with Soulbound NFTs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
