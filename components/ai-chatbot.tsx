"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, User, Sparkles } from "lucide-react"

interface AiChatbotProps {
  batteryLevel: number
  powerOutput: number
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AiChatbot({ batteryLevel, powerOutput }: AiChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your Solar AI Assistant. Current battery is at ${batteryLevel}% with ${powerOutput}W output. Ask me anything about your energy system!`,
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase()

    if (q.includes("tv") || q.includes("television")) {
      const hoursAvailable = Math.floor((batteryLevel - 20) / 5)
      return batteryLevel > 40
        ? `Yes! With ${batteryLevel}% battery, you can watch TV for approximately ${hoursAvailable} hours safely.`
        : `I'd recommend waiting. Battery is at ${batteryLevel}%. Charge to at least 50% first.`
    }

    if (q.includes("wash") || q.includes("laundry") || q.includes("machine")) {
      return batteryLevel > 70
        ? `Great timing! With ${batteryLevel}% battery, you can run the washing machine. Best to do it now while production is at ${powerOutput}W.`
        : `Washing machine needs 2000W. With ${batteryLevel}% battery, I suggest waiting until battery reaches 80%.`
    }

    if (q.includes("ac") || q.includes("air conditioner") || q.includes("cooling")) {
      return batteryLevel > 80
        ? `You can run the AC for about 2-3 hours. Current battery: ${batteryLevel}%.`
        : `AC is power-hungry (2000W). With ${batteryLevel}% battery, it's risky. Wait for more charge.`
    }

    if (q.includes("battery") || q.includes("charge") || q.includes("soc")) {
      return `Current battery level is ${batteryLevel}%. ${batteryLevel > 70 ? "Looking healthy!" : batteryLevel > 40 ? "Moderate level, conserve if possible." : "Low battery - avoid heavy loads."}`
    }

    if (q.includes("production") || q.includes("power") || q.includes("solar")) {
      return `Current solar production is ${powerOutput}W. ${powerOutput > 200 ? "Great sunshine today!" : "Production is moderate, sun might be behind clouds."}`
    }

    if (q.includes("night") || q.includes("evening")) {
      const nightHours = Math.floor(((batteryLevel - 20) * 24) / 100)
      return `Based on ${batteryLevel}% charge, you have approximately ${nightHours} hours of average evening usage (lights, TV, fridge).`
    }

    return `I'm analyzing your question. Current status: ${batteryLevel}% battery, ${powerOutput}W production. Could you be more specific about which appliance or scenario you'd like to know about?`
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsTyping(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = generateResponse(userMessage)
    setMessages((prev) => [...prev, { role: "assistant", content: response }])
    setIsTyping(false)
  }

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col h-[400px]">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-neon-green/20 border border-neon-green/30">
          <Bot className="h-5 w-5 text-neon-green" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            AI SOLAR ASSISTANT
          </h3>
          <p className="text-xs text-muted-foreground">Natural language energy queries</p>
        </div>
        <Sparkles className="h-4 w-4 text-neon-green ml-auto animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                <Bot className="h-3 w-3 text-neon-green" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-neon-cyan/20 text-foreground" : "bg-secondary/50 text-foreground"}`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                <User className="h-3 w-3 text-neon-cyan" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center">
              <Bot className="h-3 w-3 text-neon-green" />
            </div>
            <div className="bg-secondary/50 p-3 rounded-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-neon-green rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-neon-green rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-neon-green rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask: Can I watch TV tonight?"
          className="bg-background/50 border-neon-green/30 focus:border-neon-green"
        />
        <Button onClick={handleSend} className="bg-neon-green hover:bg-neon-green/80 text-background">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
