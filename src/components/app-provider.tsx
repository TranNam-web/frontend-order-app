'use client'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RefreshToken from '@/components/refresh-token'
import { useEffect, useRef } from 'react'
import {
  decodeToken,
  generateSocketInstace,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage
} from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import type { Socket } from 'socket.io-client'
import ListenLogoutSocket from '@/components/listen-logout-socket'
import { create } from 'zustand'

// ==================
// React Query client
// ==================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

// ==================
// Types
// ==================
export type SocketType = Socket

type AppStoreType = {
  isAuth: boolean
  role: RoleType | undefined
  setRole: (role?: RoleType) => void
  socket: SocketType | undefined
  setSocket: (socket?: SocketType) => void
  disconnectSocket: () => void
}

// ==================
// Zustand store
// ==================
export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  role: undefined,
  socket: undefined,

  setRole: (role) => {
    set({ role, isAuth: Boolean(role) })
    if (!role) {
      removeTokensFromLocalStorage()
    }
  },

  setSocket: (socket) => {
    set({ socket })
  },

 disconnectSocket: () =>
  set((state) => {
    state.socket?.disconnect()
    return { socket: undefined }
  })
}))

// ==================
// App Provider
// ==================
export default function AppProvider({
  children
}: {
  children: React.ReactNode
}) {
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    const accessToken = getAccessTokenFromLocalStorage()
    if (!accessToken) return

    const role = decodeToken(accessToken).role
    setRole(role)

    const sockets = generateSocketInstace(accessToken)
    setSocket(sockets)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
