import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

type FeedbackEntry = {
  id: string
  name: string
  email: string
  rating: number
  comment: string
  timestamp: string
}

// Use a writable path on Vercel (/tmp). Fallback to env override for other hosts.
const dataDir = process.env.FEEDBACK_DATA_DIR || path.join("/tmp", "feedback")
const writableFile = path.join(dataDir, "feedback.json")
const bundledFile = path.join(process.cwd(), "data", "feedback.json")

async function readFeedbacks() {
  try {
    const raw = await fs.readFile(writableFile, "utf-8")
    return JSON.parse(raw || "[]") as FeedbackEntry[]
  } catch {
    try {
      const rawBundled = await fs.readFile(bundledFile, "utf-8")
      const parsed = JSON.parse(rawBundled || "[]") as FeedbackEntry[]
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
    const body = await request.json()
    const { name, email, rating, comment } = body

    // Validation
    if (!name || !email || !rating || !comment) {
      return NextResponse.json({ ok: false, error: "Tous les champs sont requis" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "Note invalide (1-5)" }, { status: 400 })
    }

    // Create entry
    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    }

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true })

    // Read existing (writable first, fallback to bundled)
    let feedbacks: FeedbackEntry[] = await readFeedbacks()

    // Append
    feedbacks.unshift(entry) // Add to beginning
    if (feedbacks.length > 200) feedbacks = feedbacks.slice(0, 200) // Keep last 200

    // Write back
    await fs.writeFile(writableFile, JSON.stringify(feedbacks, null, 2), "utf-8")

    return NextResponse.json({ ok: true, message: "Merci pour votre avis !" })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const feedbacks = await readFeedbacks()
    return NextResponse.json(feedbacks)
  } catch {
    return NextResponse.json([])
  }
}
