'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RevenueLineChart } from '@/app/[locale]/manage/dashboard/revenue-line-chart'
import { DishBarChart } from '@/app/[locale]/manage/dashboard/dish-bar-chart'
import { formatCurrency } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { endOfDay, format, startOfDay } from 'date-fns'
import { useState } from 'react'
import { useDashboardIndicator } from '@/queries/useIndicator'
import CountUp from 'react-countup'

const initFromDate = startOfDay(new Date())
const initToDate = endOfDay(new Date())

export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(initFromDate)
  const [toDate, setToDate] = useState(initToDate)

  const { data } = useDashboardIndicator({
    fromDate,
    toDate
  })

  const revenue = data?.payload.data.revenue ?? 0
  const guestCount = data?.payload.data.guestCount ?? 0
  const orderCount = data?.payload.data.orderCount ?? 0
  const servingTableCount = data?.payload.data.servingTableCount ?? 0
  const revenueByDate = data?.payload.data.revenueByDate ?? []
  const dishIndicator = data?.payload.data.dishIndicator ?? []

  const resetDateFilter = () => {
    setFromDate(initFromDate)
    setToDate(initToDate)
  }

  return (
    <div className='space-y-6'>

      {/* FILTER */}
      <div className='flex flex-wrap gap-4 items-end bg-muted/40 p-4 rounded-xl shadow-sm'>
        <div className='flex flex-col'>
          <span className='text-xs text-muted-foreground mb-1'>Từ ngày</span>
          <Input
            type='datetime-local'
            value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
            onChange={(e) => setFromDate(new Date(e.target.value))}
          />
        </div>

        <div className='flex flex-col'>
          <span className='text-xs text-muted-foreground mb-1'>Đến ngày</span>
          <Input
            type='datetime-local'
            value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
            onChange={(e) => setToDate(new Date(e.target.value))}
          />
        </div>

        <Button variant='outline' onClick={resetDateFilter}>
          Reset 🔄
        </Button>
      </div>

      {/* KPI */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>

        {/* Revenue */}
        <Card className='transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-white to-green-50'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Tổng doanh thu
            </CardTitle>
            <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-lg'>
              💰
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-extrabold text-green-600'>
              <CountUp end={revenue} duration={1.2} separator=',' />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {formatCurrency(revenue)}
            </p>
          </CardContent>
        </Card>

        {/* Guests */}
        <Card className='transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Khách hàng
            </CardTitle>
            <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg'>
              👥
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-extrabold text-blue-600'>
              <CountUp end={guestCount} duration={1} />
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className='transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Đơn hàng
            </CardTitle>
            <div className='h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-lg'>
              📦
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-extrabold text-orange-600'>
              <CountUp end={orderCount} duration={1} />
            </div>
          </CardContent>
        </Card>

        {/* Tables */}
        <Card className='transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-sm text-muted-foreground'>
              Bàn đang phục vụ
            </CardTitle>
            <div className='h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-lg'>
              🍽️
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-4xl font-extrabold text-purple-600'>
              <CountUp end={servingTableCount} duration={1} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className='lg:col-span-4 bg-muted/40 p-4 rounded-xl shadow-sm'>
          <RevenueLineChart chartData={revenueByDate} />
        </div>
        <div className='lg:col-span-3 bg-muted/40 p-4 rounded-xl shadow-sm'>
          <DishBarChart chartData={dishIndicator} />
        </div>
      </div>
    </div>
  )
}