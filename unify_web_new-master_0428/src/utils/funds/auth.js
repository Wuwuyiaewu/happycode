
const USERINFO = 'userInfo'
const PROVINCE = 'PROVINCE'
const BANKLIST = 'BANKLIST'

export function getUserInfo () {
    return JSON.parse(localStorage.getItem(USERINFO)) || {}
}

export function setUserInfo (userInfo) {
    localStorage.setItem(USERINFO, JSON.stringify(userInfo))
}

export function removeUserInfo () {
    localStorage.removeItem(USERINFO)
}

// 获取城市缓存
export function getProvinceData () {
    return JSON.parse(localStorage.getItem(PROVINCE)) || []
}

export function setProvinceData (province = []) {
    localStorage.setItem(PROVINCE, JSON.stringify(province))
}

// 获取银行卡列表
export function getBankList () {
    return JSON.parse(localStorage.getItem(BANKLIST)) || []
}

export function setBankList (banklist) {
    localStorage.setItem(BANKLIST, JSON.stringify(banklist))
}
