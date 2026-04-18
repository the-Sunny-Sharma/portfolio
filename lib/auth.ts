import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'ss_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) return false
  return bcrypt.compare(password, hash)
}

export function setAdminSession() {
  const cookieStore = cookies()
  const token = Buffer.from(`${Date.now()}:${Math.random()}`).toString('base64')
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return token
}

export function clearAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return !!session?.value
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
