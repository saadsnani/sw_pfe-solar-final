import process from "node:process";

type SensorPayload = {
  Vpv: number;
  Ipv: number;
  Vbatt: number;
  Ibatt: number;
  temperature: number;
  batteryTemperature: number;
  humidity: number;
  block1: boolean;
  block2: boolean;
  wifiSsid: string;
  timestamp: string;
};

type ControlSnapshot = {
  mode: string;
  inverter: boolean | null;
  block1: boolean | null;
  block2: boolean | null;
};

function getArg(name: string, fallback: string): string {
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  return fallback;
}

function rand(min: number, max: number, decimals = 2): number {
  const value = min + Math.random() * (max - min);
  return Number(value.toFixed(decimals));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toBool(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "on" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "off" || normalized === "0") {
      return false;
    }
  }
  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }
  return null;
}

function toOnOff(value: boolean | null): string {
  if (value === null) {
    return "?";
  }
  return value ? "ON" : "OFF";
}

function makePayload(): SensorPayload {
  const Vpv = rand(18, 27, 2);
  return {
    Vpv,
    Ipv: rand(1, 10, 2),
    Vbatt: rand(11.6, 13.3, 2),
    Ibatt: rand(-1.8, 3.8, 2),
    temperature: rand(24, 39, 1),
    batteryTemperature: rand(24, 39, 1),
    humidity: rand(35, 80, 1),
    block1: Vpv > 19,
    block2: Vpv > 21,
    wifiSsid: "ESP32-RANDOM-DEMO",
    timestamp: new Date().toISOString(),
  };
}

async function readControlSnapshot(controlUrl: string): Promise<ControlSnapshot> {
  const response = await fetch(controlUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Control fetch failed (${response.status})`);
  }

  const data = (await response.json()) as Record<string, unknown> | null;
  const safeData = data ?? {};
  const relaysRaw =
    typeof safeData.relays === "object" && safeData.relays !== null
      ? (safeData.relays as Record<string, unknown>)
      : {};

  const mode = typeof safeData.mode === "string" ? safeData.mode : "unknown";
  const inverter = toBool(relaysRaw.inverter ?? safeData.inverter);
  const block1 = toBool(relaysRaw.block1 ?? safeData.block1);
  const block2 = toBool(relaysRaw.block2 ?? safeData.block2);

  return { mode, inverter, block1, block2 };
}

async function main(): Promise<void> {
  const apiUrl = process.env.SENSOR_API_URL ?? getArg("--url", "http://localhost:3000/api/sensor-data");
  const controlUrl =
    process.env.CONTROL_STATUS_URL ??
    getArg("--control-url", "https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app/control.json");
  const intervalMs = Number(process.env.RANDOM_INTERVAL_MS ?? getArg("--interval", "2000"));
  const count = Number(process.env.RANDOM_COUNT ?? getArg("--count", "0"));

  if (!Number.isFinite(intervalMs) || intervalMs < 100) {
    throw new Error("Invalid interval. Use --interval >= 100 ms");
  }
  if (!Number.isFinite(count) || count < 0) {
    throw new Error("Invalid count. Use --count >= 0 (0 means infinite)");
  }

  let stopRequested = false;
  process.on("SIGINT", () => {
    stopRequested = true;
    console.log("Stopping random simulator...");
  });

  console.log(`Random simulator started -> ${apiUrl}`);
  console.log(`Control watch -> ${controlUrl}`);
  console.log(`Mode: ${count === 0 ? "infinite" : `${count} samples`} | interval=${intervalMs}ms`);

  let i = 0;
  while (!stopRequested && (count === 0 || i < count)) {
    i += 1;
    try {
      const payload = makePayload();
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`POST failed (${response.status}): ${text}`);
      }

      const control = await readControlSnapshot(controlUrl);
      console.log(
        `[${i}] Vpv=${payload.Vpv} Ipv=${payload.Ipv} Vbatt=${payload.Vbatt} Temp=${payload.temperature} | sent(b1=${toOnOff(payload.block1)} b2=${toOnOff(payload.block2)}) | mode=${control.mode} inv=${toOnOff(control.inverter)} b1=${toOnOff(control.block1)} b2=${toOnOff(control.block2)}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${i}] ERROR -> ${message}`);
    }

    if (!stopRequested && (count === 0 || i < count)) {
      await sleep(intervalMs);
    }
  }

  console.log(`Random simulator finished. Sent: ${i}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Fatal error: ${message}`);
  process.exit(1);
});
