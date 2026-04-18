'use client'
import { useInView } from 'react-intersection-observer'
import { GraduationCap, Award, Trophy, ExternalLink, BookOpen } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

type Education = { id: string; institution: string; degree: string; grade: string; location: string; startYear: number; endYear: number; coursework: string[] }
type Cert = { id: string; title: string; issuer: string; date: string; credentialUrl: string }
type Achievement = { id: string; title: string; description: string; icon: string; highlight: boolean }
type Data = { education: Education[]; certifications: Cert[]; achievements: Achievement[] }

export default function Education({ data }: { data: Data }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="education" className="py-20 sm:py-28 relative" ref={ref}>
      <div className="absolute left-0 bottom-1/3 w-64 h-64 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading index="05" title="Education & Certs" subtitle="Knowledge base" inView={inView} />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="font-mono text-sm text-cyan mb-4 flex items-center gap-2">
              <GraduationCap size={15} /> Education
            </h3>
            {data.education.map(edu => (
              <div key={edu.id} className="bg-surface border border-border rounded-xl p-5 hover:border-border-bright transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-mono text-base font-bold text-text-primary">{edu.institution}</h4>
                    <p className="font-body text-sm text-amber mt-0.5">{edu.degree}</p>
                  </div>
                  <span className="font-mono text-xs text-green bg-green/10 border border-green/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {edu.grade}
                  </span>
                </div>
                <p className="font-mono text-xs text-text-muted mb-3">{edu.startYear} — {edu.endYear} · {edu.location}</p>
                <div>
                  <p className="font-mono text-xs text-text-muted mb-2 flex items-center gap-1"><BookOpen size={11} /> Relevant Coursework</p>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.coursework.map(c => (
                      <span key={c} className="font-mono text-xs bg-surface-2 border border-border text-text-muted px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right col: Certs + Achievements */}
          <div className="space-y-6">
            {/* Certifications */}
            <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="font-mono text-sm text-cyan mb-4 flex items-center gap-2">
                <Award size={15} /> Certifications
              </h3>
              <div className="space-y-3">
                {data.certifications.map(cert => (
                  <div key={cert.id} className="bg-surface border border-border rounded-lg p-4 flex items-start justify-between gap-3 hover:border-border-bright transition-colors group">
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-text-primary font-medium group-hover:text-cyan transition-colors">{cert.title}</p>
                      <p className="font-body text-xs text-text-muted mt-0.5">{cert.issuer} · {cert.date}</p>
                    </div>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-cyan transition-colors flex-shrink-0 mt-0.5">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="font-mono text-sm text-amber mb-4 flex items-center gap-2">
                <Trophy size={15} /> Achievements
              </h3>
              <div className="space-y-3">
                {data.achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`bg-surface rounded-lg p-4 border transition-colors ${ach.highlight ? 'border-amber/30 hover:border-amber/50' : 'border-border hover:border-border-bright'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{ach.icon === 'trophy' ? '🏆' : '🏅'}</span>
                      <div>
                        <p className="font-mono text-sm text-text-primary font-medium">{ach.title}</p>
                        <p className="font-body text-xs text-text-muted mt-0.5">{ach.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
