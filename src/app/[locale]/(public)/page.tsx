import BannerSlider from '@/components/banner-slider'
import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'
import envConfig, { Locale } from '@/config'
import { htmlToTextForDescription } from '@/lib/server-utils'

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>
}) {
  const params = await props.params
  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'HomePage' })
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}`

  return {
    title: t('title'),
    description: htmlToTextForDescription(t('description')),
    alternates: {
      canonical: url
    }
  }
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home(props: {
  params: Promise<{ locale: string }>
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const keyword =
    typeof searchParams.search === 'string' ? searchParams.search : ''

  const { locale } = params

  setRequestLocale(locale)
  const t = await getTranslations('HomePage')

  let dishList: DishListResType['data'] = []

  try {
    const result = await dishApiRequest.list()
    const {
      payload: { data }
    } = result

    dishList = data

    if (keyword) {
      dishList = dishList.filter((dish) =>
        dish.name.toLowerCase().includes(keyword.toLowerCase())
      )
    }
  } catch (error) {
    return <div>Something went wrong</div>
  }

  // 🔥 MÓN MỚI (ID lớn nhất)
  const sorted = [...dishList].sort((a, b) => b.id - a.id)
  const newDishes = sorted.slice(0, 4)

  // 🔥 HELPER
  const isDrink = (name: string) =>
    name.includes("nước") ||
    name.includes("trà") ||
    name.includes("coca") ||
    name.includes("pepsi")

  const isChe = (name: string) =>
    name.includes("chè")

  const isSnack = (name: string) =>
    name.includes("khoai") ||
    name.includes("xúc xích") ||
    name.includes("lạp") ||
    name.includes("ngô") ||
    name.includes("cá viên")

  // ❌ loại món mới
  const rest = dishList.filter(
    (dish) => !newDishes.some((d) => d.id === dish.id)
  )

  // 🔥 CATEGORY
  const categories = [
    {
      name: "⭐ Món mới (giảm 5k)",
      data: newDishes,
      discount: true
    },
    {
      name: "🥤 Đồ uống",
      data: rest.filter((dish) =>
        isDrink(dish.name.toLowerCase())
      )
    },
    {
      name: "🍧 Chè",
      data: rest.filter((dish) =>
        isChe(dish.name.toLowerCase())
      )
    },
    {
      name: "🍟 Ăn vặt",
      data: rest.filter((dish) =>
        isSnack(dish.name.toLowerCase())
      )
    },
    {
      name: "🍽 Món khác",
      data: rest.filter((dish) => {
        const name = dish.name.toLowerCase()
        return (
          !isDrink(name) &&
          !isChe(name) &&
          !isSnack(name)
        )
      })
    }
  ]

  return (
    <div className='w-full space-y-4'>

      <BannerSlider />

      <section className='space-y-10 py-10'>
        <h2 className='text-center text-2xl font-bold'>{t('h2')}</h2>

        {/* Search */}
        <form className='flex justify-end mb-6 px-6'>
          <input
            name='search'
            defaultValue={keyword}
            placeholder='🔍 Tìm món ăn...'
            className='border px-4 py-2 rounded w-[280px]'
          />
          <button
            type='submit'
            className='ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Tìm
          </button>
        </form>

        {/* CATEGORY */}
        {categories.map((category, index) => (
          category.data.length > 0 && (
            <div key={index} className="px-6 space-y-4">

              <h3 className="text-xl font-bold">{category.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {category.data.map((dish) => (
                  <Link
                    href={`/dishes/${generateSlugUrl({
                      name: dish.name,
                      id: dish.id
                    })}`}
                    className="flex gap-4 hover:scale-[1.02] transition"
                    key={dish.id}
                  >
                    <Image
                      src={dish.image}
                      width={120}
                      height={120}
                      alt={dish.name}
                      className="object-cover w-[120px] h-[120px] rounded-lg"
                    />

                    <div className="space-y-1">
                      <h4 className="font-semibold">{dish.name}</h4>

                      <p className="text-sm text-gray-400">
                        {dish.description}
                      </p>

                      {/* 🔥 GIÁ */}
                      {category.discount ? (
                        <div className="flex gap-2 items-center">
                          <span className="line-through text-gray-400 text-sm">
                            {formatCurrency(dish.price)}
                          </span>
                          <span className="text-red-400 font-bold">
                            {formatCurrency(dish.price - 5000)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-blue-400 font-bold">
                          {formatCurrency(dish.price)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          )
        ))}
      </section>
    </div>
  )
}