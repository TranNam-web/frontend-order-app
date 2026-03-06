import envConfig from '@/config'

export const baseOpenGraph = {
  locale: 'en_US',
  alternateLocale: ['vi_VN'],
  type: 'website',
  siteName: 'NamTran 中国菜🇨🇳',
  images: [
    {
      url: `${envConfig.NEXT_PUBLIC_URL}/banner1.png`
    }
  ]
}
