export default {
    namespaced: true,
    state: {
        loginData: '',
        info: '', // http接口登录的信息
        groupGet: {}, // 用户组信息
        userLoginInfo: {}, // 服务器下发的用户信息
        postionList: [] // 持仓列表
    },
    mutations: {
        // 清空数据，在切换账户的时候清空一下数据
        EMPTY_userData (state) {
            state.groupGet = {}
            state.userLoginInfo = {}
            state.postionList = []
        },
        UPDATE_LOGINDATA (state, data) {
            state.loginData = data
        },
        UPDATE_INFO (state, data) {
            state.info = data
            sessionStorage.setItem('userInfo', JSON.stringify(data))
        },
        UPDATE_USERLOGININFO (state, data) {
            state.userLoginInfo = data
            sessionStorage.setItem('userLoginInfo', JSON.stringify(data))
        },
        UPDATE_DEMONO (state, data) {
            state.info.toKenCompanyInfoVo.accountDemoNo = data.demoNo
        },
        DELETE_UserForceLogout (state) {
            sessionStorage.removeItem('userLoginInfo')
            state.userLoginInfo = ''
        },
        // 更新用户组信息
        UPDATE_groupGet (state, data) {
            state.groupGet = data
        },
        UPDATE_postionList (state, data) {
            if (data.reset) {
                state.postionList = data.data
            } else {
                state.postionList = state.postionList.concat(data.data)
            }
        },
        UPDATE_ACCOUNTNO (state, data) {
            state.info.toKenCompanyInfoVo.accountNo = state.info.toKenCompanyInfoVo.accountDemoNo
            try {
                const getAppProperties = JSON.parse(sessionStorage.getItem('getAppProperties'))
                getAppProperties.toKenCompanyInfoVo.accountNo = getAppProperties.toKenCompanyInfoVo.accountDemoNo
                sessionStorage.setItem('getAppProperties', JSON.stringify(getAppProperties))
            } catch (error) {
            }
        },
    }
}
