'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Terminal } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ profile }: { profile: { name: string; resumeUrl: string; openToWork: boolean } }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.querySelector(l.href))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach(s => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/90 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Terminal size={18} className="text-cyan group-hover:animate-pulse" />
          <span className="font-mono text-sm text-text-primary">
            <span className="text-cyan">sunny</span>
            <span className="text-text-secondary">@dev</span>
            <span className="text-amber animate-blink">_</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link font-mono text-xs tracking-wider transition-colors duration-200 ${
                  active === link.href ? 'text-cyan active' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {profile.openToWork && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-green bg-green/10 border border-green/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
              Open to work
            </span>
          )}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs border border-cyan/40 text-cyan hover:bg-cyan/10 px-4 py-2 rounded transition-all duration-200"
          >
            Resume.pdf
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text-secondary hover:text-cyan transition-colors p-1"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface border-b border-border mobile-menu-enter">
          <ul className="px-6 py-4 space-y-4">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block font-mono text-sm text-text-secondary hover:text-cyan transition-colors terminal-line"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-border flex flex-col gap-3">
              {profile.openToWork && (
                <span className="flex items-center gap-1.5 text-xs font-mono text-green">
                  <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
                  Open to work
                </span>
              )}
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-cyan border border-cyan/30 px-4 py-2 rounded text-center"
              >
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
