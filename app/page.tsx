"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"
import { useSalesData } from "@/hooks/use-sales-data"
import { CounterCard } from "@/components/counter-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, MapPin, TrendingUp } from "lucide-react"

function SalesTrackApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { todayStats, loading: statsLoading, updateCounter } = useSalesData()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return

    setLoginLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Login error:", error)
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    if (auth) {
      signOut(auth)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading SalesTrack+...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">SalesTrack+</CardTitle>
            <p className="text-gray-600">Track Your Success - One Knock at a Time</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loginLoading}>
                {loginLoading ? "Signing In..." : "Start Your Day!"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-red-600">SalesTrack+</h1>
            <p className="text-sm text-gray-600">Welcome back, {user.email?.split("@")[0]}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="max-w-md mx-auto px-4 py-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Today's Performance</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{todayStats.conversionRate}%</div>
                <div className="text-xs text-gray-500">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Counter Cards */}
      <div className="max-w-md mx-auto px-4 space-y-4 pb-8">
        <CounterCard
          title="Knocks"
          value={todayStats.knocks}
          color="red"
          description="Doors you've knocked on today"
          onIncrement={() => updateCounter("knocks", 1)}
          onDecrement={() => updateCounter("knocks", -1)}
        />

        <CounterCard
          title="Effective Interactions"
          value={todayStats.effectiveInteractions}
          color="orange"
          description="Meaningful conversations with prospects"
          onIncrement={() => updateCounter("effectiveInteractions", 1)}
          onDecrement={() => updateCounter("effectiveInteractions", -1)}
        />

        <CounterCard
          title="RGUs"
          value={todayStats.rgus}
          color="blue"
          description="Residential Gross Units sold"
          onIncrement={() => updateCounter("rgus", 1)}
          onDecrement={() => updateCounter("rgus", -1)}
        />
      </div>

      {/* Location Indicator */}
      <div className="max-w-md mx-auto px-4 pb-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Location tracking enabled</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function HomePage() {
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">SalesTrack+</CardTitle>
            <p className="text-gray-600">Configuration Required</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Firebase Setup Required</h3>
              <p className="text-sm text-yellow-700 mb-3">
                To use SalesTrack+, you need to configure Firebase. Add these environment variables to your Vercel
                project:
              </p>
              <ul className="text-xs text-yellow-700 space-y-1 font-mono">
                <li>• NEXT_PUBLIC_FIREBASE_API_KEY</li>
                <li>• NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                <li>• NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                <li>• NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
                <li>• NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
                <li>• NEXT_PUBLIC_FIREBASE_APP_ID</li>
              </ul>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700">
              Refresh After Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <SalesTrackApp />
}
