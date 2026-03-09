"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { Database } from "firebase/database"
import { onValue, ref, set } from "firebase/database"
import type { Firestore } from "firebase/firestore"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { getFirebaseDatabase, getFirebaseFirestore } from "@/lib/firebase-client"

export type RelayProvider = "rtdb" | "firestore"

export interface UseRelayStateOptions {
  provider?: RelayProvider
  path: string
  firestoreFieldPath?: string
  initialValue?: boolean
  database?: Database
  firestore?: Firestore
}

export interface UseRelayStateResult {
  relayOn: boolean
  loading: boolean
  error: string | null
  setRelay: (nextValue: boolean) => Promise<void>
  toggleRelay: () => Promise<void>
}

const DEFAULT_FIRESTORE_FIELD_PATH = "relays.inverter"

function normalizePath(path: string): string {
  return path.trim().replace(/^\/+|\/+$/g, "")
}

function isFirestoreDocumentPath(path: string): boolean {
  const segments = path.split("/").filter(Boolean)
  return segments.length >= 2 && segments.length % 2 === 0
}

function getNestedValue(source: unknown, fieldPath: string): unknown {
  const keys = fieldPath.split(".").filter(Boolean)
  let current: unknown = source

  for (const key of keys) {
    if (typeof current !== "object" || current === null) {
      return undefined
    }

    current = (current as Record<string, unknown>)[key]
  }

  return current
}

function setNestedValue(
  target: Record<string, unknown>,
  fieldPath: string,
  value: unknown,
): Record<string, unknown> {
  const keys = fieldPath.split(".").filter(Boolean)
  if (keys.length === 0) {
    return target
  }

  let cursor = target

  keys.forEach((key, index) => {
    const isLeaf = index === keys.length - 1

    if (isLeaf) {
      cursor[key] = value
      return
    }

    const existing = cursor[key]
    if (typeof existing !== "object" || existing === null || Array.isArray(existing)) {
      cursor[key] = {}
    }

    cursor = cursor[key] as Record<string, unknown>
  })

  return target
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "Unknown Firebase error"
}

function parseRelayBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "number") {
    return value !== 0
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase()

    if (normalized === "1" || normalized === "true" || normalized === "on") {
      return true
    }

    if (normalized === "0" || normalized === "false" || normalized === "off") {
      return false
    }
  }

  return fallback
}

export function useRelayState(options: UseRelayStateOptions): UseRelayStateResult {
  const {
    provider = "rtdb",
    path,
    firestoreFieldPath = DEFAULT_FIRESTORE_FIELD_PATH,
    initialValue = false,
    database,
    firestore,
  } = options

  const normalizedPath = useMemo(() => normalizePath(path), [path])
  const [relayOn, setRelayOn] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const relayOnRef = useRef(relayOn)

  useEffect(() => {
    relayOnRef.current = relayOn
  }, [relayOn])

  useEffect(() => {
    if (!normalizedPath) {
      setLoading(false)
      setError("Missing Firebase path for relay subscription.")
      return
    }

    if (provider === "firestore" && !isFirestoreDocumentPath(normalizedPath)) {
      setLoading(false)
      setError("Firestore path must target a document (example: relayControl/current).")
      return
    }

    setLoading(true)
    setError(null)

    if (provider === "rtdb") {
      const db = database ?? getFirebaseDatabase()
      const relayRef = ref(db, normalizedPath)

      const unsubscribe = onValue(
        relayRef,
        (snapshot) => {
          setRelayOn(parseRelayBoolean(snapshot.val(), initialValue))
          setLoading(false)
        },
        (listenerError) => {
          setError(toErrorMessage(listenerError))
          setLoading(false)
        },
      )

      return () => unsubscribe()
    }

    const store = firestore ?? getFirebaseFirestore()
    const relayDocRef = doc(store, normalizedPath)

    const unsubscribe = onSnapshot(
      relayDocRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setRelayOn(initialValue)
          setLoading(false)
          return
        }

        const rawValue = getNestedValue(snapshot.data(), firestoreFieldPath)
        setRelayOn(parseRelayBoolean(rawValue, initialValue))
        setLoading(false)
      },
      (listenerError) => {
        setError(toErrorMessage(listenerError))
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [provider, normalizedPath, firestoreFieldPath, initialValue, database, firestore])

  const setRelay = useCallback(
    async (nextValue: boolean) => {
      if (!normalizedPath) {
        throw new Error("Missing Firebase path for relay update.")
      }

      if (provider === "firestore" && !isFirestoreDocumentPath(normalizedPath)) {
        throw new Error("Firestore path must target a document (example: relayControl/current).")
      }

      const previousValue = relayOnRef.current
      setRelayOn(nextValue)
      setError(null)

      try {
        if (provider === "rtdb") {
          const db = database ?? getFirebaseDatabase()
          await set(ref(db, normalizedPath), nextValue)
          return
        }

        const store = firestore ?? getFirebaseFirestore()
        const relayDocRef = doc(store, normalizedPath)
        const payload = setNestedValue({}, firestoreFieldPath, nextValue)
        payload.updatedAt = new Date().toISOString()

        await setDoc(relayDocRef, payload, { merge: true })
      } catch (updateError) {
        setRelayOn(previousValue)
        const message = toErrorMessage(updateError)
        setError(message)
        throw updateError instanceof Error ? updateError : new Error(message)
      }
    },
    [provider, normalizedPath, firestoreFieldPath, database, firestore],
  )

  const toggleRelay = useCallback(async () => {
    await setRelay(!relayOnRef.current)
  }, [setRelay])

  return {
    relayOn,
    loading,
    error,
    setRelay,
    toggleRelay,
  }
}
