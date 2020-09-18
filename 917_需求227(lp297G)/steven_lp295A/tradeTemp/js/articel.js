let account_type = {
    selected: "請選擇模式",
    account_value: [
        {
            "name": "真實帳號",
            "val": "real"
        },
        {
            "name": "模擬帳號",
            "val": "demo"
        }
    ]
}
var vm = new Vue({
    el: "#app",
    data() {
        return {
            ax_data: {
                "head": { "appKey": "yz352001" },
                "data": { "login_name": "", "password": "", "accountType": account_type.account_value }
            },
            config: {
                method: 'post',
                url: 'https://api.dragonfly8.com/account/appProperties/getAccountProperties',
                headers: {
                    'Content-type': 'application/json',
                    'module': 'uat-account',
                    'rpcType': 'http',
                    'method': '/account/appProperties/getAccountProperties',
                    'httpMethod': 'post',
                    'trace': 'h5_' + this.get_current_time(),
                    'Authorization': ''
                },

                data: {
                    "head": { "appKey": "yz352001" },
                    "data": { "login_name": "", "password": "" }
                },
            },
            content: {
                "company_id": "",
                "login_name": "",
                "password": "",
                "user_type": -1,
                "appKey": "",
                "clientIp": ""
            },
        }
    },
    methods: {
        get_current_time() {
            var d = new Date();
            return d.getTime();
        },
        gotourl() {
            let vm = this
            console.log(vm.config);
            axios(vm.config)
                .then(function (response) {
                    vm.config.headers.Authorization = response.headers.authorization
                    vm.config.data = vm.ax_data
                    vm.config.headers.method = "/account/uac/auth/token"
                    console.log(response)
                    return axios(vm.config)
                }).
                then(function (res) {
                    let data = JSON.stringify({ "head": { "appKey": "yz352001" }, "data": {} });

                    let Newconfig = {
                        method: 'get',
                        url: 'https://api.chongontrading.com/fcc/fcc_user/list?pageIndex=1&pageSize=10',
                        headers: {
                            'Content-type': 'application/json',
                            'module': 'uat-account',
                            'rpcType': 'http',
                            'Authorization': 'Bearer ' + res.data.data.token,
                            'method': '/fcc/fcc_user/list',
                            'httpMethod': 'get'
                        },
                        data: data
                    };
                    console.log(res)

                    return axios(Newconfig)
                }).then(function (res) {
                    console.log(res)
                })
                .catch(function (error) {
                    console.log(error, '第二次錯誤');
                });
        },
        forMessage() {
            let data = JSON.stringify({ "head": { "appKey": "yz352001" }, "data": {} });

            let config = {
                method: 'get',
                url: 'https://api.chongontrading.com/fcc/fcc_user/list?pageIndex=1&pageSize=10',
                headers: {
                    'Content-type': 'application/json',
                    'module': 'uat-account',
                    'rpcType': 'http',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjExMjUsInVzZXJfbmFtZSI6IkFwcEF1dGhJbmZvKHV1aWQ9U0pMVVRVODE0ODMzNSwgYWNjb3VudF9pZD0sIGFjY291bnRfdHlwZT1HLCBwbGF0Zm9ybT0sIHNvdXJjZT13ZWIsIGdyb3VwX2lkcz0sIG1kNV9waG9uZT0sIHVzZXJpZD02Njg3NTUsIGJ1cnlfaWQ9MTcxMzAxMywgZm9udF9zaXplPTEsIGFwcElkPTEwMTcsIHRlbmFudElkPTExMjUpIiwic2NvcGUiOlsiKiJdLCJmb250X3NpemUiOjEsImJ1cnlfaWQiOjE3MTMwMTMsImV4cCI6MTU5NzIyNTIzOSwidXNlcmlkIjo2Njg3NTUsImFwcF9pZCI6MTAxNywianRpIjoiOWI2M2MwZmYtNjkzYS00MjYxLWEyNTMtM2U3NTRiOTc2ZTk5IiwiY2xpZW50X2lkIjoiWjEuMjE1MTJGTC1SVUtKTk9PVkJfLUhRUDI3T1AyWl8iLCJ0aW1lc3RhbXAiOjE1OTcxOTY0Mzk3NDh9.oM2v7czefQSNCW6RksY64rTT78H2CQVMF7BgoulpPU0',
                    'method': '/fcc/fcc_user/list',
                    'httpMethod': 'get'
                },
                data: data
            };


            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
})
