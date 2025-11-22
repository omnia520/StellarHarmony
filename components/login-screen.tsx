"use client"

import { useState } from "react"
import { Wallet, ShieldCheck, Truck, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginScreenProps {
  onConnect: (role: "leader" | "operative") => void
  onWalletConnect?: (wallet: string, userData: { nombre: string; rol: string; wallet: string }) => void
}

const API_URL = "http://localhost:3001"

export function LoginScreen({ onConnect, onWalletConnect }: LoginScreenProps) {
  const [wallet, setWallet] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet.trim()) {
      setError("Por favor ingresa una wallet")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/auth/wallet/${encodeURIComponent(wallet.trim())}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }))
        throw new Error(errorData.error || "Wallet no encontrada en la base de datos")
      }

      const userData = await response.json()
      if (onWalletConnect) {
        onWalletConnect(wallet.trim(), userData)
      }
    } catch (err) {
      console.error("Error al autenticar wallet:", err)
      setError(err instanceof Error ? err.message : "Error al autenticar wallet")
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-50 dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Truck className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Harmory</h1>
      </div>

      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
          <CardDescription>Connect your Stellar wallet to access the platform</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Button size="lg" className="w-full gap-2 text-base" onClick={() => onConnect("leader")}>
              <Wallet className="h-5 w-5" />
              Connect with Freighter
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 text-base bg-transparent"
              onClick={() => onConnect("operative")}
            >
              <ShieldCheck className="h-5 w-5" />
              Connect with Albedo
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form onSubmit={handleWalletSubmit} className="grid gap-2">
            <div className="grid gap-2">
              <Input
                type="text"
                placeholder="Ingresa tu wallet"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 text-base"
                disabled={isLoading || !wallet.trim()}
              >
                <Key className="h-5 w-5" />
                {isLoading ? "Verificando..." : "Conectar con Wallet"}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Secure Connection</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            By connecting, you agree to our Terms of Service and Privacy Policy.
            <br />
            Your role will be automatically detected.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
