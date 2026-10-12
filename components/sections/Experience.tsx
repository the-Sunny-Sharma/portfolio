'use client'
import { useRef, useState, type KeyboardEvent } from 'react'
import { useInView } from 'react-intersection-observer'
import { Briefcase, MapPin, Calendar, CheckCircle2, Layers } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

type Stat = { value: string; label: string }

type Module = {
  id: string
  name: string
  tagline: string
  ownership: string
  summary: string
  stats?: string[]
  highlights: string[]
  tech: string[]
}

type Experience = {
  id: string
  company: string
  role: string
  location: string
  type: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  highlights: string[]
  tech: string[]
  stats?: Stat[]
  modules?: Module[]
}

const TAB_KEYS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

function HighlightList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((h, idx) => (
        <li key={idx} className="flex items-start gap-2 font-body text-sm text-text-secondary">
          <CheckCircle2 size={13} className="text-cyan mt-0.5 flex-shrink-0" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  )
}

function TechChips({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map(t => (
        <span key={t} className="font-mono text-xs bg-surface-2 border border-border text-text-muted px-2.5 py-1 rounded-full">
          {t}
        </span>
      ))}
    </div>
  )
}

function ModuleTabs({ jobId, modules }: { jobId: string; modules: Module[] }) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = modules[active]

  const select = (i: number) => {
    setActive(i)
    tabRefs.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Home') { e.preventDefault(); select(0); return }
    if (e.key === 'End') { e.preventDefault(); select(modules.length - 1); return }
    const step = TAB_KEYS[e.key]
    if (!step) return
    e.preventDefault()
    select((active + step + modules.length) % modules.length)
  }

  return (
    <div className="mt-6">
      <p className="font-mono text-xs text-text-muted mb-3 flex items-center gap-1.5">
        <Layers size={12} className="text-cyan" /> What I built: pick a module
      </p>

      <div
        role="tablist"
        aria-label="Modules"
        onKeyDown={onKeyDown}
        className="grid grid-cols-1 md:grid-cols-3 gap-2"
      >
        {modules.map((m, i) => {
          const selected = i === active
          const solo = m.ownership.toLowerCase().startsWith('sole')
          return (
            <button
              key={m.id}
              ref={el => { tabRefs.current[i] = el }}
              role="tab"
              type="button"
              id={`${jobId}-tab-${m.id}`}
              aria-selected={selected}
              aria-controls={`${jobId}-panel-${m.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`text-left rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50 ${
                selected
                  ? 'bg-surface-2 border-cyan/40'
                  : 'border-border hover:border-border-bright hover:bg-surface-2/50'
              }`}
            >
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`font-mono text-sm font-bold transition-colors ${selected ? 'text-cyan' : 'text-text-primary'}`}>
                  {m.name}
                </span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    solo ? 'text-amber border-amber/30 bg-amber/10' : 'text-text-muted border-border'
                  }`}
                >
                  {solo ? 'Built solo' : m.ownership}
                </span>
              </span>
              <span className="block font-body text-xs text-text-muted mt-1">{m.tagline}</span>
            </button>
          )
        })}
      </div>

      <div
        key={current.id}
        role="tabpanel"
        id={`${jobId}-panel-${current.id}`}
        aria-labelledby={`${jobId}-tab-${current.id}`}
        className="mt-3 bg-bg/40 border border-border rounded-lg p-4 sm:p-5 animate-fade-in"
      >
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
          <h4 className="font-mono text-base font-bold text-text-primary">{current.name}</h4>
          <span className="font-mono text-xs text-amber">{current.ownership}</span>
        </div>
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-4">{current.summary}</p>

        {current.stats && current.stats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {current.stats.map(s => (
              <span key={s} className="font-mono text-xs text-cyan bg-cyan/10 border border-cyan/20 px-2.5 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4">
          <HighlightList items={current.highlights} />
        </div>
        <TechChips tech={current.tech} />
      </div>
    </div>
  )
}

export default function Experience({ experience }: { experience: Experience[] }) {
  // Low threshold: this section is tall, and a short phone viewport may never show 10% of it at once.
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <section id="experience" className="py-20 sm:py-28 relative" ref={ref}>
      <div className="absolute left-1/4 bottom-1/4 w-48 h-48 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading index="03" title="Experience" subtitle="Where I've built things" inView={inView} />

        <div className="mt-12 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-border to-transparent hidden sm:block" />

          <div className="space-y-8">
            {experience.map((job, i) => (
              <div
                key={job.id}
                className={`relative sm:pl-16 transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-2 sm:left-3.5 top-5 w-5 h-5 rounded-full bg-surface border-2 border-cyan items-center justify-center hidden sm:flex">
                  {job.current && <span className="absolute inset-0 rounded-full border border-cyan/60 animate-ping" />}
                  <div className="w-2 h-2 rounded-full bg-cyan" />
                </div>

                <div
                  className={`bg-surface border rounded-xl p-5 sm:p-6 transition-colors duration-300 group ${
                    job.current ? 'border-cyan/30 hover:border-cyan/50' : 'border-border hover:border-border-bright'
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <Briefcase size={15} className="text-cyan mt-1 flex-shrink-0" />
                        <h3 className="font-mono text-base sm:text-lg font-bold text-text-primary group-hover:text-cyan transition-colors">
                          {job.role}
                        </h3>
                      </div>
                      <p className="font-body text-amber font-semibold text-sm sm:text-base">{job.company}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 font-mono text-xs text-text-muted">
                          <MapPin size={11} /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs text-text-muted">
                          <Calendar size={11} /> {job.startDate} — {job.current ? 'Present' : job.endDate}
                        </span>
                      </div>
                    </div>
                    <div className="self-start flex flex-wrap gap-2">
                      {job.current && (
                        <span className="flex items-center gap-1.5 font-mono text-xs text-green bg-green/10 border border-green/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                          <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
                          Current
                        </span>
                      )}
                      <span className="font-mono text-xs bg-amber/10 text-amber border border-amber/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {job.type}
                      </span>
                    </div>
                  </div>

                  <p className="font-body text-text-muted text-sm leading-relaxed mb-4">{job.description}</p>

                  {/* Impact stats */}
                  {job.stats && job.stats.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
                      {job.stats.map(stat => (
                        <div key={stat.label} className="bg-surface-2 border border-border rounded-lg px-3 py-2.5">
                          <p className="font-mono text-lg sm:text-xl font-bold gradient-text leading-tight">{stat.value}</p>
                          <p className="font-body text-[11px] sm:text-xs text-text-muted mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {job.highlights.length > 0 && (
                    <div className="mb-5">
                      <HighlightList items={job.highlights} />
                    </div>
                  )}

                  <TechChips tech={job.tech} />

                  {job.modules && job.modules.length > 0 && (
                    <ModuleTabs jobId={job.id} modules={job.modules} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
