import Link from 'next/link'

export default function Home() {
  return (
    <div className="hero-content text-center">
      <div className="star-icon text-4xl text-[var(--accent-purple)] mb-4 animate-pulse">✧</div>
      <h1 className="glitch text-6xl font-bold mb-6 relative inline-block" data-text="GLASSY SHARE">
        GLASSY SHARE
      </h1>
      <p className="subtitle text-xl text-white/70 mb-12 max-w-2xl mx-auto">
        Share your .env variables and secrets securely with our enigma inspired encryption system
      </p>
      <div className="cta-container flex gap-4 justify-center">
        <Link href="/share" className="cta-button primary">
          SHARE SECRET
          <span className="arrow transition-transform duration-300 group-hover:translate-x-1">{'->'}</span>
        </Link>
        <Link href="/unseal" className="cta-button secondary">
          UNSEAL SECRET
        </Link>
      </div>
      <section className="features mt-24">
        <h2 className="text-4xl font-bold mb-12 gradient-text">Key Features</h2>
        <div className="feature-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="feature-card glass-effect p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="feature-icon text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-white/70">Your data is encrypted in the browser before being sent to our servers.</p>
          </div>
          <div className="feature-card glass-effect p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="feature-icon text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold mb-2">Time-Limited Sharing</h3>
            <p className="text-white/70">Set an expiration time for your shared secrets to auto-delete.</p>
          </div>
          <div className="feature-card glass-effect p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="feature-icon text-4xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold mb-2">View Limits</h3>
            <p className="text-white/70">Limit the number of times a secret can be viewed before it&apos;s deleted.</p>
          </div>
          <div className="feature-card glass-effect p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="feature-icon text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Sleek Design</h3>
            <p className="text-white/70">Enjoy our modern, glass-morphism inspired user interface.</p>
          </div>
        </div>
      </section>
    </div>
  )
}