import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Noto_Serif_Bengali } from 'next/font/google'
import { LanguageProvider } from '@/contexts/language-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Origin Agro — অরিজিন অ্যাগ্রো | Integrated Agro Farm & Musharakah Investment',
  description:
    "Origin Agro | অরিজিন অ্যাগ্রো — Bangladesh's Shariah-guided integrated agro-investment platform. Musharakah partnership investment, organic agriculture & livestock farming. বাংলাদেশের শরিয়াহ-নির্দেশিত কৃষি বিনিয়োগ প্ল্যাটফর্ম।",
  metadataBase: new URL('https://originagrobd.com'),
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/icon-light-32x32.png'],
  },
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
      <body className="antialiased font-sans">
        <LanguageProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
