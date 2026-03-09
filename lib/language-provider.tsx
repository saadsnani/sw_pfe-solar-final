"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type SiteLanguage = "fr" | "en" | "ar"
type SiteDirection = "ltr" | "rtl"
type TranslationMap = Record<string, string>

const STORAGE_KEY = "smartems.language"
const FALLBACK_LANGUAGE: SiteLanguage = "fr"

const languageMeta: Record<SiteLanguage, { short: string; locale: string; direction: SiteDirection }> = {
  fr: { short: "FR", locale: "fr-FR", direction: "ltr" },
  en: { short: "EN", locale: "en-US", direction: "ltr" },
  ar: { short: "AR", locale: "ar-MA", direction: "rtl" },
}

const translations: Record<SiteLanguage, TranslationMap> = {
  fr: {
    "language.label": "Langue",
    "language.french": "Francais",
    "language.english": "Anglais",
    "language.arabic": "Arabe",

    "header.aria.goBack": "Retour",
    "header.aria.openMenu": "Ouvrir le menu",
    "header.school.line1": "UNIVERSITÉ SIDI MOHAMED BEN ABDELLAH",
    "header.school.line2": "ÉCOLE SUPÉRIEURE DE TECHNOLOGIE DE FÈS",
    "header.supervisedBy": "Encadre par",
    "header.realizedBy": "Realise par",
    "header.notifications": "Notifications",
    "header.noNotifications": "Aucune notification",
    "header.logout": "Deconnexion",
    "header.notification.batteryLow": "Batterie faible",
    "header.notificationType.warning": "AVERTISSEMENT",
    "header.notificationType.error": "ERREUR",
    "header.notificationType.info": "INFO",

    "sidebar.dashboard": "Tableau de bord",
    "sidebar.analytics": "Analyses & Rapports",
    "sidebar.relayControl": "Controle Relais",
    "sidebar.aiPredictions": "Predictions IA",
    "sidebar.systemHealth": "Sante du Systeme",
    "sidebar.settings": "Parametres",
    "sidebar.profile": "Mon Profil",
    "sidebar.closeMenu": "Fermer le menu",
    "sidebar.administrator": "Administrateur",

    "login.brandMain": "CHMICHA",
    "login.brandSub": "Smart Energy Management for Solar Systems",
    "login.brandVision": "Toward a Smart and Sustainable Energy Future",
    "login.tagline": "",
    "login.aiMonitoring": "Suivi IA",
    "login.offGridReady": "Pret Off-grid",
    "login.connecting": "Connexion...",
    "login.enterDashboard": "Acceder au Dashboard",
    "login.school": "Ecole Superieure de Technologie (EST)",
    "login.projectType": "Projet de fin d'etudes",
    "login.supervisedBy": "Encadre par",
    "login.realizedBy": "Realise par",
    "login.footerBrand": "CHMICHA",
    "login.footerTagline": "Propulsez votre energie vers l'avenir",
    "login.footerVision": "Pour une vie plus intelligente et durable",
    "login.rightsReserved": "Tous droits reserves.",
    "login.reproduction": "Toute reproduction, publication ou diffusion sans autorisation est interdite.",
  },
  en: {
    "language.label": "Language",
    "language.french": "French",
    "language.english": "English",
    "language.arabic": "Arabic",

    "header.aria.goBack": "Go back",
    "header.aria.openMenu": "Open menu",
    "header.school.line1": "UNIVERSITÉ SIDI MOHAMED BEN ABDELLAH",
    "header.school.line2": "ÉCOLE SUPÉRIEURE DE TECHNOLOGIE DE FÈS",
    "header.supervisedBy": "Supervised by",
    "header.realizedBy": "Created by",
    "header.notifications": "Notifications",
    "header.noNotifications": "No notifications",
    "header.logout": "Logout",
    "header.notification.batteryLow": "Battery low",
    "header.notificationType.warning": "WARNING",
    "header.notificationType.error": "ERROR",
    "header.notificationType.info": "INFO",

    "sidebar.dashboard": "Dashboard",
    "sidebar.analytics": "Analytics & Reports",
    "sidebar.relayControl": "Relay Control",
    "sidebar.aiPredictions": "AI Predictions",
    "sidebar.systemHealth": "System Health",
    "sidebar.settings": "Settings",
    "sidebar.profile": "My Profile",
    "sidebar.closeMenu": "Close menu",
    "sidebar.administrator": "Administrator",

    "login.brandMain": "CHMICHA",
    "login.brandSub": "Smart solar energy orchestration platform",
    "login.brandVision": "Performance, autonomy, and real-time control.",
    "login.tagline": "",
    "login.aiMonitoring": "AI Monitoring",
    "login.offGridReady": "Off-grid Ready",
    "login.connecting": "Connecting...",
    "login.enterDashboard": "Open Dashboard",
    "login.school": "Higher School of Technology (EST)",
    "login.projectType": "Final-year project",
    "login.supervisedBy": "Supervised by",
    "login.realizedBy": "Created by",
    "login.footerBrand": "CHMICHA",
    "login.footerTagline": "Empower your energy future",
    "login.footerVision": "Making your life smarter and sustainable",
    "login.rightsReserved": "All rights reserved.",
    "login.reproduction": "Any reproduction, publication, or distribution without authorization is prohibited.",
  },
  ar: {
    "language.label": "اللغة",
    "language.french": "الفرنسية",
    "language.english": "الانجليزية",
    "language.arabic": "العربية",

    "header.aria.goBack": "رجوع",
    "header.aria.openMenu": "فتح القائمة",
    "header.school.line1": "UNIVERSITÉ SIDI MOHAMED BEN ABDELLAH",
    "header.school.line2": "ÉCOLE SUPÉRIEURE DE TECHNOLOGIE DE FÈS",
    "header.supervisedBy": "باشراف",
    "header.realizedBy": "انجاز",
    "header.notifications": "الاشعارات",
    "header.noNotifications": "لا توجد اشعارات",
    "header.logout": "تسجيل الخروج",
    "header.notification.batteryLow": "البطارية منخفضة",
    "header.notificationType.warning": "تحذير",
    "header.notificationType.error": "خطا",
    "header.notificationType.info": "معلومة",

    "sidebar.dashboard": "لوحة التحكم",
    "sidebar.analytics": "التحليلات والتقارير",
    "sidebar.relayControl": "التحكم في المرحلات",
    "sidebar.aiPredictions": "توقعات الذكاء الاصطناعي",
    "sidebar.systemHealth": "صحة النظام",
    "sidebar.settings": "الاعدادات",
    "sidebar.profile": "ملفي الشخصي",
    "sidebar.closeMenu": "اغلاق القائمة",
    "sidebar.administrator": "مدير النظام",

    "login.brandMain": "CHMICHA",
    "login.brandSub": "منصة ذكية لقيادة الطاقة الشمسية",
    "login.brandVision": "اداء قوي واستقلالية وتحكم لحظي.",
    "login.tagline": "",
    "login.aiMonitoring": "مراقبة بالذكاء الاصطناعي",
    "login.offGridReady": "جاهز خارج الشبكة",
    "login.connecting": "جار الاتصال...",
    "login.enterDashboard": "الدخول الى لوحة التحكم",
    "login.school": "المدرسة العليا للتكنولوجيا (EST)",
    "login.projectType": "مشروع نهاية الدراسة",
    "login.supervisedBy": "باشراف",
    "login.realizedBy": "انجاز",
    "login.footerBrand": "CHMICHA",
    "login.footerTagline": "سيطر على مستقبل طاقتك",
    "login.footerVision": "من اجل حياة اذكى واكثر استدامة",
    "login.rightsReserved": "جميع الحقوق محفوظة.",
    "login.reproduction": "يمنع اي نسخ او نشر او توزيع بدون ترخيص.",
  },
}

const isSiteLanguage = (value: string | null): value is SiteLanguage => {
  return value === "fr" || value === "en" || value === "ar"
}

function translate(language: SiteLanguage, key: string): string {
  return translations[language][key] ?? translations[FALLBACK_LANGUAGE][key] ?? key
}

interface LanguageContextValue {
  language: SiteLanguage
  locale: string
  direction: SiteDirection
  setLanguage: (language: SiteLanguage) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export const languageOptions: Array<{ code: SiteLanguage; short: string; labelKey: string }> = [
  { code: "fr", short: "FR", labelKey: "language.french" },
  { code: "en", short: "EN", labelKey: "language.english" },
  { code: "ar", short: "AR", labelKey: "language.arabic" },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>(FALLBACK_LANGUAGE)

  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEY)
    if (isSiteLanguage(storedLanguage)) {
      setLanguage(storedLanguage)
    }
  }, [])

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.lang = language
    htmlElement.dir = languageMeta[language].direction
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      locale: languageMeta[language].locale,
      direction: languageMeta[language].direction,
      setLanguage,
      t: (key: string) => translate(language, key),
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
