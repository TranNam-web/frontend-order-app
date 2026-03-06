import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import TableTable from '@/app/[locale]/manage/tables/table-table'
import { Suspense } from 'react'
import { Metadata } from 'next'
import envConfig, { Locale } from '@/config'
import { getTranslations } from 'next-intl/server'
import { Table2, LayoutGrid } from 'lucide-react'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Tables'
  })

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/tables`

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

export default function TablesPage() {
  return (
    <main className='flex flex-1 flex-col gap-6 p-6 md:p-8 bg-muted/30 min-h-screen'>
      
      {/* Page Header */}
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <div className='p-3 rounded-2xl bg-primary/10'>
            <LayoutGrid className='h-6 w-6 text-primary' />
          </div>

          <div>
            <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
              <Table2 className='h-5 w-5 text-primary' />
              Quản lý bàn ăn
            </h1>
            <p className='text-sm text-muted-foreground'>
              Danh sách và trạng thái các bàn trong nhà hàng
            </p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className='rounded-2xl shadow-sm border bg-background'>
        <CardHeader className='border-b bg-muted/40 rounded-t-2xl'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Table2 className='h-5 w-5 text-primary' />
            Bàn ăn
          </CardTitle>
          <CardDescription>
            Quản lý, chỉnh sửa và theo dõi trạng thái bàn
          </CardDescription>
        </CardHeader>

        <CardContent className='pt-6'>
          <Suspense>
            <TableTable />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}