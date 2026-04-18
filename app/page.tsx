import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Education from '@/components/sections/Education'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/ui/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import profile from '@/data/profile.json'
import projects from '@/data/projects.json'
import skills from '@/data/skills.json'
import experience from '@/data/experience.json'
import certifications from '@/data/certifications.json'

export default function Home() {
  return (
    <main className="relative noise">
      <ScrollProgress />
      <Navbar profile={profile} />
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Education data={certifications} />
      <Contact profile={profile} />
      <Footer profile={profile} />
    </main>
  )
}
