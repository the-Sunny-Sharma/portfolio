import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getGitHubConfig } from '@/lib/github'

const GITHUB_API = 'https://api.github.com'

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('resume') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDF files allowed' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    const { token, owner, repo } = getGitHubConfig()
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // Get current SHA if exists
    let sha: string | undefined
    try {
      const r = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/public/resume.pdf`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      })
      if (r.ok) { const d = await r.json(); sha = d.sha }
    } catch { /* new file */ }

    const body: Record<string, unknown> = {
      message: 'chore: update resume PDF via admin panel',
      content: base64,
    }
    if (sha) body.sha = sha

    const putRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/public/resume.pdf`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!putRes.ok) {
      const err = await putRes.json()
      throw new Error(err.message)
    }

    return NextResponse.json({ success: true, message: 'Resume uploaded. Vercel will redeploy in ~60s.' })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
