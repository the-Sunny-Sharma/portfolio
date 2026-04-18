'use client'
import { useInView } from 'react-intersection-observer'
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

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
}

export default function Experience({ experience }: { experience: Experience[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

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
                <div className="absolute left-2 sm:left-3.5 top-5 w-5 h-5 rounded-full bg-surface border-2 border-cyan flex items-center justify-center hidden sm:flex">
                  <div className="w-2 h-2 rounded-full bg-cyan" />
                </div>

                <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 hover:border-border-bright transition-colors duration-300 group">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase size={15} className="text-cyan" />
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
                    <span className="self-start font-mono text-xs bg-amber/10 text-amber border border-amber/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {job.type}
                    </span>
                  </div>

                  <p className="font-body text-text-muted text-sm mb-4">{job.description}</p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-5">
                    {job.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2 font-body text-sm text-text-secondary">
                        <CheckCircle2 size={13} className="text-cyan mt-0.5 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map(t => (
                      <span key={t} className="font-mono text-xs bg-surface-2 border border-border text-text-muted px-2.5 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
