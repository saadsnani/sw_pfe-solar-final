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

const dataFile = path.join(process.cwd(), "data", "feedback.json")

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
    await fs.mkdir(path.dirname(dataFile), { recursive: true })

    // Read existing
    let feedbacks: FeedbackEntry[] = []
    try {
      const raw = await fs.readFile(dataFile, "utf-8")
      feedbacks = JSON.parse(raw || "[]")
    } catch (e) {
      feedbacks = []
    }

    // Append
    feedbacks.unshift(entry) // Add to beginning
    if (feedbacks.length > 200) feedbacks = feedbacks.slice(0, 200) // Keep last 200

    // Write back
    await fs.writeFile(dataFile, JSON.stringify(feedbacks, null, 2), "utf-8")

    return NextResponse.json({ ok: true, message: "Merci pour votre avis !" })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const raw = await fs.readFile(dataFile, "utf-8")
    const feedbacks = JSON.parse(raw || "[]")
    return NextResponse.json(feedbacks)
  } catch {
    return NextResponse.json([])
  }
}
