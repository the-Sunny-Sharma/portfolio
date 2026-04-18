'use client'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Mail, Github, Linkedin, Send, MapPin, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import SectionHeading from '@/components/ui/SectionHeading'

type Profile = { email: string; github: string; linkedin: string; location: string; phone: string }

export default function Contact({ profile }: { profile: Profile }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Message sent! I\'ll get back to you soon 🚀')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        toast.error('Something went wrong. Try emailing me directly.')
      }
    } catch {
      toast.error('Network error. Try emailing me directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28 bg-surface/30 relative" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading index="06" title="Get In Touch" subtitle="Let's build something together" inView={inView} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left info */}
          <div className={`lg:col-span-2 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <p className="font-body text-text-secondary text-sm sm:text-base leading-relaxed mb-8">
              I'm actively looking for <span className="text-cyan font-semibold">Java Backend</span>,{' '}
              <span className="text-cyan font-semibold">Full-Stack</span>, or{' '}
              <span className="text-cyan font-semibold">MERN/Next.js</span> roles. Whether you have a position,
              a project idea, or just want to connect — my inbox is always open.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
                { icon: MapPin, label: 'Location', value: profile.location, href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-cyan" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="font-body text-sm text-text-secondary hover:text-cyan transition-colors">{value}</a>
                    ) : (
                      <p className="font-body text-sm text-text-secondary">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {[
                { href: profile.github, icon: Github, label: 'GitHub' },
                { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: `mailto:${profile.email}`, icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-cyan hover:border-cyan/40 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-surface border border-border rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare size={15} className="text-cyan" />
                <span className="font-mono text-sm text-text-secondary">Send a message</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs text-text-muted mb-1.5 block">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 font-body text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-text-muted mb-1.5 block">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="john@company.com"
                      className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 font-body text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs text-text-muted mb-1.5 block">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Job opportunity at Acme Corp"
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 font-body text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-text-muted mb-1.5 block">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Hi Sunny, I'd like to discuss..."
                    rows={5}
                    className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 font-body text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-mono text-sm bg-cyan text-bg font-bold py-3 rounded-lg hover:bg-cyan/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed glow-cyan"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={14} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
