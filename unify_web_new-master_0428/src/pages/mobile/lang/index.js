import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from '@m/lang/zh-CN.json'
import zhCNFunds from '@m/lang/funds/zh-CN.json'
import { getLanageContent } from '@/api/login'
import { localSet, localGet, localRemove } from '@/utils/index'
import { Locale } from 'vant'

Vue.use(VueI18n)
let loadServerLang = 0 // 0未加载过，1，加载中，2加载失败，3加载成功
const loadedLanguages = 'zh-CN' // 默认使用中文
export const i18n = new VueI18n({
    locale: loadedLanguages, // 设置语言
    messages: {
        'zh-CN': zhCN,
    } // 设置语言包
})
// document.title = zhCN.router.position
Object.assign(zhCN, zhCNFunds)
const vantMessages = {
    'zh-CN': zhCN.compLang,
}
Locale.add(vantMessages)

sessionStorage.removeItem('authorization__' + window.htmlKey) // 删除旧的token

function setI18nLanguage (data) {
    if (data) {
        i18n.locale = 'server'
        i18n.setLocaleMessage('server', data)
        Locale.add({ 'zh-CN': data.compLang })
        // document.title = data.router.position
        // i18n.locale = lang
    }
    return 'server'
}
export function loadLanguageAsync () {
    if (loadServerLang === 0 || loadServerLang === 1) {
        const localLangUpdateTime = localGet('localLangUpdateTime') == 'undefined' ? null : localGet('localLangUpdateTime')
        let localLangPackage = localGet('localLangPackage')
        if (localLangPackage) {
            localLangPackage = JSON.parse(localLangPackage)
        }

        return getLanageContent({
            updateTime: localLangUpdateTime && localLangPackage ? parseInt(localLangUpdateTime) : 0
        })
            .then(res => {
                if (res.code != 1) {
                    loadServerLang = 2
                    if(localStorage['langList']&&JSON.parse(localStorage['langList']).length>0){
                        delete localStorage['langList'];
                    }
                    if (localLangPackage) {
                        return Promise.resolve(setI18nLanguage(localLangPackage))
                    } else {
                        return Promise.resolve()
                    }
                }
                loadServerLang = 3
                if (res.data.fileContent) {
                    // 返回了语言包
                    try {
                        const serverLang = JSON.parse(res.data.fileContent)
                        if (serverLang) {
                            localLangPackage = serverLang
                        }
                        localSet('localLangPackage', localLangPackage)
                        localSet('localLangUpdateTime', res.data.updateTime)
                    } catch (e) {
                        console.log(e)
                    }
                }
                if (res.data.transLanguageSetting) { // 获取语言配置
                    localStorage.setItem('lang', res.data.transLanguageSetting.language)
                    localStorage.setItem('appKey', res.data.transLanguageSetting.appKey)
                    localSet('localLangUpdateTime', res.data.updateTime)
                    
                    // 返回语言选项
                     //如果此时后台修改了htmlkey的关联语言模板 （修改了langList中的第二项可切换关联模板不需要考虑，因为只切换前两项）
                    if(htmlKey==localStorage["appKey"]){//此时应用的模板是htmlkey对应的  
                        let obj = {appKey:res.data.transLanguageSetting.appKey,language:res.data.transLanguageSetting.language}
                        let transLanguageOption = [];
                        if(res.data.transLanguageSetting.optionLanguages){
                            transLanguageOption = res.data.transLanguageSetting.optionLanguages;
                        }
                        transLanguageOption.unshift(obj)
                        localStorage['langList'] = JSON.stringify(transLanguageOption)
                    }
                    i18n.locale = res.data.transLanguageSetting.language    
                }else{
                    delete localStorage['langList']; //接口不返回语言接口则删掉切换列表，语言不可切换
                }
                return Promise.resolve(setI18nLanguage(localLangPackage))
            })
            .catch(error => {   
                loadServerLang = 2
                if (localLangPackage) {
                    return Promise.resolve(setI18nLanguage(localLangPackage))
                } else {
                    return Promise.resolve()
                }
            })
    } else {
        return Promise.resolve()
    }
}
