import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { commitFileToGitHub, getGitHubConfig } from '@/lib/github'
import certsData from '@/data/certifications.json'

export async function GET() {
  return NextResponse.json(certsData)
}

export async function PUT(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const data = await req.json()
    const { token, owner, repo } = getGitHubConfig()
    await commitFileToGitHub({
      token, owner, repo,
      path: 'data/certifications.json',
      content: JSON.stringify(data, null, 2),
      message: 'chore: update certifications via admin panel',
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
