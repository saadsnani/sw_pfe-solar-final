import { evaluateSystemState } from "../lib/autonomous-decision-engine"
import { enforceSafetyRules } from "../lib/safety-override"

type ScenarioInput = {
  voltage: number
  current: number
  temperature: number
  batteryLevel: number
}

type Scenario = {
  id: number
  title: string
  input: ScenarioInput
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Normal Operation",
    input: { voltage: 13.5, current: 2, temperature: 30, batteryLevel: 80 },
  },
  {
    id: 2,
    title: "AI Decision - Low Battery",
    input: { voltage: 12.0, current: 2, temperature: 30, batteryLevel: 15 },
  },
  {
    id: 3,
    title: "Safety Emergency - Low Voltage",
    input: { voltage: 9.0, current: 2, temperature: 30, batteryLevel: 80 },
  },
  {
    id: 4,
    title: "Safety Emergency - Overheat",
    input: { voltage: 13.0, current: 2, temperature: 70, batteryLevel: 80 },
  },
]

const currentRelayState = {
  inverter: true,
  block1: true,
  block2: true,
}

for (const scenario of scenarios) {
  const sensorData = {
    voltage: scenario.input.voltage,
    current: scenario.input.current,
    temperature: scenario.input.temperature,
    batteryLevel: scenario.input.batteryLevel,
  }

  const aiDecision = evaluateSystemState(sensorData, currentRelayState)
  const safetyOverride = enforceSafetyRules(sensorData)

  const finalEffectiveDecision = safetyOverride.emergencyShutdown
    ? {
        decisionSource: "SAFETY_OVERRIDE",
        decision: safetyOverride,
      }
    : {
        decisionSource: "AI_DECISION_ENGINE",
        decision: aiDecision,
      }

  const priorityVerification =
    scenario.id === 3 || scenario.id === 4
      ? {
          expectedSafetyPriority: true,
          safetyTriggered: safetyOverride.emergencyShutdown,
          finalSourceIsSafety: finalEffectiveDecision.decisionSource === "SAFETY_OVERRIDE",
          passed:
            safetyOverride.emergencyShutdown
            && finalEffectiveDecision.decisionSource === "SAFETY_OVERRIDE",
        }
      : null

  console.log(`\n================ Scenario ${scenario.id}: ${scenario.title} ================`)
  console.log("Input JSON:")
  console.log(JSON.stringify(sensorData, null, 2))

  console.log("AI Decision JSON:")
  console.log(JSON.stringify(aiDecision, null, 2))

  console.log("Safety Override JSON:")
  console.log(JSON.stringify(safetyOverride, null, 2))

  console.log("Final Effective Decision JSON:")
  console.log(JSON.stringify(finalEffectiveDecision, null, 2))

  if (priorityVerification) {
    console.log("Safety Priority Verification JSON:")
    console.log(JSON.stringify(priorityVerification, null, 2))
  }
}
