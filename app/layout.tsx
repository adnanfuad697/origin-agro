import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif_Bengali } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Origin Agro — অরিজিন অ্যাগ্রো | Integrated Agro Farm & Eco Resort',
  description:
    'Origin Agro | অরিজিন অ্যাগ্রো — Bangladesh\'s premier Shariah-compliant integrated agro-tourism and livestock platform. Smart investment, eco resort, organic agriculture & certified cattle farm. বাংলাদেশের শীর্ষ হালাল কৃষি বিনিয়োগ প্ল্যাটফর্ম।',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0A5C36',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSerifBengali.variable} bg-background`}>
      <body className="antialiased font-sans">{children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
