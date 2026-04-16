'use client'

import { useAppStore } from '@/components/app-provider'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { OrderStatus } from '@/constants/type'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import {
  PayGuestOrdersResType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

export default function OrdersCart() {
  const { data, refetch } = useGuestGetOrderListQuery()

  // ✅ fix payload lỗi TS
  const orders = (data as any)?.payload?.data ?? []

  const socket = useAppStore((state) => state.socket)

  // ✅ payment type
  const [paymentType, setPaymentType] = useState<'CASH' | 'BANK_QR'>('CASH')

  // ✅ tính tiền
  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result: any, order: any) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Processing ||
          order.status === OrderStatus.Pending
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.waitingForPaying.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.waitingForPaying.quantity + order.quantity
            }
          }
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price +
                order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity
            }
          }
        }
        return result
      },
      {
        waitingForPaying: {
          price: 0,
          quantity: 0
        },
        paid: {
          price: 0,
          quantity: 0
        }
      }
    )
  }, [orders])

  // ✅ lấy số bàn
  const tableNumber = orders[0]?.guest?.tableNumber || ''

  useEffect(() => {
    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const {
        dishSnapshot: { name },
        quantity
      } = data
      toast({
        description: `Món ${name} (SL: ${quantity}) → ${getVietnameseOrderStatus(
          data.status
        )}`
      })
      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast({
        description: `${guest?.name} bàn ${guest?.tableNumber} đã thanh toán`
      })
      refetch()
    }

    socket?.on('update-order', onUpdateOrder)
    socket?.on('payment', onPayment)

    return () => {
      socket?.off('update-order', onUpdateOrder)
      socket?.off('payment', onPayment)
    }
  }, [refetch, socket])

  return (
    <>
      {/* LIST ORDER */}
      {orders.map((order: any, index: number) => (
        <div key={order.id} className='flex gap-4'>
          <div className='text-sm font-semibold'>{index + 1}</div>

          <Image
            src={order.dishSnapshot.image}
            alt={order.dishSnapshot.name}
            width={80}
            height={80}
            className='rounded-md'
          />

          <div>
            <h3>{order.dishSnapshot.name}</h3>
            <div>
              {formatCurrency(order.dishSnapshot.price)} x {order.quantity}
            </div>
          </div>

          <div className='ml-auto'>
            <Badge>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}

      {/* CHỌN THANH TOÁN */}
      <div className="mt-4">
        <select
          className="border p-2 rounded w-full"
          value={paymentType}
          onChange={(e) =>
            setPaymentType(e.target.value as 'CASH' | 'BANK_QR')
          }
        >
          <option value="CASH">Tiền mặt</option>
          <option value="BANK_QR">QR</option>
        </select>
      </div>

      {/* QR CODE */}
      {paymentType === 'BANK_QR' && (
        <div className="text-center mt-4">
          <img
            src={`https://img.vietqr.io/image/TPB-00000617058-compact.png?amount=${waitingForPaying.price}&addInfo=Ban${tableNumber}`}
            className="mx-auto w-[200px]"
          />
        </div>
      )}

      {/* TOTAL */}
      <div className="mt-4 font-bold">
        Chưa thanh toán: {formatCurrency(waitingForPaying.price)}
      </div>
    </>
  )
}