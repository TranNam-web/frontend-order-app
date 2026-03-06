import DashboardMain from '@/app/[locale]/manage/dashboard/dashboard-main'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import envConfig, { Locale } from '@/config'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { LayoutDashboard } from 'lucide-react'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dashboard'
  })

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/dashboard`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default async function Dashboard() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:px-6 md:gap-8'>

      <div className='max-w-7xl mx-auto space-y-6'>

        {/* HEADER CARD */}
        <Card className='border-0 shadow-lg bg-white/80 backdrop-blur-sm'>
          <CardHeader className='flex flex-row items-center justify-between'>

            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-3 text-2xl font-bold'>
                <LayoutDashboard className='h-6 w-6 text-blue-600' />
                Dashboard
                <span className='text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse'>
                  ADMIN
                </span>
              </CardTitle>

              <CardDescription className='text-base'>
                Phân tích & theo dõi các chỉ số hoạt động hệ thống
              </CardDescription>
            </div>

            <Link
              href='/login'
              className='text-sm text-muted-foreground hover:text-blue-600 transition-colors'
            >
              📈 Xem báo cáo
            </Link>

          </CardHeader>
        </Card>

        {/* MAIN DASHBOARD CONTENT */}
        <Card className='border-0 shadow-xl bg-white'>
          <CardContent className='pt-6'>
            <DashboardMain />
          </CardContent>
        </Card>

      </div>
    </main>
  )
}