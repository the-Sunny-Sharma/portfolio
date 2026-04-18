'use client'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Server, Layout, Code2, Database, Cloud, Layers } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const ICON_MAP: Record<string, React.ElementType> = {
  server: Server, layout: Layout, code: Code2,
  database: Database, cloud: Cloud, layers: Layers,
}
const COLOR_MAP: Record<string, string> = {
  cyan: 'text-cyan border-cyan/30 bg-cyan/10',
  amber: 'text-amber border-amber/30 bg-amber/10',
  green: 'text-green border-green/30 bg-green/10',
}

type Skill = { name: string; level: number }
type Category = { category: string; icon: string; color: string; skills: Skill[] }

export default function Skills({ skills }: { skills: Category[] }) {
  const [active, setActive] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const current = skills[active]
  const Icon = ICON_MAP[current.icon] || Code2

  return (
    <section id="skills" className="py-20 sm:py-28 bg-surface/30 relative" ref={ref}>
      <div className="absolute right-0 top-1/3 w-64 h-64 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading index="02" title="Tech Stack" subtitle="Tools I build with daily" inView={inView} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category tabs */}
          <div
            className={`lg:col-span-1 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
          >
            {skills.map((cat, i) => {
              const CatIcon = ICON_MAP[cat.icon] || Code2
              const isActive = active === i
              return (
                <button
                  key={cat.category}
                  onClick={() => setActive(i)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all duration-200 font-mono text-sm ${
                    isActive
                      ? 'bg-surface-2 border-cyan/40 text-cyan'
                      : 'border-border text-text-muted hover:border-border-bright hover:text-text-secondary'
                  }`}
                >
                  <CatIcon size={15} className={isActive ? 'text-cyan' : ''} />
                  <span className="whitespace-nowrap">{cat.category}</span>
                  {isActive && <span className="ml-auto w-1 h-4 bg-cyan rounded-full hidden lg:block" />}
                </button>
              )
            })}
          </div>

          {/* Skills panel */}
          <div
            className={`lg:col-span-2 bg-surface border border-border rounded-xl p-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg border ${COLOR_MAP[current.color] || COLOR_MAP.cyan}`}>
                <Icon size={18} />
              </div>
              <h3 className="font-mono text-base font-semibold text-text-primary">{current.category}</h3>
              <span className="ml-auto font-mono text-xs text-text-muted">{current.skills.length} skills</span>
            </div>

            <div className="space-y-4">
              {current.skills.map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-sm text-text-secondary">{skill.name}</span>
                    <span className="font-mono text-xs text-text-muted">{skill.level}%</span>
                  </div>
                  <div className="w-full h-[3px] bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: inView ? `${skill.level}%` : '0%',
                        transitionDelay: `${i * 80 + 300}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All tech pills - marquee */}
        <div
          className={`mt-12 transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-mono text-xs text-text-muted text-center mb-4">Also worked with</p>
          <div className="overflow-hidden relative">
            <div className="flex gap-3 animate-marquee whitespace-nowrap">
              {[...skills.flatMap(c => c.skills.map(s => s.name)), ...skills.flatMap(c => c.skills.map(s => s.name))].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="flex-shrink-0 font-mono text-xs text-text-muted border border-border px-3 py-1 rounded-full"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
