"use client"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseConfigured } from "@/lib/firebase"
import { useTeamData } from "@/hooks/use-team-data"
import { TeamMemberCard } from "@/components/team-member-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, TrendingUp, Target, Award } from "lucide-react"
import Link from "next/link"

function TeamDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { teamMembers, teamStats, loading: teamLoading } = useTeamData()

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

  if (loading || teamLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-red-600">Team Dashboard</h1>
              <p className="text-xs text-gray-500">Manager View</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Team Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-0 text-center">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">{teamStats.totalKnocks}</p>
              <p className="text-xs text-blue-700">Total Knocks</p>
            </CardContent>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-0 text-center">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{teamStats.totalInteractions}</p>
              <p className="text-xs text-green-700">Interactions</p>
            </CardContent>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-0 text-center">
              <Award className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-900">{teamStats.totalRgus}</p>
              <p className="text-xs text-red-700">Total RGUs</p>
            </CardContent>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-0 text-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">{teamStats.averageConversion}%</p>
              <p className="text-xs text-purple-700">Avg Conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Performance ({teamStats.activeMembers} active)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">SalesTrack+</CardTitle>
            <p className="text-sm text-gray-600">Configuration Required</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Firebase configuration required for team dashboard functionality.
            </p>
            <Link href="/">
              <Button className="w-full bg-red-600 hover:bg-red-700">Back to Main App</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <TeamDashboard />
}
