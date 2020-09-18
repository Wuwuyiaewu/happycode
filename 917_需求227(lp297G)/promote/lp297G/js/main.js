var data = ''
axios({
	method: 'get',
	url: '/fApi/lp297G',
})
	.then(function (response) {
	console.log(response)
	// let title = document.getElementById('fapiTitle')
	// let context = document.getElementById('fapiContext')
	// title.textContent = response.data[0].title
	// context.textContent = response.data[0].description
});

var vm = new Vue({
    el: "#app",
    data() {
        return {
            pid:68,
            peid:900
        }
    },
    computed: {

    },
    methods: {
        gotourl() {
            let vm = this
            // let params = `${TECH_ANA_URL}?pid=${vm.trading_pid}peid=${vm.trading_peid}`
            axios(`https://api.bingxuegirl.com/inv/currencies?pid=${vm.pid}&peid=${vm.peid}`)
                .then(function (response) {
                    let list = document.getElementById('app')
                    let elhold = document.createElement('html')
                    elhold.innerHTML = response.data
                    let DIV = elhold.getElementsByTagName('TABLE')
                    console.log(elhold,DIV)
                    list.appendChild(DIV[1])
                })
                .catch(function (error) {
                    console.log(error, 'axios 發送的 Http 、 Ws 出現錯誤');
                });
        },
        setTimego() {
            let vm = this
        },
    },
    mounted() {
    },
    created() {
        this.gotourl()
    },
    destroyed() {
    }
})