'use client'

import { useAppStore } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import {
  Home,
  UtensilsCrossed,
  Receipt,
  LogIn,
  LayoutDashboard,
  LogOut
} from 'lucide-react'

type MenuItem = {
  title: string
  href: string
  icon: any
  role?: RoleType[]
  hideWhenLogin?: boolean
}

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('NavItem')

  const menuItems: MenuItem[] = [
    {
      title: t('home'),
      href: '/',
      icon: Home
    },
    {
      title: t('menu'),
      href: '/guest/menu',
      icon: UtensilsCrossed,
      role: [Role.Guest]
    },
    {
      title: t('orders'),
      href: '/guest/orders',
      icon: Receipt,
      role: [Role.Guest]
    },
    {
      title: t('login'),
      href: '/login',
      icon: LogIn,
      hideWhenLogin: true
    },
    {
      title: t('manage'),
      href: '/manage/dashboard',
      icon: LayoutDashboard,
      role: [Role.Owner, Role.Employee]
    }
  ]

  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)

  const logoutMutation = useLogoutMutation()
  const router = useRouter()

  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      disconnectSocket()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {menuItems.map((item) => {
        const Icon = item.icon

        // Đã đăng nhập & đúng role
        const isAuth = item.role && role && item.role.includes(role)

        // Menu không cần role
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin)

        if (isAuth || canShow) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                `
                group flex items-center gap-2
                rounded-full px-3 py-2
                text-sm font-medium
                text-muted-foreground
                transition-all
                hover:bg-white/5
                hover:text-white
              `,
                className
              )}
            >
              <Icon
                size={18}
                className="
                  opacity-70 transition
                  group-hover:opacity-100
                  group-hover:text-blue-400
                "
              />
              <span>{item.title}</span>
            </Link>
          )
        }
        return null
      })}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div
              className={cn(
                `
                group flex items-center gap-2
                rounded-full px-3 py-2
                text-sm font-medium
                text-muted-foreground
                transition-all cursor-pointer
                hover:bg-red-500/10
                hover:text-red-400
              `,
                className
              )}
            >
              <LogOut size={18} />
              <span>{t('logout')}</span>
            </div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('logoutDialog.logoutQuestion')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('logoutDialog.logoutConfirm')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t('logoutDialog.logoutCancel')}
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
