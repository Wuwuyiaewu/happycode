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
                    vm.config.url = "https://api.chongontrading.com/fcc/fcc_user/list?pageIndex=1&pageSize=10"
                    vm.config.method = "get"
                    vm.config.headers = {
                        "Content-type": "application/json;charset=utf-8",
                        "authorization":'Bearer '+ res.data.data.token
                    }
                    return axios(vm.config)

                }).then((res)=>{
                    /// 訊息流東西在這
                    console.log(res.data)
                })
                .catch(function (error) {
                    console.log(error, '第二次錯誤');
                });
        },
    },
    mounted() {
    },
    created() {
    },
    destroyed() {
    }
})
