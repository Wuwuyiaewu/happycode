define('main', function (require, exports, module) {
    var utils = require('utils/utils')
    var ReconnectingWebSocket = require('utils/reconnecting-websocket.min')
    var heartbeatTimer = null
    var quotes = []
    var wsLinkSendMessage = []
    var mySocket = new ReconnectingWebSocket('wss://' + middleDomain + '/i/websocket') //readyState 0 CONNECTING,1 OPEN,2 CLOSING,3 CLOSED
    mySocket.onopen = function (evt) {
        if (heartbeatTimer) {
            window.clearInterval(heartbeatTimer)
        }
        this.heartbeatTimer = window.setInterval(function () {
            evtFuncs.send('ping', { beat: 1 })
        }, 30 * 1000)
        if (subCodeIds.length > 0) {
            console.log(parentTokenInfo)
            evtFuncs.send('lastPrice', { code_ids: subCodeIds, company_id: parentTokenInfo ? parentTokenInfo.companyId : '' })
            evtFuncs.send('productSubscription', { code_ids: subCodeIds, subscribeType: 'reSubscribe', type: 'yz' })
        }
        if (wsLinkSendMessage.length > 0) {
            $.each(wsLinkSendMessage, function (i, item) {
                mySocket.send(item)
            })
        }
        wsLinkSendMessage = []
    }
    mySocket.onclose = function (evt) {
        if (heartbeatTimer) {
            window.clearInterval(heartbeatTimer)
        }
        wsLinkSendMessage = []
    }
    mySocket.onmessage = function (evt) {
        if (evt.data.indexOf('{') != 0) {
            var _agr = evt.data.match(/\((.+)\)/)
            if (_agr) {
                var list = _agr[1].split(',')
                $.each(quotes, function (i, item) {
                    if (item.code_id == list[0]) {
                        quotes[i].cur_price = parseFloat(list[3])
                    }
                })
                try {
                    $.each(pageModules, function (key, val) {
                        if (key.indexOf('market') >= 0 || key.indexOf('strategyInfo') >= 0) {
                            pageModules[key].fire('quote', quotes)
                        }
                    })
                } catch (error) {}
            }
        } else {
            var data = JSON.parse(evt.data)
            if (data && data.msg_code == 'LastPrice') {
                var _lastprice = []
                $.each(data.content, function (index, item) {
                    _lastprice.push({
                        cur_price: parseFloat(item.cur_price),
                        code_id: item.code_id,
                        yesterday_price: item.yesterday_price
                    })
                })
                quotes = _lastprice
                try {
                    $.each(pageModules, function (key, val) {
                        if (key.indexOf('market') >= 0 || key.indexOf('strategyInfo') >= 0) {
                            pageModules[key].fire('quote', quotes)
                        }
                    })
                } catch (error) {}

                //utils.setSessionStorage('quotes',_lastprice)
            }
        }
    }
    mySocket.onerror = function () {
        window.clearInterval(this.heartbeatTimer)
        wsLinkSendMessage = []
    }
    // 后台模块关联的本地文件
    var MODULE_CONCAT_FILE = {
        scrollImage: 'banner',
        handerImage: 'banner',
        floatImage: 'sidebar',
        functionMenu: 'fastlink',
        accountModel: 'link',
        dynamicsInfo: 'notice',
        strategyInfo: 'strategy',
        market: 'quotes',
        info_stream: 'infoflow'
    }
    // 后台模板文件关联的html模板，此处只写入模板内容不需要做交互的，只做简单的数据渲染的木块
    // var MODULE_CONCAT_TPL ={
    //     fastlink:'tpl_fastlink',
    //     link:'tpl_link',
    // }
    // var timer = null;
    // var productInfo = {};
    // var quotesTimer =null;
    var subCodeIds = []
    var parentTokenInfo = null
    var moduleInit = false
    // var showPage = null
    // 事件响应声明
    var evtFuncs = {
        send: function (type, data) {
            if (mySocket.readyState == 1) {
                mySocket.send(utils.sendSocketMsg(type, data))
            } else {
                wsLinkSendMessage.push(utils.sendSocketMsg(type, data))
            }
        },
        bodyScroll: function (ev) {
            var scrollTop = -($('#homeContent').height() - $('#homeContent').scrollTop() - $(window).height())
            if (scrollTop > document.documentElement.clientHeight) {
                $('.evt-toTop').removeClass('out')
                $('.evt-toTop').addClass('in')
            } else {
                $('.evt-toTop').removeClass('in')
                $('.evt-toTop').addClass('out')
            }
        },
        scrollToTop: function (ev) {
            $('#homeContent').animate({ scrollTop: '0px' }, 300)
        },
        linkJump: function (ev) {
            var _configData = $(this).data()
            if (!_configData.src) {
                return
            }
            if (_configData.target == '_blank') {
                window.open(_configData.src, '_blank')
            } else if (_configData.target == 'download') {
            } else {
                //_self
                if (_configData.src.indexOf('http') == 0) {
                    if (parentTokenInfo.sourceParams) {
                        parentTokenInfo.sourceParams = parentTokenInfo.sourceParams.substring(1)
                    }
                    var url = _configData.src.indexOf('?') > 0 ? _configData.src + '&' + parentTokenInfo.sourceParams : _configData.src + '?' + parentTokenInfo.sourceParams
                    IX_postMessage.toMiddlePage({ path: '/nest/queryinfo', query: { url: url, title: _configData.title } })
                } else {
                    if (_configData.src.indexOf('/toDepositDrawings') === 0) {
                        var _qs = utils.queryToJson(_configData.src.split('?')[1])
                        IX_postMessage.toDepositDrawings(_qs.id)
                    } else {
                        IX_postMessage.toPage(_configData.src)
                    }
                }
            }
        }
    }
    //页面模块对象
    var pageModules = {}

    //自定义函数
    var custFuncs = {
        getPageData: function (data) {
            return utils.ajax(
                utils.createMiddleAjaxParams({
                    head: {
                        url: '/account/appProperties/getHomeData',
                        authorization: data.authorization,
                        method: 'POST',
                        appKey: data.appKey,
                        companyId: data.companyId
                    },
                    data: {}
                })
            )
        },
        initView(data) {
            if (moduleInit) {
                return
            }
            parentTokenInfo = data
            window.PAGECONFIG = {
                orColorType: parentTokenInfo.orColorType || 1 //1 绿涨红跌，2 红涨绿跌
            }
            custFuncs
                .getPageData(data)
                .done(function (res) {
                    if (res.code != 1) {
                        $(document).dialog({
                            titleText: '温馨提示',
                            style: 'ios',
                            content: '获取页面配置信息失败，请重试！',
                            buttonTextConfirm: '重试',
                            onClickConfirmBtn: function () {
                                pageInit()
                            }
                        })
                        return
                    }
                    if (res.data.length <= 0) {
                        $(document).dialog({
                            titleText: '温馨提示',
                            style: 'ios',
                            content: '页面模板未配置，请联系管理员！'
                        })
                        return
                    }
                    moduleInit = true
                    var pageData = res.data ? res.data.uiPageList[0].uiModules : []
                    $('#homeContent').empty()
                    subCodeIds = []
                    $.each(pageData, function (index, item) {
                        //生成dom并插入#m-body里边去
                        //换行分割单独处理
                        var moduleDomId = item.locating + '_' + utils.randomTrack()
                        if (item.locating == 'line') {
                            $('<div id="' + moduleDomId + '" class="m-cutup middle ' + item.size + '"></div>').appendTo('#homeContent')
                        } else {
                            $('<div id="' + moduleDomId + '"></div>').appendTo('#homeContent')
                            pageModules[moduleDomId] = require.async('module/' + (MODULE_CONCAT_FILE[item.locating] ? MODULE_CONCAT_FILE[item.locating] : item.locating), function (module) {
                                if (module) {
                                    item.authorization = data.authorization
                                    item.appKey = data.appKey
                                    item.origin = data.origin
                                    if (item.locating === 'market') {
                                        $.each(item.uiComponent, function (a, b) {
                                            if (subCodeIds.indexOf(parseInt(b.title)) < 0) {
                                                subCodeIds.push(parseInt(b.title))
                                            }
                                        })
                                        evtFuncs.send('lastPrice', { code_ids: subCodeIds, company_id: parentTokenInfo.companyId })
                                        evtFuncs.send('productSubscription', { code_ids: subCodeIds, subscribeType: 'reSubscribe', type: 'yz' })
                                    }
                                    if (item.locating === 'strategyInfo') {
                                        try {
                                            module.init(
                                                {
                                                    authorization: data.authorization,
                                                    appKey: data.appKey,
                                                    companyId: data.companyId,
                                                    list: res.data.tradeStrategList
                                                },
                                                moduleDomId
                                            )
                                        } catch (error) {
                                            console.error(error)
                                        }

                                        $.each(res.data.tradeStrategList, function (i, stra) {
                                            if (subCodeIds.indexOf(parseInt(stra.symbolId)) < 0) {
                                                subCodeIds.push(parseInt(stra.symbolId))
                                            }
                                        })
                                        evtFuncs.send('lastPrice', { code_ids: subCodeIds, company_id: parentTokenInfo.companyId })
                                        evtFuncs.send('productSubscription', { code_ids: subCodeIds, subscribeType: 'reSubscribe', type: 'yz' })
                                    } else {
                                        try {
                                            module.init(item, moduleDomId)
                                        } catch (error) {
                                            console.error(error)
                                        }
                                    }
                                    pageModules[moduleDomId] = module
                                }
                            })
                        }
                    })
                    bindEvt()
                })
                .fail(function (error) {
                    $(document).dialog({
                        titleText: '温馨提示',
                        style: 'ios',
                        content: '网络连接失败，请重试！',
                        buttonTextConfirm: '重试',
                        onClickConfirmBtn: function () {
                            //如果是app重新拿用户信息再刷新页面
                            if(APPFUNCTION.inApp()) {
                                APPFUNCTION.appLoginInfo()
                                .done(function (res) {
                                    var data = res.transBaseConfigVo || {}
                                    custFuncs.initView({
                                        authorization: res.authorization,
                                        appKey: data.appKey,
                                        companyId: data.companyId
                                    })
                                })
                                .fail(function (error) {
                                    pageInit()
                                })
                            } else {
                                pageInit() 
                            }
                            
                        }
                    })
                })
        },
        setRem: function (pageWidth) {
            if ('devicePixelRatio' in window) {
                var style = document.createElement('STYLE')
                var docEl = document.documentElement
                var header = document.getElementsByTagName('HEAD')[0]
                var dpr = 0
                var isIPhone = navigator.appVersion.match(/iphone/gi)
                var isAndroid = navigator.appVersion.match(/android/gi)
                var baseDpr = 'devicePixelRatio' in window ? devicePixelRatio : 1
                var dpr = baseDpr
                if (baseDpr >= 3 && (!dpr || dpr >= 3)) {
                    dpr = 3
                } else if (baseDpr >= 2 && (!dpr || dpr >= 2)) {
                    dpr = 2
                } else {
                    dpr = 1
                }
                docEl.setAttribute('data-dpr', dpr)
                docEl.setAttribute('data-device-type', isIPhone ? 'iphone' : isAndroid ? 'android' : 'other')
                var width = document.documentElement.clientWidth
                var height = document.documentElement.clientHeight
                if (pageWidth) {
                    width = pageWidth
                } else {
                    if (!isIPhone && screen.availWidth != width) {
                        width = screen.availWidth / baseDpr
                        height = screen.availHeight / baseDpr
                    }
                }
                var portrait = (Math.min(width, height) / 375) * 50
                style.innerHTML = 'html { font-size: ' + portrait + 'px!important; }'
                header.appendChild(style)
            }
        }
    }
    var bindEvt = function () {
        // 绑定事件
        $('#homeContent').on('scroll', evtFuncs.bodyScroll)
        $('.evt-toTop').on('click', evtFuncs.scrollToTop)
        $('body').on('click', 'a[data-src]', evtFuncs.linkJump)
    }
    var qs = utils.queryToJson()
    if (!(window.self === window.top)) {
        var pageWidth = qs.pagewidth ? qs.pagewidth : 375
        $('body').css('width', pageWidth)
        custFuncs.setRem(pageWidth)
    } else {
        custFuncs.setRem()
    }
    var pageInit = function () {
        if (!(window.self === window.top)) {
            IX_postMessage.getAppToken({
                success: custFuncs.initView
            })
        } else {
            custFuncs.initView({
                authorization: qs.authorization,
                appKey: qs.appKey,
                companyId: qs.companyId,
                orColorType: qs.orColorType
            })
        }
        // custFuncs.setTimer()
        window.addEventListener('message', function (evt) {
            var data = evt.data || {}
            if (data.type === 'routerChange') {
                // showPage = data.data.name
                // custFuncs.switchGetQuote(data.data)
            } else if (data.type === 'configChange') {
                window.PAGECONFIG = data.data
            }
        })
    }
    module.exports = {
        pageInit: pageInit
    }
})
