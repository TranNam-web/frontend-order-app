'use client'

import { TrendingUp } from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

import { format, parse } from 'date-fns'
import { DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'
import { useMemo } from 'react'

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

export function RevenueLineChart({
  chartData
}: {
  chartData: DashboardIndicatorResType['data']['revenueByDate']
}) {

  // 🔥 Tính tổng doanh thu
  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0)
  }, [chartData])

  return (
    <Card className="shadow-md hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          Doanh thu
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full animate-pulse">
            LIVE 📊
          </span>
        </CardTitle>
        <CardDescription>
          Biểu đồ theo thời gian đã chọn
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (chartData.length < 8) return value
                if (chartData.length < 33) {
                  const date = parse(value, 'dd/MM/yyyy', new Date())
                  return format(date, 'dd')
                }
                return ''
              }}
            />

            <YAxis hide />

            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Line
              dataKey="revenue"
              name="Doanh thu"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-semibold text-green-600">
          Tổng doanh thu: {totalRevenue.toLocaleString()} ₫
          <TrendingUp className="h-4 w-4" />
        </div>

        <div className="text-muted-foreground">
          Dữ liệu cập nhật theo bộ lọc thời gian
        </div>
      </CardFooter>
    </Card>
  )
}