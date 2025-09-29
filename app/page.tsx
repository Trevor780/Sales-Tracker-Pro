"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, MapPin, TrendingUp, Users, Plus } from "lucide-react"
import Link from "next/link"

const DEMO_USER = { email: "demo@salestrack.com", uid: "demo-user" }

function CounterCard({
  title,
  count,
  color,
  onIncrement,
  description,
}: {
  title: string
  count: number
  color: "red" | "green" | "blue"
  onIncrement: () => void
  description?: string
}) {
  const colorClasses = {
    red: "bg-red-50 border-red-200 text-red-900",
    green: "bg-green-50 border-green-200 text-green-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
  }

  const buttonClasses = {
    red: "bg-red-600 hover:bg-red-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
  }

  return (
    <Card className={`p-6 ${colorClasses[color]} border-2`}>
      <div className="text-center space-y-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {description && <p className="text-sm opacity-75">{description}</p>}
        <div className="text-6xl font-bold font-mono">{count}</div>
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={onIncrement}
            className={`w-20 h-14 rounded-full text-lg font-bold ${buttonClasses[color]}`}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function HomePage() {
  console.log("[v0] SalesTrack+ app initializing")

  const [todayStats, setTodayStats] = useState({
    knocks: 12,
    effectiveInteractions: 8,
    rgus: 3,
    conversionRate: 25,
  })

  const updateCounter = (type: "knocks" | "effectiveInteractions" | "rgus") => {
    setTodayStats((prev) => {
      const newStats = { ...prev, [type]: prev[type] + 1 }
      if (newStats.knocks > 0) {
        newStats.conversionRate = Math.round((newStats.rgus / newStats.knocks) * 100)
      }
      return newStats
    })
  }

  const conversionRate = todayStats.knocks > 0 ? Math.round((todayStats.rgus / todayStats.knocks) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-red-600">SalesTrack+</h1>
            <p className="text-xs text-gray-500">Welcome back, {DEMO_USER.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="font-semibold text-gray-900">Today's Performance</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{conversionRate}%</p>
              <p className="text-xs text-gray-500">Conversion Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{todayStats.effectiveInteractions}</p>
              <p className="text-xs text-gray-500">Effective Interactions</p>
            </div>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="space-y-4">
          <CounterCard
            title="Knocks"
            count={todayStats.knocks}
            color="blue"
            onIncrement={() => updateCounter("knocks")}
            description="Total doors approached"
          />

          <CounterCard
            title="Effective Interactions"
            count={todayStats.effectiveInteractions}
            color="green"
            onIncrement={() => updateCounter("effectiveInteractions")}
            description="Meaningful conversations"
          />

          <CounterCard
            title="RGUs"
            count={todayStats.rgus}
            color="red"
            onIncrement={() => updateCounter("rgus")}
            description="Revenue generating units"
          />
        </div>

        {/* Location Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Current Location</span>
          </div>
          <p className="text-xs text-gray-500">Demo Mode - Location tracking disabled</p>
        </div>

        {/* Demo Notice */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-1">Demo Mode Active</h3>
          <p className="text-sm text-blue-700">
            This is a simplified version of SalesTrack+. All data is stored locally and will reset on page refresh.
          </p>
        </div>
      </div>
    </div>
  )
}
