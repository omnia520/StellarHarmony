"use client"

import { Clock, Award, Zap, Target, LogOut, ArrowUpRight, ArrowDownRight, History, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const personalPerformance = [
  { day: "M", score: 85, team: 80 },
  { day: "T", score: 88, team: 82 },
  { day: "W", score: 92, team: 81 },
  { day: "T", score: 90, team: 83 },
  { day: "F", score: 95, team: 85 },
]

interface OperativeDashboardProps {
  onLogout: () => void
}

export function OperativeDashboard({ onLogout }: OperativeDashboardProps) {
  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            <span className="font-bold">Operative Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-muted-foreground">
              Connected: <span className="font-mono text-foreground">GDB...7K2L</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto mt-8 space-y-8 px-4">
        {/* Section A: My Bonuses (Financial Focus) */}
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Financial Overview</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2 bg-primary text-primary-foreground border-none">
              <CardHeader className="pb-2">
                <CardDescription className="text-primary-foreground/70">Current Balance</CardDescription>
                <CardTitle className="text-4xl font-bold tracking-tight">1,245.50 USDC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+125.00 this week</span>
                  </div>
                  <div className="text-primary-foreground/70">
                    Next Payout: <span className="font-medium text-white">Nov 25</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">#5</span>
                  <span className="text-sm text-muted-foreground">of 50 Operatives</span>
                </div>
                <Progress value={90} className="mt-4 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">Top 10% of performers</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section B: My Dispatch Metrics (Performance Focus) */}
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Performance Metrics</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Correct Orders</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +1.2% vs last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Time/Order</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12m 30s</div>
                <p className="flex items-center text-xs text-green-600">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  -45s vs team avg
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 Days</div>
                <p className="text-xs text-muted-foreground">Perfect attendance</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Performance vs Team</CardTitle>
              <CardDescription>Your efficiency score compared to the team average</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={personalPerformance}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                    }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--chart-1)"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="team"
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Section C: Achievements & Wallet */}
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Achievements & Wallet</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>Earned through consistent performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20">
                      <Zap className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Speed Demon</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20">
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Top 5%</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
                      <Target className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium">Perfect Week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Actions</CardTitle>
                <CardDescription>Manage your earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Withdraw Funds
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <span className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    View Transaction History
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
