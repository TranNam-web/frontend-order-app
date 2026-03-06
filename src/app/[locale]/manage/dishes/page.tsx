import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import DishTable from '@/app/[locale]/manage/dishes/dish-table'
import { Suspense } from 'react'
import envConfig, { Locale } from '@/config'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { UtensilsCrossed, ChefHat } from 'lucide-react'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dishes'
  })

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/dishes`

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

export default function DishesPage() {
  return (
    <main className='flex flex-1 flex-col gap-6 p-6 md:p-8 bg-muted/30 min-h-screen'>
      
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-2xl bg-primary/10'>
            <ChefHat className='h-6 w-6 text-primary' />
          </div>
          <div>
            <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
              <UtensilsCrossed className='h-5 w-5 text-primary' />
              Quản lý món ăn
            </h1>
            <p className='text-sm text-muted-foreground'>
              Danh sách và quản lý toàn bộ món ăn trong hệ thống
            </p>
          </div>
        </div>
      </div>

      <Card className='rounded-2xl shadow-sm border bg-background'>
        <CardHeader className='border-b bg-muted/40 rounded-t-2xl'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <UtensilsCrossed className='h-5 w-5 text-primary' />
            Món ăn
          </CardTitle>
          <CardDescription>
            Quản lý, chỉnh sửa và theo dõi các món ăn
          </CardDescription>
        </CardHeader>

        <CardContent className='pt-6'>
          <Suspense>
            <DishTable />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}