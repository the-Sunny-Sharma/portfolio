import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { commitFileToGitHub, getGitHubConfig } from '@/lib/github'
import profileData from '@/data/profile.json'

export async function GET() {
  return NextResponse.json(profileData)
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const profile = await req.json()
    const { token, owner, repo } = getGitHubConfig()
    await commitFileToGitHub({
      token, owner, repo,
      path: 'data/profile.json',
      content: JSON.stringify(profile, null, 2),
      message: 'chore: update profile via admin panel',
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
