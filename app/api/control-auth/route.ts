import { NextRequest, NextResponse } from 'next/server'
import {
  CONTROL_SESSION_COOKIE,
  createControlSessionToken,
  getControlSessionMaxAgeSeconds,
  isControlPasswordValid,
  isControlSecurityConfigured,
  verifyControlSessionToken,
} from '@/lib/control-session'

export async function GET(request: NextRequest) {
  const configured = isControlSecurityConfigured()
  const token = request.cookies.get(CONTROL_SESSION_COOKIE)?.value
  const payload = token ? verifyControlSessionToken(token) : null

  return NextResponse.json({
    success: true,
    data: {
      configured,
      authenticated: Boolean(payload),
      expiresAt: payload ? new Date(payload.exp).toISOString() : null,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    if (!isControlSecurityConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Control security is not configured. Set CONTROL_PANEL_PASSWORD and CONTROL_SESSION_SECRET.',
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!isControlPasswordValid(password)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid control password',
        },
        { status: 401 },
      )
    }

    const token = createControlSessionToken()
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create control session token',
        },
        { status: 500 },
      )
    }

    const response = NextResponse.json({
      success: true,
      data: {
        authenticated: true,
      },
    })

    response.cookies.set({
      name: CONTROL_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: getControlSessionMaxAgeSeconds(),
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to authenticate control session',
        details: String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    data: {
      authenticated: false,
    },
  })

  response.cookies.set({
    name: CONTROL_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })

  return response
}
