export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  longDescription: string
  tech: string[]
  github: string
  live: string
  status: 'live' | 'building' | 'archived'
  featured: boolean
  highlight: string
  category: string
  date: string
}

export interface Experience {
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

export interface Profile {
  name: string
  tagline: string
  roles: string[]
  summary: string
  shortBio: string
  location: string
  email: string
  phone: string
  github: string
  linkedin: string
  website: string
  resumeUrl: string
  openToWork: boolean
  availableFrom: string
  photo: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  date: string
  credentialUrl: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  highlight: boolean
}

export interface SkillCategory {
  category: string
  icon: string
  color: string
  skills: { name: string; level: number }[]
}

export interface AdminSession {
  authenticated: boolean
  expiresAt: number
}
