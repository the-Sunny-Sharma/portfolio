'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, FolderGit2, User, Briefcase, Award,
  FileText, LogOut, Plus, Trash2, Save, ChevronDown,
  ChevronUp, Terminal, Eye, EyeOff, Star, Upload, X
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────
type Project = {
  id: string; title: string; tagline: string; description: string
  longDescription: string; tech: string[]; github: string; live: string
  status: string; featured: boolean; highlight: string; category: string; date: string
}
type Experience = {
  id: string; company: string; role: string; location: string; type: string
  startDate: string; endDate: string; current: boolean
  description: string; highlights: string[]; tech: string[]
}
type Profile = {
  name: string; tagline: string; roles: string[]; summary: string; shortBio: string
  location: string; email: string; phone: string; github: string; linkedin: string
  website: string; resumeUrl: string; openToWork: boolean; availableFrom: string; photo: string
}
type Certifications = {
  education: { id: string; institution: string; degree: string; grade: string; location: string; startYear: number; endYear: number; coursework: string[] }[]
  certifications: { id: string; title: string; issuer: string; date: string; credentialUrl: string }[]
  achievements: { id: string; title: string; description: string; icon: string; highlight: boolean }[]
}

type Tab = 'overview' | 'projects' | 'profile' | 'experience' | 'certs' | 'resume'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'certs', label: 'Certs & Edu', icon: Award },
  { id: 'resume', label: 'Resume', icon: FileText },
]

// ─── Shared helpers ────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono text-xs text-text-muted mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 font-body text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors"
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 font-body text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-cyan/50 transition-colors resize-none"
    />
  )
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 font-mono text-sm bg-cyan text-bg font-bold px-5 py-2.5 rounded-lg hover:bg-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> : <Save size={14} />}
      {loading ? 'Saving...' : 'Save & Deploy'}
    </button>
  )
}

// ─── Sub-panels ────────────────────────────────────────────────

function ProjectsPanel({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (id: string, field: keyof Project, value: unknown) => {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const addProject = () => {
    const id = `project-${Date.now()}`
    const blank: Project = {
      id, title: 'New Project', tagline: '', description: '', longDescription: '',
      tech: [], github: '', live: '', status: 'building', featured: false,
      highlight: '', category: 'Full-Stack', date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    setProjects(ps => [blank, ...ps])
    setExpanded(id)
  }

  const remove = (id: string) => {
    if (!confirm('Delete this project?')) return
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projects),
      })
      const data = await res.json()
      if (res.ok) toast.success(data.message || 'Projects saved! Redeploying...')
      else toast.error(data.error || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-base font-bold text-text-primary">Projects <span className="text-text-muted text-sm">({projects.length})</span></h2>
        <div className="flex gap-3">
          <button onClick={addProject} className="flex items-center gap-1.5 font-mono text-xs border border-cyan/40 text-cyan hover:bg-cyan/10 px-3 py-2 rounded-lg transition-colors">
            <Plus size={13} /> Add Project
          </button>
          <SaveBtn onClick={save} loading={loading} />
        </div>
      </div>

      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Row header */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-2 transition-colors"
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-text-primary truncate">{p.title || 'Untitled'}</span>
                  {p.featured && <Star size={11} className="text-amber fill-amber flex-shrink-0" />}
                  <span className={`font-mono text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${p.status === 'live' ? 'badge-live' : 'badge-building'}`}>
                    {p.status}
                  </span>
                </div>
                <p className="font-body text-xs text-text-muted truncate mt-0.5">{p.tagline || p.category}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={e => { e.stopPropagation(); remove(p.id) }} className="text-text-muted hover:text-red transition-colors p-1">
                  <Trash2 size={13} />
                </button>
                {expanded === p.id ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
              </div>
            </div>

            {/* Expanded form */}
            {expanded === p.id && (
              <div className="border-t border-border p-4 space-y-4 bg-bg/50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Title *"><Input value={p.title} onChange={v => update(p.id, 'title', v)} /></Field>
                  <Field label="Tagline"><Input value={p.tagline} onChange={v => update(p.id, 'tagline', v)} /></Field>
                </div>
                <Field label="Description (short)">
                  <Textarea value={p.description} onChange={v => update(p.id, 'description', v)} rows={3} />
                </Field>
                <Field label="Long Description">
                  <Textarea value={p.longDescription} onChange={v => update(p.id, 'longDescription', v)} rows={4} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="GitHub URL"><Input value={p.github} onChange={v => update(p.id, 'github', v)} placeholder="https://github.com/..." /></Field>
                  <Field label="Live URL"><Input value={p.live} onChange={v => update(p.id, 'live', v)} placeholder="https://..." /></Field>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="Status">
                    <select value={p.status} onChange={e => update(p.id, 'status', e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-cyan/50">
                      <option value="live">Live</option>
                      <option value="building">Building</option>
                      <option value="archived">Archived</option>
                    </select>
                  </Field>
                  <Field label="Category">
                    <select value={p.category} onChange={e => update(p.id, 'category', e.target.value)}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-cyan/50">
                      {['Full-Stack', 'Backend', 'Frontend', 'Web3', 'ML', 'Mobile'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Date"><Input value={p.date} onChange={v => update(p.id, 'date', v)} placeholder="Jan 2025" /></Field>
                  <Field label="Featured">
                    <button onClick={() => update(p.id, 'featured', !p.featured)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-sm font-mono transition-colors ${
                        p.featured ? 'border-amber/40 bg-amber/10 text-amber' : 'border-border text-text-muted hover:border-border-bright'
                      }`}>
                      <Star size={13} fill={p.featured ? 'currentColor' : 'none'} />
                      {p.featured ? 'Yes' : 'No'}
                    </button>
                  </Field>
                </div>
                <Field label="Key Highlight (metric)">
                  <Input value={p.highlight} onChange={v => update(p.id, 'highlight', v)} placeholder="e.g. sub-100ms latency" />
                </Field>
                <Field label="Tech Stack (comma separated)">
                  <Input
                    value={p.tech.join(', ')}
                    onChange={v => update(p.id, 'tech', v.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="Spring Boot, React.js, PostgreSQL"
                  />
                </Field>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePanel({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState<Profile>(initial)
  const [loading, setLoading] = useState(false)
  const set = (field: keyof Profile, value: unknown) => setProfile(p => ({ ...p, [field]: value }))

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (res.ok) toast.success('Profile saved! Redeploying...')
      else toast.error(data.error || 'Save failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-base font-bold text-text-primary">Profile</h2>
        <SaveBtn onClick={save} loading={loading} />
      </div>
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name"><Input value={profile.name} onChange={v => set('name', v)} /></Field>
          <Field label="Tagline"><Input value={profile.tagline} onChange={v => set('tagline', v)} /></Field>
        </div>
        <Field label="Short Bio (hero section)">
          <Textarea value={profile.shortBio} onChange={v => set('shortBio', v)} rows={2} />
        </Field>
        <Field label="Full Summary (about section)">
          <Textarea value={profile.summary} onChange={v => set('summary', v)} rows={4} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email"><Input value={profile.email} onChange={v => set('email', v)} type="email" /></Field>
          <Field label="Phone"><Input value={profile.phone} onChange={v => set('phone', v)} /></Field>
          <Field label="Location"><Input value={profile.location} onChange={v => set('location', v)} /></Field>
          <Field label="Available From"><Input value={profile.availableFrom} onChange={v => set('availableFrom', v)} /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="GitHub URL"><Input value={profile.github} onChange={v => set('github', v)} /></Field>
          <Field label="LinkedIn URL"><Input value={profile.linkedin} onChange={v => set('linkedin', v)} /></Field>
          <Field label="Website URL"><Input value={profile.website} onChange={v => set('website', v)} /></Field>
        </div>
        <Field label="Roles (typewriter — one per line)">
          <Textarea
            value={profile.roles.join('\n')}
            onChange={v => set('roles', v.split('\n').map(r => r.trim()).filter(Boolean))}
            rows={5}
            placeholder={"Java Backend Developer\nSpring Boot Engineer\nMERN Stack Developer"}
          />
        </Field>
        <div className="flex items-center gap-3">
          <button
            onClick={() => set('openToWork', !profile.openToWork)}
            className={`flex items-center gap-2 font-mono text-sm px-4 py-2.5 rounded-lg border transition-colors ${
              profile.openToWork ? 'border-green/40 bg-green/10 text-green' : 'border-border text-text-muted'
            }`}
          >
            {profile.openToWork ? <Eye size={14} /> : <EyeOff size={14} />}
            Open to Work: {profile.openToWork ? 'Yes' : 'No'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ExperiencePanel({ initial }: { initial: Experience[] }) {
  const [exp, setExp] = useState<Experience[]>(initial)
  const [expanded, setExpanded] = useState<string | null>(exp[0]?.id || null)
  const [loading, setLoading] = useState(false)

  const update = (id: string, field: keyof Experience, value: unknown) => {
    setExp(es => es.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const addExp = () => {
    const id = `exp-${Date.now()}`
    const blank: Experience = {
      id, company: 'Company Name', role: 'Your Role', location: 'City, State',
      type: 'Full-time', startDate: 'Jan 2025', endDate: '', current: true,
      description: '', highlights: [''], tech: []
    }
    setExp(es => [blank, ...es])
    setExpanded(id)
  }

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/experience', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(exp),
      })
      const data = await res.json()
      if (res.ok) toast.success('Experience saved! Redeploying...')
      else toast.error(data.error || 'Save failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-base font-bold text-text-primary">Experience</h2>
        <div className="flex gap-3">
          <button onClick={addExp} className="flex items-center gap-1.5 font-mono text-xs border border-cyan/40 text-cyan hover:bg-cyan/10 px-3 py-2 rounded-lg transition-colors">
            <Plus size={13} /> Add Role
          </button>
          <SaveBtn onClick={save} loading={loading} />
        </div>
      </div>

      {exp.map(e => (
        <div key={e.id} className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-2 transition-colors"
            onClick={() => setExpanded(expanded === e.id ? null : e.id)}>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm font-semibold text-text-primary">{e.role || 'Untitled Role'}</p>
              <p className="font-body text-xs text-text-muted">{e.company} · {e.startDate} — {e.current ? 'Present' : e.endDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={ev => { ev.stopPropagation(); if (confirm('Delete?')) setExp(es => es.filter(x => x.id !== e.id)) }}
                className="text-text-muted hover:text-red p-1 transition-colors"><Trash2 size={13} /></button>
              {expanded === e.id ? <ChevronUp size={15} className="text-text-muted" /> : <ChevronDown size={15} className="text-text-muted" />}
            </div>
          </div>

          {expanded === e.id && (
            <div className="border-t border-border p-4 bg-bg/50 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company"><Input value={e.company} onChange={v => update(e.id, 'company', v)} /></Field>
                <Field label="Role"><Input value={e.role} onChange={v => update(e.id, 'role', v)} /></Field>
                <Field label="Location"><Input value={e.location} onChange={v => update(e.id, 'location', v)} /></Field>
                <Field label="Type">
                  <select value={e.type} onChange={ev => update(e.id, 'type', ev.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-cyan/50">
                    {['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Start Date"><Input value={e.startDate} onChange={v => update(e.id, 'startDate', v)} placeholder="Jan 2024" /></Field>
                <Field label="End Date">
                  <div className="space-y-2">
                    <Input value={e.endDate} onChange={v => update(e.id, 'endDate', v)} placeholder="Dec 2024" />
                    <button onClick={() => update(e.id, 'current', !e.current)}
                      className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors ${e.current ? 'border-green/40 text-green bg-green/10' : 'border-border text-text-muted'}`}>
                      {e.current ? '✓ Current Job' : 'Mark as current'}
                    </button>
                  </div>
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={e.description} onChange={v => update(e.id, 'description', v)} />
              </Field>
              <Field label="Highlights (one per line)">
                <Textarea
                  value={e.highlights.join('\n')}
                  onChange={v => update(e.id, 'highlights', v.split('\n').map(h => h.trim()).filter(Boolean))}
                  rows={6}
                  placeholder={"Built REST API with JWT auth\nReduced response time by 30%"}
                />
              </Field>
              <Field label="Tech Stack (comma separated)">
                <Input value={e.tech.join(', ')} onChange={v => update(e.id, 'tech', v.split(',').map(t => t.trim()).filter(Boolean))} />
              </Field>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CertsPanel({ initial }: { initial: Certifications }) {
  const [data, setData] = useState<Certifications>(initial)
  const [loading, setLoading] = useState(false)

  const save = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/certifications', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
      const d = await res.json()
      if (res.ok) toast.success('Saved! Redeploying...')
      else toast.error(d.error || 'Save failed')
    } finally { setLoading(false) }
  }

  const addCert = () => {
    setData(d => ({
      ...d, certifications: [...d.certifications, { id: `cert-${Date.now()}`, title: '', issuer: '', date: '', credentialUrl: '' }]
    }))
  }
  const removeCert = (id: string) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) }))
  const updateCert = (id: string, field: string, value: string) => setData(d => ({
    ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
  }))

  const addAch = () => setData(d => ({
    ...d, achievements: [...d.achievements, { id: `ach-${Date.now()}`, title: '', description: '', icon: 'award', highlight: false }]
  }))
  const removeAch = (id: string) => setData(d => ({ ...d, achievements: d.achievements.filter(a => a.id !== id) }))
  const updateAch = (id: string, field: string, value: unknown) => setData(d => ({
    ...d, achievements: d.achievements.map(a => a.id === id ? { ...a, [field]: value } : a)
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-base font-bold text-text-primary">Education, Certs & Achievements</h2>
        <SaveBtn onClick={save} loading={loading} />
      </div>

      {/* Education — simple edit */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-mono text-sm text-cyan">Education</h3>
        {data.education.map(edu => (
          <div key={edu.id} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Institution"><Input value={edu.institution} onChange={v => setData(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, institution: v } : e) }))} /></Field>
              <Field label="Degree"><Input value={edu.degree} onChange={v => setData(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, degree: v } : e) }))} /></Field>
              <Field label="Grade / CGPA"><Input value={edu.grade} onChange={v => setData(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, grade: v } : e) }))} /></Field>
              <Field label="Location"><Input value={edu.location} onChange={v => setData(d => ({ ...d, education: d.education.map(e => e.id === edu.id ? { ...e, location: v } : e) }))} /></Field>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm text-cyan">Certifications</h3>
          <button onClick={addCert} className="flex items-center gap-1 font-mono text-xs border border-cyan/40 text-cyan hover:bg-cyan/10 px-3 py-1.5 rounded transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        {data.certifications.map(cert => (
          <div key={cert.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end bg-bg border border-border rounded-lg p-3">
            <Field label="Title"><Input value={cert.title} onChange={v => updateCert(cert.id, 'title', v)} /></Field>
            <Field label="Issuer"><Input value={cert.issuer} onChange={v => updateCert(cert.id, 'issuer', v)} /></Field>
            <Field label="Date"><Input value={cert.date} onChange={v => updateCert(cert.id, 'date', v)} placeholder="2024" /></Field>
            <div className="flex gap-2">
              <div className="flex-1"><Field label="URL"><Input value={cert.credentialUrl} onChange={v => updateCert(cert.id, 'credentialUrl', v)} /></Field></div>
              <button onClick={() => removeCert(cert.id)} className="text-text-muted hover:text-red transition-colors mt-5 p-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm text-amber">Achievements</h3>
          <button onClick={addAch} className="flex items-center gap-1 font-mono text-xs border border-amber/40 text-amber hover:bg-amber/10 px-3 py-1.5 rounded transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        {data.achievements.map(ach => (
          <div key={ach.id} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end bg-bg border border-border rounded-lg p-3">
            <Field label="Title"><Input value={ach.title} onChange={v => updateAch(ach.id, 'title', v)} /></Field>
            <Field label="Description"><Input value={ach.description} onChange={v => updateAch(ach.id, 'description', v)} /></Field>
            <div className="flex gap-2 items-end">
              <button onClick={() => updateAch(ach.id, 'highlight', !ach.highlight)}
                className={`font-mono text-xs px-3 py-2.5 rounded-lg border transition-colors ${ach.highlight ? 'border-amber/40 text-amber bg-amber/10' : 'border-border text-text-muted'}`}>
                {ach.highlight ? '⭐ Featured' : 'Feature'}
              </button>
              <button onClick={() => removeAch(ach.id)} className="text-text-muted hover:text-red transition-colors p-2"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResumePanel() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const upload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('resume', file)
      const res = await fetch('/api/resume', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) { toast.success(data.message || 'Resume uploaded!'); setFile(null) }
      else toast.error(data.error || 'Upload failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-mono text-base font-bold text-text-primary">Resume PDF</h2>
      <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
        <p className="font-body text-sm text-text-muted">
          Upload a PDF to replace <code className="font-mono text-xs bg-bg px-2 py-0.5 rounded text-cyan">/public/resume.pdf</code>.
          The file is committed directly to your GitHub repo and Vercel redeploys automatically.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault(); setDragOver(false)
            const f = e.dataTransfer.files[0]
            if (f?.type === 'application/pdf') setFile(f)
            else toast.error('Only PDF files are accepted')
          }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-cyan/60 bg-cyan/5' : 'border-border hover:border-border-bright'
          }`}
          onClick={() => document.getElementById('resume-input')?.click()}
        >
          <Upload size={32} className={`mx-auto mb-3 ${dragOver ? 'text-cyan' : 'text-text-muted'}`} />
          <p className="font-mono text-sm text-text-secondary mb-1">
            {file ? file.name : 'Drop PDF here or tap to browse'}
          </p>
          <p className="font-mono text-xs text-text-muted">Max 5MB · PDF only</p>
          <input id="resume-input" type="file" accept="application/pdf" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
        </div>

        {file && (
          <div className="flex items-center gap-3 bg-bg border border-border rounded-lg px-4 py-3">
            <FileText size={16} className="text-cyan" />
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-text-primary truncate">{file.name}</p>
              <p className="font-mono text-xs text-text-muted">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button onClick={() => setFile(null)} className="text-text-muted hover:text-red transition-colors"><X size={14} /></button>
          </div>
        )}

        <button
          onClick={upload}
          disabled={!file || loading}
          className="w-full font-mono text-sm bg-cyan text-bg font-bold py-3 rounded-lg hover:bg-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading
            ? <><span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> Uploading & Deploying...</>
            : <><Upload size={14} /> Upload & Deploy</>}
        </button>
      </div>
    </div>
  )
}

function OverviewPanel({ profile, projects, experience }: { profile: Profile; projects: Project[]; experience: Experience[] }) {
  return (
    <div className="space-y-6">
      <h2 className="font-mono text-base font-bold text-text-primary">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: projects.length, color: 'cyan' },
          { label: 'Live', value: projects.filter(p => p.status === 'live').length, color: 'green' },
          { label: 'Building', value: projects.filter(p => p.status === 'building').length, color: 'amber' },
          { label: 'Experience', value: experience.length, color: 'cyan' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className={`font-mono text-3xl font-bold text-${color}`}>{value}</p>
            <p className="font-body text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Profile summary */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="font-mono text-sm text-cyan mb-4">Profile Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { k: 'Name', v: profile.name },
            { k: 'Open to Work', v: profile.openToWork ? '✓ Yes' : '✗ No' },
            { k: 'Available From', v: profile.availableFrom },
            { k: 'Location', v: profile.location },
          ].map(({ k, v }) => (
            <div key={k} className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-muted w-28 flex-shrink-0">{k}</span>
              <span className="font-body text-sm text-text-secondary">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy reminder */}
      <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
        <p className="font-mono text-xs text-amber mb-1">⚡ How saves work</p>
        <p className="font-body text-xs text-text-muted leading-relaxed">
          Every save commits directly to your GitHub repo via the GitHub API. Vercel detects the push and auto-redeploys your portfolio in ~60 seconds. No manual action needed.
        </p>
      </div>
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard({ initialProfile, initialProjects, initialExperience, initialCertifications }: {
  initialProfile: Profile
  initialProjects: Project[]
  initialExperience: Experience[]
  initialCertifications: Certifications
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-bg font-body">
      {/* Top bar */}
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan" />
            <span className="font-mono text-sm text-text-secondary">
              <span className="text-cyan">admin</span>@sunny.dev
            </span>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 font-mono text-xs text-text-muted hover:text-red transition-colors border border-border hover:border-red/30 px-3 py-1.5 rounded">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-48 flex-shrink-0">
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex-shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-mono text-sm transition-all text-left whitespace-nowrap ${
                    tab === id
                      ? 'bg-surface border border-cyan/30 text-cyan'
                      : 'text-text-muted hover:text-text-secondary hover:bg-surface'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {tab === 'overview' && <OverviewPanel profile={initialProfile} projects={initialProjects} experience={initialExperience} />}
            {tab === 'projects' && <ProjectsPanel initial={initialProjects} />}
            {tab === 'profile' && <ProfilePanel initial={initialProfile} />}
            {tab === 'experience' && <ExperiencePanel initial={initialExperience} />}
            {tab === 'certs' && <CertsPanel initial={initialCertifications} />}
            {tab === 'resume' && <ResumePanel />}
          </main>
        </div>
      </div>
    </div>
  )
}
