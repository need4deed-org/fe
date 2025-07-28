import { Lang } from 'need4deed-sdk'

import { n4dLanguageLocalStorageKey } from '@/config/constants'

export function setStoredLang(lang: Lang) {
  if (isEnumValue(Lang, lang)) {
    localStorage.setItem(n4dLanguageLocalStorageKey, lang)
  } else {
    console.warn(`Invalid language code: ${lang}`)
  }
}

export function isEnumValue<E>(enumObject: object, value: E) {
  return typeof enumObject === 'object' ? Object.values(enumObject).includes(value) : false
}

export function getStoredLang(): Lang | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedLang = localStorage.getItem(n4dLanguageLocalStorageKey)
  if (storedLang && isEnumValue(Lang, storedLang)) {
    return storedLang as Lang
  }

  return null
}
