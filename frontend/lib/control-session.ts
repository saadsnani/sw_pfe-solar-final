import { createHmac, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

export const CONTROL_SESSION_COOKIE = 'control_session'

const DEFAULT_SESSION_TTL_MS = 1000 * 60 * 60 * 12

type ControlSessionPayload = {
  scope: 'relay-control'
  iat: number
  exp: number
}

function getControlPassword(): string | null {
  const password = process.env.CONTROL_PANEL_PASSWORD?.trim()
  return password && password.length > 0 ? password : null
}

function getSessionSecret(): string | null {
  const explicitSecret = process.env.CONTROL_SESSION_SECRET?.trim()
  if (explicitSecret && explicitSecret.length > 0) {
    return explicitSecret
  }

  // Fallback keeps dev usable, but production should provide CONTROL_SESSION_SECRET explicitly.
  return getControlPassword()
}

function getSessionTtlMs(): number {
  const parsed = Number(process.env.CONTROL_SESSION_TTL_MS || DEFAULT_SESSION_TTL_MS)
  if (!Number.isFinite(parsed) || parsed < 60_000) {
    return DEFAULT_SESSION_TTL_MS
  }
  return parsed
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}

function encodePayload(payload: ControlSessionPayload): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
}

function decodePayload(encoded: string): ControlSessionPayload | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf8')
    const parsed = JSON.parse(json) as Partial<ControlSessionPayload>

    if (parsed.scope !== 'relay-control') return null
    if (typeof parsed.iat !== 'number' || typeof parsed.exp !== 'number') return null

    return {
      scope: 'relay-control',
      iat: parsed.iat,
      exp: parsed.exp,
    }
  } catch {
    return null
  }
}

export function isControlSecurityConfigured(): boolean {
  return Boolean(getControlPassword() && getSessionSecret())
}

export function isControlPasswordValid(password: string): boolean {
  const configuredPassword = getControlPassword()
  if (!configuredPassword) return false

  return safeEqual(password, configuredPassword)
}

export function getControlSessionMaxAgeSeconds(): number {
  return Math.floor(getSessionTtlMs() / 1000)
}

export function createControlSessionToken(now = Date.now()): string | null {
  const secret = getSessionSecret()
  if (!secret) {
    return null
  }

  const payload: ControlSessionPayload = {
    scope: 'relay-control',
    iat: now,
    exp: now + getSessionTtlMs(),
  }

  const encodedPayload = encodePayload(payload)
  const signature = createHmac('sha256', secret).update(encodedPayload).digest('base64url')

  return `${encodedPayload}.${signature}`
}

export function verifyControlSessionToken(token: string): ControlSessionPayload | null {
  const secret = getSessionSecret()
  if (!secret) {
    return null
  }

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  const payload = decodePayload(encodedPayload)
  if (!payload) {
    return null
  }

  if (payload.exp <= Date.now()) {
    return null
  }

  return payload
}

export function isRelayControlRequestAuthorized(request: NextRequest): boolean {
  const configuredApiKey = process.env.CONTROL_API_KEY?.trim()
  const requestApiKey = request.headers.get('x-control-key')?.trim() || ''

  if (configuredApiKey && requestApiKey && safeEqual(requestApiKey, configuredApiKey)) {
    return true
  }

  const sessionToken = request.cookies.get(CONTROL_SESSION_COOKIE)?.value
  if (!sessionToken) {
    return false
  }

  return Boolean(verifyControlSessionToken(sessionToken))
}
