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
            pid: 69,
            peid: 60,
            one_block: [],
            one_css: [],
            two_block: [],
            three_block: [],
            four_block: [],
            five_block: []
        }
    },
    computed: {

    },
    methods: {
        gotourl() {
            let vm = this
            // let params = `${TECH_ANA_URL}?pid=${vm.trading_pid}peid=${vm.trading_peid}`
            // ?pid=${vm.pid}&peid=${vm.peid}
            axios(`https://api.bingxuegirl.com/inv/currencies?pid=${vm.pid}&peid=${vm.peid}`)
                .then(function (response) {
                    let list = document.getElementById('app')
                    let elhold = document.createElement('div')
                    elhold.innerHTML = response.data
                    let newTech = elhold.getElementsByClassName('newTechStudiesRight instrumentTechTab')
                    let h3xyz = elhold.getElementsByTagName('H3')
                    let crossRatesTbl = elhold.getElementsByClassName('crossRatesTbl')
                    let float_lang_base_1 = elhold.getElementsByClassName('float_lang_base_1')
                    let float_lang_base_2 = elhold.getElementsByClassName('float_lang_base_2')
                    let el_all = document.createElement('div')
                    let table_one = document.createElement('table')
                    let table_one_collect = [...newTech[0].getElementsByTagName('span')]
                    for (let i = 0; i < table_one_collect.length; i++) {
                        if (table_one_collect[i].classList.length > 1) {
                            vm.one_css.push(table_one_collect[i].classList)
                        }
                        vm.one_block.push(table_one_collect[i].innerText)
                    }
                    table_one.innerHTML = `<table>
                    <tbody><tr>
                        <th colspan="4">总结：<strong class="${vm.one_css[0]}">${vm.one_block[0]}</strong></th>
                    </tr>
                    <tr>
                        <td>${vm.one_block[1]}</td>
                        <td class="${vm.one_css[1]}">${vm.one_block[2]}</td>
                        <td>${vm.one_block[3]}</td>
                        <td>${vm.one_block[4]}</td>
                    </tr>
                    <tr>
                        <td>${vm.one_block[5]}</td>
                        <td class="${vm.one_css[2]}">${vm.one_block[6]}</td>
                        <td>${vm.one_block[7]}</td>
                        <td>${vm.one_block[8]}</td>
                </tr></tbody></table>`
                    console.log(vm.one_css)
                    console.log(vm.one_block)
                    el_all.appendChild(table_one)
                    // el.appendChild(h3xyz[0])
                    // el.appendChild(tableCross[0])
                    el_all.appendChild(float_lang_base_1[0])
                    // el.appendChild(DIV_2[0])
                    list.innerHTML = el_all.innerHTML
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