'use client'
import { useEffect, useRef } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Github, Linkedin, Mail, ArrowDown, ExternalLink } from 'lucide-react'

type Profile = {
  name: string
  tagline: string
  roles: string[]
  shortBio: string
  github: string
  linkedin: string
  email: string
  resumeUrl: string
  location: string
}

export default function Hero({ profile }: { profile: Profile }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 245, 255, ${p.opacity})`
        ctx.fill()
      })

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 245, 255, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  const typeSequence = profile.roles.flatMap(role => [role, 2000]).flat()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Radial glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 font-mono text-xs bg-green/10 border border-green/20 text-green px-4 py-1.5 rounded-full mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
          Available for opportunities · Mumbai, IN
        </div>

        {/* Name */}
        <h1 className="font-mono text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 animate-slide-up">
          <span className="text-text-primary">Hi, I'm </span>
          <span className="gradient-text text-glow-cyan">Sunny Sharma</span>
        </h1>

        {/* Animated role */}
        <div className="font-mono text-lg sm:text-2xl lg:text-3xl text-text-secondary mb-6 h-10 flex items-center justify-center gap-2">
          <span className="text-amber">{'<'}</span>
          <TypeAnimation
            sequence={typeSequence as (string | number)[]}
            wrapper="span"
            speed={50}
            deletionSpeed={70}
            repeat={Infinity}
            className="text-cyan"
          />
          <span className="text-amber">{'/>'}</span>
        </div>

        {/* Short bio */}
        <p className="font-body text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
          {profile.shortBio}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
          <a
            href="#projects"
            className="w-full sm:w-auto font-mono text-sm bg-cyan text-bg font-bold px-8 py-3 rounded hover:bg-cyan/90 transition-all duration-200 glow-cyan"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto font-mono text-sm border border-cyan/40 text-cyan hover:bg-cyan/10 px-8 py-3 rounded transition-all duration-200"
          >
            Get In Touch
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto font-mono text-sm border border-border text-text-secondary hover:text-text-primary hover:border-border-bright px-8 py-3 rounded transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            Resume
          </a>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-5 mb-16">
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
              className="text-text-muted hover:text-cyan transition-colors duration-200 hover:scale-110 transform"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        {/* Terminal code snippet — decorative but memorable */}
        <div className="max-w-md mx-auto bg-surface border border-border rounded-lg p-4 text-left font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-3 h-3 rounded-full bg-red/60" />
            <span className="w-3 h-3 rounded-full bg-amber/60" />
            <span className="w-3 h-3 rounded-full bg-green/60" />
            <span className="ml-2 text-text-muted text-xs">sunny.ts</span>
          </div>
          <div className="space-y-1 text-text-muted">
            <p><span className="text-amber">const</span> <span className="text-cyan">developer</span> = {'{'}</p>
            <p className="pl-4"><span className="text-text-secondary">name:</span> <span className="text-green">"Sunny Sharma"</span>,</p>
            <p className="pl-4"><span className="text-text-secondary">stack:</span> [<span className="text-green">"Java"</span>, <span className="text-green">"Spring Boot"</span>, <span className="text-green">"MERN"</span>],</p>
            <p className="pl-4"><span className="text-text-secondary">openToWork:</span> <span className="text-amber">true</span>,</p>
            <p className="pl-4"><span className="text-text-secondary">location:</span> <span className="text-green">"Mumbai 🇮🇳"</span>,</p>
            <p>{'}'}</p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex justify-center">
          <a href="#about" className="text-text-muted hover:text-cyan transition-colors animate-float" aria-label="Scroll down">
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}
