import Vue from 'vue'
import { getProvinceData, getUserInfo as userInfo, removeUserInfo, setUserInfo } from '@/utils/funds/auth'
import { getUserInfo } from '@/api/user/accountApi'
import { getProAndCity } from '@/api/base/index.js'
import { provinceAndCityFormatData } from '@/utils/funds/index'

const state = {
    userInfo: userInfo(),
    province: getProvinceData(), // 中国省份
    accountType: ['USD', 'CNY'] // 账户类型
}

const getters = {
    getAccount: (state, getters) => {
        let obj = {}
        state.userInfo.account_info_list &&
            state.userInfo.account_info_list.forEach(item => {
                if (state.accountType.includes(item.currency)) {
                    obj = item
                }
            })
        console.log('getAccount', obj)
        return obj
    },
    getNewAccount: (state, getters) => {
        let obj = {}
        state.userInfo.account_info_list &&
            state.userInfo.account_info_list.forEach(item => {
                if (item.currency !== 'IXD') {
                    obj = item
                }
            })
        console.log('getAccount', obj)
        return obj
    }
}

const mutations = {
    setUserInfo (state, userInfo) {
        state.userInfo = userInfo
    },
    setProvince (state, province) {
        state.province = province
    },
    removeUserAllData (state) {
        state.userInfo = {}
        setUserInfo({})
    }
}
const actions = {
    // 获取省份
    getProvince ({ dispatch, commit, state }) {
        const language = this.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        getProAndCity({
            pid: 'ISO_3166_156' // 中国
        }).then(res => {
            if (res.code === 1) {
                const list = provinceAndCityFormatData(res.data, language)
                commit('setProvince', list)
                // setProvinceData([list])
            }
        })
    },
    getCity ({ dispatch }, code) {
        const language = this.state.ix_baseInfo.companyInfo.transBaseConfigVo.language
        return getProAndCity({ pid: code }).then(res => {
            if (res.code === 1) {
                const list = provinceAndCityFormatData(res.data, language)
                // debugger
                return Promise.resolve(list)
            } else {
                return Promise.resolve([])
            }
        })
    },

    // 获取用户信息
    getUserInfo ({ dispatch, commit, state }) {
        return new Promise((resolve, reject) => {
            getUserInfo().then(res => {
                if (res.code === 1) {
                    console.log('userInfo', res.data)
                    commit('setUserInfo', res.data)
                    setUserInfo(res.data || {})
                    resolve()
                }
            })
        })
    },
    // 退出登录
    logout ({ dispatch, commit, state }) {
        commit('setUserInfo', {})
        removeUserInfo()
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
