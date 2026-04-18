'use client'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { MapPin, Mail, Phone, Github, Linkedin, Globe } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

type Profile = {
  name: string
  summary: string
  shortBio: string
  location: string
  email: string
  phone: string
  github: string
  linkedin: string
  website: string
  photo: string
  availableFrom: string
}

export default function About({ profile }: { profile: Profile }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="about" className="py-20 sm:py-28 relative" ref={ref}>
      {/* Subtle left glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="01"
          title="About Me"
          subtitle="The human behind the terminal"
          inView={inView}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center mt-12">
          {/* Photo */}
          <div
            className={`lg:col-span-2 flex justify-center transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="relative">
              {/* Rotating gradient border */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full p-[3px] bg-gradient-to-br from-cyan via-amber to-cyan animate-spin-slow">
                <div className="w-full h-full rounded-full overflow-hidden bg-surface">
                  <Image
                    src={profile.photo}
                    alt={profile.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-top scale-110"
                    priority
                    quality={85}
                  />
                </div>
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-cyan/5 blur-xl -z-10" />
              {/* Badge */}
              <div className="absolute -bottom-2 -right-2 bg-surface border border-border rounded-full px-3 py-1.5 font-mono text-xs text-green flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
                Available
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <p className="font-body text-text-secondary text-base sm:text-lg leading-relaxed mb-6">
              {profile.summary}
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: MapPin, label: profile.location },
                { icon: Mail, label: profile.email },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 font-mono text-xs text-text-muted">
                  <Icon size={13} className="text-cyan flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>

            {/* Personality chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                '☕ Coffee-driven coder',
                '🧠 System design enthusiast',
                '🚀 Ships fast, scales smart',
                '🌐 Open source contributor',
                '🎯 Detail-oriented',
              ].map(trait => (
                <span
                  key={trait}
                  className="font-mono text-xs text-text-secondary bg-surface-2 border border-border px-3 py-1.5 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Social row */}
            <div className="flex gap-4">
              {[
                { href: profile.github, icon: Github, label: 'GitHub' },
                { href: profile.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: profile.website, icon: Globe, label: 'Website' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2 font-mono text-xs text-text-muted hover:text-cyan border border-border hover:border-cyan/40 px-3 py-2 rounded transition-all duration-200"
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
