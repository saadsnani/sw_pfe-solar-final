import emailjs from "@emailjs/browser"

// ⚠️ CONFIGURATION: Add your EmailJS credentials here
// Get these from: https://dashboard.emailjs.com/
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID"
const TEMPLATE_ID_LOGIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_LOGIN || "YOUR_LOGIN_TEMPLATE_ID"
const TEMPLATE_ID_FEEDBACK = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_FEEDBACK || "YOUR_FEEDBACK_TEMPLATE_ID"
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"

// Initialize EmailJS (should be done once on app startup)
export function initializeEmailJS() {
  try {
    emailjs.init(PUBLIC_KEY)
  } catch (error) {
    console.error("Failed to initialize EmailJS:", error)
  }
}

// Send login log via email
export async function sendLogToEmail(
  email: string,
  status: "success" | "failed",
  timestamp: string = new Date().toISOString()
) {
  if (!SERVICE_ID || SERVICE_ID === "YOUR_SERVICE_ID") {
    console.error("EmailJS: SERVICE_ID is missing")
    return { success: false, message: "SERVICE_ID manquant" }
  }
  if (!TEMPLATE_ID_LOGIN || TEMPLATE_ID_LOGIN === "YOUR_LOGIN_TEMPLATE_ID") {
    console.error("EmailJS: TEMPLATE_ID_LOGIN is missing")
    return { success: false, message: "Template login manquant" }
  }
  if (!PUBLIC_KEY || PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    console.error("EmailJS: PUBLIC_KEY is missing")
    return { success: false, message: "PUBLIC_KEY manquant" }
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_LOGIN,
      {
        to_email: "saad.snani@usmba.ac.ma", // Admin email for login alerts
        user_email: email,
        login_status: status,
        login_timestamp: new Date(timestamp).toLocaleString("en-US"),
        login_date: new Date(timestamp).toLocaleDateString("en-US"),
        login_time: new Date(timestamp).toLocaleTimeString("en-US"),
      },
      PUBLIC_KEY
    )

    if (response.status === 200) {
      console.log("Login log sent successfully to email")
      return { success: true, message: "Login logged successfully" }
    }
  } catch (error) {
    console.error("Failed to send login log:", error)
    return { success: false, message: "Failed to log login event" }
  }
}

// Send feedback via email
export async function sendFeedbackToEmail(
  name: string,
  email: string,
  rating: number,
  comment: string
) {
  if (!SERVICE_ID || SERVICE_ID === "YOUR_SERVICE_ID") {
    console.error("EmailJS: SERVICE_ID is missing")
    return { success: false, message: "SERVICE_ID manquant" }
  }
  if (!TEMPLATE_ID_FEEDBACK || TEMPLATE_ID_FEEDBACK === "YOUR_FEEDBACK_TEMPLATE_ID") {
    console.error("EmailJS: TEMPLATE_ID_FEEDBACK is missing")
    return { success: false, message: "Template feedback manquant" }
  }
  if (!PUBLIC_KEY || PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    console.error("EmailJS: PUBLIC_KEY is missing")
    return { success: false, message: "PUBLIC_KEY manquant" }
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID_FEEDBACK,
      {
        to_email: "saad.snani@usmba.ac.ma", // Admin email for feedback alerts
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
      console.log("Feedback sent successfully to email")
      return { success: true, message: "Feedback sent successfully" }
    }
  } catch (error) {
    console.error("Failed to send feedback:", error)
    const message =
      (typeof error === "object" && error && "text" in error && (error as any).text) ||
      "Failed to send feedback"
    return { success: false, message }
  }
}
