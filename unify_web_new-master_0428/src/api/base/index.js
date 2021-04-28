import request from '@/utils/request'
/**
 *  @name  基础数据
 *  @desc 此类接口主要获取基础配置数据、汇率转换接口、以及统一文件上传等公共接口
 **/

// 获取交易商配置
export function getCompanyConfig (code, channel_no = '', version_no = '') {
    return request({
        // url: '/base/get_company_config',
        url: '/account/front/getCompanyConfig',
        method: 'post',
        data: {
            data: {
                code,
                channel_no,
                version_no
            }
        }
    })
}

// 获取地区数据
export function getProAndCity (data) {
    return request({
        // url: '/base/get_all_area',
        url: '/account/front/getAreaInfo',
        method: 'post',
        data: { data: data }
    })
}

// 文件上传接口
export function uploadUrl (data) {
    return request({
        url: '/api/base/upload',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: data,
        upload: true
    })
}

// 获取银行卡列表
export function getBaseBankList (data = {}) {
    return request({
        // url: '/base/get_bank_list',
        url: '/account/front/getBankList',
        method: 'post',
        data: { data }
    })
}
// 获取银行卡对应的银行信息
export function getBankInfoByCode (data) {
    return request({
        // url: '/base/get_bank_list',
        url: '/account/front/getBankInfoByCode',
        method: 'post',
        data: { data }
    })
}
// 获取国家列表
export function getClientCountries (data) {
    return request({
        url: '/account/front/getClientCountries',
        method: 'post',
        data: { data }
    })
}
