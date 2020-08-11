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
            gb:null,
            mb:null,
            sadwq:66,
            RankAccount:[]
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
        getRandom(min,max){
            return Math.floor(Math.random()*(max-min+1))+min;
        },
        //   Calculation() {
        //     let vm = this
        //     setInterval(() => {
        //       if (vm.fapidata.profit < 1000000) {
        //         vm.fapidata.profit = vm.fapidata.profit + 300000
        //       } else if (vm.fapidata.profit > 1000000) {
        //         vm.fapidata.profit = vm.fapidata.profit - 200000
        //       }
        //       console.log('bin', vm.fapidata.profit)
        //     }, 1000);
        //   }
    },
    computed: {
        cal() {
            let vm = this
            let newdata = vm.getRandom(0,999)
            return `68***${newdata}`
            setInterval(() => {
                
            }, 1000);
        }
    },
    watch:{
        gb(value,oldv){
            this.mb = value * 1024;
        },
        mb(value){
            this.gb = value / 1024;
        },
        sadwq(val){
            this.gb = val / 6;
        }
    },
    mounted() {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', './js/ws_index_251.js')
        console.log(recaptchaScript)
        document.head.appendChild(recaptchaScript)
    },
    created() {
        this.ajax_sample()
        //   this.Calculation()
    },
    destroyed() {
    }
})
