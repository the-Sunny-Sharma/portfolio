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

export const metadata: Metadata = {
  title: 'Sunny Sharma — Full-Stack Developer',
  description:
    'Full-Stack Developer specializing in Java (Spring Boot, Microservices) and JavaScript (MERN/Next.js). Building scalable, high-performance systems. Open to Java Backend & Full-Stack roles.',
  keywords: [
    'Sunny Sharma',
    'Full Stack Developer',
    'Java Developer',
    'Spring Boot',
    'MERN Stack',
    'Next.js',
    'React',
    'Mumbai Developer',
    'Backend Developer',
  ],
  authors: [{ name: 'Sunny Sharma', url: 'https://sunnysharma.vercel.app' }],
  creator: 'Sunny Sharma',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sunnysharma.vercel.app',
    title: 'Sunny Sharma — Full-Stack Developer',
    description:
      'Full-Stack Developer specializing in Java (Spring Boot) and MERN/Next.js. Building scalable systems.',
    siteName: 'Sunny Sharma Portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sunny Sharma — Full-Stack Developer',
    description: 'Full-Stack Developer | Spring Boot | MERN | Next.js',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://sunnysharma.vercel.app'),
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
