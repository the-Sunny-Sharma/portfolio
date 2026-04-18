import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, setAdminSession, clearAdminSession } from '@/lib/auth'

// POST /api/auth → login
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 })

    const valid = await verifyAdminPassword(password)
    if (!valid) {
      // Delay to prevent timing attacks
      await new Promise(r => setTimeout(r, 800 + Math.random() * 400))
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    setAdminSession()
    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/auth → logout
export async function DELETE() {
  clearAdminSession()
  return NextResponse.json({ success: true })
}
