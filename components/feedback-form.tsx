"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Send, MessageSquare } from "lucide-react"
import { useAlert } from "@/lib/alert-provider"

// TODO: replace with your real EmailJS values
const SERVICE_ID = "service_g6ujbtd"
const TEMPLATE_ID_FEEDBACK = "template_ge2bcpv"
const PUBLIC_KEY = "26Wmc6eta0u4ZfQCq"

export function FeedbackForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addAlert } = useAlert()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !rating || !comment) {
      addAlert({ type: "error", title: "Erreur", message: "Veuillez remplir tous les champs" })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID_FEEDBACK,
        {
          to_email: "saad.snani@usmba.ac.ma",
          user_name: name,
          user_email: email,
          feedback_rating: `${rating} / 5`,
          feedback_comment: comment,
          feedback_date: new Date().toLocaleDateString("en-US"),
          feedback_time: new Date().toLocaleTimeString("en-US"),
        },
        PUBLIC_KEY
      )

      if (response.status === 200) {
        addAlert({ type: "success", title: "Merci !", message: "Votre avis a été envoyé avec succès" })
        setName("")
        setEmail("")
        setRating(0)
        setComment("")
      } else {
        addAlert({ type: "error", title: "Erreur", message: "Impossible d'envoyer votre avis" })
      }
    } catch (error) {
      const message =
        (typeof error === "object" && error && "text" in error && (error as any).text) ||
        "Impossible d'envoyer votre avis"
      console.error("EmailJS feedback error", error)
      addAlert({ type: "error", title: "Erreur", message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Votre Avis Compte
        </CardTitle>
        <CardDescription>Partagez votre expérience avec Smart EMS</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground self-center">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full gap-2">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Envoyer mon Avis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
