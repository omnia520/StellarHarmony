"use client"

import { useState, useEffect } from "react"
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from "recharts"

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
  picker: string | null
  packer: string | null
  items: number
  status: string
  time: string
  result?: "Correct" | "Issues" | "Rejected"
}

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
function processOrders(ordersFromDB: OrderFromDB[]): ProcessedOrder[] {
  return ordersFromDB.map((order) => {
    const time = calculateTime(order)
    const processed: ProcessedOrder = {
      id: order.Orden,
      date: order.FechaFinEmpaque || "",
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

const performanceData = [
  { name: "Mon", efficiency: 92, volume: 145 },
  { name: "Tue", efficiency: 94, volume: 160 },
  { name: "Wed", efficiency: 91, volume: 150 },
  { name: "Thu", efficiency: 96, volume: 175 },
  { name: "Fri", efficiency: 95, volume: 165 },
  { name: "Sat", efficiency: 88, volume: 120 },
  { name: "Sun", efficiency: 90, volume: 110 },
]

interface OperativeMetric {
  name: string
  completed: number
  productQuantity: number
  efficiency: string
  bonus: string
}

interface LeaderDashboardProps {
  onLogout: () => void
}

const API_URL = "http://localhost:3001"

export function LeaderDashboard({ onLogout }: LeaderDashboardProps) {
  const [activeTab, setActiveTab] = useState("activities")
  const [orders, setOrders] = useState<ProcessedOrder[]>([])
  const [operativeMetrics, setOperativeMetrics] = useState<OperativeMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [workerOrders, setWorkerOrders] = useState<ProcessedOrder[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [fechaInicio, setFechaInicio] = useState<string>("")
  const [fechaFin, setFechaFin] = useState<string>("")
  const [loadingWorkerData, setLoadingWorkerData] = useState(false)

  // Cargar órdenes desde la API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/ordenes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`Error loading orders: ${response.status} ${response.statusText}`)
        }
        const data: OrderFromDB[] = await response.json()
        const processed = processOrders(data)
        setOrders(processed)
      } catch (error) {
        console.error("Error loading orders:", error)
        // En caso de error, dejar el array vacío
        setOrders([])
        // Mostrar mensaje de error más descriptivo
        if (error instanceof Error) {
          console.error("Error details:", error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Cargar métricas de operativos
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/metrics/operatives`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(`Error loading metrics: ${response.status} ${response.statusText}`)
        }
        const data: OperativeMetric[] = await response.json()
        setOperativeMetrics(data)
      } catch (error) {
        console.error("Error loading metrics:", error)
        // En caso de error, usar datos vacíos
        setOperativeMetrics([])
        if (error instanceof Error) {
          console.error("Error details:", error.message)
        }
      }
    }

    if (activeTab === "metrics") {
      fetchMetrics()
    }
  }, [activeTab])

  // Cargar datos del trabajador seleccionado
  useEffect(() => {
    if (!selectedWorker) {
      console.log('❌ No hay trabajador seleccionado')
      setWorkerOrders([])
      setChartData([])
      return
    }

    console.log('🔄 Cargando datos para trabajador:', selectedWorker)

    const fetchWorkerData = async () => {
      setLoadingWorkerData(true)
      try {
        // Construir query params para fechas
        const params = new URLSearchParams()
        if (fechaInicio) params.append('fechaInicio', fechaInicio)
        if (fechaFin) params.append('fechaFin', fechaFin)
        
        const queryString = params.toString()
        const url = `${API_URL}/api/operative/ordenes/${encodeURIComponent(selectedWorker)}${queryString ? `?${queryString}` : ''}`
        
        console.log('📡 Cargando órdenes desde:', url)
        
        // Cargar órdenes
        const ordersResponse = await fetch(url)
        if (ordersResponse.ok) {
          const ordersData: OrderFromDB[] = await ordersResponse.json()
          console.log('✅ Órdenes recibidas:', ordersData.length)
          const processed = processOrders(ordersData)
          setWorkerOrders(processed)
          console.log('✅ Órdenes procesadas:', processed.length)
        } else {
          console.error('❌ Error al cargar órdenes:', ordersResponse.status, await ordersResponse.text())
        }

        // Cargar datos del gráfico
        const chartUrl = `${API_URL}/api/operative/chart/${encodeURIComponent(selectedWorker)}${queryString ? `?${queryString}` : ''}`
        const chartResponse = await fetch(chartUrl)
        if (chartResponse.ok) {
          const chartDataRaw = await chartResponse.json()
          console.log('📊 Datos del gráfico recibidos:', chartDataRaw)
          
          // Formatear datos para el gráfico
          const formatted = chartDataRaw.map((item: any) => {
            // El servidor ya devuelve FechaParsed en formato YYYY-MM-DD
            let fechaStr = item.FechaParsed || item.Fecha || ''
            let fecha: Date | null = null
            
            // Parsear la fecha (ya viene en formato YYYY-MM-DD del servidor)
            if (fechaStr) {
              try {
                // Intentar parsear como YYYY-MM-DD
                const dateParts = fechaStr.split(/[-/]/)
                if (dateParts.length === 3) {
                  // Si el primer elemento tiene 4 dígitos, es YYYY-MM-DD
                  if (dateParts[0].length === 4) {
                    fecha = new Date(`${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`)
                  } else {
                    // Si no, puede ser DD/MM/YYYY
                    fecha = new Date(`${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`)
                  }
                } else {
                  fecha = new Date(fechaStr)
                }
                
                if (isNaN(fecha.getTime())) {
                  fecha = null
                }
              } catch (e) {
                console.warn('Error parseando fecha:', fechaStr, e)
                fecha = null
              }
            }
            
            // Formatear fecha para mostrar en el eje X
            const fechaFormateada = fecha && !isNaN(fecha.getTime())
              ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
              : fechaStr.substring(0, 10) || 'No date'
            
            return {
              fecha: fechaFormateada,
              cantidad: Number(item.Cantidad) || 0,
              ordenes: Number(item.Ordenes) || 0,
              fechaKey: fechaStr.substring(0, 10), // Para ordenamiento
            }
          }).sort((a: any, b: any) => {
            // Ordenar por fecha
            if (a.fechaKey && b.fechaKey) {
              return a.fechaKey.localeCompare(b.fechaKey)
            }
            return 0
          }).map((item: any) => ({
            fecha: item.fecha,
            cantidad: item.cantidad,
            ordenes: item.ordenes,
          }))
          
          console.log('✅ Datos formateados:', formatted)
          setChartData(formatted)
        } else {
          console.error('❌ Error al cargar gráfico:', chartResponse.status, await chartResponse.text())
        }
      } catch (error) {
        console.error("Error al cargar datos del trabajador:", error)
        setWorkerOrders([])
        setChartData([])
      } finally {
        setLoadingWorkerData(false)
      }
    }

    fetchWorkerData()
  }, [selectedWorker, fechaInicio, fechaFin])

  // Función para actualizar el estado de una orden
  const handleOrderAction = async (orderId: number, action: "Correct" | "Issues" | "Rejected") => {
    try {
      // Mapear la acción al resultado
      const resultadoMap = {
        Correct: "Correct",
        Issues: "Issues",
        Rejected: "Rejected",
      }

      const response = await fetch(`${API_URL}/api/ordenes/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Estado: "Reviewed",
          Resultado: resultadoMap[action],
        }),
      })

      if (!response.ok) throw new Error("Error updating order")

      // Actualizar el estado local
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: "Reviewed",
              result: action,
            }
          }
          return order
        })
      )
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Error updating order. Please try again.")
    }
  }

  // Calcular órdenes pendientes
  const pendingOrdersCount = orders.filter((order) => order.status === "Pending").length

  // Calcular Daily Efficiency (placeholder - se implementará en la tarde)
  const calculateDailyEfficiency = (): string => {
    // TODO: Calcular basado en promedio de tiempo histórico
    // Por ahora retornamos un valor placeholder
    const reviewedOrders = orders.filter((order) => order.status === "Reviewed")
    if (reviewedOrders.length === 0) return "0%"
    
    // Lógica temporal - se ajustará en la tarde
    return "94.2%"
  }

  const dailyEfficiency = calculateDailyEfficiency()

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Package className="mr-2 h-6 w-6 text-accent-foreground" />
          <span className="text-lg font-bold">Harmony</span>
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
                    <div className="text-2xl font-bold">{pendingOrdersCount}</div>
                    <p className="text-xs text-muted-foreground">Orders awaiting review</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Efficiency</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dailyEfficiency}</div>
                    <p className="text-xs text-muted-foreground">Based on historical average</p>
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
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">Cargando órdenes...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-muted-foreground">No orders available</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>OrdenID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Picker</TableHead>
                          <TableHead>Packer</TableHead>
                          <TableHead>Item</TableHead>
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
                          <TableCell>{order.picker || "-"}</TableCell>
                          <TableCell>{order.packer || "-"}</TableCell>
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
                                  onClick={() => handleOrderAction(order.id, "Correct")}
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                  onClick={() => handleOrderAction(order.id, "Issues")}
                                >
                                  <AlertTriangle className="h-5 w-5" />
                                  <span className="sr-only">Issue</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:bg-gray-100 hover:text-gray-700"
                                  onClick={() => handleOrderAction(order.id, "Rejected")}
                                >
                                  <XCircle className="h-5 w-5" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </div>
                            ) : (
                              <span
                                className={`text-sm font-medium ${
                                  order.result === "Correct"
                                    ? "text-green-600"
                                    : order.result === "Issues"
                                      ? "text-amber-600"
                                      : "text-red-600"
                                }`}
                              >
                                {order.result || "Reviewed"}
                              </span>
                            )}
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
                        <TableHead>Product Quantity</TableHead>
                        <TableHead>Efficiency %</TableHead>
                        <TableHead className="text-right">Bonuses Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {operativeMetrics.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No metrics available
                          </TableCell>
                        </TableRow>
                      ) : (
                        operativeMetrics.map((metric) => (
                          <TableRow 
                            key={metric.name}
                            className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedWorker === metric.name ? 'bg-muted' : ''}`}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('👤 Trabajador seleccionado:', metric.name)
                              setSelectedWorker(metric.name)
                              // Scroll hacia la sección del trabajador
                              setTimeout(() => {
                                const element = document.getElementById('worker-details')
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                              }, 100)
                            }}
                          >
                            <TableCell className="font-medium">{metric.name}</TableCell>
                            <TableCell>{metric.completed}</TableCell>
                            <TableCell>{metric.productQuantity}</TableCell>
                            <TableCell>{metric.efficiency}</TableCell>
                            <TableCell className="text-right font-mono">{metric.bonus}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Sección de trabajador seleccionado */}
              {selectedWorker && (
                <div id="worker-details" className="space-y-6 mt-6 border-t pt-6">
                  {/* Filtros de fecha - Simple sin título */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-2 block">Start Date</label>
                          <Input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-medium mb-2 block">End Date</label>
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
                          Clear Filters
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gráfico de desempeño - Sin título */}
                  <Card>
                    <CardContent className="pt-6">
                      {loadingWorkerData ? (
                        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                          <p className="text-muted-foreground">Loading chart data...</p>
                        </div>
                      ) : chartData.length === 0 ? (
                        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                          <p className="text-muted-foreground">
                            No data available{fechaInicio || fechaFin ? ' for the selected date range' : ''}
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
                              label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }}
                              domain={[0, Math.max(3000, ...chartData.map(d => d.cantidad))]}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "var(--card)",
                                borderColor: "var(--border)",
                                borderRadius: "var(--radius)",
                              }}
                              itemStyle={{ color: "var(--foreground)" }}
                              formatter={(value: any) => [`${value} units`, "Quantity"]}
                            />
                            <ReferenceLine 
                              y={3000} 
                              stroke="#9333ea" 
                              strokeDasharray="4 4" 
                              strokeWidth={2}
                              label={{ 
                                value: "Target: 3000", 
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

                  {/* Tabla de órdenes del trabajador - Sin título */}
                  <Card>
                    <CardContent className="pt-6">
                      {loadingWorkerData ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-muted-foreground">Loading orders...</p>
                        </div>
                      ) : workerOrders.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-muted-foreground">
                            No orders available{fechaInicio || fechaFin ? ' for the selected date range' : ''}
                          </p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>OrdenID</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Picker</TableHead>
                              <TableHead>Packer</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workerOrders.map((order) => {
                              const role = order.picker === selectedWorker && order.packer === selectedWorker
                                ? "Both"
                                : order.picker === selectedWorker
                                  ? "Picker"
                                  : "Packer"
                              
                              return (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium">{order.id}</TableCell>
                                  <TableCell>{order.date}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{role}</Badge>
                                  </TableCell>
                                  <TableCell>{order.picker || "-"}</TableCell>
                                  <TableCell>{order.packer || "-"}</TableCell>
                                  <TableCell>{order.items}</TableCell>
                                  <TableCell>{order.time}</TableCell>
                                  <TableCell>
                                    <Badge variant={order.status === "Pending" ? "outline" : "secondary"}>
                                      {order.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {order.result ? (
                                      <span
                                        className={`text-sm font-medium ${
                                          order.result === "Correct"
                                            ? "text-green-600"
                                            : order.result === "Issues"
                                              ? "text-amber-600"
                                              : "text-red-600"
                                        }`}
                                      >
                                        {order.result}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
