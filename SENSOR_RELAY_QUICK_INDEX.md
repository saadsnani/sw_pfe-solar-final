# Sensor And Relay Quick Index

This file is the single reference for sensor values and relay states.

## Direct Links (Browser)

- Combined overview (one URL): `http://localhost:3000/api/system-overview`
- Latest sensors node: `https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app/sensors.json?print=pretty`
- Control node (mode + relays): `https://fir-esp-16cb0-default-rtdb.europe-west1.firebasedatabase.app/control.json?print=pretty`
- Relay API snapshot: `http://localhost:3000/api/relay-control`
- Safety API snapshot: `http://localhost:3000/api/safety-status`
- Control auth status: `http://localhost:3000/api/control-auth`

## What To Watch

- Sensor values: `temperature`, `batteryTemperature`, `humidity`, `Vpv`, `Ipv`, `Vbatt`, `Ibatt`, `Ppv`, `Pbatt`
- Relay state: `inverter`, `block1`, `block2`
- Mode: `manual` or `ai`
- Control timestamp: `controlUpdatedAt` (in sensors), `updatedAt` (in control)

## Core Files Only

- Sensor ingest + Firebase sync: `app/api/sensor-data/route.ts`
- Relay mode and relay writes: `app/api/relay-control/route.ts`
- One-shot combined status endpoint: `app/api/system-overview/route.ts`
- UI switches and relay controls: `components/relay-control-panel.tsx`
- Safety override logic: `lib/safety-override.ts`

## Quick Rule

- `/sensors` = latest sensor telemetry + mirrored relay fields for quick read.
- `/control` = source of truth for mode and relay control decisions.

## Security Notes

- Relay control now requires an authenticated control session cookie.
- Configure `CONTROL_PANEL_PASSWORD` and `CONTROL_SESSION_SECRET` in `.env.local`.
- Optional script automation can use `CONTROL_API_KEY` via header `x-control-key`.
