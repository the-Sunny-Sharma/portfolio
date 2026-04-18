import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { commitFileToGitHub, getGitHubConfig } from '@/lib/github'
import projectsData from '@/data/projects.json'

function authCheck() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

// GET - return all projects
export async function GET() {
  return NextResponse.json(projectsData)
}

// PUT - replace entire projects array and commit to GitHub
export async function PUT(req: NextRequest) {
  const authErr = authCheck()
  if (authErr) return authErr

  try {
    const projects = await req.json()
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Expected array of projects' }, { status: 400 })
    }

    const { token, owner, repo } = getGitHubConfig()
    await commitFileToGitHub({
      token, owner, repo,
      path: 'data/projects.json',
      content: JSON.stringify(projects, null, 2),
      message: 'chore: update projects via admin panel',
    })

    return NextResponse.json({ success: true, message: 'Projects updated. Vercel will redeploy.' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
