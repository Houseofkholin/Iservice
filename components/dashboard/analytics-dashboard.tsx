"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowDown, ArrowUp, DollarSign, Users, Star, BarChart2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [data, setData] = useState<any>(null)

  // Fetch analytics data
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!isMounted) return

      setIsLoading(true)

      try {
        // In a real app, fetch from API with the timeRange parameter
        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockData = {
          summary: {
            earnings: {
              value: 2450,
              change: 12.5,
              trend: "up",
            },
            clients: {
              value: 18,
              change: 8.3,
              trend: "up",
            },
            rating: {
              value: 4.8,
              change: 0.2,
              trend: "up",
            },
            completionRate: {
              value: 95,
              change: -2,
              trend: "down",
            },
          },
          revenueData: [
            { name: "Jan", revenue: 1200 },
            { name: "Feb", revenue: 1900 },
            { name: "Mar", revenue: 1500 },
            { name: "Apr", revenue: 2100 },
            { name: "May", revenue: 1800 },
            { name: "Jun", revenue: 2400 },
            { name: "Jul", revenue: 2450 },
          ],
          categoryData: [
            { name: "Web Development", value: 40 },
            { name: "Design", value: 25 },
            { name: "Marketing", value: 15 },
            { name: "Writing", value: 20 },
          ],
          clientActivity: [
            { date: "Mon", views: 12, inquiries: 5, contracts: 1 },
            { date: "Tue", views: 18, inquiries: 7, contracts: 2 },
            { date: "Wed", views: 15, inquiries: 6, contracts: 1 },
            { date: "Thu", views: 20, inquiries: 9, contracts: 3 },
            { date: "Fri", views: 25, inquiries: 10, contracts: 2 },
            { date: "Sat", views: 15, inquiries: 5, contracts: 1 },
            { date: "Sun", views: 10, inquiries: 3, contracts: 0 },
          ],
          topServices: [
            { name: "Website Development", revenue: 1200, clients: 5 },
            { name: "Logo Design", revenue: 800, clients: 8 },
            { name: "SEO Optimization", revenue: 600, clients: 3 },
            { name: "Content Writing", revenue: 450, clients: 6 },
          ],
        }

        if (isMounted) {
          setData(mockData)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [timeRange])

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your performance and business metrics</p>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">${data.summary.earnings.value}</div>
                </div>

                <div className="flex items-center mt-1">
                  {data.summary.earnings.trend === "up" ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${data.summary.earnings.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {data.summary.earnings.change}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{data.summary.clients.value}</div>
                </div>
                <div className="flex items-center mt-1">
                  {data.summary.clients.trend === "up" ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${data.summary.clients.trend === "up" ? "text-green-500" : "text-red-500"}`}
                  >
                    {data.summary.clients.change}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{data.summary.rating.value}</div>
                </div>
                <div className="flex items-center mt-1">
                  {data.summary.rating.trend === "up" ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${data.summary.rating.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {data.summary.rating.change} points from last period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-bold">{data.summary.completionRate.value}%</div>
                </div>
                <div className="flex items-center mt-1">
                  {data.summary.completionRate.trend === "up" ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      data.summary.completionRate.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {Math.abs(data.summary.completionRate.change)}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="clients">Client Activity</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Distribution across service categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.categoryData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Activity</CardTitle>
              <CardDescription>Profile views, inquiries, and contracts over time</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <ChartContainer
                  config={{
                    views: {
                      label: "Profile Views",
                      color: "hsl(var(--chart-1))",
                    },
                    inquiries: {
                      label: "Inquiries",
                      color: "hsl(var(--chart-2))",
                    },
                    contracts: {
                      label: "Contracts",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.clientActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="views" fill="var(--color-views)" />
                      <Bar dataKey="inquiries" fill="var(--color-inquiries)" />
                      <Bar dataKey="contracts" fill="var(--color-contracts)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
              <CardDescription>Services with the highest revenue and client count</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="space-y-8">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue ($)",
                        color: "hsl(var(--chart-1))",
                      },
                      clients: {
                        label: "Clients",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topServices} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" />
                        <Bar dataKey="clients" fill="var(--color-clients)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.topServices.map((service: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{service.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Revenue</p>
                              <p className="text-lg font-semibold">${service.revenue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Clients</p>
                              <p className="text-lg font-semibold">{service.clients}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

