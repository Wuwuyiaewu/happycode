import { widget } from '@public/charting_library/charting_library.min'
import datafeeds from './datafees'
import socket from './socket'
localStorage._interval = localStorage._interval || '1'
var _interval = localStorage._interval || '1'

var TVjsApi = function () {
    this.pricescale = '100000'
    // 价格精度
    var urls = 'wss://api.fcoin.com/v2/ws'
    var urls = urls
    this.widgets = null
    this.socket = new socket(urls)
    this.datafeeds = new datafeeds(this)
    this.symbol = 'btcusdt'
    this.interval = _interval
    this.cacheData = {}
    this.lastTime = null
    this.getBarTimer = null
    this.isLoading = true
    var that = this
    this.socket.doOpen()
    this.socket.on('open', function () {
        // 页面初始化的时候，为了快速加载，先请求150条记录
        // scoket自己定义，我这边和后端约定的是发送当前时间然后，后端根据当前时间往前查询出150条数据
        that.socket.send({
            cmd: 'req',
            args: ['candle.' + that.interval + '.' + that.symbol.toLowerCase(), 150, parseInt(Date.now() / 1000)]
        })
        // that.socket.send({
        //     cmd: 'req',
        //     args: ['deep.' + $('.deepness_check').attr('data-type') + '.' + that.symbol.toLowerCase()]
        // })
        // that.socket.send({
        //     cmd: 'sub',
        //     args: ['trade_list']
        // })
    })
    this.socket.on('message', that.onMessage.bind(this))
    this.socket.on('close', that.onClose.bind(this))
}
TVjsApi.prototype.init = function () {
    var resolution = localStorage._interval != 'undefined' ? localStorage._interval : '1'
    var chartType = (localStorage.getItem('tradingview.chartType') || '1') * 1
    var skin = localStorage.getItem('tradingViewTheme') || 'white'
    if (!this.widgets) {
        this.widgets = new widget({
            autosize: true,
            symbol: this.symbol,
            interval: resolution,
            container_id: 'tv_chart_container',
            // K线渲染的dom
            datafeed: this.datafeeds,
            library_path: '/charting_library/',
            // K线静态文件地址
            enabled_features: [],
            timezone: localStorage.timezone || 'Asia/Shanghai',
            // custom_css_url: './css/tradingview_'+skin+'.css',
            locale: localStorage.lang || 'zh',
            debug: false,
            toolbar_bg: '#fff',
            disabled_features: [
                'save_chart_properties_to_local_storage', // 本地存储
                'header_symbol_search', // 搜索
                'symbol_search_hot_key',
                'volume_force_overlay',
                'header_interval_dialog_button',
                'header_screenshot', // 照相机
                'header_compare',
                'use_localstorage_for_settings', // 用户本地存储
                'timeframes_toolbar', // 底部时间栏目
                'volume_force_overlay', // k线与销量分开
                'header_undo_redo', // 左右箭头
                // "header_settings",//设置按钮
                // "header_indicators",//技术指标线
                'header_chart_type', // 图表类型
                'pane_context_menu', // 图表右键菜单
                'header_resolutions', // 系统默认时间按钮
                // "hide_left_toolbar", //左边工具栏 hide_left_toolbar_by_default
                'header_saveload',
                'main_series_scale_menu', // 显示图表右下角的设置按钮
                'control_bar',
                'caption_buttons_text_if_possible'
            ],
            enabled_features: [
                'keep_left_toolbar_visible_on_small_screens', // 防止左侧工具栏在小屏幕上消失
                'adaptive_logo',
                'property_pages',
                'display_market_status',
                'remove_library_container_border',
                'move_logo_to_main_pane',
                'dont_show_boolean_study_arguments', // 是否隐藏指标参数
                'countdown',
                // "caption_buttons_text_if_possible", //在可能的情况下，在标题中的“指标”和“比较”按钮上显示文字而不是图标
                'header_settings',
                'hide_last_na_study_output', // 隐藏最后一次指标输出
                'symbol_info', // 商品信息对话框
                'hide_left_toolbar_by_default'
            ],
            // preset: "mobile",
            overrides: {
                ' paneProperties.rightAxisProperties.autoScale': true,
                ' paneProperties.leftAxisProperties.autoScale': true,
                volumePaneSize: 'small', // "volumePaneSize" : "large"支持的值: large（默认）, medium, small, tiny//  白色蜡烛样式
                'mainSeriesProperties.candleStyle.downColor': '#ee6560', // K线颜色
                'mainSeriesProperties.candleStyle.upColor': '#4db872',
                'mainSeriesProperties.candleStyle.borderDownColor': '#ee6560', // 边框颜色
                'mainSeriesProperties.candleStyle.borderUpColor': '#4db872',
                'mainSeriesProperties.candleStyle.wickDownColor': '#ee6560', // 烛芯颜色
                'mainSeriesProperties.candleStyle.wickUpColor': '#4db872',
                'paneProperties.vertGridProperties.color': '#f8f8fa', // 格子线条
                'paneProperties.horzGridProperties.color': '#f8f8fa',
                'paneProperties.vertGridProperties.style': 0,
                'paneProperties.horzGridProperties.style': 0,
                toolbar_bg: '#fff',
                'scalesProperties.textColor': '#818b9d',
                'paneProperties.legendProperties.showLegend': false,
                'scalesProperties.fontSize': 12,
                'paneProperties.topMargin': 30, // K线面板属性,
                'price-axis.leftMargin': 30,
                hide_left_toolbar_by_default: 'hidden',
                // "symbolWatermarkProperties.color": "#ffffff",
                'scalesProperties.lineColor': '#ccd0d8' // 边框线条颜色
            },
            studies_overrides: {
                'bollinger bands.median.color': '#33FF88',
                'bollinger bands.upper.linewidth': 7
                // "volume.precision" : 1
            },
            studies_overrides: {
                'volume.volume.color.0': '#ee6560',
                'volume.volume.color.1': '#4db872'
            }
        })

        var thats = this.widgets
        this.widgets.headerReady().then(function () {
            // 指标线
            thats.chart().createStudy('Moving Average', false, true, [5], null, { 'plot.color': '#99aac7' })
            thats.chart().createStudy('Moving Average', false, true, [15], null, { 'plot.color': '#e9e12f' })
            thats.chart().createStudy('Moving Average', false, true, [30], null, { 'plot.color': '#2026dc' })
            thats.chart().createStudy('Moving Average', false, true, [60], null, { 'plot.color': '#a109ef' })
            // 重新构建时间切换按钮
            const chart = thats.chart()
            const btnList = [
                {
                    label: '分时',
                    resolution: localStorage.resolution || '1',
                    chartType: 3
                },
                {
                    label: '1分',
                    resolution: '1',
                    chartType: 1
                },
                {
                    label: '5分',
                    resolution: '5',
                    chartType: 1
                },
                {
                    label: '15分',
                    resolution: '15',
                    chartType: 1
                },
                {
                    label: '30分',
                    resolution: '30',
                    chartType: 1
                },
                {
                    label: '1小时',
                    resolution: '60',
                    chartType: 1
                },
                {
                    label: '1天',
                    resolution: '1D',
                    chartType: 1
                },
                {
                    label: '1周',
                    resolution: '1W',
                    chartType: 1
                },
                {
                    label: '1月',
                    resolution: '1M',
                    chartType: 1
                }
            ]
            btnList.forEach(function (item, index) {
                const button = thats.createButton({
                    align: 'left'
                })
                if (item.resolution == (localStorage.resolution || '1') && item.label != '分时') {
                    button.classList.add('active')
                } else {
                }
                button.textContent = item.label
                button.setAttribute('title', item.resolution)
                button.setAttribute('data-chart-type', item.chartType === undefined ? 8 : item.chartType)
                button.setAttribute('data-resolution', item.resolution)
                button.addEventListener('click', function (e) {
                    // TVjsApi.interval=item.resolution
                    localStorage.resolution = item.resolution
                    localStorage._interval = button.getAttribute('data-resolution')
                    const chartType = button.getAttribute('data-chart-type') * 1
                    button.classList.add('active')
                    var list = TVjsApi.prototype.sibling(this.parentNode.parentNode)
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].childNodes[0]) {
                            var list_btn = list[i].childNodes[0]
                            var list_btn_chil = list_btn.children[0]
                            list_btn_chil.className = list_btn_chil.className.replace('active', ' ')
                        }
                    }
                    if (thats.chart().chartType() !== chartType) {
                        thats.chart().setChartType(chartType)
                    }
                    if (item.label != '分时') {
                        thats.chart().setResolution(item.resolution, function onReadyCallback () {})
                    } else {
                        var type = this.getAttribute('data-resolution')
                        thats.chart().setResolution(type, function onReadyCallback () {})
                    }
                })
            })
            const zb_button = thats.createButton({
                align: 'left'
            })
            zb_button.addEventListener('click', function (e) {
                // console.log(thats.getStudiesList())
            })
            zb_button.textContent = '指标'
            zb_button.classList.add('tv_indicators')
        })
    }
}
TVjsApi.prototype.sibling = function (elem) {
    var r = []
    var n = elem.parentNode.firstChild
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
            r.push(n)
        }
    }
    return r
}
TVjsApi.prototype.sendMessage = function (data, type) {
    var that = this
    // console.log("这是要发送的数据："+JSON.stringify(data) )
    if (this.socket.checkOpen()) {
        this.socket.send(data)
    } else {
        this.socket.on('open', function () {
            that.socket.send(data)
        })
    }
}
TVjsApi.prototype.reqsend = function () {
    this.socket.send({
        cmd: 'req',
        args: ['deep.' + $('.deepness_check').attr('data-type') + '.' + this.symbol.toLowerCase()]
    })
}
TVjsApi.prototype.unSubscribe = function (interval) {
    var thats = this
    // 停止订阅，删除过期缓存、缓存时间、缓存状态
    this.interval = interval
    var ticker = thats.symbol + '-' + interval
    var tickertime = ticker + 'load'
    var tickerstate = ticker + 'state'
    var tickerCallback = ticker + 'Callback'
    delete thats.cacheData[ticker]
    delete thats.cacheData[tickertime]
    delete thats.cacheData[tickerstate]
    delete thats.cacheData[tickerCallback]
    // 取消订阅
    this.sendMessage({
        cmd: 'unsub',
        args: ['candle.' + thats.interval + '.' + thats.symbol.toLowerCase()]
    })
}
// 订阅
TVjsApi.prototype.subscribe = function () {
    this.sendMessage({
        cmd: 'req',
        args: ['candle.' + this.interval + '.' + this.symbol.toLowerCase(), 1440, parseInt(Date.now() / 1000)]
    })
}

TVjsApi.prototype.onMessage = function (data) {
    var thats = this
    if (data.name == 'kline') {
        // websocket返回的值，数组代表时间段历史数据，不是增量
        var list = []
        var ticker = thats.symbol + '-' + thats.interval
        var tickerstate = ticker + 'state'
        var tickerCallback = ticker + 'Callback'
        var onLoadedCallback = thats.cacheData[tickerCallback]
        var list = data.data.kline || ''
        // 入托将后台返回的实时数据变更成TV需要的数据格式
        格式示例
        // list=[{time: 1566983700000, close: 0.008618, open: 0.008618, high: 0.008622, low: 0.008616, volume: 492.6057},{time: 1566983700000, close: 0.008618, open: 0.008618, high: 0.008622, low: 0.008616, volume: 492.6057}]

        if (data.config) {
            thats['getSymbol'] = data.config.data
        }

        // 如果没有缓存数据，则直接填充，发起订阅
        if (!thats.cacheData[ticker]) {
            thats.cacheData[ticker] = list
            // thats.subscribe()
        }
        // 新数据即当前时间段需要的数据，直接喂给图表插件
        if (onLoadedCallback) {
            onLoadedCallback(list)
            delete thats.cacheData[tickerCallback]
        }
        // 请求完成，设置状态为false
        thats.cacheData[tickerstate] = !1
        // 记录当前缓存时间，即数组最后一位的时间
        if (thats.cacheData[ticker].length > 0) {
            thats.lastTime = thats.cacheData[ticker][thats.cacheData[ticker].length - 1].time
        }
    }
    if (data.name == 'kline_real') {
        // 实时数据
        var data = data.data
        // data带有type，即返回的是订阅数据，
        // 缓存的key
        var ticker = thats.symbol + '-' + thats.interval
        // 将后台返回的实时数据变更成TV需要的数据格式
        var barsData = {
            time: data.t * 1000,
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.c,
            volume: data.v
        }

        // 如果实时数据的时间大于缓存时间，而且缓存有数据，数据长度大于0
        if (barsData.time > thats.lastTime && thats.cacheData[ticker] && thats.cacheData[ticker].length) {
            // 实时的数据直接加入缓存数组
            thats.cacheData[ticker].push(barsData)
            // 修改缓存时间
            thats.lastTime = barsData.time
        } else if (barsData.time == thats.lastTime && thats.cacheData[ticker] && thats.cacheData[ticker].length) {
            // 如果增量更新的时间等于缓存时间，即在当前时间颗粒内产生了新数据，更新当前数据
            thats.cacheData[ticker][thats.cacheData[ticker].length - 1] = barsData
        }

        // 通知图表插件，可以开始增量更新的渲染了
        thats.datafeeds.barsUpdater.updateData()
    }
}
TVjsApi.prototype.onClose = function () {
    var thats = this
    // console.log(' >> : 连接已断开... 正在重连')
    thats.socket.doOpen()
    thats.socket.on('open', function () {
        // console.log(' >> : 已重连')
        thats.subscribe()
    })
}
TVjsApi.prototype.onError = function () {
    conosle.log('....')
}
TVjsApi.prototype.initMessage = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
    // console.log('发起请求，从websocket获取当前时间段的数据');
    var that = this
    // 保留当前回调
    var tickerCallback = this.symbol + '-' + resolution + 'Callback'
    that.cacheData[tickerCallback] = onLoadedCallback
    // 获取需要请求的数据数目
    var limit = that.initLimit(resolution, rangeStartDate, rangeEndDate)
    // 商品名
    var symbol = that.symbol
    // 如果当前时间节点已经改变，停止上一个时间节点的订阅，修改时间节点值

    if (that.interval !== resolution) {
        that.unSubscribe(that.interval)
        that.interval = resolution
    }
    // 获取当前时间段的数据，在onMessage中执行回调onLoadedCallback
    that.socket.send({
        cmd: 'req',
        args: ['candle.' + that.interval + '.' + symbol.toLowerCase(), limit, rangeEndDate]
    })
}
TVjsApi.prototype.initLimit = function (resolution, rangeStartDate, rangeEndDate) {
    var limit = 0
    switch (resolution) {
    // 计算当前请求需要的K线条数
    case '1D':
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / 60 / 24)
        break
    case '1W':
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / 60 / 24 / 7)
        break
    case '1M':
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / 60 / 24 / 31)
        break
    default:
        limit = Math.ceil((rangeEndDate - rangeStartDate) / 60 / resolution)
        break
    }
    return limit
}
TVjsApi.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
    // console.log(' >> :', rangeStartDate, rangeEndDate)
    var ticker = this.symbol + '-' + resolution
    var tickerload = ticker + 'load'
    var tickerstate = ticker + 'state'

    if (!this.cacheData[ticker] && !this.cacheData[tickerstate]) {
        // 如果缓存没有数据，而且未发出请求，记录当前节点开始时间
        this.cacheData[tickerload] = rangeStartDate
        // 发起请求，从websocket获取当前时间段的数据
        this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        // 设置状态为true
        this.cacheData[tickerstate] = !0
        return false
    }
    if (!this.cacheData[tickerload] || this.cacheData[tickerload] > rangeStartDate) {
        // 如果缓存有数据，但是没有当前时间段的数据，更新当前节点时间
        this.cacheData[tickerload] = rangeStartDate
        // 发起请求，从websocket获取当前时间段的数据
        this.initMessage(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        // 设置状态为true
        this.cacheData[tickerstate] = !0
        return false
    }
    if (this.cacheData[tickerstate]) {
        // 正在从websocket获取数据，禁止一切操作
        return false
    }
    ticker = this.symbol + '-' + this.interval
    if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        this.isLoading = false
        var newBars = []
        this.cacheData[ticker].forEach(item => {
            if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
                newBars.push(item)
            }
        })
        onLoadedCallback(newBars)
    } else {
        var self = this
        this.getBarTimer = setTimeout(function () {
            self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }, 10)
    }
}

TVjsApi.prototype.getStudiesOverrides = function (theme) {}
TVjsApi.prototype.resetTheme = function (skin) {
    this.widgets.addCustomCSSFile('./css/tradingview_' + skin + '.css')
    this.widgets.applyOverrides(this.getOverrides(skin))
    this.widgets.applyStudiesOverrides(this.getStudiesOverrides(skin))
}

export default TVjsApi
