import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import AdminDashboard from '@/components/admin/AdminDashboard'
import profileData from '@/data/profile.json'
import projectsData from '@/data/projects.json'
import experienceData from '@/data/experience.json'
import certificationsData from '@/data/certifications.json'

export const metadata = { title: 'Admin — Not found', robots: 'noindex, nofollow' }

export default function AdminPage() {
  if (!isAdminAuthenticated()) {
    redirect('/secret-gate')
  }

  return (
    <AdminDashboard
      initialProfile={profileData}
      initialProjects={projectsData}
      initialExperience={experienceData}
      initialCertifications={certificationsData}
    />
  )
}
