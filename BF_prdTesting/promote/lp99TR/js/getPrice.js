// 10/20 15:30 上傳文檔

var vm = new Vue({
            el: "#getPriceTemplate",
            data() {
                return {
                    // 技術分析
                    currencies: `${TECH_ANA_URL}`,
                    // 輪播起始與切換資料
                    arrshow: [],
                    arrshow2: [],
                    // 輪播產品選擇
                    carouselId: LOOPING_PRODUCT_ID,
                    // 輪播產品文字
                    carouseName: [],
                    carouseCur: [],
                    carouselData: [],
                    // 03 總產品清單 json url
                    jsonUrl: 'promote/lp63TR/js/code_03_ix.json',
                    // json資料存放陣列
                    allJson: [],
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
                            "head": {
                                "appKey": "yz352001"
                            },
                            "data": {
                                "login_name": "Guest",
                                "password": ""
                            }
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
                    // 所有產品 id
                    typeId: [],
                    // 最後一口價 開關
                    lastPriceOn_Off: LASTPRICE_ON_OFF,
                    // 總產品_最後一口價
                    allLastProduct: [],
                    // 時實數據 開關
                    productOn_Off: PRODUCT_SUB_ON_OFF,
                    // 時實數據
                    realtimeData: [],
                    // 心跳間隔(單位:毫秒)
                    beatTime: 30000,
                    // k 線數據開關
                    klineOn_Off: KLINE_ON_OFF,
                    // k 線日期單位
                    ktypeDay: KLINE_DATE_INTERVAL,
                    // k 線數據
                    klineHistoryData: [],
                    // k 線開始時間
                    klinestartTime: KLINE_DATE_START,
                    // k 線資料時間走向( 1:往未來 0:向過去)
                    klineflag: 1,
                    // 輪播廣播 開關
                    loopOn_Off: LOOPING_ON_OFF,
                    // 行情技術分析 開關
                    techOn_off: TECH_ANA,
                    // 行情技術分析
                    currenctTemp: "",

                    testData: [{ cur_price: 0, benefit: 0, benefit2: 0 }, { cur_price: 0, benefit: 0, benefit2: 0 }, { cur_price: 0, benefit: 0, benefit2: 0 }],
                }
            },
            computed: {
                month: function() {
                    var d = new Date();
                    return d.getMonth() + 1
                },
                date: function() {
                    var d = new Date();
                    return d.getDate()
                },
                rankedProduct: function() {
                    let vm = this;
                    vm.realtimeData.forEach(function(item) {
                        vm.allJson.forEach(function(item2) {
                            if (item.code_id == item2.id) {
                                item.name = item2.name;
                                item.benefit = (100 * (item.high_price - item.low_price) / (item.cur_price * item2.per / 100)).toFixed(2);
                                item.benefit2 = (Number(item.benefit) + 100).toFixed(2);
                            }
                        })
                    })
                    vm.realtimeData.sort(function(a, b) {
                        return a.code_id - b.code_id
                    });
                    return vm.realtimeData;
                }
            },
            methods: {
                // 紀錄分頁
                recordHis() {
                    let vm = this
                    let url_path = window.location.href
                        //console.log(url_path)
                    let routeFomr = sessionStorage.setItem('routerForm', url_path)
                },
                // 時間具有唯一性
                get_current_time() {
                    var d = new Date();
                    return d.getTime();
                },
                // 取得技術分析
                getCurrenc() {
                    let vm = this
                    axios(vm.currencies).then(res => {
                        vm.currenctTemp = res.data
                    }).catch(error => {
                        console.log(error, '技術分析錯誤')
                    })
                },
                // 取得 json 格式文件
                getJson() {
                    let vm = this
                    axios(vm.jsonUrl).then(res => {
                        vm.allJson = JSON.parse(JSON.stringify(res.data))
                    }).catch(error => {
                        console.log(error, '取得json錯誤')
                    })
                },
                // 生成買賣
                generate(v) {
                    let vm = this
                    const slider = document.querySelector('.slider')
                    slider.style.height = `${(100 * (vm.carouselId.length))}%`
                    _content_ls = {
                            code_ids: LOOPING_PRODUCT_ID,
                        }
                        // --最後一口價 + 推入輪播
                    setTimeout(() => {
                        vm.WsLastpriceBuildup("lastPrice", _content_ls)
                        vm.allLastProduct.forEach(el => {
                            vm.allJson.forEach(el_2 => {
                                if (el.code_id == el_2.id) {
                                    vm.carouseName.push(el_2.name)
                                    vm.carouseCur.push(el.cur_price)
                                }
                            })
                        })
                    }, 1000);
                    // 因應 Ws 網路延時
                    vm.arrshow = []
                    setTimeout(() => {
                        vm.arrshow2.push(vm.randomTrading(v))
                        vm.arrshow2.push(vm.randomTrading(v))
                            // 輪播 start
                            // 輪播 end
                    }, 1000);
                },
                // 更新買賣
                updataGenerate() {
                    let vm = this
                    _content_ls = {
                            code_ids: vm.typeId,
                        }
                        // --最後一口價 + 推入輪播
                    vm.carouseName = []
                    vm.carouseCur = []
                        // setTimeout(() => {
                    vm.WsLastpriceBuildup("lastPrice", _content_ls)
                    vm.allLastProduct.forEach(el => {
                        vm.allJson.forEach(el_2 => {
                            if (el.code_id == el_2.id) {
                                vm.carouseName.push(el_2.name)
                                vm.carouseCur.push(el.cur_price)
                            }
                        })
                    })

                    // }, 1000);
                    // 因應 Ws 網路延時
                    setTimeout(() => {
                        for (let x = 0; x < vm.carouselId.length; x++) {
                            vm.arrshow2.push(vm.randomTrading(x))
                            vm.arrshow2.push(vm.randomTrading(x))
                        }
                        // 輪播 start
                        // 輪播 end
                    }, 1000);

                },
                // 亂數生成
                randomTrading() {
                    let vm = this
                    let random_boolean = Math.random() >= 0.5;
                    let buyOrsell
                    if (random_boolean) {
                        buyOrsell = '买入'
                    } else {
                        buyOrsell = '卖出'
                    }
                    let randomCal = (Math.floor(Math.random() * vm.carouselId.length))
                    let account = {
                            data: `68****${Math.floor(Math.random() * 90) + 10}以 ${(vm.carouseCur[`${randomCal}`])} ${buyOrsell} ${(Math.floor(Math.random() * 37) * 0.05 + 0.5).toFixed(2)}手 ${vm.carouseName[`${randomCal}`]}`,
				id: `random`
			}
			return account
		},
		// 輪播買賣 carousel
		looping(v) {
			let vm = this
			const slider = document.querySelector('.slider')
			let top = 0
			setInterval(() => {
				top = (top - 0.3).toFixed(1)
				let allLengthUnit = (((vm.carouselId.length) * 2) * 0.3).toFixed(1)
				slider.setAttribute('style', `top:${top}rem`)
				if (-(top % allLengthUnit).toFixed(2) === 0.3) {
					vm.updataGenerate()
				}
			}, 3000);
		},
		//css prfix
		setVendorCss(element, property, value) {
			element.style["webkit" + property] = value;
			element.style["moz" + property] = value;
			element.style["ms" + property] = value;
			element.style["o" + property] = value;
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
			//console.log('open connect', vm.Ws_config)
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
		// --初始化所有產品 與 產品分類、ID
		defineProduct(e) {
			let vm = this
			let newArr = JSON.parse(e)
			newArr.content.product_category.forEach(element => {
				vm.typeId = vm.typeId.concat(element.code_ids)
			});

			//console.log(vm.typeId, 'Id 產生')
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
		// 發送心跳
		Ws_heartBeat(msgType, _content) {
			let vm = this
			let Ws_HtConfig = {
				"head": vm.Ws_Head(msgType),
				"content": _content,
				"trace": vm.get_current_time(),
				"device": "h5",
				"version_code": 1
			}
			vm.websocketsend(JSON.stringify(Ws_HtConfig));
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
		WsKlineBuildup(msgType, _content) {
			let vm = this
			let ws_klineConfig = {
				"head": vm.Ws_Head(msgType),
				"content": _content,
				"device": "h5",
				"trace": vm.get_current_time(),
				"version_code": 1
			}
			vm.websocketsend(JSON.stringify(ws_klineConfig));
		},
		// lastPrice format
		// buy_price code_id cur_price high_price low_price open_price sell_price seq time title yesterday_price
		// --更新時實數據
		WsUpdateReal(data) {
			let vm = this
			// 實時數據資料
			vm.realtimeData.forEach(el => {
				if (el.code_id == data[0]) {
					el.sell_price = data[1]
					el.buy_price = data[2]
					el.cur_price = data[3]
					el.time = data[4]
					el.high_price = data[5]
					el.low_price = data[6]
				}
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
				// 完整 p 資料
				vm.WsUpdateReal(ws_realTimeProduct)
				// ws 登入後會回傳數據
				// msg_type 請看 ix 文檔
				// https://testdocs.ixmiddle.com/ixmiddle/ix-socket-proxy-doc/trade-login.html
				// 為字串且排除產品訂閱的條件後，再行轉換
			} else if (typeof (e) === "string" && e.toString().indexOf("p(") < 0) {
				msg = JSON.parse(e);
				var msg_code = msg.msg_code;
				// blob 資料型態
			} else {
				// 必須使用 FileReader 解讀
				var reader = new FileReader();
				reader.addEventListener('load', function () {
					// console.log(reader.result)
					// 解讀後再使用 pako 解讀成 base64
					let base64 = pako.inflate(reader.result, { to: "string" });
					// base64 在使用 decodeURI 轉碼成物件
					let newarr = JSON.parse(decodeURI(base64));
					// 解碼後取物件 msg_code
					let msg_code = newarr.msg_code
					// -- 事件 msg_code 判斷 (blob 資料型態) 
					switch (msg_code) {
						case "GroupSymbolListRet":
							break
							case "KlineHistoryData":
							vm.klineHistoryData = JSON.parse(JSON.stringify(newarr.content.kline_data_list))
							break
					}
				});
				reader.readAsArrayBuffer(e);
			}
			// -- 事件 msg_code 判斷 (非 blob 資料型態)
			switch (msg_code) {
					// 比對到使用者登入
				case "UserLoginInfoRet":
					// 已經有用戶帳戶資料 參考 ix 文檔
					// https://testdocs.ixmiddle.com/ixmiddle/ix-socket-proxy-doc/trade-login/tui-song-deng-lu-jie-guo.html
					break;
					// 比對到心跳設定
				case "HeartBeatConf":
					_content_ht = {
						beat: 1,
					}
					vm.Ws_heartBeat("ping", _content_ht)
					break;
					// 比對到心跳回傳
				case "pong":
					setTimeout(() => {
						_content_ht = {
							beat: 1,
						}
						vm.Ws_heartBeat("ping", _content_ht)
					}, vm.beatTime);
					break;
					// --初始化 所有產品 與 產品分類
				case "InitProductInfo":
					// 抓取所有 ID 或自定義 ID
					if (vm.lastPriceOn_Off) {
						vm.defineProduct(e)
						// 訂閱所有產品最後一口價
						_content_ls = {
							code_ids: PRODUCT_SUB_ID,
						}
						// --最後一口價
						vm.WsLastpriceBuildup("lastPrice", _content_ls)
					} else {
						//('最後一口價開關狀態: OFF');
					}
					// 輪播 ID 訂閱
					if (vm.loopOn_Off) {
						for (let v = 0; v < (vm.carouselId.length); v++) {
							vm.generate(v)
						}
					}else{
						//console.log('輪播開關狀態: OFF');
					}
					if (vm.klineOn_Off) {
						_content_kline = {
							code_id: 573004,
							startTime: vm.klinestartTime,
							ktype: vm.ktypeDay,
							num: 500,
							flag: vm.klineflag
						}
						// --發送 k線ID
						vm.WsKlineBuildup('klineHistoryData', _content_kline)
					} else { 
						//console.log('K 線開關狀態: OFF'); 
					}
					break;
					// 比對到最後一口價傳入
				case "LastPrice":
					let newarr = JSON.parse(e)
					vm.allLastProduct = []
					newarr.content.forEach(el => {
						vm.allLastProduct = vm.allLastProduct.concat(el)
					})
					vm.realtimeData = JSON.parse(JSON.stringify(vm.allLastProduct))

					/*Jimmy 需要的 filter*/
					vm.filter();

					_content_pr = {
						code_ids: PRODUCT_SUB_ID,
						subscribeType: "reSubscribe",
						type: "yz"
					}
					//console.log(PRODUCT_SUB_ID)
					// --產品報價
					if (vm.productOn_Off) {
						vm.WsProductCurBuildup("productSubscription", _content_pr)
					} else { 
						//console.log('實時報價開關狀態: OFF'); 
					}
					break
					// 比對到 K 線發送
					case "klineHistoryData":
					break
					default:
					break;
			}
		},
		// 輪播非同步應對
		loopingTime() {
			setTimeout(() => {
				this.looping()
			}, 1000);
		},

		filter() {

		}
	},
	mounted() {
		// this.loopingTime()
	},
	created() {
		this.gotourl()
		this.getJson()
		if (this.techOn_off) {
			this.getCurrenc()
		} else { 
			//console.log('技術分析開關狀態 : OFF'); 
		}
	},
	destroyed() {
	}
})
// overriding function
var doGetPriceResponse = {
	'lastPrice': function(data) {
	},
	'priceSubscribe': function(data) {
	}
};