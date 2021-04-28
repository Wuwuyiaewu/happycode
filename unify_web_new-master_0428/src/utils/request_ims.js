import axios from 'axios'
import { Toast } from 'vant'
import { i18n } from '@m/lang'
import CryptoJS from 'crypto-js'
import CheckAPI from './checkAPI_ims'
import { httpUrl } from '@/config'
import queryString from 'query-string'
import store from '@m/store'

const key = CryptoJS.enc.Utf8.parse('GTSAPP123457890a')
// create an axios instance
const service = axios.create({
    baseURL: isPRD ? imsService : httpUrl, // url = base url + request url
    // baseURL: httpUrl, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// request interceptor
service.interceptors.request.use(
    config => {
        const baseData = store.state.ix_baseInfo.companyInfo.toKenCompanyInfoVo || {}
        const encryptedData = CryptoJS.AES.encrypt((baseData.accountNo ? baseData.accountNo : baseData.accountDemoNo), key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        const params = {
            companyId: baseData.companyId,
            platform: 'CATS',
            accountNo: baseData.accountNo ? baseData.accountNo : baseData.accountDemoNo,
            demoAccountId: baseData.demoTradeAccountId,
            key: encryptedData.ciphertext.toString()
        }
        config.data = queryString.stringify(Object.assign({}, params, config.data))
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        const token = response.headers.authorization
        if (token) {
            window['authorization'] = token
            sessionStorage.setItem('authorization__' + window.htmlKey, token)
        }

        // if the custom code is not 20000, it is judged as an error.
        if (false && res.ret !== 0) {
            let msg = ''
            if (i18n.te('retMsg.' + res.errorCode)) {
                msg = i18n.t('retMsg.' + res.errorCode)
            } else {
                msg = res.msg || i18n.t('serverBusy')
            }
            Toast(msg)

            return Promise.reject(new Error(res.msg || 'Error'))
        } else {
            const result = new CheckAPI(res)
            // console.log('CheckAPI result', result);
            return result
        }
    },
    error => {
        const data = error.response ? error.response.data : {}
        if (error && error.config && error.config.hideError) {
            console.error(data.msg || i18n.t('timeOut'))
        } else {
            Toast(data.msg || i18n.t('timeOut'))
        }
        console.log('api error', error.response) // for debug
        return Promise.reject(error)
    }
)

export default service
