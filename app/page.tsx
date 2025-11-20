"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { LeaderDashboard } from "@/components/leader-dashboard"
import { OperativeDashboard } from "@/components/operative-dashboard"

export type UserRole = "leader" | "operative" | null

export default function Page() {
  const [role, setRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate wallet connection and role detection
  const handleConnect = (selectedRole: "leader" | "operative") => {
    setIsLoading(true)
    setTimeout(() => {
      setRole(selectedRole)
      setIsLoading(false)
    }, 1500)
  }

  const handleLogout = () => {
    setRole(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Connecting to Stellar Network...</p>
        </div>
      </div>
    )
  }

  if (role === "leader") {
    return <LeaderDashboard onLogout={handleLogout} />
  }

  if (role === "operative") {
    return <OperativeDashboard onLogout={handleLogout} />
  }

  return <LoginScreen onConnect={handleConnect} />
}
