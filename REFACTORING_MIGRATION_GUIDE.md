# 🏗️ Refactoring Migration Guide

This guide helps you migrate existing components to use the new modular structure.

## ✅ What Was Done

### 1. **New Folder Structure Created**

```
sw_pfe-solar-final-main/
├── frontend/
│   ├── lib/
│   │   ├── api/
│   │   │   └── data-manager.ts    ✨ NEW: All API/data logic
│   │   └── ui/
│   │       └── ui-manager.ts      ✨ NEW: All UI/visual logic
│   └── styles/
│       └── main.css               ✨ NEW: Global styles
└── firmware/
    ├── esp32/
    │   ├── ESP32_Battery_Temperature_Example.ino
    │   └── README.md
    ├── arduino/
    │   ├── Arduino_Mega_Temperature_Sensor.ino
    │   ├── Arduino_Mega_To_ESP32.ino
    │   └── README.md
    ├── platformio.ini
    └── README.md
```

### 2. **Files Already Updated**

✅ [hooks/use-battery-temperature.ts](hooks/use-battery-temperature.ts) - Now uses `data-manager`  
✅ [components/battery-temperature-card.tsx](components/battery-temperature-card.tsx) - Now uses both modules  
✅ [tsconfig.json](tsconfig.json) - Path aliases added  
✅ Firmware files moved to `/firmware` folder

---

## 📚 How to Use the New Modules

### **data-manager.ts** - API & Data Logic

```typescript
// Import functions
import { 
  fetchBatteryTemperature,
  sendBatteryTemperature,
  subscribeToBatteryTemperature,
  exportDataAsJson,
  exportDataAsCsv
} from '@/frontend/lib/api/data-manager';

// Fetch data
const result = await fetchBatteryTemperature(20); // limit 20 readings
if (result.success && result.data) {
  console.log(result.data.current); // Latest reading
  console.log(result.data.readings); // All readings
}

// Send data
await sendBatteryTemperature(35.5);

// Subscribe to updates (polling)
const unsubscribe = subscribeToBatteryTemperature((data) => {
  console.log('New data:', data);
}, 3000); // Poll every 3 seconds

// Export data
exportDataAsJson(readings, 'my-data.json');
exportDataAsCsv(readings, 'my-data.csv');
```

### **ui-manager.ts** - Visual & Formatting Logic

```typescript
// Import functions
import {
  formatChartData,
  getTemperatureColor,
  getTemperatureStatus,
  formatTemperature,
  formatRelativeTime,
  getTrendArrow
} from '@/frontend/lib/ui/ui-manager';

// Format for charts
const chartData = formatChartData(readings);

// Get status
const status = getTemperatureStatus(35.5);
console.log(status); // { label: 'Normal', color: 'text-green-500', icon: '✅' }

// Format display
const display = formatTemperature(35.5); // "35.5°C"
const time = formatRelativeTime('2026-01-06T10:00:00'); // "il y a 2h"
const trend = getTrendArrow(readings); // "↑" or "↓" or "→"
```

---

## 🔄 Migration Steps for Other Components

### **Step 1: Replace Direct fetch() Calls**

**Before:**
```typescript
const response = await fetch('/api/sensor-data?type=battery');
const data = await response.json();
```

**After:**
```typescript
import { fetchBatteryTemperature } from '@/frontend/lib/api/data-manager';

const result = await fetchBatteryTemperature();
if (result.success && result.data) {
  const data = result.data;
}
```

### **Step 2: Replace Formatting Logic**

**Before:**
```typescript
const formatted = temp ? `${temp.toFixed(1)}°C` : 'N/A';
```

**After:**
```typescript
import { formatTemperature } from '@/frontend/lib/ui/ui-manager';

const formatted = formatTemperature(temp);
```

### **Step 3: Replace Status Logic**

**Before:**
```typescript
const getStatus = (temp: number) => {
  if (temp < 20) return { label: 'Cold', color: 'text-blue-500' };
  // ... more conditions
};
```

**After:**
```typescript
import { getTemperatureStatus } from '@/frontend/lib/ui/ui-manager';

const status = getTemperatureStatus(temp);
```

---

## 📋 Components That Need Migration

### High Priority
- [ ] [components/battery-temperature-chart.tsx](components/battery-temperature-chart.tsx)
- [ ] [components/temperature-display-card.tsx](components/temperature-display-card.tsx)
- [ ] [components/analytics-page.tsx](components/analytics-page.tsx)

### Medium Priority
- [ ] [components/system-health-page.tsx](components/system-health-page.tsx)
- [ ] [app/battery-test/page.tsx](app/battery-test/page.tsx)

### Low Priority
- [ ] Other components with sensor data logic

---

## 🎨 Using the New CSS

Add to your [app/layout.tsx](app/layout.tsx):

```typescript
import '@/frontend/styles/main.css';
```

Use utility classes:
```tsx
<div className="glass-effect">Glass background</div>
<h1 className="text-gradient">Gradient text</h1>
<div className="skeleton">Loading...</div>
```

---

## 🔧 TypeScript Path Aliases

The following aliases are now available:

```typescript
// Old way
import { something } from '@/lib/utils';

// New way (both work)
import { something } from '@/lib/utils';              // Still works
import { fetchData } from '@/frontend/lib/api/data-manager'; // New
```

---

## 🧪 Testing the Refactoring

1. **Test API calls:**
   ```typescript
   const result = await fetchBatteryTemperature();
   console.log('API working:', result.success);
   ```

2. **Test formatting:**
   ```typescript
   const formatted = formatTemperature(25.5);
   console.log('Format working:', formatted === '25.5°C');
   ```

3. **Test imports:**
   - Restart your dev server
   - Check for TypeScript errors
   - Verify hot reload works

---

## ⚠️ Common Issues

### Issue: Import not found
**Solution:** Restart your dev server after editing `tsconfig.json`

### Issue: Type errors
**Solution:** Run `npm run build` to check all type errors

### Issue: Path alias not working
**Solution:** Check [tsconfig.json](tsconfig.json) has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/frontend/*": ["./frontend/*"]
    }
  }
}
```

---

## 📊 Benefits Achieved

✅ **Separation of Concerns** - Data logic separate from UI logic  
✅ **Reusability** - Functions can be used in any component  
✅ **Maintainability** - Clear file organization  
✅ **Testability** - Each module can be tested independently  
✅ **Type Safety** - Full TypeScript support  
✅ **Documentation** - Each function has JSDoc comments  

---

## 🚀 Next Steps

1. Migrate remaining components to use new modules
2. Add unit tests for `data-manager.ts` and `ui-manager.ts`
3. Consider adding:
   - WebSocket support in `data-manager.ts`
   - Animation utilities in `ui-manager.ts`
   - State management (Zustand/Redux) for global state

---

## 📖 Reference

- [data-manager.ts](frontend/lib/api/data-manager.ts) - All API functions
- [ui-manager.ts](frontend/lib/ui/ui-manager.ts) - All UI utilities
- [main.css](frontend/styles/main.css) - Global styles
- [firmware/](firmware/) - Hardware code

---

**Created:** January 6, 2026  
**Status:** ✅ Core refactoring complete
