import type { NextApiRequest, NextApiResponse } from "next"
import { promises as fs } from "fs"
import path from "path"

const dataDir = process.env.FEEDBACK_DATA_DIR || path.join("/tmp", "feedback")
const writableFile = path.join(dataDir, "feedback.json")
const bundledFile = path.join(process.cwd(), "data", "feedback.json")

type FeedbackEntry = {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  timestamp: string
}

async function readFeedbacks(): Promise<FeedbackEntry[]> {
  try {
    const raw = await fs.readFile(writableFile, "utf-8")
    return JSON.parse(raw || "[]")
  } catch {
    try {
      const rawBundled = await fs.readFile(bundledFile, "utf-8")
      const parsed = JSON.parse(rawBundled || "[]") as FeedbackEntry[]
      await fs.mkdir(dataDir, { recursive: true })
      await fs.writeFile(writableFile, JSON.stringify(parsed, null, 2), "utf-8")
      return parsed
    } catch {
      return []
    }
  }
}

async function writeFeedbacks(items: FeedbackEntry[]) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(writableFile, JSON.stringify(items, null, 2), "utf-8")
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const data = await readFeedbacks()
    return res.status(200).json(data)
  }

  if (req.method === "POST") {
    const { name, email, rating, comment } = req.body || {}

    if (!name || !email || !rating || !comment) {
      return res.status(400).json({ ok: false, error: "Tous les champs sont requis" })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: "Note invalide (1-5)" })
    }

    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      name: String(name).trim(),
      email: String(email).trim(),
      rating: Number(rating),
      comment: String(comment).trim(),
      timestamp: new Date().toISOString(),
    }

    const items = await readFeedbacks()
    items.unshift(entry)
    const sliced = items.slice(0, 200)
    await writeFeedbacks(sliced)
    return res.status(200).json({ ok: true, message: "Merci pour votre avis !" })
  }

  res.setHeader("Allow", ["GET", "POST"])
  return res.status(405).end("Method Not Allowed")
}
