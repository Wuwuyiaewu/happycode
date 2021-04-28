import axios from 'axios'
import { Toast } from 'vant'
// import qs from 'qs'
import store from '@m/store'
import { getQuery } from '@/utils/funds/index.js'
import { locale } from '@/utils/funds/config.js'
import { httpUrl } from '@/config'

// 创建axios实例
const service = axios.create({
    withCredentials: false,
    // baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
    baseURL: httpUrl + '/api', // api 的 base_url
    timeout: 60000 // 请求超时时间
})

service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// request拦截器
service.interceptors.request.use(
    config => {
        config.params = config.params || {}
        config.data = config.data || {}
        console.log(config)
        const fundsURL = sessionStorage.getItem('fundsURL') || ''
        const { api_token, api_id, open_id } = getQuery(fundsURL.slice(fundsURL.indexOf('?')))
        console.table({
            api_token, api_id, open_id
        })

        if (locale === 'en') {
            config.params.lang = locale
        }

        if (api_token) {
            // config.headers['api_token'] = api_token // 让每个请求携带自定义token 请根据实际情况自行修改
            config.params.api_token = api_token
        }

        if (api_id) {
            // config.headers['api_id'] = api_id // 让每个请求携带自定义token 请根据实际情况自行修改
            config.params.api_id = api_id
        }

        if (open_id) {
            config.data.open_id = open_id
        }

        if (config.method === 'post') {
            if (config.form === true) {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
                // config.data = qs.stringify(config.data)
            } else if (config.upload === true) {
                config.headers['Content-Type'] = 'multipart/form-data'
            } else {
                config.data = JSON.stringify(config.data)
            }
        }

        if (/^\/json/.test(config.url)) {
            config.baseURL = config.baseURL.replace(/\/api$/, '')
            config.data = ''
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        console.log('response', response)
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        const res = response.data

        if (res.code !== '0') {
            switch (res.code) {
            case '2': {
                // 清空账户所有数据和本地缓存
                store.commit('funds/removeUserAllData')
                Toast(res.msg)
                break
            }
            case '7': {
                // 无权限访问
                Toast(res.msg)
                break
            }
            }
            return res
        } else {
            return res
        }
    },
    error => {
        console.log(error && error.response)
        Toast('网络异常')
        return Promise.reject(error.response)
    }
)

export default service
