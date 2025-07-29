import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fermion Live Streaming - Educational Platform',
  description: 'Professional live streaming platform for education with WebRTC and HLS technology',
  authors: [{ name: 'Fermion Assignment' }],
  keywords: ['live streaming', 'education', 'webrtc', 'hls', 'fermion'],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}