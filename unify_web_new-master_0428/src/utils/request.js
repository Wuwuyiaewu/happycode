import axios from 'axios'
import CheckAPI from './checkAPI'
import { Toast } from 'vant'
import { guid, _csrf } from './index'
import { httpUrl, sigin_data } from '@/config'
import { i18n } from '@m/lang'
import { localSet, localGet } from '@/utils/index'

export { axios }
// create an axios instance
const service = axios.create({
    baseURL: httpUrl, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 60000 // request timeout
})
const headers = service.defaults.headers
headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
headers.module = 'uat-account'
headers.rpcType = 'http'
headers.httpMethod = 'post'
// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        let language="zh-CN";
        let appKey = "";
        if(localStorage['langList']&&JSON.parse(localStorage['langList']).length>0){
            let langList = JSON.parse(localStorage['langList']);
            if(htmlKey!=langList[0].appKey){
                localStorage['langList'] = [];
                appKey = htmlKey;
            }else{
                appKey = localStorage["appKey"];
            }
        }else{
            appKey = htmlKey;
        }
        const baseParams = {
            head: {
                appKey: appKey,
                language:language
            }
        }
        const token = window['authorization'] || sessionStorage.getItem('authorization__' + window.htmlKey)
        const headers = config.headers
        headers.trace = guid()
        headers.method = config.url
        const timestamp = Date.now()
        const tokenstr = token ? token.split(' ')[1] : null
        let _index = tokenstr ? (tokenstr.charAt(20).charCodeAt() % 5) : 1
        if (config.url === '/account/appProperties/getAccountProperties'
            || config.url === '/account/appProperties/getLanageContent'
            || config.url === '/account/open/openRealGoldExperienceAccount') {
            _index = 1
        }
        headers.timestamp = timestamp
        headers.sign = _csrf(timestamp, sigin_data[_index])
        headers.method = config.url + '/vsids'
        headers.httpMethod = config.method || 'post'
        config.responseType = config.responseType || ''
        if (window['serviceUrl'] === '') config.url = '/api' + config.url
        if (token && config.url === '/account/appProperties/getAccountProperties') headers.token = token.slice(7)
        else if (token && config.url !== '/account/appProperties/getAppProperties') headers.authorization = token

        if (config.method === 'get') {
            config.params = Object.assign({}, baseParams, config.params || {})
        } else if (config.method === 'post') {
            const postData = config.data
            config.data = Object.assign({}, baseParams, postData)
        }
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
        const data = error.response.data
        const config = error.response.config

        if (error && error.config && error.config.hideError) {
            console.error(data.msg || i18n.t('timeOut'))
        } else if (config.url.indexOf('/account/appProperties/getLanageContent') < 0) {
            Toast(data.msg || i18n.t('timeOut'))
        }

        console.log('api error', error.response) // for debug
        // Message({
        //     message: error.message,
        //     type: 'error',
        //     duration: 5 * 1000
        // })
        return Promise.reject(error)
    }
)

export default service
