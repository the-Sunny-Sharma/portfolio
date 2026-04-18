import { Github, Linkedin, Mail, Terminal } from 'lucide-react'

type Profile = { name: string; github: string; linkedin: string; email: string }

export default function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-bg py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan" />
            <span className="font-mono text-sm text-text-secondary">
              <span className="text-cyan">sunny</span>.dev
            </span>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[
              { href: profile.github, icon: Github },
              { href: profile.linkedin, icon: Linkedin },
              { href: `mailto:${profile.email}`, icon: Mail },
            ].map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-cyan transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-mono text-xs text-text-muted">
            © {year} {profile.name} · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
