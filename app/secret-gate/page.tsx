'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal } from 'lucide-react'

const BOOT_LINES = [
  '> Initializing secure terminal...',
  '> Loading kernel modules...',
  '> Mounting encrypted filesystem...',
  '> Authentication required.',
]

export default function SecretGatePage() {
  const [phase, setPhase] = useState<'boot' | 'auth' | 'error'>('boot')
  const [bootIdx, setBootIdx] = useState(0)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Boot animation
  useEffect(() => {
    if (phase !== 'boot') return
    if (bootIdx < BOOT_LINES.length) {
      const t = setTimeout(() => setBootIdx(i => i + 1), 500)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { setPhase('auth'); setTimeout(() => inputRef.current?.focus(), 100) }, 400)
      return () => clearTimeout(t)
    }
  }, [phase, bootIdx])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        setPhase('boot')
        setBootIdx(0)
        // Override boot lines for success
        setTimeout(() => router.push('/admin'), 1200)
      } else {
        setAttempts(a => a + 1)
        setPhase('error')
        setPassword('')
        setTimeout(() => { setPhase('auth'); inputRef.current?.focus() }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-mono">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Terminal window */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-2 border-b border-border">
            <span className="w-3 h-3 rounded-full bg-red/60" />
            <span className="w-3 h-3 rounded-full bg-amber/60" />
            <span className="w-3 h-3 rounded-full bg-green/60" />
            <div className="flex-1 text-center">
              <span className="text-xs text-text-muted flex items-center justify-center gap-1.5">
                <Terminal size={11} />
                secure-shell — 80×24
              </span>
            </div>
          </div>

          {/* Terminal body */}
          <div className="p-6 min-h-[260px] text-sm">
            {/* Boot lines */}
            <div className="space-y-1 mb-4">
              {BOOT_LINES.slice(0, bootIdx).map((line, i) => (
                <p key={i} className={`text-xs ${i === BOOT_LINES.length - 1 ? 'text-amber' : 'text-text-muted'}`}>
                  {line}
                </p>
              ))}
            </div>

            {/* Auth prompt */}
            {phase === 'auth' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <p className="text-cyan text-xs mb-3">
                    {attempts > 0
                      ? `Access denied. ${attempts} failed attempt${attempts > 1 ? 's' : ''}. Try again:`
                      : 'Enter admin passphrase:'}
                  </p>
                  <div className="flex items-center gap-2 bg-bg border border-border rounded px-3 py-2">
                    <span className="text-cyan text-xs">$</span>
                    <input
                      ref={inputRef}
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="flex-1 bg-transparent text-text-primary text-sm outline-none tracking-widest placeholder-text-muted"
                      placeholder="••••••••••••"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {loading && <span className="w-3 h-3 border border-cyan/30 border-t-cyan rounded-full animate-spin" />}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full text-xs bg-cyan/10 border border-cyan/30 text-cyan py-2 rounded hover:bg-cyan/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Authenticating...' : 'Authenticate →'}
                </button>
              </form>
            )}

            {/* Error state */}
            {phase === 'error' && (
              <div className="space-y-1">
                <p className="text-red text-xs">✗ Authentication failed.</p>
                <p className="text-text-muted text-xs">Redirecting...</p>
              </div>
            )}

            {/* Blinking cursor when idle */}
            {phase === 'boot' && bootIdx < BOOT_LINES.length && (
              <span className="inline-block w-2 h-4 bg-cyan animate-blink" />
            )}
          </div>
        </div>

        {/* Hint text — so subtle you'd miss it */}
        <p className="text-center text-[10px] text-text-muted/30 mt-4">
          This page does not exist.
        </p>
      </div>
    </div>
  )
}
