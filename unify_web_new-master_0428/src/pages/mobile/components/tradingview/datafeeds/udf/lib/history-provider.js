import dayjs from 'dayjs'
import { tvKtype } from './ktype'
import { toFixed } from '@/utils/calculation'

const timeZone = dayjs().utcOffset() * 60 * 1000 // 时区，单位为分钟

let leftTime = null // 最左侧K线时间

var HistoryProvider = /** @class */ (function () {
    function HistoryProvider (datafeedUrl, requester, vm) {
        this._datafeedUrl = datafeedUrl
        this._requester = requester
        this.vm = vm
        this.dataList = []
    }
    HistoryProvider.prototype.getBars = function (symbolInfo, resolution, from, to, first) {
        var _this = this
        if (!first) {
            to = leftTime - 1
        }
        this.vm.loading = true
        var meta = { noData: false }
        // 历史K线
        let getFunc = null
        console.log(_this.vm.activeTab)
        if (_this.vm.activeTab === 'timeSharing') {
            getFunc = () => getTimeSharing(symbolInfo.ticker, resolution, _this.vm, from * 1000, to * 1000, first)
        } else {
            getFunc = () => getKlineData(symbolInfo.ticker, resolution, _this.vm, from * 1000, to * 1000, first)
        }
        return getFunc()
            .then(list => {
                this.vm.loading = false
                if (this.vm.activeTab === 'timeSharing') {
                    list = []
                    meta.noData = true
                } else {
                    list[0] && (leftTime = list[0].timeStr)
                    if (list.length < 400) {
                        meta.noData = true
                    }
                    if (first) {
                        _this.vm.tvWidget
                            .activeChart()
                            .onDataLoaded()
                            .subscribe(
                                null,
                                () => {
                                    _this.vm.resetZoom(list)
                                },
                                true
                            )
                    }
                }

                return {
                    bars: list,
                    meta
                }
            })
            .catch(error => {
                console.log(error)
                this.vm.loading = false
                var meta = { noData: true }
                return {
                    bars: [],
                    meta
                }
            })
    }
    return HistoryProvider
})()
export { HistoryProvider }

/** 根据接口获取K线数据
 * @params {Number} code_id 产品id
 * @params {Object} vm vue实例
 * @params {Number} from 开始时间的时间戳
 * @params {Number} to 结束时间的时间戳
 * @return {Array} K线数据列表
 */
function getKlineData (code_id, ktype, vm, from, to, first) {
    // console.log('to', dayjs(to).format('YYYY-MM-DD HH:mm:ss'))
    return requestKlineData(code_id, ktype, vm, from, to, first).then(list => {
        const newList = (list || []).map(el => {
            const time = dayjs(el.time).unix() * 1000
            return {
                time: el.time * 1000, // 图表显示 0 时区
                timeStr: el.time,
                close: el.close_price,
                open: el.open_price,
                high: el.high_price,
                low: el.low_price,
                // volume: randomNum(10, 20) // 模拟数据，接口没有该数据，
            }
        })
        newList.sort((a, b) => a.time - b.time)
        return newList
    })
}
function requestKlineData (code_id, ktype, vm, from, to, first) {
    // const resolution = vm.tvWidget && vm.tvWidget.activeChart().resolution()
    // console.log(tvKtype[resolution])
    console.log({ ktype, first })
    return vm.$mSocket
        .send('klineHistoryData', {
            code_id: Number(code_id),
            ktype: tvKtype[ktype],
            msg_id: Date.now(),
            num: 400,
            flag: 0, // 取值0或1，0表示向历史方向请求，1表示向后请求, 比如 starttime = 2016-08-05 00:00:00，flag为0 请求数据往小于2016-08-05 方向， flag为1 ，请求数据往大于 2016-08-05方向
            startTime: first ? 0 : dayjs(to - timeZone).format('YYYY-MM-DD HH:mm:ss')
        })
        .then(res => res.kline_data_list)
}

/** 根据接口获取分时数据
 * @params {Number} code_id 产品id
 * @params {Object} vm vue实例
 * @params {Number} from 开始时间的时间戳
 * @params {Number} to 结束时间的时间戳
 * @return {Array} K线数据列表
 */
function getTimeSharing (code_id, ktype, vm, from, to, first) {
    return requestTimeSharingData(code_id, ktype, vm, from, to, first).then(list => {
        console.log({ list })
        const newList = list.map(el => {
            return {
                time: el.time * 1000,
                close: el.close
            }
        })
        if (newList.length > 0) {
            newList.sort((a, b) => a.time - b.time)
        }
        return newList
    })
}

// 请求分时数据
function requestTimeSharingData (code_id, ktype, vm, from, to, first, result = []) {
    return new Promise((resolve, reject) => {
        const params = {
            dayCount: 1,
            symbol_id: code_id,
            msg_id: Date.now()
        }
        const klineData = vm.klineData

        console.log('%cSharingTick', 'color:blue', vm.productId)
        vm.$mSocket
            .send('SharingTick', params)
            .then(res => {
                console.log('%cSharingTick', 'color:red', res.data.symbol_id)

                if (vm.productId != res.data.symbol_id) {
                    return
                }

                let chartData = []
                if (res.errorType) {
                    reject()
                    return vm.$toast({ duration: 1000, message: res.remark })
                } else if (klineData.length === 0 && (!res.data.kdata || res.data.kdata.length === 0)) {
                    vm.$toast({ duration: 1000, message: vm.$t('chart.chartEmpty') })
                } else if (res.data.kdata.length > 0) {
                    chartData = res.data.kdata.map(item => {
                        const multiple = Math.pow(10, item.digits)
                        const result = {
                            close: toFixed(item.price_close / multiple, item.digits),
                            // high_price: item.price_high / multiple,
                            // low_price: item.price_low / multiple,
                            // open_price: item.price_open / multiple,
                        };

                        ['price_close', 'price_high', 'price_low', 'price_open'].forEach(key => {
                            delete item[key]
                        })
                        return {
                            ...item,
                            ...result
                        }
                    }).reverse()
                }

                vm && typeof vm.updateTSData === 'function' && vm.updateTSData({
                    schedule_day: res.data.schedule_day,
                    chartData
                })

                resolve(chartData)
            })
            .catch(error => {
                console.log(error)
                vm.$toast({ duration: 1000, message: error.remark })
                return Promise.resolve(false)
            })
    })
}
