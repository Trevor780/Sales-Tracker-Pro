"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { db, auth, isFirebaseConfigured } from "@/lib/firebase"
import type { SalesData, DailyStats } from "@/lib/types"

export function useSalesData() {
  const [user] = useAuthState(auth)
  const [todayStats, setTodayStats] = useState<DailyStats>({
    knocks: 0,
    effectiveInteractions: 0,
    rgus: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!user || !isFirebaseConfigured || !db) {
      setLoading(false)
      return
    }

    const docRef = doc(db, "sales-data", `${user.uid}-${today}`)

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SalesData
        const conversionRate = data.knocks > 0 ? (data.rgus / data.knocks) * 100 : 0
        setTodayStats({
          knocks: data.knocks,
          effectiveInteractions: data.effectiveInteractions,
          rgus: data.rgus,
          conversionRate: Math.round(conversionRate * 100) / 100,
        })
      } else {
        setTodayStats({
          knocks: 0,
          effectiveInteractions: 0,
          rgus: 0,
          conversionRate: 0,
        })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, today])

  const updateCounter = async (type: "knocks" | "effectiveInteractions" | "rgus", increment = 1) => {
    if (!user || !isFirebaseConfigured || !db) return

    const docRef = doc(db, "sales-data", `${user.uid}-${today}`)
    const newValue = Math.max(0, todayStats[type] + increment)

    try {
      await setDoc(
        docRef,
        {
          userId: user.uid,
          date: today,
          [type]: newValue,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error updating counter:", error)
    }
  }

  return {
    todayStats,
    loading,
    updateCounter,
  }
}
