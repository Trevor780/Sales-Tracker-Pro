"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface CounterCardProps {
  title: string
  value: number
  color: "red" | "orange" | "blue"
  onIncrement: () => void
  onDecrement: () => void
  description?: string
}

export function CounterCard({ title, value, color, onIncrement, onDecrement, description }: CounterCardProps) {
  const colorClasses = {
    red: "bg-red-50 border-red-200 text-red-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
    blue: "bg-blue-50 border-blue-200 text-blue-900",
  }

  const buttonClasses = {
    red: "bg-red-600 hover:bg-red-700 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
  }

  return (
    <Card className={`p-6 ${colorClasses[color]} border-2`}>
      <div className="text-center space-y-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {description && <p className="text-sm opacity-75">{description}</p>}

        <div className="text-6xl font-bold font-mono">{value}</div>

        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            variant="outline"
            onClick={onDecrement}
            className="w-14 h-14 rounded-full p-0 bg-transparent"
            disabled={value === 0}
          >
            <Minus className="h-6 w-6" />
          </Button>

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
