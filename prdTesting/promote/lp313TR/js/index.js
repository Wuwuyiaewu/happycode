(function() {
    var lastPrice = {};
    var cur;
    var upDownAmount;
    var upDownWidth;
    var color = '';
    var curColor = ''
    var buyColor = ''
    var sellColor = ''
    var klineDataList = {}
    var buyPrice = ''
    var sellPrice = ''
    var wsUrl = 'wss://api.mircoinfolab.com:1315/i/websocket'
    var ws = new WS({
        url: wsUrl,
        heartData: {
            head: { server: "yz", msgType: "ping", sendTime: new Date().getTime() },
            content: { beat: 1 },
            device: "h5",
            trace: guid(),
            version_code: 1
        }
    })

    $('.btnProduct').each(function(i, item) {
        item.addEventListener('click', function(e) {
            if (productId === e.target.dataset.id * 1) {
                return
            }

            productCode = e.target.dataset.code
            productName = e.target.innerText
            productId = e.target.dataset.id * 1
            digits = e.target.dataset.digits

            cur = upDownAmount = upDownWidth = color = curColor = buyColor = sellColor = buyPrice = sellPrice = ''
            lastPrice = {}
            klineDataList = {}

            $('.btnProduct').removeClass('active')
            $(e.target).addClass('active')
            mountedData()

            init()
        })
    })

    $('.btnProduct').eq(0).click()

    function init() {
        ws.reset()
        ws.subscribe({
            event: 'close'
        }, function() {
            ws = new WS({
                url: wsUrl,
                heartData: {
                    head: { server: "yz", msgType: "ping", sendTime: new Date().getTime() },
                    content: { beat: 1 },
                    device: "h5",
                    trace: guid(),
                    version_code: 1
                }
            })
            init()
        })

        $('.info-code').text(productCode)
        $('.info-name').text(productName)

        // 最后一口报价
        getLastPrice(function(data) {
            data.content.forEach(function(el) {
                lastPrice = el
                cur = lastPrice.cur_price
                buyPrice = lastPrice.buy_price
                sellPrice = lastPrice.sell_price
                upDownAmount = (cur - lastPrice.yesterday_price).toFixed(digits) // 涨跌额
                upDownWidth = (upDownAmount / lastPrice.yesterday_price * 100).toFixed(2) // 涨跌幅
                color = upDownAmount > 0 ? riseColor : (upDownAmount < 0 ? fallColor : '')
                mountedData()
            })
        })

        // 实时报价
        getProductSubscription(function(data) {
            curColor = cur === data[3] * 1 ? curColor : (cur > data[3] * 1 ? fallColor : riseColor)
            buyColor = buyPrice * 1 !== data[2] * 1 ? (buyPrice < data[2] ? riseColor : fallColor) : buyColor
            sellColor = sellPrice * 1 !== data[1] * 1 ? (sellPrice < data[1] ? riseColor : fallColor) : sellColor
            cur = data[3] * 1

            // console.log(ttt, (((data[5] * 1) - (data[6] * 1)) / (cur * 0.2)).toFixed(5), );
            buyPrice = data[2]
            sellPrice = data[1]
            upDownAmount = (cur - lastPrice.yesterday_price).toFixed(digits) // 涨跌额
            upDownWidth = (upDownAmount / lastPrice.yesterday_price * 100).toFixed(2) // 涨跌幅
            color = upDownAmount > 0 ? riseColor : (upDownAmount < 0 ? fallColor : '')
            mountedData()

            // if (klineDataList.datas) {
            //     var date = new Date(data[4] * 1000)
            //     var M = date.getMonth() + 1
            //     var D = date.getDate()
            //     var h = date.getHours()
            //     var m = date.getMinutes()
            //     var timeStr = `${M}/${D} ${h}:${m}`
            //     var oldTimeStr = klineDataList.times[klineDataList.times.length - 1]
            //     var lastData = klineDataList.datas[klineDataList.datas.length - 1]

            //     var high = Math.max(lastData[3], cur)
            //     var low = Math.min(lastData[2], cur)

            //     if (new Date(timeStr).getTime() <= new Date(oldTimeStr).getTime()) {
            //         var newData = splitData([[
            //             oldTimeStr, lastData[1], cur, high, low
            //         ]])

            //         klineDataList.datas[klineDataList.datas.length - 1] = newData.datas[0]
            //         klineDataList.times[klineDataList.times.length - 1] = newData.times[0]
            //     } else {
            //         var newData = splitData([[
            //             timeStr, lastData[0], cur, low, high
            //         ]])

            //         klineDataList.datas.push(...newData.datas)
            //         klineDataList.times.push(...newData.times)
            //     }

            //     resetChart()
            // }
        })

        myChart.setOption(chartOption);
        myChart.showLoading(null, {
            color: '#477fd3',
            lineWidth: 1,
            text: ''
        })
        myChart.dispatchAction({ type: 'restore' })
            // 获取历史k线
        getKline(function(list) {
            myChart.hideLoading()
            klineDataList = splitData(list.content.kline_data_list.reverse().map(function(item) {
                return [getTimeStr(item.time * 1000), item.open_price, item.close_price, item.low_price, item.high_price, 10000, item.time]
            }))
            console.log('getKline: ', klineDataList)
                // localStorage.setItem('a', JSON.stringify(klineDataList))
            resetChart()
        })

        function getTimeStr(time) {
            var date = new Date(time)
            var M = ('0' + (date.getMonth() + 1)).substr(-2)
            var D = ('0' + date.getDate()).substr(-2)
            return M + '/' + D
        }

        function resetChart() {
            var len = (lastPrice.cur_price + '').replace(/\..+/, '').length + (digits * 1 + 1)
            myChart.setOption({
                dataZoom: {
                    startValue: klineDataList.datas.length > 30 ? klineDataList.datas.length - 30 : 0,
                    endValue: klineDataList.datas.length + 30
                },
                xAxis: [{
                    data: klineDataList.times,
                }],
                series: [{
                    data: klineDataList.datas,
                }],
                yAxis: [{
                    axisLabel: {
                        formatter(value, index) {
                            if (value === 0) {
                                return ''
                            }
                            return value.toFixed(digits)
                        }
                    }
                }],
                tooltip: {
                    axisPointer: {
                        label: {
                            precision: digits,
                        },
                    },
                    formatter: function(params, ticket, callback) {
                        if (!params.length) {
                            return
                        }
                        var name = params[0].name
                        var data = params[0].data
                        var date = new Date(data[6] * 1000)
                        var Y = (date.getFullYear())
                        var M = ('0' + (date.getMonth() + 1)).substr(-2)
                        var D = ('0' + date.getDate()).substr(-2)
                        var timeStr = Y + '/' + M + '/' + D
                        return '\
                            <div>' + timeStr + '</div>\
                            <div>开: ' + data[1].toFixed(digits) + '</div>\
                            <div>收: ' + data[2].toFixed(digits) + '</div>\
                            <div>低: ' + data[3].toFixed(digits) + '</div>\
                            <div>高: ' + data[4].toFixed(digits) + '</div>\
                        '
                    }
                },
                grid: [{
                    right: len * 6 + 10,
                }]
            })
        }

        function getLastPrice(cb) {
            ws.send({
                head: {
                    server: "yz",
                    msgType: "lastPrice",
                    sendTime: new Date().getTime()
                },
                content: { code_ids: [productId], company_id: 112010 },
                device: "h5",
                trace: guid(),
                version_code: 1
            })

            ws.subscribe({
                msgType: "LastPrice",
            }, function(data) {
                if (typeof data.content === 'string') {
                    return
                }

                if (data.content[0].code_id !== productId) {
                    return
                }

                cb(data)
                console.log('LastPrice: ', data)
            })
        }

        function getKline(cb) {
            ws.send({
                head: {
                    server: "yz",
                    msgType: "klineHistoryData",
                    sendTime: new Date().getTime()
                },
                content: {
                    code_id: productId,
                    ktype: "day",
                    msg_id: new Date().getTime(),
                    num: 1000,
                    flag: 0,
                    startTime: 0
                },
                timestamp: new Date().getTime(),
                execute: "vsids",
                sign: "7cda094df3a855d6315224fefc17aad8",
                device: "h5",
                trace: guid(),
                version_code: 1
            })

            ws.subscribe({
                msgType: "klineHistoryDataBlob",
            }, function(data) {
                if (data.msg_code !== 'KlineHistoryData' && data.content.code_id !== productId) {
                    return
                }
                cb(data)
            })
        }

        function getProductSubscription(cb) {
            ws.send({
                head: {
                    server: "yz",
                    msgType: "productSubscription",
                    sendTime: new Date().getTime()
                },
                content: {
                    code_ids: [productId],
                    subscribeType: "reSubscribe",
                    type: "yz"
                },
                device: "h5",
                trace: guid(),
                version_code: 1
            })
            ws.subscribe({
                msgType: "productSubscription",
            }, function(data) {
                if (data[0] * 1 !== productId) {
                    return
                }
                cb(data)
            })
        }
    }


    function mountedData() {
        var curPrice = cur * 1 || lastPrice.cur_price
        $('.cur').text(curPrice ? curPrice.toFixed(digits) : '- -').css('color', curColor)
        $('.upDownAmount').text(((upDownAmount && upDownAmount > 0) ? '+' : '') + (upDownAmount || '- -')).css('color', color)
        $('.upDownWidth').text(((upDownWidth && upDownWidth > 0) ? '+' : '') + (upDownWidth || '- -') + '%').css('color', color)

        var url = new URL(window.location.href);
        var utm_source = url.searchParams.get("utm_source") == null ? '' : url.searchParams.get("utm_source");
        var utm_medium = url.searchParams.get("utm_medium") == null ? '' : url.searchParams.get("utm_medium");
        var utm_term = url.searchParams.get("utm_term") == null ? '' : url.searchParams.get("utm_term");
        var utm_campaign = url.searchParams.get("utm_campaign") == null ? '' : url.searchParams.get("utm_campaign");
        var utm_content = url.searchParams.get("utm_content") == null ? '' : url.searchParams.get("utm_content");
        $('.sellBtn')
            .css({
                background: sellColor,
            })
            .attr('href', origin + '/yz352001/order/' + productId + '?direction=sell&utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_campaign=' + utm_campaign + '&utm_content=' + utm_content + '&openbrowser=true&experience=true')
            .find('.sellPrice').text(sellPrice ? (sellPrice * 1).toFixed(digits) : '- -')

        $('.buyBtn')
            .css({
                background: buyColor,
            })
            .attr('href', origin + '/yz352001/order/' + productId + '?direction=buy&utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_term=' + utm_term + '&utm_campaign=' + utm_campaign + '&utm_content=' + utm_content + '&openbrowser=true&experience=true')
            .find('.buyPrice').text(buyPrice ? (buyPrice * 1).toFixed(digits) : '- -')
    }
})()