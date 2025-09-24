"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore"
import { onAuthStateChanged, type User } from "firebase/auth"
import { db, auth, isFirebaseConfigured } from "@/lib/firebase"
import type { SalesData } from "@/lib/types"

interface TeamMember {
  id: string
  email: string
  todayStats: {
    knocks: number
    effectiveInteractions: number
    rgus: number
    conversionRate: number
  }
  isActive: boolean
}

interface TeamStats {
  totalKnocks: number
  totalInteractions: number
  totalRgus: number
  averageConversion: number
  activeMembers: number
}

export function useTeamData() {
  const [user, setUser] = useState<User | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats>({
    totalKnocks: 45,
    totalInteractions: 32,
    totalRgus: 12,
    averageConversion: 26.7,
    activeMembers: 3,
  })
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Demo data for team members
      setTeamMembers([
        {
          id: "1",
          email: "john@company.com",
          todayStats: { knocks: 15, effectiveInteractions: 12, rgus: 4, conversionRate: 26.7 },
          isActive: true,
        },
        {
          id: "2",
          email: "sarah@company.com",
          todayStats: { knocks: 18, effectiveInteractions: 11, rgus: 5, conversionRate: 27.8 },
          isActive: true,
        },
        {
          id: "3",
          email: "mike@company.com",
          todayStats: { knocks: 12, effectiveInteractions: 9, rgus: 3, conversionRate: 25.0 },
          isActive: false,
        },
      ])
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

    // Query team sales data for today
    const q = query(collection(db, "sales-data"), where("date", "==", today), orderBy("updatedAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const members: TeamMember[] = []
      let totalKnocks = 0
      let totalInteractions = 0
      let totalRgus = 0
      let activeCount = 0

      snapshot.forEach((doc) => {
        const data = doc.data() as SalesData
        const conversionRate = data.knocks > 0 ? (data.rgus / data.knocks) * 100 : 0
        const isActive = data.knocks > 0 || data.effectiveInteractions > 0 || data.rgus > 0

        members.push({
          id: data.userId,
          email: data.userId, // In real app, would fetch user email
          todayStats: {
            knocks: data.knocks,
            effectiveInteractions: data.effectiveInteractions,
            rgus: data.rgus,
            conversionRate: Math.round(conversionRate * 100) / 100,
          },
          isActive,
        })

        totalKnocks += data.knocks
        totalInteractions += data.effectiveInteractions
        totalRgus += data.rgus
        if (isActive) activeCount++
      })

      const averageConversion = totalKnocks > 0 ? (totalRgus / totalKnocks) * 100 : 0

      setTeamMembers(members)
      setTeamStats({
        totalKnocks,
        totalInteractions,
        totalRgus,
        averageConversion: Math.round(averageConversion * 100) / 100,
        activeMembers: activeCount,
      })
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, today])

  return {
    teamMembers,
    teamStats,
    loading,
  }
}
