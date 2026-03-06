'use client'

import { TrendingUp, Medal } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, Cell, LabelList } from 'recharts'
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
import { DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'
import { useMemo } from 'react'

const colors = [
  '#f97316', // 🥇 Top 1 nổi bật
  '#3b82f6',
  '#10b981',
  '#a855f7',
  '#64748b'
]

const chartConfig = {
  successOrders: {
    label: 'Đơn thanh toán'
  }
} satisfies ChartConfig

export function DishBarChart({
  chartData
}: {
  chartData: Pick<
    DashboardIndicatorResType['data']['dishIndicator'][0],
    'name' | 'successOrders'
  >[]
}) {

  // 🔥 Sort + lấy top 5
  const sortedData = useMemo(
    () =>
      [...chartData]
        .sort((a, b) => b.successOrders - a.successOrders)
        .slice(0, 5),
    [chartData]
  )

  return (
    <Card className='shadow-md hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
          Xếp hạng món ăn
          <span className='text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse'>
            HOT 🔥
          </span>
        </CardTitle>
        <CardDescription>
          Top món được gọi nhiều nhất
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sortedData}
            layout='vertical'
            margin={{ left: 20 }}
            barCategoryGap={12}
          >
            <YAxis
              dataKey='name'
              type='category'
              tickLine={false}
              axisLine={false}
              width={140}
              tick={{ fontSize: 12 }}
            />

            <XAxis dataKey='successOrders' type='number' hide />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar
              dataKey='successOrders'
              layout='vertical'
              radius={[0, 12, 12, 0]}
              animationDuration={800}
            >
              {sortedData.map((_, index) => (
                <Cell
                  key={index}
                  fill={colors[index] ?? colors[colors.length - 1]}
                />
              ))}

              {/* 📊 Hiển thị số cuối thanh */}
              <LabelList
                dataKey='successOrders'
                position='right'
                style={{ fontSize: 12, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col items-start gap-2 text-sm'>
        {sortedData[0] && (
          <div className='flex items-center gap-2 font-semibold text-orange-600'>
            <Medal className='h-4 w-4' />
            Top 1: {sortedData[0].name} ({sortedData[0].successOrders} đơn)
          </div>
        )}

        <div className='flex items-center gap-2 text-muted-foreground'>
          <TrendingUp className='h-4 w-4' />
          Dữ liệu cập nhật theo bộ lọc thời gian
        </div>
      </CardFooter>
    </Card>
  )
}