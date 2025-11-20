"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Download,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Mock Data
const orders = [
  { id: "ORD-7829", date: "2023-11-20", operative: "Alex Chen", items: 12, status: "Pending", time: "14m" },
  { id: "ORD-7830", date: "2023-11-20", operative: "Sarah Jones", items: 8, status: "Pending", time: "9m" },
  { id: "ORD-7831", date: "2023-11-20", operative: "Mike Ross", items: 24, status: "Pending", time: "22m" },
  {
    id: "ORD-7832",
    date: "2023-11-19",
    operative: "Alex Chen",
    items: 15,
    status: "Reviewed",
    result: "Correct",
    time: "16m",
  },
  {
    id: "ORD-7833",
    date: "2023-11-19",
    operative: "Sarah Jones",
    items: 5,
    status: "Reviewed",
    result: "Issues",
    time: "12m",
  },
]

const performanceData = [
  { name: "Mon", efficiency: 92, volume: 145 },
  { name: "Tue", efficiency: 94, volume: 160 },
  { name: "Wed", efficiency: 91, volume: 150 },
  { name: "Thu", efficiency: 96, volume: 175 },
  { name: "Fri", efficiency: 95, volume: 165 },
  { name: "Sat", efficiency: 88, volume: 120 },
  { name: "Sun", efficiency: 90, volume: 110 },
]

const operativeMetrics = [
  { name: "Alex Chen", completed: 145, efficiency: "96%", bonus: "450 USDC" },
  { name: "Sarah Jones", completed: 132, efficiency: "92%", bonus: "380 USDC" },
  { name: "Mike Ross", completed: 156, efficiency: "98%", bonus: "520 USDC" },
  { name: "Lisa Wong", completed: 128, efficiency: "91%", bonus: "350 USDC" },
]

interface LeaderDashboardProps {
  onLogout: () => void
}

export function LeaderDashboard({ onLogout }: LeaderDashboardProps) {
  const [activeTab, setActiveTab] = useState("activities")

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Package className="mr-2 h-6 w-6 text-accent-foreground" />
          <span className="text-lg font-bold">StellarLogistics</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Button
            variant={activeTab === "activities" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("activities")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Activities
          </Button>
          <Button
            variant={activeTab === "metrics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("metrics")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Metrics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Operatives
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground bg-transparent"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect Wallet
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-xl font-semibold capitalize">{activeTab} Overview</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Wallet: <span className="font-mono text-foreground">GDB...7K2L</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-accent/20" />
          </div>
        </header>

        <div className="p-6">
          {activeTab === "activities" ? (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">+12% from last hour</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Efficiency</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.2%</div>
                    <p className="text-xs text-muted-foreground">+2.1% from yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bonus Pool</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4,250 USDC</div>
                    <p className="text-xs text-muted-foreground">Available for distribution</p>
                  </CardContent>
                </Card>
              </div>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Order Management</CardTitle>
                      <CardDescription>Review completed orders to assign bonuses.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search orders..." className="pl-8 w-[200px]" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Operative</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.operative}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>{order.time}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "Pending" ? "outline" : "secondary"}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {order.status === "Pending" ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                >
                                  <AlertTriangle className="h-5 w-5" />
                                  <span className="sr-only">Issue</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:bg-gray-100 hover:text-gray-700"
                                >
                                  <XCircle className="h-5 w-5" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </div>
                            ) : (
                              <span
                                className={`text-sm font-medium ${order.result === "Correct" ? "text-green-600" : "text-amber-600"}`}
                              >
                                {order.result}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Productivity Analysis</CardTitle>
                    <CardDescription>Units packed over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                          dataKey="name"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            borderRadius: "var(--radius)",
                          }}
                          itemStyle={{ color: "var(--foreground)" }}
                        />
                        <Line type="monotone" dataKey="volume" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Efficiency Trends</CardTitle>
                    <CardDescription>Average team efficiency percentage</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                          dataKey="name"
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
                        <Bar dataKey="efficiency" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Operative Performance</CardTitle>
                  <CardDescription>Detailed breakdown by employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Operative Name</TableHead>
                        <TableHead>Orders Completed</TableHead>
                        <TableHead>Efficiency %</TableHead>
                        <TableHead className="text-right">Bonuses Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {operativeMetrics.map((metric) => (
                        <TableRow key={metric.name}>
                          <TableCell className="font-medium">{metric.name}</TableCell>
                          <TableCell>{metric.completed}</TableCell>
                          <TableCell>{metric.efficiency}</TableCell>
                          <TableCell className="text-right font-mono">{metric.bonus}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
