import type { NextApiRequest, NextApiResponse } from "next"
import { promises as fs } from "fs"
import path from "path"

const dataDir = process.env.LOG_DATA_DIR || path.join("/tmp", "logs")
const writableFile = path.join(dataDir, "login-logs.json")
const bundledFile = path.join(process.cwd(), "data", "login-logs.json")

type LogEntry = {
  email: string
  timestamp: string
  status: "success" | "failed"
  userAgent?: string
  ip?: string
}

async function readLogs(): Promise<LogEntry[]> {
  try {
    const raw = await fs.readFile(writableFile, "utf-8")
    return JSON.parse(raw || "[]")
  } catch {
    try {
      const rawBundled = await fs.readFile(bundledFile, "utf-8")
      const parsed = JSON.parse(rawBundled || "[]") as LogEntry[]
      await fs.mkdir(dataDir, { recursive: true })
      await fs.writeFile(writableFile, JSON.stringify(parsed, null, 2), "utf-8")
      return parsed
    } catch {
      return []
    }
  }
}

async function writeLogs(items: LogEntry[]) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(writableFile, JSON.stringify(items, null, 2), "utf-8")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const data = await readLogs()
    return res.status(200).json(data)
  }

  if (req.method === "POST") {
    const body = req.body as LogEntry
    const entry: LogEntry = {
      ...body,
      timestamp: body?.timestamp || new Date().toISOString(),
    }

    const logs = await readLogs()
    logs.push(entry)
    const sliced = logs.slice(-500)
    await writeLogs(sliced)
    return res.status(200).json({ ok: true })
  }

  res.setHeader("Allow", ["GET", "POST"])
  return res.status(405).end("Method Not Allowed")
}
