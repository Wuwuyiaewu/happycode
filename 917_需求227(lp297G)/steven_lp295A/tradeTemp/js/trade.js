
const WS_BASE_URL = "wss://api.mircoinfolab.com/websocket";
const HTTP_BASE_URL = "https://api.mircoinfolab.com";
var vm = new Vue({
    el: "#app",
    data() {
        return {
            // 03 總產品清單 json url
            jsonUrl: 'data/code_03_ix.json',
            // Http 登入獲取 token
            Http_config: {
                method: 'post',
                url: `${HTTP_BASE_URL}/account/appProperties/getAccountProperties`,
                headers: {
                    'Content-type': 'application/json',
                    'module': 'uat-account',
                    'rpcType': 'http',
                    'method': '/account/appProperties/getAccountProperties',
                    'httpMethod': 'post',
                    'trace': 'h5_' + this.get_current_time(),
                    // 發送後才可以取 token
                    'Authorization': ''
                },
                data: {
                    "head": { "appKey": "yz352001" },
                    "data": { "login_name": "Guest", "password": "" }
                },
            },
            // 建立 websocket 記憶體
            websock: null,
            // 初始化 ws 格式
            Ws_config: {
                trace: `h5 ${this.get_current_time()}`,
                version_code: 1,
                device: "h5",
                head: {
                    server: "yz",
                    msgType: "",
                    sendTime: this.get_current_time(),
                    Authorization: "",
                    lang: "zh-TW"
                },
                content: {
                    appKey: "",
                    clientIp: "",
                    company_id: "",
                    login_name: "Guest",
                    password: "",
                    user_type: 1
                },
            },
            selectProduct: '贵金属',
            // 訂閱產品
            subscrition: [],
            // JSON 總產品
            jsonDate: null,
            // 最後一口總產品
            temp: [],
            // 單筆更新時實數據
            realTime_singleProduct: [],
            // 所有產品 id
            typeId: [],
            // 物件化所有產品 id ( 包含產品分類 )
            sortProduct: [],
            // 紅漲綠跌判斷
            tempLastA: [],
            tempLastB: []
        }
    },
    computed: {
        temps() {
            return this.temp
        }
    },
    methods: {
        // 接收產品類別參數
        getValue(varname) {
            let vm = this
            let url = new URL(document.location).searchParams;
            console.log(url);
            
            let type = url.get('link').split(' ')
            type.forEach(el => {
                switch (el) {
                    case 'met':
                        vm.subscrition.push('贵金属')
                        break;
                    case 'eng':
                        vm.subscrition.push('能源')
                        break;
                    case 'exc':
                        vm.subscrition.push('外汇')
                        break;
                    case 'ind':
                        vm.subscrition.push('指数')
                        break;
                    case 'agr':
                        vm.subscrition.push('农产品')
                        break;
                    case 'us':
                        vm.subscrition.push('美股')
                        break;
                    case 'hk':
                        vm.subscrition.push('港股')
                        break;
                }
            })
        },
        // scroll 位置調整
        showtar(e) {
            let vm = this
            let productBar_All = [...document.querySelectorAll('.btn_bar')]
            let parentBar = productBar_All[e].parentElement
            let productScrollWidth = productBar_All[e].parentElement.scrollWidth
            if (productScrollWidth >= 612) {
                return
            } else if (e === vm.subscrition.length - 1 || 0) {
                parentBar.scrollLeft = productBar_All[e].offsetLeft
            } else {
                parentBar.scrollLeft = productBar_All[e].offsetLeft / 3
            }
        },
        // 時間具有唯一性
        get_current_time() {
            var d = new Date();
            return d.getTime();
        },
        // 要做 ws 以前都要先做 http 發送登入，才能夠要到 token 做 ws 操作 ix 文檔
        // https://testdocs.ixmiddle.com/ixmiddle/http-interface-doc/account/appProperties/getAccountProperties.html
        gotourl() {
            let vm = this
            axios(vm.Http_config)
                .then(function (response) {
                // 進行 ws 操作
                // 從 HTTP 所取得的 response 帶入 websocket head
                vm.Ws_config.head.Authorization = response.headers.authorization
                vm.Ws_config.head.msgType = 'login'
                vm.Ws_config.content.appKey = response.data.data.transBaseConfigVo.appKey
                vm.Ws_config.content.clientIp = response.data.data.clientIp
                vm.Ws_config.content.company_id = response.data.data.toKenCompanyInfoVo.companyId
                vm.Ws_config.content.login_name = vm.Http_config.data.data.login_name
                vm.Ws_config.content.password = vm.Http_config.data.data.password
                vm.Ws_config.content.user_type = -1
                vm.initWebSocket(vm.Ws_config)
                return axios(vm.jsonUrl)
            }).then(function (jsonRes) {
                vm.jsonDate = JSON.parse(JSON.stringify(jsonRes.data))
            })
                .catch(function (error) {
                console.log(error, 'axios 發送的 Http 、 Ws 出現錯誤');
            });
        },
        initWebSocket(Ws_config) { //初始化 websocket
            this.websock = new WebSocket(WS_BASE_URL);
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onopen = this.websocketonopen;
            this.websock.onerror = this.websocketonerror;
            this.websock.onclose = this.websocketclose;
        },
        websocketonopen() { //連接建立後執行 send 發送數據
            let vm = this
            console.log('open connect', vm.Ws_config)
            if (this.websock.readyState === 1) {
                this.websocketsend(JSON.stringify(vm.Ws_config));
            } else {
                alert("還沒進入 websocket.readyState === 1")
            }
        },
        websocketonerror() {//連結失敗，重新連線
            console.log('///連結失敗，重新連線')
            this.initWebSocket();
        },
        websocketonmessage(e) { //資料接收後
            let vm = this
            // 接收資料後判斷數據
            vm.Wsevent(e.data)
        },
        websocketsend(Data) {//資料發送
            this.websock.send(Data);
        },
        websocketclose(e) {  //關閉
            console.log('websocket 連線已經中斷', e);
        },
        // --初始化所有產品 與 產品分類
        defineProduct(e) {
            let newArr = JSON.parse(e)
            // 分類 id
            let idTypeArr = []
            // 分類類型
            let productType = []
            // 無分類所有 id
            let allProductId = []
            let typeArr = newArr.content.product_category
            // 組裝推送 id 與前置分類
            typeArr.forEach(element => {
                idTypeArr.push(element.code_ids)
                allProductId = allProductId.concat(element.code_ids)
                productType = productType.concat(element.title)
            });
            // 所有 id 推入
            vm.typeId = allProductId
            // 組分類物件
            let _consis = {
                id: [],
                title: ""
            }
            let product_finish = []
            for (let index = 0; index < idTypeArr.length; index++) {
                let id = idTypeArr[index];
                let type = productType[index]
                _consis.id = id
                _consis.title = type
                let _new_consis = JSON.parse(JSON.stringify(_consis))
                product_finish.push(_new_consis)
            }
            vm.sortProduct = product_finish
        },
        // 需要 token 者 ( 依照文檔目前只在判斷客戶來源使用 )
        WsBuildup(msgType, _content) {
            let vm = this
            vm.Ws_config.head.msgType = msgType
            vm.Ws_config.content = _content
            // 登入後正式進入 Wsevent 判斷
            vm.websocketsend(JSON.stringify(vm.Ws_config));
        },
        // 共通 head
        Ws_Head(msgType) {
            let vm = this
            let _head = {
                "server": "yz",
                "msgType": msgType,
                "sendTime": vm.get_current_time()
            }
            return _head
        },
        // 訂閱所有行情最後一口價 ( 可直接訂閱 )
        // --最後一口價--
        WsLastpriceBuildup(msgType, _content) {
            let vm = this
            let Ws_LsConfig = {
                "head": vm.Ws_Head(msgType),
                "content": _content,
                "trace": vm.get_current_time(),
                "device": "h5",
                "version_code": 1
            }
            vm.websocketsend(JSON.stringify(Ws_LsConfig));
        },
        // 訂閱產品實時報價
        // --產品報價
        WsProductCurBuildup(msgType, _content) {
            let vm = this
            let ws_PrCurConfig = {
                "head": vm.Ws_Head(msgType),
                "content": _content,
                "device": "h5",
                "trace": vm.get_current_time(),
                "version_code": 1
            }
            vm.websocketsend(JSON.stringify(ws_PrCurConfig));
        },
        // lastPrice format
        // buy_price code_id cur_price high_price low_price open_price sell_price seq time title yesterday_price
        // --更新時實數據
        WsUpdateReal(data) {
            let vm = this

            vm.tempLastA = JSON.parse(JSON.stringify(vm.temp))
            vm.temp.filter(el => {
                // 時實數據更新
                if (el.code_id === (data[0] * 1)) {
                    el.cur_price = data[3]
                    el.sell_price = data[1]
                    el.buy_price = data[2]

                }
                // 綠漲紅跌比較
                vm.tempLastA.filter(elA => {
                    if (elA.code_id === el.code_id) {
                        // console.log(elA.code_id,el.code_id)
                        if (document.getElementById(`${el.code_id}`) == null) {
                            return
                        }
                        let site = document.getElementById(`${el.code_id}`)
                        if ((site.querySelector('.sell') == null)) {
                            return
                        } else if ((elA.sell_price * 1) < (el.sell_price * 1)) {
                            site.querySelector('.sell').setAttribute('class', 'fall')
                        } else if ((elA.sell_price * 1) > (el.sell_price * 1)) {
                            site.querySelector('.sell').setAttribute('class', 'rise')
                        }
                        if ((site.querySelector('.buy') == null)) {
                            return
                        } else if ((elA.buy_price * 1) < (el.buy_price * 1)) {
                            site.querySelector('.buy').setAttribute('class', 'fall')
                        } else if ((elA.buy_price * 1) > (el.buy_price * 1)) {
                            site.querySelector('.buy').setAttribute('class', 'rise')
                        }
                    }
                })
            })
        },
        Wsevent(e) {
            let vm = this
            var msg = null;
            // 進來的字串，需要再轉字串才能使用方法
            if (e.toString().indexOf("p(") > -1) {
                // --產品報價處理
                // p( 因為非物件開頭 所以不能單純使用 json.parse 去做處理
                // ws_realTimeProduct( [0]產品ID,[1]賣價,[2]買價,[3]當前價,[4]時間,[5]最高價格,[6]最低價格 )
                // 字串處理
                let newData = e.slice(2, e.length - 1);
                let ws_realTimeProduct = newData.split(",");
                if (ws_realTimeProduct.length < 7) {
                    console.log("報價有錯 " + e);
                }
                // string 轉為 num
                var numSplit = ws_realTimeProduct[0] * 1

                // 時刻訂閱產品 id
                if (vm.realTime_singleProduct.indexOf(numSplit) < 0) {
                    vm.realTime_singleProduct.push(numSplit)
                }
                vm.WsUpdateReal(ws_realTimeProduct)

                // ws 登入後會回傳數據
                // 將數據轉換成可以比對的 msg_type 
                // msg_type 請看 ix 文檔
                // https://testdocs.ixmiddle.com/ixmiddle/ix-socket-proxy-doc/trade-login.html
                // 為字串且排除產品訂閱的條件後，再行轉換
            } else if (typeof (e) === "string" && e.toString().indexOf("p(") < 0) {
                msg = JSON.parse(e);
                var msg_code = msg.msg_code;
            }
            // 比對什麼回傳訊息
            // 再做什麼樣的事
            switch (msg_code) {
                    // 比對到使用者登入
                case "UserLoginInfoRet":
                    // 已經有用戶帳戶資料 參考 ix 文檔
                    // https://testdocs.ixmiddle.com/ixmiddle/ix-socket-proxy-doc/trade-login/tui-song-deng-lu-jie-guo.html

                    break;
                case "HeartBeatConf":
                    break;
                case "InitProductInfo":
                    // --初始化所有產品 與 產品分類
                    vm.defineProduct(e)
                    // 訂閱所有產品最後一口價
                    _content_ls = {
                        code_ids: vm.typeId,
                    }
                    // --最後一口價
                    vm.WsLastpriceBuildup("lastPrice", _content_ls)
                    break;
                case "LastPrice":
                    // console.log(`找到最後一口報價`, msg)
                    let newarr = []
                    let tempType = ''
                    vm.temp = msg.content
                    // 比對 id 填入產品名稱、英文代碼
                    vm.temp.filter(tempGroup => {
                        vm.jsonDate.forEach(jsonEl => {
                            if (tempGroup.code_id === (jsonEl.id * 1)) {
                                tempGroup.ProductName = jsonEl.name
                                tempGroup.enName = jsonEl.en
                                tempGroup.alink = `https://h5.smart-elite.com/yz352001/productDetail/${jsonEl.id}`
                            }
                        })
                    })
                    // 插入 title
                    vm.sortProduct.forEach(el => {
                        el.id.forEach(innerid => {
                            vm.temp.filter(tempGroup => {
                                if (innerid !== tempGroup.code_id) {
                                    return
                                } else if (innerid === tempGroup.code_id && tempType === '' && tempGroup.title === undefined) {
                                    // console.log(`id 相等 tempType 尚未賦予 `)
                                    tempGroup.title = el.title
                                    tempType = el.title
                                } else if (innerid === tempGroup.code_id && tempType === el.title && tempGroup.title === undefined) {
                                    // console.log(`id 相等 tempType 已經有了，title 還沒定義`)
                                    tempGroup.title = el.title
                                } else if (innerid === tempGroup.code_id && tempType !== el.title && tempGroup.title === undefined) {
                                    // console.log(`id 並不相等 tempType 已經有了，title 還沒定義`)
                                    tempGroup.title = el.title
                                    tempType = el.title
                                }
                            })
                        })
                    })
                    // 訂閱實時報價
                    _content_pr = {
                        code_ids: vm.typeId,
                        subscribeType: "reSubscribe",
                        type: "yz"
                    }
                    // --產品報價
                    vm.WsProductCurBuildup("productSubscription", _content_pr)
                    break
                    default:
                    break;
            }
        }
    },
    mounted() {
    },
    created() {
        this.getValue("link")
        this.gotourl()
    },
    destroyed() {
    }
})