"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const viewsData = [
  { name: "Mon", views: 120 },
  { name: "Tue", views: 150 },
  { name: "Wed", views: 180 },
  { name: "Thu", views: 145 },
  { name: "Fri", views: 190 },
  { name: "Sat", views: 210 },
  { name: "Sun", views: 170 },
]

const bidsData = [
  { name: "Mon", bids: 5 },
  { name: "Tue", bids: 8 },
  { name: "Wed", bids: 12 },
  { name: "Thu", bids: 6 },
  { name: "Fri", bids: 9 },
  { name: "Sat", bids: 15 },
  { name: "Sun", bids: 10 },
]

const categoryData = [
  { name: "Web Development", value: 35 },
  { name: "Graphic Design", value: 25 },
  { name: "Content Writing", value: 20 },
  { name: "Marketing", value: 15 },
  { name: "Other", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ServiceAnalytics() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Service Analytics</CardTitle>
          <CardDescription>Track the performance of your services</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="views">
          <TabsList className="mb-4">
            <TabsTrigger value="views">Profile Views</TabsTrigger>
            <TabsTrigger value="bids">Bids Received</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="views">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Total Views: {viewsData.reduce((sum, item) => sum + item.views, 0)}
            </div>
          </TabsContent>

          <TabsContent value="bids">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bidsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bids" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Total Bids: {bidsData.reduce((sum, item) => sum + item.bids, 0)}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Most popular category: {categoryData.sort((a, b) => b.value - a.value)[0].name}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

