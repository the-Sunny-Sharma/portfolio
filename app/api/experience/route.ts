import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { commitFileToGitHub, getGitHubConfig } from '@/lib/github'
import experienceData from '@/data/experience.json'

export async function GET() {
  return NextResponse.json(experienceData)
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const experience = await req.json()
    const { token, owner, repo } = getGitHubConfig()
    await commitFileToGitHub({
      token, owner, repo,
      path: 'data/experience.json',
      content: JSON.stringify(experience, null, 2),
      message: 'chore: update experience via admin panel',
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
