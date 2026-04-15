
'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useDishListQuery } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import Quantity from '@/app/[locale]/guest/menu/quantity'
import { useMemo, useState } from 'react'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { DishStatus } from '@/constants/type'
import { useRouter } from '@/i18n/routing'

const removeVietnameseTones = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export default function MenuOrder({ search }: { search: string }) {
  const { data } = useDishListQuery()
  const dishes = useMemo(() => data?.payload.data ?? [], [data])

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const [paymentType, setPaymentType] = useState<'CASH' | 'BANK_QR'>('CASH')
  const { mutateAsync } = useGuestOrderMutation()
  const router = useRouter()

  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => dish.status !== DishStatus.Hidden)
      .filter((dish) =>
        removeVietnameseTones(dish.name.toLowerCase()).includes(
          removeVietnameseTones(search.toLowerCase())
        )
      )
  }, [dishes, search])

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id)
      if (!order) return result
      return result + order.quantity * dish.price
    }, 0)
  }, [dishes, orders])

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }

      const index = prevOrders.findIndex((order) => order.dishId === dishId)

      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }

      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }

  const handleOrder = async () => {
  try {
    await mutateAsync({
      orders,
      paymentType
    })
    router.push(`/guest/orders`)
  } catch (error) {
    handleErrorApi({
      error
    })
  }
}

  return (
    <>
      {filteredDishes.length === 0 && (
        <p className='text-center text-sm text-gray-500'>
          Không tìm thấy món ăn
        </p>
      )}

      {filteredDishes.map((dish) => (
        <div
          key={dish.id}
          className={cn('flex gap-4', {
            'pointer-events-none': dish.status === DishStatus.Unavailable
          })}
        >
          <div className='flex-shrink-0 relative'>
            {dish.status === DishStatus.Unavailable && (
              <span className='absolute inset-0 flex items-center justify-center text-sm'>
                Hết hàng
              </span>
            )}

            <Image
              src={dish.image}
              alt={dish.name}
              height={100}
              width={100}
              quality={100}
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>

          <div className='space-y-1'>
            <h3 className='text-sm'>{dish.name}</h3>
            <p className='text-xs'>{dish.description}</p>
            <p className='text-xs font-semibold'>
              {formatCurrency(dish.price)}
            </p>
          </div>

          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Quantity
              onChange={(value) => handleQuantityChange(dish.id, value)}
              value={
                orders.find((order) => order.dishId === dish.id)?.quantity ?? 0
              }
            />
          </div>
        </div>
      ))}

      <div className='sticky bottom-0'>
        <Button
          className='w-full justify-between'
          onClick={handleOrder}
          disabled={orders.length === 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}

