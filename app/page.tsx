"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { getFirebaseAuth, checkFirebaseConfig } from "@/lib/firebase"
import { useSalesData } from "@/hooks/use-sales-data"
import { CounterCard } from "@/components/counter-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, MapPin, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

function FirebaseSetupScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">SalesTrack+</CardTitle>
          <p className="text-sm text-gray-600">Configuration Required</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Firebase Setup Required</h3>
            <p className="text-sm text-yellow-700 mb-3">
              To use SalesTrack+, you need to configure Firebase. Add these environment variables to your Vercel
              project:
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>• NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>• NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>• NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
              <li>• NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>• NEXT_PUBLIC_FIREBASE_APP_ID</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={() => (window.location.href = "?demo=true")}
              variant="outline"
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              Try Demo Mode Instead
            </Button>
            <p className="text-xs text-gray-500 text-center mt-2">Test the app without Firebase setup</p>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => window.location.reload()}>
            Refresh After Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function SalesTrackApp({ forceDemoMode = false }: { forceDemoMode?: boolean }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(forceDemoMode)
  const { todayStats, loading: statsLoading, updateCounter } = useSalesData()

  useEffect(() => {
    if (forceDemoMode) {
      setUser({ email: "demo@salestrack.com", uid: "demo-user" })
      setLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [forceDemoMode])

  const handleDemoLogin = () => {
    setIsDemoMode(true)
    setUser({ email: "demo@salestrack.com", uid: "demo-user" })
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const auth = getFirebaseAuth()
    if (!auth) return

    setLoginLoading(true)
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (error) {
      console.error("Auth error:", error)
      alert(error instanceof Error ? error.message : "Authentication failed")
    }
    setLoginLoading(false)
  }

  const handleLogout = () => {
    if (isDemoMode || forceDemoMode) {
      setIsDemoMode(false)
      setUser(null)
      window.location.href = window.location.pathname
    } else {
      const auth = getFirebaseAuth()
      if (auth) {
        signOut(auth)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
            <p className="text-sm text-gray-600">{isSignUp ? "Create your account" : "Sign in to continue"}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
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
                minLength={6}
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loginLoading}>
                {loginLoading
                  ? isSignUp
                    ? "Creating Account..."
                    : "Signing in..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Try Demo Mode
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">Test the app without creating an account</p>
            </div>
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const conversionRate = todayStats.knocks > 0 ? ((todayStats.rgus / todayStats.knocks) * 100).toFixed(1) : "0.0"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-red-600">SalesTrack+</h1>
            <p className="text-xs text-gray-500">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
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
          <p className="text-xs text-gray-500">Location tracking enabled</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  console.log("[v0] SalesTrack+ app initializing")
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
  const [forceDemoMode, setForceDemoMode] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const demoMode = urlParams.get("demo") === "true"

    if (demoMode) {
      setForceDemoMode(true)
      setIsConfigured(true)
      return
    }

    const hasConfig = checkFirebaseConfig()
    console.log("[v0] Firebase configured:", hasConfig)
    setIsConfigured(hasConfig)
  }, [])

  if (isConfigured === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    )
  }

  if (!isConfigured && !forceDemoMode) {
    return <FirebaseSetupScreen />
  }

  return <SalesTrackApp forceDemoMode={forceDemoMode} />
}
