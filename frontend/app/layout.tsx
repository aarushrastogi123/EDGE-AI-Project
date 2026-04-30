import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EdgeVisionNet — Live Energy Intelligence Platform',
  description: 'Real-time edge AI inference with live device telemetry, energy analytics, and cloud comparison.',
  keywords: ['edge AI', 'energy intelligence', 'telemetry', 'machine learning', 'IoT'],
  authors: [{ name: 'EdgeVisionNet Team' }],
  icons: { icon: '/favicon.ico' },
}

export const viewport = {
  themeColor: '#0A0F1E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy text-slate-200 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
