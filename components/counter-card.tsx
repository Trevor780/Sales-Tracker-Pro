"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CounterCardProps {
  title: string
  count: number
  color: "red" | "green" | "blue"
  onIncrement: () => void
  description?: string
}

export function CounterCard({ title, count, color, onIncrement, description }: CounterCardProps) {
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
