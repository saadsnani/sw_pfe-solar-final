import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type LogEntry = {
  email: string
  timestamp: string
  status: "success" | "failed"
  userAgent?: string
  ip?: string
}

const dataDir = process.env.LOG_DATA_DIR || path.join("/tmp", "logs")
const writableFile = path.join(dataDir, "login-logs.json")
const bundledFile = path.join(process.cwd(), "data", "login-logs.json")

async function readLogs() {
  try {
    const raw = await fs.readFile(writableFile, "utf-8")
    return JSON.parse(raw || "[]") as LogEntry[]
  } catch {
    try {
      const rawBundled = await fs.readFile(bundledFile, "utf-8")
      const parsed = JSON.parse(rawBundled || "[]") as LogEntry[]
      // Seed writable path for subsequent writes
      await fs.mkdir(dataDir, { recursive: true })
      await fs.writeFile(writableFile, JSON.stringify(parsed, null, 2), "utf-8")
      return parsed
    } catch {
      return []
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LogEntry
    const now = new Date().toISOString()
    const entry: LogEntry = {
      ...body,
      timestamp: body.timestamp || now,
    }

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true })

    // Read existing (writable first, fallback bundled)
    let logs: LogEntry[] = await readLogs()

    // Append and cap to last 500
    logs.push(entry)
    if (logs.length > 500) logs = logs.slice(-500)

    // Write back
    await fs.writeFile(writableFile, JSON.stringify(logs, null, 2), "utf-8")

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 400 })
  }
}

export async function GET() {
  try {
    const logs = await readLogs()
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json([])
  }
}
