"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface TeamMemberCardProps {
  member: {
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
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-sm">{member.email}</span>
          </div>
          <Badge variant={member.isActive ? "default" : "secondary"}>{member.isActive ? "Active" : "Inactive"}</Badge>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-blue-600">{member.todayStats.knocks}</p>
            <p className="text-xs text-gray-500">Knocks</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">{member.todayStats.effectiveInteractions}</p>
            <p className="text-xs text-gray-500">Interactions</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600">{member.todayStats.rgus}</p>
            <p className="text-xs text-gray-500">RGUs</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600">{member.todayStats.conversionRate}%</p>
            <p className="text-xs text-gray-500">Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
