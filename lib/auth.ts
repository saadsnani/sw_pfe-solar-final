// Authentication utilities

export interface User {
  email: string
  password: string
  createdAt: string
}

export interface LoginLog {
  email: string
  timestamp: string
  status: "success" | "failed"
}

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem("smart-ems-users")
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
export const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("smart-ems-users", JSON.stringify(users))
}

// Get login logs from localStorage
export const getLoginLogs = (): LoginLog[] => {
  if (typeof window === "undefined") return []
  const logs = localStorage.getItem("smart-ems-login-logs")
  return logs ? JSON.parse(logs) : []
}

// Save login logs to localStorage
export const saveLoginLogs = (logs: LoginLog[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("smart-ems-login-logs", JSON.stringify(logs))
}

// Add a login log
export const addLoginLog = (email: string, status: "success" | "failed") => {
  const logs = getLoginLogs()
  const newLog: LoginLog = {
    email,
    timestamp: new Date().toISOString(),
    status,
  }
  logs.unshift(newLog) // Add to beginning
  saveLoginLogs(logs.slice(0, 100)) // Keep only last 100 logs

  // Also send to server to persist in a local file (visible in VS Code)
  if (typeof window !== "undefined") {
    try {
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      }).catch(() => {})
    } catch {}
  }
}

// Register a new user
export const registerUser = (email: string, password: string): { success: boolean; message: string } => {
  // Validate password length
  if (password.length < 4) {
    return { success: false, message: "Le mot de passe doit contenir au moins 4 caractères" }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: "Adresse email invalide" }
  }

  const users = getUsers()

  // Check if user already exists
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: "Un compte avec cet email existe déjà" }
  }

  // Add new user
  const newUser: User = {
    email,
    password, // In production, hash this!
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true, message: "Compte créé avec succès" }
}

// Login a user
export const loginUser = (email: string, password: string): { success: boolean; message: string } => {
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    addLoginLog(email, "failed")
    return { success: false, message: "Email ou mot de passe incorrect" }
  }

  if (user.password !== password) {
    addLoginLog(email, "failed")
    return { success: false, message: "Email ou mot de passe incorrect" }
  }

  addLoginLog(email, "success")
  return { success: true, message: "Connexion réussie" }
}

// Get current logged in user
export const getCurrentUser = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("smart-ems-current-user")
}

// Set current logged in user
export const setCurrentUser = (email: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem("smart-ems-current-user", email)
}

// Logout current user
export const logoutUser = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("smart-ems-current-user")
}
