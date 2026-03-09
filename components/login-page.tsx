"use client"

import { useState } from "react"
import { Plus_Jakarta_Sans, Sora } from "next/font/google"
import Image from "next/image"
import { ArrowRight, BatteryCharging, BrainCircuit, Loader2, ShieldCheck, Sun, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-provider"

interface LoginPageProps {
  onLogin: () => void
}

const displayFont = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
})

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { t, direction } = useLanguage()

  const handleEnter = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)
    onLogin()
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${bodyFont.className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/large-solar-panel-farm-installation-at-sunset-with.jpg')" }}
      />
      <div className="absolute inset-0 bg-slate-950/58" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(52,211,153,0.42),transparent_35%),radial-gradient(circle_at_85%_8%,rgba(56,189,248,0.3),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(14,165,233,0.18),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.15),transparent_45%,rgba(59,130,246,0.15))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_76%,rgba(250,204,21,0.14),transparent_30%),radial-gradient(circle_at_88%_22%,rgba(34,211,238,0.12),transparent_28%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-6 sm:max-w-lg sm:px-6">
        <section className="relative w-full overflow-hidden rounded-[32px] border border-white/80 bg-[linear-gradient(165deg,rgba(255,255,255,0.985),rgba(240,253,248,0.95)_43%,rgba(236,248,255,0.93))] p-6 shadow-[0_32px_76px_rgba(7,26,43,0.35),0_0_0_1px_rgba(255,255,255,0.3)] backdrop-blur-xl sm:p-8 animate-[riseFade_0.45s_ease-out]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.78),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_50%_102%,rgba(16,185,129,0.16),transparent_44%)]" />
          <div className="pointer-events-none absolute -left-[62%] top-[-30%] h-[230px] w-[200%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.52),transparent)] blur-2xl animate-[cardShimmer_6.2s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-emerald-300/45 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 -left-12 h-36 w-36 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full bg-green-300/25 blur-2xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/80 via-green-400/75 to-sky-500/70" />

          <div className="relative z-10 space-y-6 text-center sm:space-y-7">
            <header className="space-y-6">
              <div className="relative flex w-full items-center justify-start gap-4 rounded-2xl border border-emerald-300/70 bg-[linear-gradient(118deg,rgba(16,185,129,0.14),rgba(255,255,255,0.9)_38%,rgba(14,165,233,0.14))] px-5 py-4 shadow-[0_10px_24px_rgba(16,185,129,0.14)] sm:px-6 sm:py-4">
                <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/75 to-transparent" />
                <div className="h-12 w-12 overflow-hidden rounded-xl border border-white/90 bg-white shadow-[0_6px_14px_rgba(16,185,129,0.2)] ring-1 ring-emerald-300/55 sm:h-14 sm:w-14">
                  <Image src="/images.jpg" alt={t("login.school")} width={64} height={64} className="h-full w-full object-cover" priority />
                </div>
                <div className="min-w-0 flex-1 space-y-1 text-left leading-snug">
                  <p className="text-[12px] font-bold leading-snug text-emerald-900 sm:text-[13px]">
                    {"UNIVERSIT\u00c9 SIDI MOHAMED BEN ABDELLAH"}
                  </p>
                  <p className="text-[11px] font-medium leading-snug text-slate-700 sm:text-[12px]">
                    {"\u00c9COLE SUP\u00c9RIEURE DE TECHNOLOGIE DE F\u00c8S"}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(239,252,246,0.93)_48%,rgba(233,247,255,0.93))] px-5 py-6 shadow-[0_12px_26px_rgba(15,23,42,0.1)] sm:px-7 sm:py-7">
                <span className="pointer-events-none absolute -left-8 top-8 h-20 w-20 rounded-full bg-emerald-300/25 blur-2xl" />
                <span className="pointer-events-none absolute -right-6 bottom-6 h-16 w-16 rounded-full bg-sky-300/25 blur-2xl" />

                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                  <div className="inline-flex items-center rounded-full border border-emerald-300/75 bg-white/90 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-emerald-700">
                    Smart Energy Platform
                  </div>

                  <div className="relative flex h-[4.15rem] w-[4.15rem] items-center justify-center rounded-[1.15rem] border border-emerald-300/85 bg-white shadow-[0_10px_24px_rgba(16,185,129,0.22)] animate-[logoBreath_4.8s_ease-in-out_infinite]">
                    <span className="pointer-events-none absolute -inset-1 rounded-[1.2rem] border border-emerald-300/45" />
                    <Sun className="h-6 w-6 text-emerald-600" />
                    <span className="pointer-events-none absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.75)] animate-pulse" />
                  </div>

                  <div className="space-y-3">
                    <h1 className={`${displayFont.className} text-[2.35rem] font-extrabold tracking-[-0.045em] text-transparent bg-gradient-to-r from-emerald-800 via-emerald-600 to-sky-600 bg-clip-text sm:text-[2.75rem]`}>
                      {t("login.brandMain")}
                    </h1>
                    <p className="mx-auto max-w-md text-[0.92rem] font-semibold leading-relaxed tracking-[0.008em] text-slate-600 sm:text-[1rem]">
                      {t("login.brandSub")}
                    </p>
                    <p className="mx-auto max-w-md text-[0.8rem] italic leading-relaxed text-sky-700/90 sm:text-[0.86rem]">{t("login.brandVision")}</p>
                  </div>

                  <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2.5 pt-1">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/75 bg-white/92 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 shadow-[0_6px_14px_rgba(16,185,129,0.12)] sm:text-[11px]">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <BrainCircuit className="h-3.5 w-3.5" />
                      </span>
                      {t("login.aiMonitoring")}
                    </span>

                    <span className="inline-flex h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-emerald-400 to-sky-400" />

                    <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/75 bg-white/92 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-sky-700 shadow-[0_6px_14px_rgba(14,165,233,0.12)] sm:text-[11px]">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                        <BatteryCharging className="h-3.5 w-3.5" />
                      </span>
                      {t("login.offGridReady")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-[15rem] items-center gap-2 text-emerald-600/80">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/70 to-emerald-300/70" />
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-400/70 to-sky-300/70" />
              </div>
            </header>

            <section className="space-y-3 text-center">
              <div className="w-full pt-1">
                <Button
                  type="button"
                  onClick={handleEnter}
                  className="group relative h-14 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-sky-500 px-7 text-[15px] font-bold text-white shadow-[0_16px_34px_rgba(14,165,233,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_46px_rgba(16,185,129,0.45)] focus-visible:ring-2 focus-visible:ring-emerald-400"
                  disabled={isLoading}
                >
                  <span className="pointer-events-none absolute inset-y-0 left-[-45%] w-[38%] skew-x-[-24deg] bg-white/45 opacity-0 transition-all duration-700 group-hover:left-[126%] group-hover:opacity-100" />
                  {isLoading ? (
                    <span className="relative z-10 inline-flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("login.connecting")}
                    </span>
                  ) : (
                    <span className="relative z-10 inline-flex items-center">
                      <Zap className="mr-2 h-5 w-5" />
                      {t("login.enterDashboard")}
                      <ArrowRight
                        className={`h-4 w-4 transition-transform duration-300 ${
                          direction === "rtl" ? "mr-1 rotate-180 group-hover:-translate-x-1" : "ml-1 group-hover:translate-x-1"
                        }`}
                      />
                    </span>
                  )}
                </Button>
              </div>
            </section>

            <section className="rounded-2xl border border-white/80 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-sm sm:p-5">
              <div className="rounded-xl border border-slate-200/80 bg-white/80 px-4 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">{t("login.projectType")}</p>

                <div className="mt-4 grid gap-3 text-left text-sm">
                  <article className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{t("login.supervisedBy")}</p>
                      <p className="mt-0.5 font-semibold text-slate-900">M. Abdelaziz FRI</p>
                    </div>
                  </article>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

                  <article className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700">
                      <Users className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{t("login.realizedBy")}</p>
                      <p className="mt-0.5 font-semibold text-slate-900">Saad SNANI</p>
                      <p className="font-semibold text-slate-900">Walid EL HALOUAT</p>
                    </div>
                  </article>
                </div>
              </div>
            </section>

            <footer className="pt-3 text-center">
              <div className="border-t border-slate-200/75 pt-3">
                <p className="text-[11px] font-medium text-slate-500 sm:text-xs">{t("login.rightsReserved")}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-700 sm:text-xs">
                  @2026 SMART EMS
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700/90 sm:text-[11px]">
                  By Saad Snani
                </p>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}
