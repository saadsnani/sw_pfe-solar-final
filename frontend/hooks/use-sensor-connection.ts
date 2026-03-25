"use client"

import { useState, useCallback } from 'react'
import type {
  SensorConnection,
  SystemSensorsState,
} from '@/lib/sensor-connection'
import {
  createDisconnectedSensor,
  createConnectedSensor,
  createErrorSensor,
  createDefaultSystemState,
} from '@/lib/sensor-connection'

/**
 * Hook for managing individual sensor connection state
 * 
 * @example
 * const batteryState = useSensorConnection<number>('battery')
 * 
 * // Simulate reading from hardware
 * batteryState.updateValue(85)  // When hardware connected
 * batteryState.disconnect()     // When hardware disconnected
 */
export function useSensorConnection<T = number>(sensorName: string) {
  const [sensor, setSensor] = useState<SensorConnection<T>>(
    createDisconnectedSensor(sensorName)
  )

  const updateValue = useCallback(
    (value: T) => {
      setSensor(createConnectedSensor(value))
    },
    []
  )

  const disconnect = useCallback(() => {
    setSensor(createDisconnectedSensor(sensorName))
  }, [sensorName])

  const setError = useCallback(
    (error: string) => {
      setSensor(createErrorSensor(sensorName, error))
    },
    [sensorName]
  )

  return {
    ...sensor,
    updateValue,
    disconnect,
    setError,
  }
}

/**
 * Hook for managing entire system sensor state
 * 
 * @example
 * const systemState = useSystemSensors()
 * 
 * // Update battery
 * systemState.updateBattery(85)
 * 
 * // Disconnect temperature sensor
 * systemState.disconnectTemperature()
 */
export function useSystemSensors() {
  const [state, setState] = useState<SystemSensorsState>(
    createDefaultSystemState()
  )

  const updateBattery = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      battery: createConnectedSensor(value),
    }))
  }, [])

  const updateSolarVoltage = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      solarVoltage: createConnectedSensor(value),
    }))
  }, [])

  const updateSolarCurrent = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      solarCurrent: createConnectedSensor(value),
    }))
  }, [])

  const updateGridVoltage = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      gridVoltage: createConnectedSensor(value),
    }))
  }, [])

  const updateGridFrequency = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      gridFrequency: createConnectedSensor(value),
    }))
  }, [])

  const updateTemperature = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      temperature: createConnectedSensor(value),
    }))
  }, [])

  const updateHumidity = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      humidity: createConnectedSensor(value),
    }))
  }, [])

  const updateProduction = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      production: createConnectedSensor(value),
    }))
  }, [])

  const updateConsumption = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      consumption: createConnectedSensor(value),
    }))
  }, [])

  const disconnectBattery = useCallback(() => {
    setState((prev) => ({
      ...prev,
      battery: createDisconnectedSensor('Battery'),
    }))
  }, [])

  const disconnectTemperature = useCallback(() => {
    setState((prev) => ({
      ...prev,
      temperature: createDisconnectedSensor('Temperature'),
    }))
  }, [])

  const disconnectAll = useCallback(() => {
    setState(createDefaultSystemState())
  }, [])

  const setError = useCallback((sensorKey: keyof SystemSensorsState, error: string) => {
    setState((prev) => ({
      ...prev,
      [sensorKey]: createErrorSensor(sensorKey, error),
    }))
  }, [])

  return {
    state,
    updateBattery,
    updateSolarVoltage,
    updateSolarCurrent,
    updateGridVoltage,
    updateGridFrequency,
    updateTemperature,
    updateHumidity,
    updateProduction,
    updateConsumption,
    disconnectBattery,
    disconnectTemperature,
    disconnectAll,
    setError,
  }
}
