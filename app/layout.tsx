import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, DM_Sans } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const SITE_URL = 'https://the-sunny-sharma.vercel.app'

export const metadata: Metadata = {
  title: 'Sunny Sharma — Full-Stack Engineer · AI Products',
  description:
    'Full-stack engineer building AI-powered products with React, Python/FastAPI and Java/Spring Boot. Full-Stack Developer Intern at Namaah Pvt. Ltd., where I built the Slate review workspace and the Storyboard Studio for Atlas, an AI film-production platform. Open to full-time roles from Dec 2026.',
  keywords: [
    'Sunny Sharma',
    'Full Stack Developer',
    'AI Product Engineer',
    'FastAPI',
    'Python Developer',
    'React',
    'Next.js',
    'PostgreSQL',
    'Spring Boot',
    'Java Developer',
    'Generative AI',
    'Mumbai Developer',
  ],
  authors: [{ name: 'Sunny Sharma', url: SITE_URL }],
  creator: 'Sunny Sharma',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    title: 'Sunny Sharma — Full-Stack Engineer · AI Products',
    description:
      'Full-stack engineer building AI-powered products end to end with React, FastAPI and Spring Boot. Currently building Atlas, an AI film-production platform, at Namaah.',
    siteName: 'Sunny Sharma Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunny Sharma — Full-Stack Engineer · AI Products',
    description: 'Full-Stack Engineer | React · FastAPI · Spring Boot | Building AI film tools at Namaah',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(SITE_URL),
}

export const viewport: Viewport = {
  themeColor: '#060A12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-bg text-text-primary font-body antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0C1120',
              color: '#E8F4F8',
              border: '1px solid #1E2D45',
              fontFamily: 'var(--font-dm-sans)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
