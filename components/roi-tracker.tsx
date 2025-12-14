"use client"

import { useState, useEffect } from "react"
import { DollarSign, Leaf, TrendingUp, Calendar } from "lucide-react"

interface RoiTrackerProps {
  energyProduced: number
}

export default function RoiTracker({ energyProduced }: RoiTrackerProps) {
  const [stats, setStats] = useState({
    dailySavings: 0,
    monthlySavings: 0,
    totalSavings: 0,
    co2Avoided: 0,
    treesEquivalent: 0,
  })

  useEffect(() => {
    // Electricity price in Morocco: ~1.5 MAD/kWh
    const pricePerKwh = 1.5
    const dailySavings = energyProduced * pricePerKwh
    const monthlySavings = dailySavings * 30
    const totalSavings = monthlySavings * 6 // Simulate 6 months of operation

    // CO2: ~0.5 kg per kWh from grid
    const co2Avoided = energyProduced * 30 * 6 * 0.5
    const treesEquivalent = Math.floor(co2Avoided / 20) // 1 tree absorbs ~20kg CO2/year

    setStats({
      dailySavings,
      monthlySavings,
      totalSavings,
      co2Avoided,
      treesEquivalent,
    })
  }, [energyProduced])

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-amber to-transparent" />

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-neon-amber/20 border border-neon-amber/30">
          <TrendingUp className="h-5 w-5 text-neon-amber" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
            FINANCIAL ROI TRACKER
          </h3>
          <p className="text-xs text-muted-foreground">Savings & environmental impact</p>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-neon-amber/10 border border-neon-amber/20">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-3 w-3 text-neon-amber" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Today</span>
          </div>
          <p className="text-xl font-bold font-mono text-neon-amber">{stats.dailySavings.toFixed(1)} DH</p>
        </div>
        <div className="p-3 rounded-xl bg-neon-amber/10 border border-neon-amber/20">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-neon-amber" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly</span>
          </div>
          <p className="text-xl font-bold font-mono text-neon-amber">{stats.monthlySavings.toFixed(0)} DH</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-neon-amber/20 to-neon-green/20 border border-neon-amber/30 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Savings (6 months)</p>
            <p className="text-3xl font-bold font-mono text-neon-amber" style={{ fontFamily: "var(--font-display)" }}>
              {stats.totalSavings.toFixed(0)} DH
            </p>
          </div>
          <DollarSign className="h-10 w-10 text-neon-amber/30" />
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Environmental Impact</p>
        <div className="flex items-center justify-between p-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-neon-green" />
            <span className="text-sm">CO2 Avoided</span>
          </div>
          <span className="font-mono font-bold text-neon-green">{stats.co2Avoided.toFixed(0)} kg</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌳</span>
            <span className="text-sm">Trees Equivalent</span>
          </div>
          <span className="font-mono font-bold text-neon-green">{stats.treesEquivalent} trees</span>
        </div>
      </div>
    </div>
  )
}
