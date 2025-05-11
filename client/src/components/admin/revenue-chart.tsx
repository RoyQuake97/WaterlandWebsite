import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Types for the chart data
interface RevenueData {
  name: string;
  revenue: number;
  occupancy: number;
}

interface RevenueChartProps {
  data: {
    weekly: RevenueData[];
    monthly: RevenueData[];
    yearly: RevenueData[];
  };
  className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue & Occupancy</CardTitle>
        <CardDescription>
          View revenue trends and room occupancy rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          
          {["weekly", "monthly", "yearly"].map((period) => (
            <TabsContent key={period} value={period} className="space-y-4">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data[period as keyof typeof data]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === "revenue" ? `$${value}` : `${value}%`, 
                        name === "revenue" ? "Revenue" : "Occupancy"
                      ]}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="revenue" 
                      fill="#1e3a8a" 
                      radius={[4, 4, 0, 0]} 
                      name="Revenue" 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="occupancy" 
                      fill="#14b8a6" 
                      radius={[4, 4, 0, 0]} 
                      name="Occupancy %" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-50">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-[#1e3a8a]">
                    ${data[period as keyof typeof data].reduce((sum, item) => sum + item.revenue, 0)}
                  </p>
                </Card>
                <Card className="p-4 bg-teal-50">
                  <p className="text-sm font-medium text-gray-500">Avg. Occupancy</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {Math.round(data[period as keyof typeof data].reduce((sum, item) => sum + item.occupancy, 0) / 
                    data[period as keyof typeof data].length)}%
                  </p>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}