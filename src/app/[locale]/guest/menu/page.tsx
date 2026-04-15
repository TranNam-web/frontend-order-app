
import MenuOrder from '@/app/[locale]/guest/menu/menu-order'
import envConfig, { Locale } from '@/config'
import { baseOpenGraph } from '@/shared-metadata'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'GuestMenu'
  })

  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/guest/menu`

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...baseOpenGraph,
      title: t('title'),
      description: t('description'),
      url
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default async function MenuPage(props: Props) {
  const searchParams = await props.searchParams

  const keyword =
    typeof searchParams.search === 'string' ? searchParams.search : ''

  return (
    <div className='max-w-[400px] mx-auto space-y-4'>

      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold'>🍕 Menu quán</h1>

        <form className='flex'>
        <div className="flex items-center gap-2">
 <div className="flex items-center border rounded-full px-2 py-1 bg-white w-[140px]">
  <span className="text-sm mr-1">🔍</span>
  <input
    name="search"
    defaultValue={keyword}
    placeholder="Tìm món"
    className="outline-none text-black text-sm w-full placeholder:text-gray-400 caret-black"
  />
</div>

  <button
    type="submit"
    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-600 transition"
  >
    Tìm
  </button>
</div>
        
        </form>
      </div>

      <MenuOrder search={keyword} />

    </div>
  )
}

