import envConfig, { Locale } from '@/config'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import LoginClient from './LoginClient'

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>
}) {
  const params = await props.params
  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'Login' })
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/login`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url
    }
  }
}

export default async function Login(props: {
  params: Promise<{ locale: string }>
}) {
  const params = await props.params
  const { locale } = params

  setRequestLocale(locale)

  return <LoginClient />
}
