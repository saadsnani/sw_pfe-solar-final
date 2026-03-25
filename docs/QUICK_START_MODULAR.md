# 🎯 Quick Start - Using Your New Modular Code

## 📦 Three Ways to Import

### Option 1: Direct Import (Recommended)
```typescript
import { fetchBatteryTemperature } from '@/frontend/lib/api/data-manager';
import { formatTemperature } from '@/frontend/lib/ui/ui-manager';
```

### Option 2: Single Import (Clean)
```typescript
import { 
  fetchBatteryTemperature,
  formatTemperature,
  getTemperatureStatus 
} from '@/frontend/lib';
```

### Option 3: Namespace Import
```typescript
import * as DataManager from '@/frontend/lib/api/data-manager';
import * as UIManager from '@/frontend/lib/ui/ui-manager';

const result = await DataManager.fetchBatteryTemperature();
const temp = UIManager.formatTemperature(35.5);
```

---

## 🚀 Complete Component Examples

### Example 1: Simple Temperature Display

```typescript
'use client';

import { useEffect, useState } from 'react';
import { 
  fetchBatteryTemperature, 
  formatTemperature,
  getTemperatureStatus 
} from '@/frontend/lib';

export function TemperatureDisplay() {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchBatteryTemperature();
      if (result.success && result.data?.current) {
        setTemp(result.data.current.batteryTemperature);
      }
    };
    loadData();
  }, []);

  const status = getTemperatureStatus(temp);

  return (
    <div>
      <h2>Battery Temperature</h2>
      <p className={status.color}>
        {status.icon} {formatTemperature(temp)} - {status.label}
      </p>
    </div>
  );
}
```

---

### Example 2: Real-Time Chart

```typescript
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  subscribeToBatteryTemperature,
  formatChartData,
  getTemperatureColor,
  type SensorReading 
} from '@/frontend/lib';

export function TemperatureChart() {
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToBatteryTemperature((data) => {
      setReadings(data.readings);
    }, 3000); // Poll every 3 seconds

    return () => unsubscribe(); // Cleanup
  }, []);

  const chartData = formatChartData(readings);
  const latestTemp = readings[readings.length - 1]?.batteryTemperature;

  return (
    <LineChart width={600} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Line 
        type="monotone" 
        dataKey="battery" 
        stroke={getTemperatureColor(latestTemp)} 
        strokeWidth={2}
      />
    </LineChart>
  );
}
```

---

### Example 3: Export Data Button

```typescript
'use client';

import { useState } from 'react';
import { fetchBatteryTemperature, exportDataAsJson, exportDataAsCsv } from '@/frontend/lib';
import { Button } from '@/components/ui/button';

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'json' | 'csv') => {
    setLoading(true);
    try {
      const result = await fetchBatteryTemperature(100); // Get last 100 readings
      
      if (result.success && result.data) {
        if (format === 'json') {
          exportDataAsJson(result.data.readings);
        } else {
          exportDataAsCsv(result.data.readings);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => handleExport('json')} disabled={loading}>
        Export JSON
      </Button>
      <Button onClick={() => handleExport('csv')} disabled={loading}>
        Export CSV
      </Button>
    </div>
  );
}
```

---

### Example 4: Status Dashboard

```typescript
'use client';

import { useEffect, useState } from 'react';
import { 
  fetchBatteryTemperature,
  formatTemperature,
  formatRelativeTime,
  getTemperatureStatus,
  getTrendArrow,
  type SensorReading 
} from '@/frontend/lib';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function StatusDashboard() {
  const [current, setCurrent] = useState<SensorReading | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchBatteryTemperature(10);
      if (result.success && result.data) {
        setCurrent(result.data.current);
        setReadings(result.data.readings);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!current) return <p>Loading...</p>;

  const status = getTemperatureStatus(current.batteryTemperature);
  const trend = getTrendArrow(readings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Battery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-4xl font-bold">
            {formatTemperature(current.batteryTemperature)}
          </div>
          
          <div className={`flex items-center gap-2 ${status.color}`}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
            <span className="text-2xl">{trend}</span>
          </div>
          
          <div className="text-sm text-gray-500">
            Last update: {formatRelativeTime(current.timestamp)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Example 5: Custom Hook with New Modules

```typescript
// hooks/use-sensor-data.ts
import { useEffect, useState } from 'react';
import { 
  subscribeToBatteryTemperature,
  type BatteryTemperatureData 
} from '@/frontend/lib';

export function useSensorData(interval = 3000) {
  const [data, setData] = useState<BatteryTemperatureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToBatteryTemperature((newData) => {
        setData(newData);
        setLoading(false);
        setError(null);
      }, interval);

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [interval]);

  return { data, loading, error };
}

// Usage in component:
export function MyComponent() {
  const { data, loading, error } = useSensorData();
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data</p>;
  
  return <div>{data.current?.batteryTemperature}°C</div>;
}
```

---

## 🎨 Using CSS Classes

```typescript
import '@/frontend/styles/main.css';

export function MyComponent() {
  return (
    <div>
      {/* Glass effect background */}
      <div className="glass-effect p-4">
        <h2 className="text-gradient">Solar Dashboard</h2>
      </div>

      {/* Loading skeleton */}
      <div className="skeleton h-20 w-full" />

      {/* Animated slide-in */}
      <div className="slide-in-right">
        <p>Notification</p>
      </div>
    </div>
  );
}
```

---

## 📋 Common Patterns

### Pattern 1: Fetch Once on Mount
```typescript
useEffect(() => {
  const loadData = async () => {
    const result = await fetchBatteryTemperature();
    if (result.success) {
      // Use data
    }
  };
  loadData();
}, []); // Empty deps = run once
```

### Pattern 2: Polling with Cleanup
```typescript
useEffect(() => {
  const unsubscribe = subscribeToBatteryTemperature((data) => {
    // Handle new data
  });
  return () => unsubscribe(); // Cleanup
}, []);
```

### Pattern 3: Manual Refresh
```typescript
const [data, setData] = useState(null);

const refresh = async () => {
  const result = await fetchBatteryTemperature();
  if (result.success) setData(result.data);
};

return <button onClick={refresh}>Refresh</button>;
```

---

## 🔧 TypeScript Tips

### Get Full Type Safety
```typescript
import type { 
  SensorReading,
  BatteryTemperatureData,
  ApiResponse 
} from '@/frontend/lib';

// Type your state
const [data, setData] = useState<BatteryTemperatureData | null>(null);

// Type your API responses
const result: ApiResponse<BatteryTemperatureData> = await fetchBatteryTemperature();
```

### Handle API Errors
```typescript
const result = await fetchBatteryTemperature();

if (result.success) {
  // ✅ Data is available
  console.log(result.data);
} else {
  // ❌ Error occurred
  console.error(result.error);
}
```

---

## 🎓 Best Practices

1. **Always check `result.success`** before using data
2. **Use TypeScript types** for better IntelliSense
3. **Clean up subscriptions** in useEffect return
4. **Import only what you need** for better tree-shaking
5. **Use the index file** for cleaner imports

---

## 📚 All Available Functions

### Data API (`data-manager.ts`)
- `fetchAllSensorData(limit)` - Get all sensor types
- `fetchBatteryTemperature(limit)` - Get battery temp only
- `sendBatteryTemperature(temp)` - Send data to backend
- `sendSensorError()` - Report sensor error
- `subscribeToBatteryTemperature(callback, interval)` - Real-time polling
- `isValidSensorReading(data)` - Validate data structure
- `parseTemperatureString(data)` - Parse serial format
- `exportDataAsJson(data, filename)` - Export to JSON
- `exportDataAsCsv(data, filename)` - Export to CSV

### UI Utilities (`ui-manager.ts`)
- `formatChartData(readings)` - Format for Recharts
- `getTemperatureColor(temp)` - Get color by temp
- `getTemperatureStatus(temp)` - Get status object
- `getTrendArrow(readings)` - Get ↑↓→ indicator
- `getSkeletonChartData(count)` - Loading state data
- `formatTemperature(temp, decimals)` - Format display
- `formatTimestamp(timestamp)` - Localized time
- `formatRelativeTime(timestamp)` - "il y a 2h"
- `isMobileDevice()` - Device detection
- `getResponsiveChartHeight()` - Adaptive sizing
- `getNotificationIcon(type)` - Get icon
- `getNotificationClasses(type)` - Get styling

---

## ✅ Migration Checklist

- [ ] Import from `@/frontend/lib` in components
- [ ] Replace direct `fetch()` calls with `fetchBatteryTemperature()`
- [ ] Use `formatTemperature()` for display
- [ ] Use `getTemperatureStatus()` for status
- [ ] Use `formatChartData()` for charts
- [ ] Clean up old utility functions
- [ ] Test all components
- [ ] Run `npm run build` to check for errors

---

**Copy-paste any example and adapt to your needs!** 🚀
