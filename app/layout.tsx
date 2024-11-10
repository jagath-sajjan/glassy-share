import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Glassy Share - Secure Secret Sharing',
  description: 'Share your .env variables and secrets securely with a glassy touch',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="f13CGsQcX7QJlhmEZedh6snS20SgOET0QgtPwd0wtI0" />
      </head>
      <body>
        <div className="min-h-screen relative overflow-hidden flex flex-col">
          <div className="gradient-sphere top-[20%] right-[10%]"></div>
          <div className="gradient-sphere secondary top-[60%] left-[5%]"></div>
          <div className="grid-background"></div>
          <div className="relative z-10 flex-grow">
            <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(15,22,36,0.8)] backdrop-blur-md border-b border-[var(--glass-border)]">
              <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wider text-white relative overflow-hidden group">
                  GLASSY SHARE
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent-purple)] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
                </Link>
                <div className="hidden md:flex gap-8">
                  <Link href="/" className="text-white text-sm tracking-wide hover:text-[var(--accent-purple)] transition-colors">Home</Link>
                  <Link href="/share" className="text-white text-sm tracking-wide hover:text-[var(--accent-purple)] transition-colors">Share</Link>
                  <Link href="/unseal" className="text-white text-sm tracking-wide hover:text-[var(--accent-purple)] transition-colors">Unseal</Link>
                </div>
              </nav>
            </header>
            <main className="pt-24 px-6 max-w-4xl mx-auto flex-grow">
              {children}
            </main>
            <footer className="relative z-10 text-center py-6 text-white/60 text-sm">
              <p>&copy; 2024 Glassy Share. All rights reserved.</p>
              <p className="mt-2">Secure. Private. Ephemeral.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  )
}