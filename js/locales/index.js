import { createI18n } from 'vue-i18n'
import en from './en.js'
import zhTW from './zh-TW.js'

const getBrowserLang = () => {
  const saved = localStorage.getItem('lang')

  if (saved) return saved

  const lang = navigator.language || navigator.userLanguage
  if (lang.includes('zh')) return 'zh-TW'
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLang(),
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
  },
})

export default i18n

export const languages = [
  { title: 'English', value: 'en' },
  { title: '繁體中文', value: 'zh-TW' }
]
