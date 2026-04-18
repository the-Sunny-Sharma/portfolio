import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'sunny.sharma.syn@gmail.com'],
      replyTo: email,
      subject: subject || `Portfolio contact from ${name}`,
      html: `
        <div style="font-family: monospace; background: #060A12; color: #E8F4F8; padding: 24px; border-radius: 8px; border: 1px solid #1E2D45; max-width: 600px;">
          <h2 style="color: #00F5FF; margin: 0 0 20px;">New message from your portfolio</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="color: #7A9BB5; padding: 6px 0; width: 80px;">Name</td><td style="color: #E8F4F8;">${name}</td></tr>
            <tr><td style="color: #7A9BB5; padding: 6px 0;">Email</td><td><a href="mailto:${email}" style="color: #00F5FF;">${email}</a></td></tr>
            ${subject ? `<tr><td style="color: #7A9BB5; padding: 6px 0;">Subject</td><td style="color: #E8F4F8;">${subject}</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 1px solid #1E2D45; margin: 16px 0;"/>
          <p style="color: #E8F4F8; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
