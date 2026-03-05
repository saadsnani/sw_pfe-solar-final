import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ChatRole = 'user' | 'assistant'
type SupportedLanguage = 'darija' | 'fr' | 'en'

interface ChatMessage {
  role: ChatRole
  content: string
}

interface RelayCommand {
  relay: number
  action: 'on' | 'off'
}

interface ApiResponse {
  success: true
  message: string
  analysis: string
  relayCommand: RelayCommand | null
  provider: 'openai'
}

interface SensorsSnapshot {
  batteryTemperature: number | null
  batteryVoltage: number | null
  ambientTemperature: number | null
  batteryLevel: number | null
  production: number | null
  consumption: number | null
}

interface ControlSnapshot {
  mode: 'manual' | 'ai'
  relays: {
    inverter: boolean
    block1: boolean
    block2: boolean
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
const OPENAI_FALLBACK_MESSAGE =
  'System analysis is temporarily offline due to high traffic, but your energy levels are safe.'
const openaiClient = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null

const FIREBASE_RTDB_URL =
  process.env.FIREBASE_RTDB_URL ||
  'https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app'

function toNumber(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function detectLanguage(message: string, preferred?: unknown): SupportedLanguage {
  if (preferred === 'darija' || preferred === 'fr' || preferred === 'en') return preferred

  const text = message.toLowerCase()
  if (/[\u0600-\u06ff]/.test(message)) return 'darija'

  const darijaHints = ['wach', 'bghit', '3afak', 'chno', 'kifach', 'ch3l', 'tfi', 'hseb']
  if (darijaHints.some((token) => text.includes(token))) return 'darija'

  const frenchHints = ['bonjour', 'système', 'analyse', 'température', 'batterie', 'onduleur', 'arrête']
  if (frenchHints.some((token) => text.includes(token))) return 'fr'

  return 'en'
}

function normalizeSensors(input: unknown): SensorsSnapshot {
  const source = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {}

  return {
    batteryTemperature: toNumber(source.batteryTemperature),
    batteryVoltage: toNumber(source.batteryVoltage ?? source.voltage),
    ambientTemperature: toNumber(source.temperature),
    batteryLevel: toNumber(source.batteryLevel ?? source.battery),
    production: toNumber(source.production ?? source.power),
    consumption: toNumber(source.consumption ?? source.load),
  }
}

function normalizeControl(input: unknown): ControlSnapshot {
  const source = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : {}
  const relays =
    typeof source.relays === 'object' && source.relays !== null
      ? (source.relays as Record<string, unknown>)
      : {}

  return {
    mode: source.mode === 'ai' ? 'ai' : 'manual',
    relays: {
      inverter: Boolean(relays.inverter),
      block1: Boolean(relays.block1),
      block2: Boolean(relays.block2),
    },
  }
}

function computeAnalysis(sensors: SensorsSnapshot, control: ControlSnapshot, language: SupportedLanguage): string {
  const batteryLevelText =
    sensors.batteryLevel === null
      ? language === 'fr'
        ? 'indisponible'
        : language === 'darija'
          ? 'ma kaynach'
          : 'unavailable'
      : `${Math.round(sensors.batteryLevel)}%`

  const batteryLevelValue = sensors.batteryLevel

  const batteryTempText =
    sensors.batteryTemperature === null
      ? language === 'fr'
        ? 'indisponible'
        : language === 'darija'
          ? 'ma kaynach'
          : 'unavailable'
      : `${sensors.batteryTemperature.toFixed(1)}°C`

  const batteryVoltageText =
    sensors.batteryVoltage === null
      ? language === 'fr'
        ? 'indisponible'
        : language === 'darija'
          ? 'ma kaynach'
          : 'unavailable'
      : `${sensors.batteryVoltage.toFixed(2)}V`

  const batteryTempValue = sensors.batteryTemperature

  const energyBalance =
    sensors.production !== null && sensors.consumption !== null
      ? Math.round(sensors.production - sensors.consumption)
      : null

  const balanceText =
    energyBalance === null
      ? language === 'fr'
        ? 'incomplet'
        : language === 'darija'
          ? 'naqes'
          : 'incomplete'
      : `${energyBalance}W`

  const healthStatus =
    batteryTempValue !== null && batteryTempValue > 50
      ? language === 'fr'
        ? 'Critique'
        : language === 'darija'
          ? 'Critical'
          : 'Critical'
      : batteryTempValue !== null && batteryTempValue > 42
        ? language === 'fr'
          ? 'Risque élevé'
          : language === 'darija'
            ? 'Risque 3ali'
            : 'High risk'
        : batteryLevelValue !== null && batteryLevelValue < 20
          ? language === 'fr'
            ? 'Énergie basse'
            : language === 'darija'
              ? 'Ta9a habta'
              : 'Low energy'
          : language === 'fr'
            ? 'Stable'
            : language === 'darija'
              ? 'Stable'
              : 'Stable'

  const safetyLine =
    batteryTempValue !== null && batteryTempValue > 50
      ? language === 'fr'
        ? '- **Alerte sécurité:** Température > 50°C, activez immédiatement le relais de refroidissement.'
        : language === 'darija'
          ? '- **Safety alert:** Temp > 50°C, khass cooling relay ych3el daba.'
          : '- **Safety alert:** Temperature > 50°C, trigger cooling safety relay now.'
      : language === 'fr'
        ? '- **Sécurité:** aucun dépassement critique détecté.'
        : language === 'darija'
          ? '- **Safety:** ma kayn ta critical exceedance daba.'
          : '- **Safety:** no critical threshold breach detected.'

  if (language === 'darija') {
    return [
      '### **System Health**',
      `- **Health:** ${healthStatus}`,
      '',
      '| Metric | Value |',
      '|---|---|',
      `| Battery % | ${batteryLevelText} |`,
      `| Battery Voltage | ${batteryVoltageText} |`,
      `| Battery Temp | ${batteryTempText} |`,
      `| Energy Balance | ${balanceText} |`,
      '',
      '### **Recommendations**',
      safetyLine,
      `- Energy balance: ${balanceText}`,
      `- Control mode: ${control.mode}`,
      `- Relays: inverter=${control.relays.inverter}, block1=${control.relays.block1}, block2=${control.relays.block2}`,
    ].join('\n')
  }

  if (language === 'fr') {
    return [
      '### **État de santé**',
      `- **Santé globale :** ${healthStatus}`,
      '',
      '| Mesure | Valeur |',
      '|---|---|',
      `| Batterie % | ${batteryLevelText} |`,
      `| Tension batterie | ${batteryVoltageText} |`,
      `| Température batterie | ${batteryTempText} |`,
      `| Bilan énergétique | ${balanceText} |`,
      '',
      '### **Recommandations**',
      safetyLine,
      `- Bilan énergétique : ${balanceText}`,
      `- Mode de contrôle : ${control.mode}`,
      `- Relais : inverter=${control.relays.inverter}, block1=${control.relays.block1}, block2=${control.relays.block2}`,
    ].join('\n')
  }

  return [
    '### **System Health**',
    `- **Overall health:** ${healthStatus}`,
    '',
    '| Metric | Value |',
    '|---|---|',
    `| Battery % | ${batteryLevelText} |`,
    `| Battery Voltage | ${batteryVoltageText} |`,
    `| Battery Temperature | ${batteryTempText} |`,
    `| Energy Balance | ${balanceText} |`,
    '',
    '### **Recommendations**',
    safetyLine,
    `- Energy balance: ${balanceText}`,
    `- Control mode: ${control.mode}`,
    `- Relays: inverter=${control.relays.inverter}, block1=${control.relays.block1}, block2=${control.relays.block2}`,
  ].join('\n')
}

function wantsRelayControl(message: string): boolean {
  const text = message.toLowerCase()
  const terms = [
    'relay',
    'relai',
    'relays',
    'activate relays',
    'control relay',
    'onduleur',
    'inverter',
    'block1',
    'block2',
    'ch3l',
    'tfi',
    'sdd',
    'sed',
    'sedd',
    'ysd',
    'سكر',
    'سد',
    '7ell',
    'fta7',
    'fta7',
    'yft7',
    'حل',
    'فتح',
    'ouvrir',
    'fermer',
    'eteindre',
    'éteindre',
    'demarrer',
    'démarrer',
    'allume',
    'arrête',
    'arrete',
    'turn on',
    'turn off',
  ]

  return terms.some((term) => text.includes(term))
}

function parseRelayCommandFromMessage(message: string): RelayCommand | null {
  const text = message.toLowerCase()
  if (!wantsRelayControl(message) && !text.includes('more power') && !text.includes('turn on the fans') && !text.includes('need power')) return null

  if (text.includes('turn on the fans') || text.includes('fans') || text.includes('ventilateur')) {
    return { relay: 2, action: 'on' }
  }

  if (text.includes('more power') || text.includes('need power') || text.includes('plus de puissance')) {
    return { relay: 1, action: 'on' }
  }

  const relay = text.includes('inverter') || text.includes('onduleur')
    ? 0
    : text.includes('block2') || text.includes('block 2')
      ? 2
      : 1

  const actionOffTerms = [
    'off',
    'turn off',
    'stop',
    'disable',
    'tfi',
    'sdd',
    'sed',
    'sedd',
    'ysd',
    'سكر',
    'سد',
    'arrête',
    'arrete',
    'fermer',
    'eteindre',
    'éteindre',
  ]

  const actionOnTerms = [
    'on',
    'turn on',
    'enable',
    'start',
    'run',
    'ch3l',
    '7ell',
    'fta7',
    'fta7',
    'yft7',
    'حل',
    'فتح',
    'allume',
    'ouvrir',
    'demarrer',
    'démarrer',
  ]

  const hasOffIntent = actionOffTerms.some((term) => text.includes(term))
  const hasOnIntent = actionOnTerms.some((term) => text.includes(term))

  const action: 'on' | 'off' = hasOffIntent ? 'off' : hasOnIntent ? 'on' : 'on'

  return { relay, action }
}

function wantsStatusReport(message: string): boolean {
  const text = message.toLowerCase()
  const statusTerms = [
    'status',
    'system status',
    'health',
    'analysis',
    'analyze',
    'rapport',
    'état',
    'etat',
    'chno l7ala',
    'kif dayra',
    'situation',
  ]
  return statusTerms.some((term) => text.includes(term))
}

function buildAutonomousRelayCommand(message: string, sensors: SensorsSnapshot, _control: ControlSnapshot): RelayCommand | null {
  if (sensors.batteryTemperature !== null && sensors.batteryTemperature > 50) {
    return { relay: 2, action: 'on' }
  }

  const fromMessage = parseRelayCommandFromMessage(message)
  if (fromMessage) return fromMessage

  return null
}

function buildRelayActionResponse(
  language: SupportedLanguage,
  command: RelayCommand,
): Pick<ApiResponse, 'message' | 'analysis' | 'relayCommand'> {
  const relayLabel = command.relay === 0 ? 'Onduleur' : command.relay === 1 ? 'Block1' : 'Block2'
  const actionLabel = command.action === 'on' ? 'ON' : 'OFF'

  if (language === 'fr') {
    return {
      message: `Commande exécutée: ${relayLabel} → ${actionLabel}.`,
      analysis: `Action directe appliquée sans analyse longue pour éviter les réponses ambiguës.`,
      relayCommand: command,
    }
  }

  if (language === 'darija') {
    return {
      message: `تم تنفيذ الأمر: ${relayLabel} → ${actionLabel}.`,
      analysis: 'Ttbi9 direct bla jawabat twila bach l-command tb9a wadi7a.',
      relayCommand: command,
    }
  }

  return {
    message: `Command executed: ${relayLabel} → ${actionLabel}.`,
    analysis: 'Direct control action applied without long analysis to avoid ambiguous responses.',
    relayCommand: command,
  }
}

function extractFirstJson(raw: string): string | null {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  return raw.slice(start, end + 1)
}

function normalizeRelayCommand(input: unknown): RelayCommand | null {
  if (!input || typeof input !== 'object') return null
  const source = input as Record<string, unknown>
  const relay = Number(source.relay)
  const action = source.action === 'off' ? 'off' : source.action === 'on' ? 'on' : null

  if (!Number.isFinite(relay) || relay < 0 || relay > 2 || !action) return null
  return { relay, action }
}

async function fetchFirebaseSnapshot(): Promise<{ sensors: SensorsSnapshot; control: ControlSnapshot }> {
  const baseUrl = FIREBASE_RTDB_URL.replace(/\/$/, '')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const [sensorsRes, controlRes] = await Promise.all([
      fetch(`${baseUrl}/sensors.json`, { cache: 'no-store', signal: controller.signal }),
      fetch(`${baseUrl}/control.json`, { cache: 'no-store', signal: controller.signal }),
    ])

    const sensorsRaw = sensorsRes.ok ? await sensorsRes.json() : null
    const controlRaw = controlRes.ok ? await controlRes.json() : null

    return {
      sensors: normalizeSensors(sensorsRaw),
      control: normalizeControl(controlRaw),
    }
  } finally {
    clearTimeout(timer)
  }
}

async function callOpenAI(params: {
  message: string
  language: SupportedLanguage
  history: ChatMessage[]
  sensors: SensorsSnapshot
  control: ControlSnapshot
  forcedRelayCommand: RelayCommand | null
  statusRequested: boolean
  allowModelRelayOverride: boolean
}): Promise<ApiResponse> {
  const { message, language, history, sensors, control, forcedRelayCommand, statusRequested, allowModelRelayOverride } = params
  const analysis = computeAnalysis(sensors, control, language)
  const includeAnalysis = statusRequested || allowModelRelayOverride

  if (!openaiClient) {
    return {
      success: true,
      message: OPENAI_FALLBACK_MESSAGE,
      analysis: includeAnalysis ? analysis : '',
      relayCommand: forcedRelayCommand ?? null,
      provider: 'openai',
    }
  }

  const systemPrompt = [
    'You are an Expert Autonomous AI Systems Engineer for a real-time solar system.',
    'You have full access to real-time data: Battery %, Voltage, Temperature, Production, Consumption, Control mode, Relay states.',
    'Tone: scientific, helpful, concise, actionable. No filler lines.',
    'Language: seamlessly adapt to user preference (Darija/French/English).',
    'Primary rule: answer the user intent directly first (question, math, command, explanation).',
    'Do NOT output full system status tables unless the user explicitly asks for status/health/analysis.',
    'If status is not requested, keep analysis short (1-3 bullets max) and focused on user ask.',
    'When status is requested, perform deep analysis: explain health status, not just numbers.',
    'If user asks for more power / fans / relay control, include relayCommand immediately.',
    'If battery temperature > 50°C, highlight critical risk and trigger safety relay command.',
    'Format output using Markdown. Use compact tables only when status is requested.',
    'Return STRICT JSON only with this schema:',
    '{"success":true,"message":"Friendly response in Markdown","analysis":"Technical details about energy/safety","relayCommand":{"relay":number,"action":"on|off"},"provider":"openai"}',
    `Status explicitly requested: ${statusRequested ? 'yes' : 'no'}`,
    `Language: ${language}`,
    `Sensors: ${JSON.stringify(sensors)}`,
    `Control: ${JSON.stringify(control)}`,
    `Forced relay command (if already detected): ${JSON.stringify(forcedRelayCommand)}`,
  ].join('\n')

  const chatHistory = history
    .slice(-8)
    .filter((entry) => typeof entry.content === 'string')
    .map((entry) => ({ role: entry.role, content: entry.content }))

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory,
    {
      role: 'user',
      content: statusRequested
        ? message
        : `${message}\n\nReminder: respond to this exact user intent and avoid full status table unless explicitly requested.`,
    },
  ]

  try {
    const completion = await openaiClient.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages,
    })

    const raw = completion.choices?.[0]?.message?.content?.trim() || ''

    let parsed: Partial<ApiResponse> | null = null
    try {
      const payload = extractFirstJson(raw) || raw
      parsed = JSON.parse(payload) as Partial<ApiResponse>
    } catch {
      parsed = {
        success: true,
        message: raw || OPENAI_FALLBACK_MESSAGE,
        analysis: includeAnalysis ? analysis : '',
        relayCommand: forcedRelayCommand ?? null,
        provider: 'openai',
      }
    }

    const parsedRelay = normalizeRelayCommand(parsed?.relayCommand)
    const relayCommand = allowModelRelayOverride ? forcedRelayCommand ?? parsedRelay : null

    return {
      success: true,
      message: typeof parsed?.message === 'string' ? parsed.message : OPENAI_FALLBACK_MESSAGE,
      analysis: includeAnalysis ? (typeof parsed?.analysis === 'string' ? parsed.analysis : analysis) : '',
      relayCommand: relayCommand ?? null,
      provider: 'openai',
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`[AI][openai] API error (${error.status ?? 'unknown'}): ${error.message}`)
    } else {
      console.error('[AI][openai] Unexpected error:', error)
    }

    return {
      success: true,
      message: OPENAI_FALLBACK_MESSAGE,
      analysis: includeAnalysis ? analysis : '',
      relayCommand: forcedRelayCommand ?? null,
      provider: 'openai',
    }
  }
}

export async function POST(request: NextRequest) {
  const keyPrefix = (process.env.OPENAI_API_KEY || '').slice(0, 5)
  console.log(`[AI][openai] key prefix: ${keyPrefix || 'empty'}`)

  try {
    const body = (await request.json()) as {
      message?: string
      history?: ChatMessage[]
      preferredLanguage?: SupportedLanguage
    }

    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const language = detectLanguage(message, body.preferredLanguage)
    const history = Array.isArray(body.history) ? body.history : []

    if (!message) {
      return NextResponse.json({
        success: true,
        message: 'Message is required.',
        analysis: 'No message received from client.',
        relayCommand: null,
        provider: 'openai',
      } satisfies ApiResponse)
    }

    const { sensors, control } = await fetchFirebaseSnapshot().catch(() => ({
      sensors: normalizeSensors(null),
      control: normalizeControl(null),
    }))

    const statusRequested = wantsStatusReport(message)
    const explicitRelayIntent = wantsRelayControl(message)
    const criticalTemp = sensors.batteryTemperature !== null && sensors.batteryTemperature > 50
    const shouldAutoRelay = explicitRelayIntent || (criticalTemp && statusRequested)
    const forcedRelayCommand = shouldAutoRelay ? buildAutonomousRelayCommand(message, sensors, control) : null
    const allowModelRelayOverride = shouldAutoRelay

    if (explicitRelayIntent && forcedRelayCommand) {
      const directControl = buildRelayActionResponse(language, forcedRelayCommand)
      return NextResponse.json({
        success: true,
        message: directControl.message,
        analysis: directControl.analysis,
        relayCommand: directControl.relayCommand,
        provider: 'openai',
      } satisfies ApiResponse)
    }

    const response = await callOpenAI({
      message,
      language,
      history,
      sensors,
      control,
      forcedRelayCommand,
      statusRequested,
      allowModelRelayOverride,
    })

    const safetyOverrideMessage =
      language === 'fr'
        ? 'Sécurité prioritaire: température batterie critique. Le relais 2 est activé pour protection.'
        : language === 'darija'
          ? 'السلامة أولاً: حرارة البطارية خطيرة. تم تشغيل relay 2 للحماية.'
          : 'Safety first: battery temperature is critical. Relay 2 is forced ON for protection.'

    const finalResponse =
      criticalTemp && forcedRelayCommand?.relay === 2 && forcedRelayCommand?.action === 'on'
        ? {
            ...response,
            message: safetyOverrideMessage,
            relayCommand: forcedRelayCommand,
          }
        : response

    return NextResponse.json(finalResponse)
  } catch {
    return NextResponse.json({
      success: true,
      message: OPENAI_FALLBACK_MESSAGE,
      analysis: 'Fallback response returned due to request processing issue.',
      relayCommand: null,
      provider: 'openai',
    } satisfies ApiResponse)
  }
}
