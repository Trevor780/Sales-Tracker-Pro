"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged, type User } from "firebase/auth"
import { db, auth, isFirebaseConfigured } from "@/lib/firebase"
import type { SalesData, DailyStats } from "@/lib/types"

export function useSalesData() {
  const [user, setUser] = useState<User | null>(null)
  const [todayStats, setTodayStats] = useState<DailyStats>({
    knocks: 12,
    effectiveInteractions: 8,
    rgus: 3,
    conversionRate: 25,
  })
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
    if (!user || !isFirebaseConfigured || !db) {
      const newValue = Math.max(0, todayStats[type] + increment)
      const conversionRate =
        type === "rgus" || type === "knocks"
          ? todayStats.knocks > 0
            ? (todayStats.rgus / todayStats.knocks) * 100
            : 0
          : todayStats.conversionRate

      setTodayStats((prev) => ({
        ...prev,
        [type]: newValue,
        conversionRate: Math.round(conversionRate * 100) / 100,
      }))
      return
    }

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
