const configColor = {
    mainColor: '#477fd3',
    subColor: '#10b873',
    riseColor: '#10b873',
    fallColor: '#e3525c'
}
let styleTag = null
// 配置公司皮肤
export function configHandler (params) {
    if (styleTag) {
        document.head.removeChild(styleTag)
    }
    let styleColor = []
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const color = params[key]
            styleColor.push(`.${key}{color: ${color} !important;}`)
            styleColor.push(`.${key}Bg{background-color: ${color} !important;}`)
        }
    }
    if (params.riseColor === '#10b873') {
        // 1 绿涨红跌
        styleColor.push('.riseColorBgAni { animation-name: bg-green !important; }.fallColorBgAni { animation-name: bg-red !important;}')
    } else {
        // 2 红涨绿跌
        styleColor.push('.riseColorBgAni {animation-name: bg-red !important;}.fallColorBgAni {animation-name: bg-green !important;}')
    }
    styleColor = styleColor.join('')
    styleTag = document.createElement('style')
    styleTag.type = 'text/css'
    styleTag.innerHTML = styleColor
    document.head.appendChild(styleTag)
}
export function setORColor (commit, type) {
    // 1 绿涨红跌，2 红涨绿跌
    let data = {}
    if (type == '1') {
        data = Object.assign(data, configColor)
    } else if (type == '2') {
        data = Object.assign({}, configColor, {
            riseColor: style.fallColor,
            fallColor: style.riseColor
        })
    }
    commit('UPDATE_userConfigInfo', type)
    commit('ix_baseInfo/UPDATE_STYLE', data)
    configHandler(data)
}

export const style = configColor

// 自动识别不同环境的接口域名
const imsApiURL = window['imsService'] // IMS 接口域名
if (imsApiURL.indexOf('.') === -1) window['imsService'] = 'https://imsapi.mircoinfolab.com:1315'

let apiURL = window['serviceUrl']
const uatHost = ['192.168.35.218', 'testixmiddle.', 'testpcixmiddle.', 'testweb.', 'uativmarket.ixmiddle.site', 'localhost', '192.168.1.', 'gcpuatixmiddle', 'gcppreixmiddle', 'testoa', 'test1.ixmiddle']
const preHost = ['prepcixmiddle.ixmiddle', 'preixmiddle.ixmiddle', 'preivmarket.ixmiddle.site', 'h5.cats-technology.com']

if (uatHost.concat(preHost).find(item => location.hostname.indexOf(item) === 0)) {
    window['isPRD'] = false
}

if (apiURL.indexOf('.') === -1) {
    // 没有配置接口域名的Nginx环境变量
    if (location.hostname.indexOf('gcpuatixmiddle.ixmiddle') > -1) { // 4k UAT
        apiURL = 'gcpuatapi.ixmiddle.site'
    } else if (location.hostname.indexOf('gcppreixmiddle.ixmiddle') > -1) { // 4k PRE
        apiURL = 'gcppreapi.ixmiddle.site'
    } else if (preHost.find(item => location.hostname.indexOf(item) === 0)) { // tw pre
        apiURL = 'preapi.zhonglepai.cn:1315'
    } else if (uatHost.find(item => location.hostname.indexOf(item) === 0)) { // tw uat
        apiURL = 'testapi.ixmiddle.com'
    } else {
        // PRD 备用接口域名
        apiURL = process.env.VUE_APP_apiUrl || 'api.mircoinfolab.com'
    }
}
window['serviceUrl'] = apiURL
const apiProtocol = (location.protocol === 'https:' || process.env.NODE_ENV === 'development') ? 'https://' : 'http://'
export const httpUrl = apiProtocol + apiURL
export const apiHost = apiURL
export const sigin_data = [
    [12103, 12101, 12101, 12301, 12300, 12244, 12234, 12240, 12241, 12243, 12044, 12011, 12020, 12100, 12101, 12020],
    [12102, 12100, 12300, 12244, 12243, 12300, 12244, 12100, 12044, 12044, 12044, 12011, 12010, 12103, 12011, 12020],
    [12043, 12043, 12103, 12243, 12244, 12242, 12100, 12103, 12243, 12242, 12020, 12022, 12103, 12101, 12043, 12042],
    [12013, 12004, 12020, 12243, 12243, 12243, 12100, 12043, 12242, 12240, 12244, 12243, 12043, 12101, 12100, 12020],
    [12042, 12012, 12242, 12241, 12240, 12241, 12240, 12041, 12034, 12103, 12043, 12042, 12021, 12021, 12020, 12300]
]
export const autoLoginKeyCodeList = [121, 89, 52, 121, 81, 114, 118, 107, 82, 68, 111, 81, 52, 101, 68]
sessionStorage.setItem('httpUrl', httpUrl) // 缓存起来，跨页面的时候调用，比如维护中的页面
