# Quick Reference: Using Real Sensor Data

## 🎯 For Hardware Integration

### Option 1: Simple Update (One Component)

```typescript
// In any component
import { useSensorConnection } from '@/hooks/use-sensor-connection'

export function MyComponent() {
  const batteryState = useSensorConnection<number>('battery')
  
  useEffect(() => {
    // When you receive data from hardware:
    batteryState.updateValue(85)
  }, [])
  
  return (
    <div>
      {batteryState.connected ? (
        <p>Battery: {batteryState.value}%</p>
      ) : (
        <p>Battery: Non connecté</p>
      )}
    </div>
  )
}
```

### Option 2: Global System State

```typescript
// In dashboard-content.tsx or main layout
import { useSystemSensors } from '@/hooks/use-sensor-connection'

export function DashboardContent() {
  const { state: sensors, updateBattery, updateProduction, ... } = useSystemSensors()
  
  useEffect(() => {
    // Connect to hardware
    const unsubscribe = hardwareAPI.subscribe(data => {
      if (data.battery !== undefined) updateBattery(data.battery)
      if (data.production !== undefined) updateProduction(data.production)
      if (data.consumption !== undefined) updateConsumption(data.consumption)
      if (data.temperature !== undefined) updateTemperature(data.temperature)
    })
    
    return unsubscribe
  }, [updateBattery, updateProduction, updateConsumption, updateTemperature])
  
  // Pass sensors to all components
  return (
    <>
      <MetricCards sensors={sensors} />
      <EnergyChart sensors={sensors} />
      <GridIntegrationStatus sensors={sensors} />
      {/* ... */}
    </>
  )
}
```

## 📊 Connection States

### ✅ Connected with Real Data
```typescript
const sensor = {
  connected: true,
  value: 85,
  status: 'connected',
  statusMessage: 'Connecté',
  lastUpdate: '2025-12-19T10:30:45Z',
  error: null
}
// Display: "85%"
```

### ❌ Not Connected
```typescript
const sensor = {
  connected: false,
  value: null,
  status: 'disconnected',
  statusMessage: 'Non connecté',
  lastUpdate: null,
  error: 'Device not found'
}
// Display: "Non connecté"
```

### ⚠️ Error State
```typescript
const sensor = {
  connected: false,
  value: null,
  status: 'error',
  statusMessage: 'Erreur de lecture',
  lastUpdate: null,
  error: 'Timeout reading sensor'
}
// Display: "Erreur de lecture"
```

## 🔌 Common Integration Patterns

### Serial Port (ESP32/Arduino)
```typescript
useEffect(() => {
  const port = await navigator.serial.requestPort()
  await port.open({ baudRate: 9600 })
  
  const reader = port.readable.getReader()
  
  (async () => {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      const text = new TextDecoder().decode(value)
      const data = JSON.parse(text)
      
      updateBattery(data.battery)
      updateProduction(data.production)
      // ...
    }
  })()
}, [])
```

### MQTT
```typescript
useEffect(() => {
  const client = mqtt.connect('mqtt://broker.example.com')
  
  client.subscribe('sensors/battery')
  client.subscribe('sensors/production')
  
  client.on('message', (topic, message) => {
    const value = parseFloat(message.toString())
    
    if (topic === 'sensors/battery') updateBattery(value)
    if (topic === 'sensors/production') updateProduction(value)
  })
  
  return () => client.end()
}, [])
```

### REST API Polling
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await fetch('/api/sensors').then(r => r.json())
    
    if (data.battery !== undefined) updateBattery(data.battery)
    if (data.production !== undefined) updateProduction(data.production)
    if (data.consumption !== undefined) updateConsumption(data.consumption)
    if (data.temperature !== undefined) updateTemperature(data.temperature)
  }, 1000)
  
  return () => clearInterval(interval)
}, [])
```

### WebSocket Real-time
```typescript
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/sensors')
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    
    updateBattery(data.battery)
    updateProduction(data.production)
    updateConsumption(data.consumption)
    updateTemperature(data.temperature)
  }
  
  return () => ws.close()
}, [])
```

## 🧪 Testing with Simulation

To test the UI with fake data (development only):

```typescript
// In dashboard-content.tsx
useEffect(() => {
  const timer = setInterval(() => {
    // Simulate sensor updates every 2 seconds
    updateBattery(50 + Math.random() * 50)
    updateProduction(Math.random() * 500)
    updateConsumption(100 + Math.random() * 400)
    updateTemperature(15 + Math.random() * 30)
  }, 2000)
  
  return () => clearInterval(timer)
}, [updateBattery, updateProduction, updateConsumption, updateTemperature])
```

**⚠️ IMPORTANT:** Remove or comment out this code before deploying to production!

## 📝 Error Handling

### Handle Sensor Errors
```typescript
useEffect(() => {
  try {
    const data = await readSensor()
    updateBattery(data.battery)
  } catch (error) {
    setError('battery', `Failed to read sensor: ${error.message}`)
  }
}, [])
```

### Handle Disconnection
```typescript
useEffect(() => {
  const handleDisconnect = () => {
    // All sensors go to disconnected state
    disconnectAll()
    
    // Or disconnect individual sensors
    // disconnectBattery()
  }
  
  hardware.on('disconnect', handleDisconnect)
  
  return () => hardware.off('disconnect', handleDisconnect)
}, [])
```

## 🎨 Component Props

### All components now accept `sensors` prop:

```typescript
// Before
<MetricCards />

// After - with real sensors
<MetricCards sensors={sensorsState} />
```

**Affected components:**
- `<MetricCards sensors={sensors} />`
- `<GridIntegrationStatus sensors={sensors} />`
- `<EnergyChart sensors={sensors} historicalData={data} />`
- `<AnalyticsPageEnhanced sensors={sensors} />`
- `<SystemSynoptic sensors={sensors} />`
- `<AIInsightsPanel sensors={sensors} />`
- `<SystemStatusBoard sensors={sensors} />`

## 🔍 Checking Connection Status

```typescript
import { hasRealData, getSensorValue } from '@/lib/sensor-connection'

// Check if sensor has real data
if (hasRealData(sensors.battery)) {
  console.log('Battery has real data')
}

// Safely get value (returns null if not connected)
const value = getSensorValue(sensors.battery)
console.log(value)  // 85 or null
```

## 📚 Reference Files

- **Types:** `lib/sensor-connection.ts`
- **Hooks:** `hooks/use-sensor-connection.ts`
- **Documentation:** `REFACTORING_NOTES.md`
- **Summary:** `REFACTORING_SUMMARY.md`

---

**Status:** ✅ Production Ready
**No fake data:** ✅ Confirmed
**Hardware ready:** ✅ Yes
