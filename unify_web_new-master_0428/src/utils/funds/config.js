import { getQuery } from '@/utils/funds/index.js'

export const Rate = {
    /* UAT */
    CNY: 132003,
    HK: 121001
    /* PRD */
    // CNY: 21045,
    // HK: 21046
}

const { lang } = getQuery()
const localLang = localStorage.getItem('lang')
const langs = ['zh_CN', 'en']
let result = ''

if (langs.includes(lang)) {
    localStorage.setItem('lang', lang)
    result = lang
} else if (langs.includes(localLang)) {
    result = localLang
} else {
// 默认简体中文
    result = 'zh_CN'
}
export const locale = result
