"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  Package,
  LogOut,
  Search,
  Filter,
  Download,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

// Interfaz para los datos de la base de datos
interface OrderFromDB {
  Orden: number
  Cantidad: number
  Sacador: string | null
  Empacador: string | null
  Estado: string
  FechaInicioSacado: string | null
  FechaFinSacado: string | null
  FechaInicioEmpaque: string | null
  FechaFinEmpaque: string | null
  Resultado: string | null
}

// Interfaz para los datos procesados de la orden
interface ProcessedOrder {
  id: number
  date: string
  role: string
  picker: string | null
  packer: string | null
  items: number
  status: string
  time: string
  result?: "Correct" | "Issues" | "Rejected"
}

interface WorkerDashboardProps {
  onLogout: () => void
  workerName: string
  workerWallet: string
}

const API_URL = "http://localhost:3001"

// Función para calcular el tiempo total en minutos
function calculateTime(order: OrderFromDB): string {
  let totalMinutes = 0

  // Calcular diferencia entre FechaFinSacado - FechaInicioSacado
  if (order.FechaInicioSacado && order.FechaFinSacado) {
    const inicioSacado = new Date(order.FechaInicioSacado)
    const finSacado = new Date(order.FechaFinSacado)
    if (!isNaN(inicioSacado.getTime()) && !isNaN(finSacado.getTime())) {
      const diffSacado = (finSacado.getTime() - inicioSacado.getTime()) / (1000 * 60)
      totalMinutes += diffSacado
    }
  }

  // Calcular diferencia entre FechaFinEmpaque - FechaInicioEmpaque
  if (order.FechaInicioEmpaque && order.FechaFinEmpaque) {
    const inicioEmpaque = new Date(order.FechaInicioEmpaque)
    const finEmpaque = new Date(order.FechaFinEmpaque)
    if (!isNaN(inicioEmpaque.getTime()) && !isNaN(finEmpaque.getTime())) {
      const diffEmpaque = (finEmpaque.getTime() - inicioEmpaque.getTime()) / (1000 * 60)
      totalMinutes += diffEmpaque
    }
  }

  // Formatear como "Xm" o "Xh Ym"
  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)}m`
  } else {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = Math.round(totalMinutes % 60)
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
}

// Función para procesar órdenes de la BD
function processOrders(ordersFromDB: OrderFromDB[], workerName: string): ProcessedOrder[] {
  return ordersFromDB.map((order) => {
    const time = calculateTime(order)
    
    // Determinar el rol del trabajador en esta orden
    let role = ""
    if (order.Sacador === workerName && order.Empacador === workerName) {
      role = "Both"
    } else if (order.Sacador === workerName) {
      role = "Picker"
    } else if (order.Empacador === workerName) {
      role = "Packer"
    }
    
    const processed: ProcessedOrder = {
      id: order.Orden,
      date: order.FechaFinEmpaque || "",
      role,
      picker: order.Sacador,
      packer: order.Empacador,
      items: order.Cantidad,
      status: order.Estado,
      time,
    }

    // Si el estado es "Reviewed" y hay un resultado, mapearlo
    if (order.Estado === "Reviewed" && order.Resultado) {
      const resultado = order.Resultado.toLowerCase()
      if (resultado === "correct") {
        processed.result = "Correct"
      } else if (resultado === "issues") {
        processed.result = "Issues"
      } else if (resultado === "rejected") {
        processed.result = "Rejected"
      }
    }

    return processed
  })
}

export function WorkerDashboard({ onLogout, workerName, workerWallet }: WorkerDashboardProps) {
  const [activeTab, setActiveTab] = useState("activities")
  const [orders, setOrders] = useState<ProcessedOrder[]>([])
  const [metrics, setMetrics] = useState({
    productQuantity: 0,
    completed: 0,
    efficiency: "0%",
    bonus: "0 USDC"
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [loadingChart, setLoadingChart] = useState(false)

  // Cargar métricas del trabajador
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/operative/metrics/${encodeURIComponent(workerName)}`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Error al cargar métricas:", error)
      }
    }
    fetchMetrics()
  }, [workerName])

  // Cargar órdenes del trabajador
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (fechaInicio) params.append('fechaInicio', fechaInicio)
        if (fechaFin) params.append('fechaFin', fechaFin)
        
        const queryString = params.toString()
        const url = `${API_URL}/api/operative/ordenes/${encodeURIComponent(workerName)}${queryString ? `?${queryString}` : ''}`
        
        const response = await fetch(url)
        if (!response.ok) throw new Error("Error al cargar órdenes")
        const data: OrderFromDB[] = await response.json()
        const processed = processOrders(data, workerName)
        // Ordenar por fecha descendente (más recientes primero)
        processed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setOrders(processed)
      } catch (error) {
        console.error("Error al cargar órdenes:", error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [workerName, fechaInicio, fechaFin])

  // Cargar datos del gráfico
  useEffect(() => {
    const fetchChartData = async () => {
      if (activeTab !== "metrics") return
      
      try {
        setLoadingChart(true)
        const params = new URLSearchParams()
        if (fechaInicio) params.append('fechaInicio', fechaInicio)
        if (fechaFin) params.append('fechaFin', fechaFin)
        
        const queryString = params.toString()
        const url = `${API_URL}/api/operative/chart/${encodeURIComponent(workerName)}${queryString ? `?${queryString}` : ''}`
        
        const response = await fetch(url)
        if (response.ok) {
          const chartDataRaw = await response.json()
          
          // Formatear datos para el gráfico
          const formatted = chartDataRaw.map((item: any) => {
            let fechaStr = item.Fecha || ''
            let fecha: Date | null = null
            
            if (fechaStr) {
              try {
                fecha = new Date(fechaStr)
                if (isNaN(fecha.getTime())) {
                  const parts = fechaStr.split(/[/-]/)
                  if (parts.length === 3) {
                    fecha = new Date(parts[0] + '-' + parts[1] + '-' + parts[2])
                  }
                }
              } catch (e) {
                console.warn('Error parseando fecha:', fechaStr, e)
              }
            }
            
            const fechaFormateada = fecha && !isNaN(fecha.getTime())
              ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
              : fechaStr.substring(0, 10) || 'Sin fecha'
            
            return {
              fecha: fechaFormateada,
              cantidad: Number(item.Cantidad) || 0,
              ordenes: Number(item.Ordenes) || 0,
            }
          }).sort((a: any, b: any) => {
            const dateA = new Date(a.fecha)
            const dateB = new Date(b.fecha)
            return dateA.getTime() - dateB.getTime()
          })
          
          setChartData(formatted)
        } else {
          setChartData([])
        }
      } catch (error) {
        console.error("Error al cargar gráfico:", error)
        setChartData([])
      } finally {
        setLoadingChart(false)
      }
    }

    fetchChartData()
  }, [workerName, fechaInicio, fechaFin, activeTab])

  // Calcular órdenes pendientes
  const pendingOrdersCount = orders.filter((order) => order.status === "Pending").length
  const completedOrdersCount = orders.filter((order) => order.status === "Terminado" || order.status === "terminado").length

  const formatWallet = (wallet: string) => {
    if (wallet.length > 10) {
      return `${wallet.substring(0, 4)}...${wallet.substring(wallet.length - 4)}`
    }
    return wallet
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Target className="mr-2 h-6 w-6 text-accent-foreground" />
          <span className="text-lg font-bold">Worker Portal</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Button
            variant={activeTab === "activities" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("activities")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            My Orders
          </Button>
          <Button
            variant={activeTab === "metrics" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("metrics")}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            My Performance
          </Button>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground bg-transparent"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-xl font-semibold capitalize">{activeTab === "activities" ? "My Orders" : "My Performance"}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Wallet: <span className="font-mono text-foreground">{formatWallet(workerWallet)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              User: <span className="font-medium text-foreground">{workerName}</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === "activities" ? (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{orders.length}</div>
                    <p className="text-xs text-muted-foreground">All time orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completedOrdersCount}</div>
                    <p className="text-xs text-muted-foreground">Finished orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Product Quantity</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.productQuantity}</div>
                    <p className="text-xs text-muted-foreground">Items processed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros de fecha */}
              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                  <CardDescription>Filtrar órdenes por rango de fechas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Fecha Inicio</label>
                      <Input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Fecha Fin</label>
                      <Input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        min={fechaInicio}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFechaInicio("")
                        setFechaFin("")
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Orders Table */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Order History</CardTitle>
                      <CardDescription>Historial de todas tus órdenes procesadas</CardDescription>
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">Cargando órdenes...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">No hay órdenes disponibles</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>OrdenID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              {order.date ? new Date(order.date).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : 'N/A'}
                            </TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>{order.time}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "Terminado" || order.status === "terminado"
                                    ? "default"
                                    : order.status === "Reviewed" || order.status === "reviewed"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Product Quantity</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.productQuantity}</div>
                    <p className="text-xs text-muted-foreground">Total items processed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders Completed</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.completed}</div>
                    <p className="text-xs text-muted-foreground">Total orders</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.efficiency}</div>
                    <p className="text-xs text-muted-foreground">Performance metric</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Bonuses Earned</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.bonus}</div>
                    <p className="text-xs text-muted-foreground">Total earned</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filtros de fecha */}
              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                  <CardDescription>Filtrar rendimiento por rango de fechas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Fecha Inicio</label>
                      <Input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Fecha Fin</label>
                      <Input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        min={fechaInicio}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFechaInicio("")
                        setFechaFin("")
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de rendimiento */}
              <Card>
                <CardHeader>
                  <CardTitle>My Performance Chart</CardTitle>
                  <CardDescription>Productos procesados por día</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingChart ? (
                    <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                      <p className="text-muted-foreground">Cargando datos del gráfico...</p>
                    </div>
                  ) : chartData.length === 0 ? (
                    <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                      <p className="text-muted-foreground">
                        No hay datos disponibles{fechaInicio || fechaFin ? ' para el rango de fechas seleccionado' : ''}
                      </p>
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '400px', minHeight: '400px' }}>
                      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis
                            dataKey="fecha"
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
                            label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }}
                            domain={[0, Math.max(3000, ...chartData.map(d => d.cantidad))]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              borderRadius: "var(--radius)",
                            }}
                            itemStyle={{ color: "var(--foreground)" }}
                            formatter={(value: any) => [`${value} unidades`, "Cantidad"]}
                          />
                          <ReferenceLine 
                            y={3000} 
                            stroke="#9333ea" 
                            strokeDasharray="4 4" 
                            strokeWidth={2}
                            label={{ 
                              value: "Meta: 3000", 
                              position: "right",
                              fill: "#9333ea",
                              fontSize: 12
                            }}
                          />
                          <Bar dataKey="cantidad" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

