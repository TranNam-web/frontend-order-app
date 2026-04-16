import guestApiRequest from '@/apiRequests/guest'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.order
  })
}
export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequest.getOrderList,
    queryKey: ['guest-orders'],
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    staleTime: 0,

    // 🔥 QUAN TRỌNG NHẤT
    notifyOnChangeProps: 'all',

    // 🔥 ÉP React Query luôn coi là data mới
    select: (data) => {
      return {
        ...data,
        payload: {
          ...data.payload,
          data: data.payload.data.map((item: any) => ({
            ...item
          }))
        }
      }
    }
  })
}