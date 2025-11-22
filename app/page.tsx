"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { LeaderDashboard } from "@/components/leader-dashboard"
import { WorkerDashboard } from "@/components/worker-dashboard"
import { OperativeDashboard } from "@/components/operative-dashboard"

export type UserRole = "leader" | "operative" | "trabajador" | null

interface UserData {
  nombre: string
  rol: string
  wallet: string
}

export default function Page() {
  const [role, setRole] = useState<UserRole>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate wallet connection and role detection (botones originales)
  const handleConnect = (selectedRole: "leader" | "operative") => {
    setIsLoading(true)
    setTimeout(() => {
      setRole(selectedRole)
      setIsLoading(false)
    }, 1500)
  }

  // Autenticación por wallet
  const handleWalletConnect = (wallet: string, data: UserData) => {
    setIsLoading(true)
    setTimeout(() => {
      setUserData(data)
      // Mapear "lider" -> "leader", "trabajador" -> "trabajador"
      if (data.rol === "lider") {
        setRole("leader")
      } else if (data.rol === "trabajador") {
        setRole("trabajador")
      } else {
        setRole("operative") // Fallback
      }
      setIsLoading(false)
    }, 500)
  }

  const handleLogout = () => {
    setRole(null)
    setUserData(null)
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

  if (role === "trabajador" && userData) {
    return <WorkerDashboard onLogout={handleLogout} workerName={userData.nombre} workerWallet={userData.wallet} />
  }

  if (role === "operative") {
    return <OperativeDashboard onLogout={handleLogout} />
  }

  return <LoginScreen onConnect={handleConnect} onWalletConnect={handleWalletConnect} />
}
