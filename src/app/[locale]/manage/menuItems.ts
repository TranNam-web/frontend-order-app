import { Role } from '@/constants/type'
import { Home, ShoppingCart, Users2, Salad, Table } from 'lucide-react'

const menuItems = [
  {
    title: 'Tổng quan',
    Icon: Home,
    href: '/manage/dashboard',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: 'Quản lý đơn hàng',
    Icon: ShoppingCart,
    href: '/manage/orders',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: 'Quản lý bàn',
    Icon: Table,
    href: '/manage/tables',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: 'Quản lý món ăn',
    Icon: Salad,
    href: '/manage/dishes',
    roles: [Role.Owner, Role.Employee]
  },
  {
    title: 'Quản lý nhân viên',
    Icon: Users2,
    href: '/manage/accounts',
    roles: [Role.Owner]
  }
]

export default menuItems