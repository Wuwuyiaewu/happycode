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
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 },
                { account: this.radomAccount(), money: 200 }
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
        startAccM1(value) {
            this.setAccountM1(value)
        },
        startAccM2(value) {
            this.setAccountM2(value)
        },
        startAccM3(value) {
            this.setAccountM3(value)
        },
        setAccountM1(nid) {
            let vm = this
            console.log(nid)
            let id = vm.list[0].account
            if (nid) {
                id = nid
            }
            //設定 id 為帳號
            vm.list.forEach((res, index) => {
                if (res.account == id) {
                    // 該res帳號 等於 id
                    console.log(res.account + 'bingo')
                    let myCount = setInterval(() => {
                        res.money = res.money + this.getRandom(300, 500)
                        if (res.money > 1000) {
                            vm.list.splice(index, 1)
                            console.log('結束M1')
                            clearInterval(myCount)
                            this.startAccM1(id)
                        }
                    }, 1000);
                }
            })
        },
        setAccountM2(nid) {
            let vm = this
            let id = vm.list[1].account
            if (nid) {
                id = nid
            }
            //設定 id 為帳號
            vm.list.forEach((res, index) => {
                if (res.account == id) {
                    // 該res帳號 等於 id
                    console.log(res.account + 'bingo')
                    let myCount = setInterval(() => {
                        res.money = res.money + this.getRandom(10, 25)
                        if (res.money > 1000) {
                            vm.list.splice(index, 1)
                            console.log('結束M2')
                            clearInterval(myCount)
                            this.startAccM2(id)
                        }
                    }, 1000);
                }
            })
        },
        setAccountM3(nid) {
            let vm = this
            let id = vm.list[2].account
            if (nid) {
                id = nid
            }
            //設定 id 為帳號
            vm.list.forEach((res, index) => {
                if (res.account == id) {
                    // 該res帳號 等於 id
                    console.log(res.account + 'bingo')
                    let myCount = setInterval(() => {
                        res.money = res.money + this.getRandom(10,30)
                        if (res.money > 1000) {
                            vm.list.splice(index, 1)
                            console.log('結束M3')
                            clearInterval(myCount)
                            this.startAccM3(id)
                        }
                    }, 1000);
                }
            })
        },
        radomAccount() {
            let vm = this
            let newdata = vm.getRandom(100, 999)
            return `68***${newdata}`
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

        this.setAccountM1()
        this.setAccountM2()
        this.setAccountM3()

    },
    created() {
        this.ajax_sample()
        //   this.Calculation()
    },
    destroyed() {
    }
})
