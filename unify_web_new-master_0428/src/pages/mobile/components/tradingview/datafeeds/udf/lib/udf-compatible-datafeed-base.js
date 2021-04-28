import { getErrorMessage, logMessage } from './helpers'
import { HistoryProvider } from './history-provider'
import { DataPulseProvider } from './data-pulse-provider'
import { QuotesPulseProvider } from './quotes-pulse-provider'
import { SymbolsStorage } from './symbols-storage'
import { KtypeList } from './ktype'
function extractField (data, field, arrayIndex) {
    var value = data[field]
    return Array.isArray(value) ? value[arrayIndex] : value
}
/**
 * This class implements interaction with UDF-compatible datafeed.
 * See UDF protocol reference at https://github.com/tradingview/charting_library/wiki/UDF
 */
var UDFCompatibleDatafeedBase = /** @class */ (function () {
    function UDFCompatibleDatafeedBase (datafeedURL, quotesProvider, requester, updateFrequency, store, vm) {
        var _this = this
        if (updateFrequency === void 0) {
            updateFrequency = 10 * 1000
        }
        this._configuration = defaultConfiguration()
        this._symbolsStorage = null
        this._datafeedURL = datafeedURL
        this._requester = requester
        this.store = store
        this.vm = vm
        this.onTick = null
        this._historyProvider = new HistoryProvider(datafeedURL, this._requester, vm)
        this._quotesProvider = quotesProvider
        this._dataPulseProvider = new DataPulseProvider(this._historyProvider, updateFrequency, vm)
        this._quotesPulseProvider = new QuotesPulseProvider(this._quotesProvider)
        this._configurationReadyPromise = this._requestConfiguration().then(function (configuration) {
            if (configuration === null) {
                configuration = defaultConfiguration()
            }
            _this._setupWithConfiguration(configuration)
        })
    }
    UDFCompatibleDatafeedBase.prototype.onReady = function (callback) {
        // console.log('onReady')
        var _this = this
        this._configurationReadyPromise.then(function () {
            callback(_this._configuration)
        })
    }
    UDFCompatibleDatafeedBase.prototype.getQuotes = function (symbols, onDataCallback, onErrorCallback) {
        // console.log('getQuotes')
        this._quotesProvider
            .getQuotes(symbols)
            .then(onDataCallback)
            .catch(onErrorCallback)
    }
    UDFCompatibleDatafeedBase.prototype.subscribeQuotes = function (symbols, fastSymbols, onRealtimeCallback, listenerGuid) {
        // console.log('subscribeQuotes 订阅K线数据')
        this._quotesPulseProvider.subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid)
    }
    UDFCompatibleDatafeedBase.prototype.unsubscribeQuotes = function (listenerGuid) {
        // console.log('unsubscribeQuotes 取消订阅K线数据')
        this._quotesPulseProvider.unsubscribeQuotes(listenerGuid)
    }
    UDFCompatibleDatafeedBase.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
        // console.log('calculateHistoryDepth', resolution, 'resolutionBack', resolutionBack, intervalBack, resolution === 'D')
        let newResolutionBack = 'D'
        let newIntervalBack
        switch (String(resolution)) {
        case '5':
            newIntervalBack = 1 // 约26个小时，请求三百多条数据
            break
        case '15':
            newIntervalBack = 4 // 约5天，请求三百多条数据
        case '30':
            newIntervalBack = 6 // 约7天，请求三百多条数据
        case '60':
            newIntervalBack = 14 // 约15天，请求三百多条数据
            break
            // case '1W':
            //     resolutionBack = 'M'
            //     newIntervalBack = 83 // 约83个月，请求三百多条数据
        case '1M':
            newResolutionBack = 'M'
            newIntervalBack = 360 // 约360个月，请求三百多条数据
            break
        case '1D':
            newIntervalBack = 360
            break
        }
        // console.log('resolutionBack', newResolutionBack, 'intervalBack', newIntervalBack)
        return newIntervalBack ? { resolutionBack: newResolutionBack, intervalBack: newIntervalBack } : undefined
    }
    UDFCompatibleDatafeedBase.prototype.getMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
        // console.log('getMarks')
        if (!this._configuration.supports_marks) {
            return
        }
        var requestParams = {
            symbol: symbolInfo.ticker || '',
            from: from,
            to: to,
            resolution: resolution
        }
        this._send('marks', requestParams)
            .then(function (response) {
                if (!Array.isArray(response)) {
                    var result = []
                    for (var i = 0; i < response.id.length; ++i) {
                        result.push({
                            id: extractField(response, 'id', i),
                            time: extractField(response, 'time', i),
                            color: extractField(response, 'color', i),
                            text: extractField(response, 'text', i),
                            label: extractField(response, 'label', i),
                            labelFontColor: extractField(response, 'labelFontColor', i),
                            minSize: extractField(response, 'minSize', i)
                        })
                    }
                    response = result
                }
                onDataCallback(response)
            })
            .catch(function (error) {
                logMessage('UdfCompatibleDatafeed: Request marks failed: ' + getErrorMessage(error))
                onDataCallback([])
            })
    }
    UDFCompatibleDatafeedBase.prototype.getTimescaleMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
        // console.log('getTimescaleMarks')
        if (!this._configuration.supports_timescale_marks) {
            return
        }
        var requestParams = {
            symbol: symbolInfo.ticker || '',
            from: from,
            to: to,
            resolution: resolution
        }
        this._send('timescale_marks', requestParams)
            .then(function (response) {
                if (!Array.isArray(response)) {
                    var result = []
                    for (var i = 0; i < response.id.length; ++i) {
                        result.push({
                            id: extractField(response, 'id', i),
                            time: extractField(response, 'time', i),
                            color: extractField(response, 'color', i),
                            label: extractField(response, 'label', i),
                            tooltip: extractField(response, 'tooltip', i)
                        })
                    }
                    response = result
                }
                onDataCallback(response)
            })
            .catch(function (error) {
                logMessage('UdfCompatibleDatafeed: Request timescale marks failed: ' + getErrorMessage(error))
                onDataCallback([])
            })
    }
    UDFCompatibleDatafeedBase.prototype.getServerTime = function (callback) {
        // console.log('getServerTime')
        if (!this._configuration.supports_time) {
            return
        }
        this._send('time')
            .then(function (response) {
                var time = parseInt(response)
                if (!isNaN(time)) {
                    callback(time)
                }
            })
            .catch(function (error) {
                logMessage('UdfCompatibleDatafeed: Fail to load server time, error=' + getErrorMessage(error))
            })
    }
    UDFCompatibleDatafeedBase.prototype.searchSymbols = function (userInput, exchange, symbolType, onResult) {
        // console.log('searchSymbols')
        if (this._configuration.supports_search) {
            var params = {
                limit: 30 /* SearchItemsLimit */,
                query: userInput.toUpperCase(),
                type: symbolType,
                exchange: exchange
            }
            this._send('search', params)
                .then(function (response) {
                    if (response.s !== undefined) {
                        logMessage('UdfCompatibleDatafeed: search symbols error=' + response.errmsg)
                        onResult([])
                        return
                    }
                    onResult(response)
                })
                .catch(function (reason) {
                    logMessage("UdfCompatibleDatafeed: Search symbols for '" + userInput + "' failed. Error=" + getErrorMessage(reason))
                    onResult([])
                })
        } else {
            if (this._symbolsStorage === null) {
                throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)')
            }
            this._symbolsStorage
                .searchSymbols(userInput, exchange, symbolType, 30 /* SearchItemsLimit */)
                .then(onResult)
                .catch(onResult.bind(null, []))
        }
    }
    UDFCompatibleDatafeedBase.prototype.resolveSymbol = function (symbolName, onResolve, onError) {
        // console.log('resolveSymbol', symbolName)
        logMessage('Resolve requested')
        var resolveRequestStartTime = Date.now()
        function onResultReady (symbolInfo) {
            logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime) + 'ms')
            onResolve(symbolInfo)
        }
        if (!this._configuration.supports_group_request) {
            const store = this.store
            // 这里需要异步返回结果
            setTimeout(() => {
                onResultReady(querySymbolInfo(symbolName, store))
            }, 0)
        } else {
            if (this._symbolsStorage === null) {
                throw new Error('UdfCompatibleDatafeed: inconsistent configuration (symbols storage)')
            }
            this._symbolsStorage
                .resolveSymbol(symbolName)
                .then(onResultReady)
                .catch(onError)
        }
    }
    UDFCompatibleDatafeedBase.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onResult, onError, firstDataRequest) {
        // console.log('getBars', arguments)
        this._historyProvider
            .getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest)
            .then(function (result) {
                onResult(result.bars, result.meta)
            })
            .catch(onError)
    }
    UDFCompatibleDatafeedBase.prototype.subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {
        // console.log('subscribeBars')
        this.setOnTick(onTick, onResetCacheNeededCallback)
        this._dataPulseProvider.subscribeBars(symbolInfo, resolution, onTick, listenerGuid)
    }
    UDFCompatibleDatafeedBase.prototype.unsubscribeBars = function (listenerGuid) {
        // console.log('unsubscribeBars')
        this._dataPulseProvider.unsubscribeBars(listenerGuid)
    }
    UDFCompatibleDatafeedBase.prototype._requestConfiguration = function () {
        // console.log('_requestConfiguration')
        // return this._send('config').catch(function(reason) {
        //     logMessage('UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=' + getErrorMessage(reason))
        //     return null
        // })
        return Promise.resolve(defaultConfiguration())
    }
    UDFCompatibleDatafeedBase.prototype._send = function (urlPath, params) {
        return this._requester.sendRequest(this._datafeedURL, urlPath, params)
    }
    UDFCompatibleDatafeedBase.prototype._setupWithConfiguration = function (configurationData) {
        this._configuration = configurationData
        if (configurationData.exchanges === undefined) {
            configurationData.exchanges = []
        }
        if (!configurationData.supports_search && !configurationData.supports_group_request) {
            throw new Error('Unsupported datafeed configuration. Must either support search, or support group request')
        }
        if (configurationData.supports_group_request || !configurationData.supports_search) {
            this._symbolsStorage = new SymbolsStorage(this._datafeedURL, configurationData.supported_resolutions || [], this._requester)
        }
        logMessage('UdfCompatibleDatafeed: Initialized with ' + JSON.stringify(configurationData))
    }
    // 以下是新增
    UDFCompatibleDatafeedBase.prototype.setOnTick = function (onTick, onResetCacheNeededCallback) {
        this.onTick = onTick
        this.onResetCacheNeededCallback = onResetCacheNeededCallback
    }
    UDFCompatibleDatafeedBase.prototype.delOnTick = function (onTick) {
        this.onTick = null
        this.onResetCacheNeededCallback = null
    }
    return UDFCompatibleDatafeedBase
})()
export { UDFCompatibleDatafeedBase }

/* 默认配置 */
function defaultConfiguration () {
    return {
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: KtypeList,
        supports_marks: false,
        supports_timescale_marks: false
    }
}
/* 商品信息结构 */
function querySymbolInfo (code_id, store) {
    if (isNaN(code_id)) return null
    const product = store.state.ix_quote.product_map[String(code_id)]
    return {
        name: code_id,
        // 'exchange-traded': product.short_name,   不需要这两个字段
        // 'exchange-listed': product.short_name,   不需要这两个字段
        timezone: 'Etc/UTC', // 交易所时区
        minmov: 1, // 最小波动
        minmov2: 0, // 这是一个神奇的数字来格式化复杂情况下的价格
        pointvalue: 1,
        session: '24x7', // 交易时段
        has_intraday: true, // 布尔值显示商品是否具有日内（分钟）历史数据
        has_no_volume: false, // 布尔表示商品是否拥有成交量数据
        description: product.simplified, // 商品说明。这个商品说明将被打印在图表的标题栏中。
        type: 'stock', // 仪表的可选类型 stock, index, forex, futures, bitcoin,  expression,  spread, cfd 或其他字符串
        // supported_resolutions: ['D', '2D', '3D', 'W', '3W', 'M', '6M'],
        pricescale: Math.pow(10, product.digit), // 价格精度
        ticker: code_id,
        has_weekly_and_monthly: true // 允许周期：周/月
    }
}
