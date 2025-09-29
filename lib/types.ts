export interface SalesData {
  id?: string
  userId: string
  date: string
  knocks: number
  effectiveInteractions: number
  rgus: number
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  territory?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: "rep" | "manager"
  territory?: string
  team?: string
}

export interface DailyStats {
  knocks: number
  effectiveInteractions: number
  rgus: number
  conversionRate: number
}
