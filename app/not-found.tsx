import Link from 'next/link'
import { Terminal } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-mono grid-bg">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold gradient-text mb-4">404</div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Terminal size={16} className="text-cyan" />
          <p className="text-text-secondary text-sm">Page not found</p>
        </div>
        <p className="text-text-muted text-xs mb-8 font-body leading-relaxed">
          The route you're looking for doesn't exist or has been moved.
        </p>
        <div className="bg-surface border border-border rounded-lg p-4 text-left text-xs mb-8">
          <p className="text-text-muted"><span className="text-red">✗</span> Error: ENOENT: no such file or directory</p>
          <p className="text-text-muted pl-4">at path <span className="text-amber">'/{'{'}requested_path{'}'}'</span></p>
          <p className="text-cyan mt-2">$ cd ~</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-sm bg-cyan text-bg font-bold px-6 py-3 rounded hover:bg-cyan/90 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
