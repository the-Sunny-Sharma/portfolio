'use client'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, Star, Zap, Globe, Cpu, Layers, FlaskConical } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

type Project = {
  id: string
  title: string
  tagline: string
  description: string
  longDescription: string
  tech: string[]
  github: string
  live: string
  status: string
  featured: boolean
  highlight: string
  category: string
  date: string
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Backend': Cpu,
  'Full-Stack': Layers,
  'Web3': Globe,
  'ML': FlaskConical,
}

const FILTERS = ['All', 'Backend', 'Full-Stack', 'Web3', 'ML']

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="py-20 sm:py-28 bg-surface/30 relative" ref={ref}>
      <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-cyan/4 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading index="04" title="Projects" subtitle="Things I've shipped" inView={inView} />

        {/* Filter tabs */}
        <div
          className={`mt-8 flex flex-wrap gap-2 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200 ${
                filter === f
                  ? 'bg-cyan text-bg border-cyan font-bold'
                  : 'border-border text-text-muted hover:border-border-bright hover:text-text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((project, i) => {
            const CatIcon = CATEGORY_ICONS[project.category] || Layers
            const isExpanded = expanded === project.id

            return (
              <div
                key={project.id}
                className={`relative bg-surface border rounded-xl overflow-hidden transition-all duration-500 group
                  ${project.featured ? 'border-cyan/30 hover:border-cyan/60' : 'border-border hover:border-border-bright'}
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 font-mono text-xs text-amber bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-full z-10">
                    <Star size={10} fill="currentColor" />
                    Featured
                  </div>
                )}

                {/* Top accent bar */}
                <div className={`h-[2px] w-full ${project.featured ? 'bg-gradient-to-r from-cyan via-amber to-transparent' : 'bg-gradient-to-r from-border to-transparent'}`} />

                <div className="p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg border flex-shrink-0 ${project.featured ? 'bg-cyan/10 border-cyan/20 text-cyan' : 'bg-surface-2 border-border text-text-muted'}`}>
                      <CatIcon size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-base font-bold text-text-primary group-hover:text-cyan transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-body text-xs text-text-muted mt-0.5">{project.tagline}</p>
                    </div>
                  </div>

                  {/* Status + date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${project.status === 'live' ? 'badge-live' : 'badge-building'}`}>
                      {project.status === 'live' ? '● Live' : '⚡ Building'}
                    </span>
                    <span className="font-mono text-xs text-text-muted">{project.date}</span>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm text-text-secondary leading-relaxed mb-4">
                    {isExpanded ? project.longDescription : project.description}
                  </p>

                  {/* Highlight metric */}
                  <div className="flex items-center gap-1.5 font-mono text-xs text-amber mb-4">
                    <Zap size={11} fill="currentColor" />
                    {project.highlight}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map(t => (
                      <span key={t} className="font-mono text-xs bg-surface-2 border border-border text-text-muted px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-cyan transition-colors"
                      >
                        <Github size={13} /> Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-green transition-colors"
                      >
                        <ExternalLink size={13} /> Live
                      </a>
                    )}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : project.id)}
                      className="ml-auto font-mono text-xs text-text-muted hover:text-cyan transition-colors"
                    >
                      {isExpanded ? 'Show less ↑' : 'Read more ↓'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* GitHub CTA */}
        <div className={`mt-10 text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="https://github.com/the-Sunny-Sharma"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-cyan border border-border hover:border-cyan/40 px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Github size={15} />
            View all projects on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
