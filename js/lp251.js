var vm = new Vue({
    el: "#app",
    data() {
        return {
            ax_data: {
                "head": { "appKey": "yz352001" },
                "data": { "login_name": "", "password": "", "accountType": "" }
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
            aj_config: {
                method: 'get',
                url: '/json/lp251.json',
            },
            fapidata: {},
            gb: null,
            mb: null,
            sadwq: 66,
            RankAccount_1: 50,
            RankAccount_2: null,
            RankAccount_3: null,
            list: [
                { account: this.radomAccount(), money: 9994 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 8881 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9957 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9800 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9841 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
                { account: this.radomAccount(), money: 9850 },
                { account: this.radomAccount(), money: 9921 },
                { account: this.radomAccount(), money: 9851 },
                { account: this.radomAccount(), money: 9867 },
                { account: this.radomAccount(), money: 9842 },
                { account: this.radomAccount(), money: 9951 },
                { account: this.radomAccount(), money: 9862 },
                { account: this.radomAccount(), money: 9930 },
            ],
            lim_1: 0,
            lim_2: 0,
            lim_3: 0
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
                    console.log(response)
                    return axios(vm.config)
                })
                .catch(function (error) {
                    console.log(error, '第二次錯誤');
                });
        },
        ajax_sample() {
            let vm = this
            axios(vm.aj_config)
                .then((res) => {
                    vm.fapidata = res.data
                    console.log(vm.fapidata)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        getRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        radomAccount() {
            let vm = this
            let newdata = vm.getRandom(100, 999)
            return `68***${newdata}`
        },
        setAccountMoney() {
            let vm = this
            vm.list.forEach((element,index,object) => {
                
            });
        }
    },
    computed: {
        doll() {
            let vm = this
            let newSort = vm.list.sort((a, b) => {
                return a.money < b.money ? 1 : -1
            })
            return newSort
        }
    },
    watch: {
    },
    mounted() {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', './js/ws_index_251.js')
        console.log(recaptchaScript)
        document.head.appendChild(recaptchaScript)
        setInterval(() => {
            this.setAccountMoney()
        }, 1000);
    },
    created() {
        this.ajax_sample()
    },
    destroyed() {
    }
})
