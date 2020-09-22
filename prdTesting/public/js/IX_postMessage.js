			/**
 * postMessage API
 */
			var APPFUNCTION = {
				inApp:function(){
					if(window.JsHook && JsHook.appGoHome) {
						return true
					} else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoHome) {
						return true
					} else  {
						return false
					}
				},
				toAppPages:function(key){
					if (window.JsHook && JsHook.appGoHome) {
						if(arguments.length == 1) {
							JsHook[key]()
						} else if(arguments.length == 2) {
							JsHook[key](arguments[1])
						} else if(arguments.length == 3) {
							JsHook[key](arguments[1],arguments[2])
						}

					} else if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appGoHome) {
						var _arr = [].slice.call(arguments);
						_arr = _arr.splice(1)
						window.webkit.messageHandlers[key].postMessage(_arr)
					}
				}
			}
			var IX_postMessage = (function(window) {
				function IX_postMessage() {
					this.domain = ''
					this.key = ''
					this.inIframe = !(window.self === window.top)
					this.callback = {}
				}

				/** 初始化调用
     */
				IX_postMessage.prototype.install = function(config) {
					this.domain = config.domain
					this.key = config.key
					window.top.postMessage({ type: 'IX_postMessage_install' }, '*')
				}
				/** 页面跳转(所有内嵌页面可用)
     * @param {String} urlPath  /home, /trade
     */
				IX_postMessage.prototype.toPage = function(urlPath) {
					if (!urlPath) return console.error(new Error('IX_postMessage.toPage 方法请传入urlPath'))
					if (urlPath.indexOf('/') !== 0) urlPath = '/' + urlPath
					if(APPFUNCTION.inApp()) {
						// 在app里边
console.log(urlPath,urlPath.indexOf('/productDetail/') == 0)
						
						// appGoNewOrder(long symbolId, int direction)//跳转到下单页；1买 2卖
						// appGoPositionList()    //跳转到持仓列表
						// appGoOrderList()  //跳转到挂单列表
						// appGoDealList()    //跳转到已平仓列表
						// appGoCS()  //跳转到客服


						if(urlPath.indexOf('/productDetail/') == 0) {
							//去行情页面
							APPFUNCTION.toAppPages('appGoChart',urlPath.substring(urlPath.lastIndexOf('/')+1))
						} else if(urlPath.indexOf('/login')== 0) {
							// 去登陆
							APPFUNCTION.toAppPages('appGoLogin') 
						} else if(urlPath.indexOf('/mine')== 0) {
							APPFUNCTION.toAppPages('appGoMine') 
						} else if(urlPath.indexOf('/home')== 0) {
							APPFUNCTION.toAppPages('appGoHome') 
							alert()
						} else if(urlPath.indexOf('/trade')== 0) {
							APPFUNCTION.toAppPages('appGoQuote') 
						} else if(urlPath.indexOf('/register')== 0) {
							var url = new URL('http://h5.bofu210.com/JW666key'+urlPath);
							var mobile = url.searchParams.get("mobile");
							APPFUNCTION.toAppPages('appGoRegister',mobile) 
						} else if(urlPath.indexOf('/order')== 0) {
							var productId = urlPath.match(/\d+/)[0];
							var direction = urlPath.indexOf('direction=buy') >= 0 ? 1:2;
							APPFUNCTION.toAppPages('appGoNewOrder', Number(productId), direction) 
						}
					} else {
						if (this.inIframe) {
							window.top.postMessage({ type: 'toPage', data: { path: urlPath } }, '*')
						} else if (this.domain && this.key) {
							location.href = `${this.domain}/${this.key + urlPath}`
						} else {
							console.error(new Error('请先调用install方法'))
						}
					}  
				}
				IX_postMessage.prototype.toMiddlePage = function(data) {
					if (!data) return console.error(new Error('IX_postMessage.toMiddlePage 方法请传入data'))
					if(APPFUNCTION.inApp()) {
						if(data.path === '/nest/queryinfo') {
							APPFUNCTION.toAppPages('appOpenNewpage',data.query.url,data.query.title)
						}
					} else {
						if (this.inIframe) {
							window.top.postMessage({ type: 'toPage', data }, '*')
						}
					}


				}

				/** 登录接口(只存在开户页面可用)
     * @param {Object} data  {accountNo:**，passWord:**}
     */
				IX_postMessage.prototype.login = function(data) {
					if (!data || !data.accountNo || !data.passWord) return console.error(new Error('IX_postMessage.login 方法请传入{accountNo:**，passWord:**}格式数据'))
					if (!this.inIframe) return
					window.top.postMessage({ type: 'autoLogin', data: data }, '*')
				}

				/** 跳转入金页面(首页可用) id： deposit 入金， drawings 出金
     */
				IX_postMessage.prototype.toDepositDrawings = function(id) {
					if (['deposit', 'drawings'].indexOf(id) < 0) {
						return
					}
					if(APPFUNCTION.inApp()) {
						if(id === 'deposit') {
							APPFUNCTION.toAppPages('appGoDeposit')
						} else if(id === 'drawings') {
							APPFUNCTION.toAppPages('appGoWithdrawal')
						}
					} else {
						if (!this.inIframe) return
						window.top.postMessage({ type: 'toPage', data: { name: 'NestAccess', params: { id: id } } }, '*')
					}

				}
				/*
     * 返回
     */
				IX_postMessage.prototype.back = function() {
					if (!this.inIframe) return
					window.top.postMessage({ type: 'back', data: {} }, '*')
				}
				/* 获取app的基本信息 */
				IX_postMessage.prototype.getAppToken = function(data) {
					if (!this.inIframe) return
					if (data && data.success) {
						this.callback['getAppToken'] = data.success
					}
					window.top.postMessage({ type: 'getAppToken', data: {} }, '*')
				}
				var pm = new IX_postMessage()

				window.addEventListener(
					'message',
					function(evt) {
						var data = evt.data || {}
						if (data.type === 'appToken') {
							pm.callback['getAppToken'](data.data || {})
						} else if(data.type === 'appProductInfo') {
							pm.callback['getAppProductInfo'](data.data || [])
						}
					},
					false
				)
				return pm
			})(window)

