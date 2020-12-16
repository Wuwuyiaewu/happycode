(function() {
	var lastPrice2 = {};
	var cur2;
	var upDownAmount2;
	var upDownWidth2;
	var color2 = '';
	var curColor2 = ''
	var buyColor2 = ''
	var sellColor2 = ''
	var klineDataList2 = {}
	var buyPrice2 = ''
	var sellPrice2 = ''
	var ws2 = new WS({
		url: 'wss://api.mircoinfolab.com:1315/i/websocket',
		heartData: {
			head: { server: "yz", msgType: "ping", sendTime: new Date().getTime() },
			content: { beat: 1 },
			device: "h5",
			trace: guid(),
			version_code: 1
		}
	})

	$('.btnProduct2').each(function(i, item) {
		item.addEventListener('click', function(e) {
			if (productId2 === e.target.dataset.id * 1) {
				return
			}

			productCode2 = e.target.dataset.code
			productName2 = e.target.innerText
			productId2 = e.target.dataset.id * 1
			digits2 = e.target.dataset.digits

			cur2 = upDownAmount2 = upDownWidth2 = color2 = curColor2 = buyColor2 = sellColor2 = buyPrice2 = sellPrice2 = ''
			lastPrice2 = {}
			klineDataList2 = {}

			$('.btnProduct2').removeClass('active')
			$(e.target).addClass('active')
			mountedData()

			init()
		})
	})

	$('.btnProduct2').eq(0).click()

	function init() {
		ws2.reset()
		ws2.subscribe({
			event: 'close'
		}, function() {
			ws2 = new WS({
				url: 'wss://api.mircoinfolab.com:1315/i/websocket',
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

		$('.info-code2').text(productCode2)
		$('.info-name2').text(productName2)

		// 最后一口报价
		getlastPrice(function(data) {
			data.content.forEach(function(el) {
				lastPrice2 = el
				cur2 = lastPrice2.cur_price
				buyPrice2 = lastPrice2.buy_price
				sellPrice2 = lastPrice2.sell_price
				upDownAmount2 = (cur2 - lastPrice2.yesterday_price).toFixed(digits2) // 涨跌额
				upDownWidth2 = (upDownAmount2 / lastPrice2.yesterday_price * 100).toFixed(2) // 涨跌幅
				color2 = upDownAmount2 > 0 ? riseColor : (upDownAmount2 < 0 ? fallColor : '')
				mountedData()
			})
		})

		// 实时报价
		getProductSubscription(function(data) {
			curColor2 = cur2 === data[3] * 1 ? curColor2 : (cur2 > data[3] * 1 ? fallColor : riseColor)
			buyColor2 = buyPrice2 * 1 !== data[2] * 1 ? (buyPrice2 < data[2] ? riseColor : fallColor) : buyColor2
			sellColor2 = sellPrice2 * 1 !== data[1] * 1 ? (sellPrice2 < data[1] ? riseColor : fallColor) : sellColor2

			cur2 = data[3] * 1
			buyPrice2 = data[2]
			sellPrice2 = data[1]
			upDownAmount2 = (cur2 - lastPrice2.yesterday_price).toFixed(digits2) // 涨跌额
			upDownWidth2 = (upDownAmount2 / lastPrice2.yesterday_price * 100).toFixed(2) // 涨跌幅
			color2 = upDownAmount2 > 0 ? riseColor : (upDownAmount2 < 0 ? fallColor : '')
			mountedData()

			// if (klineDataList2.datas) {
			//     var date = new Date(data[4] * 1000)
			//     var M = date.getMonth() + 1
			//     var D = date.getDate()
			//     var h = date.getHours()
			//     var m = date.getMinutes()
			//     var timeStr = `${M}/${D} ${h}:${m}`
			//     var oldTimeStr = klineDataList2.times[klineDataList2.times.length - 1]
			//     var lastData = klineDataList2.datas[klineDataList2.datas.length - 1]

			//     var high = Math.max(lastData[3], cur)
			//     var low = Math.min(lastData[2], cur)

			//     if (new Date(timeStr).getTime() <= new Date(oldTimeStr).getTime()) {
			//         var newData = splitData([[
			//             oldTimeStr, lastData[1], cur, high, low
			//         ]])

			//         klineDataList2.datas[klineDataList2.datas.length - 1] = newData.datas[0]
			//         klineDataList2.times[klineDataList2.times.length - 1] = newData.times[0]
			//     } else {
			//         var newData = splitData([[
			//             timeStr, lastData[0], cur, low, high
			//         ]])

			//         klineDataList2.datas.push(...newData.datas)
			//         klineDataList2.times.push(...newData.times)
			//     }

			//     resetChart()
			// }
		})

		myChart2.setOption(chartOption);
		myChart2.showLoading(null, {
			color2: '#477fd3',
			lineWidth: 1,
			text: ''
		})
		myChart2.dispatchAction({ type: 'restore' })
		// 获取历史k线
		getKline(function(list) {
			myChart2.hideLoading()
			klineDataList2 = splitData(list.content.kline_data_list.reverse().map(function(item) {
				return [getTimeStr(item.time * 1000), item.open_price, item.close_price, item.low_price, item.high_price, 10000]
			}))
			console.log('getKline: ', klineDataList2)
			// localStorage.setItem('a', JSON.stringify(klineDataList2))
			resetChart()
		})

		function getTimeStr(time) {
			var date = new Date(time)
			var M = ('0' + (date.getMonth() + 1)).substr(-2)
			var D = ('0' + date.getDate()).substr(-2)
			var h = ('0' + date.getHours()).substr(-2)
			var m = ('0' + date.getMinutes()).substr(-2)
			// return `${M}/${D} ${h}:${m}`
			return `${M}/${D}`
		}

		function resetChart() {
			var len = (lastPrice2.cur_price + '').replace(/\..+/, '').length + (digits2 * 1 + 1)
			myChart2.setOption({
				dataZoom: {
					startValue: klineDataList2.datas.length > 30 ? klineDataList2.datas.length - 30 : 0,
					endValue: klineDataList2.datas.length + 30
				},
				xAxis: [{
					data: klineDataList2.times,
				}],
				series: [{
					data: klineDataList2.datas,
				}],
				yAxis: [{
					axisLabel: {
						formatter(value, index) {
							if (value === 0) {
								return ''
							}
							return value.toFixed(digits2)
						}
					}
				}],
				tooltip: {
					axisPointer: {
						label: {
							precision: digits2,
						},
					},
				},
				grid: [{
					right: len * 6 + 10,
				}]
			})
		}

		function getlastPrice(cb) {
			ws2.send({
				head: {
					server: "yz",
					msgType: "lastPrice",
					sendTime: new Date().getTime()
				},
				content: { code_ids: [productId2], company_id: 112010 },
				device: "h5",
				trace: guid(),
				version_code: 1
			})

			ws2.subscribe({
				msgType: "LastPrice",
			}, function(data) {
				if (typeof data.content === 'string') {
					return
				}

				if (data.content[0].code_id !== productId2) {
					return
				}

				cb(data)
				console.log('lastPrice2: ', data)
			})
		}

		function getKline(cb) {
			ws2.send({
				head: {
					server: "yz",
					msgType: "klineHistoryData",
					sendTime: new Date().getTime()
				},
				content: {
					code_id: productId2,
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

			ws2.subscribe({
				msgType: "klineHistoryDataBlob",
			}, function(data) {
				if (data.msg_code !== 'KlineHistoryData' && data.content.code_id !== productId2) {
					return
				}
				cb(data)
			})
		}

		function getProductSubscription(cb) {
			ws2.send({
				head: {
					server: "yz",
					msgType: "productSubscription",
					sendTime: new Date().getTime()
				},
				content: {
					code_ids: [productId2],
					subscribeType: "reSubscribe",
					type: "yz"
				},
				device: "h5",
				trace: guid(),
				version_code: 1
			})
			ws2.subscribe({
				msgType: "productSubscription",
			}, function(data) {
				if (data[0] * 1 !== productId2) {
					return
				}
				cb(data)
			})
		}
	}


	function mountedData() {
		var curPrice2 = cur2 * 1 || lastPrice2.cur_price
		$('.cur2').text(curPrice2 ? curPrice2.toFixed(digits2) : '- -').css('color', curColor2)
		$('.upDownAmount2').text(((upDownAmount2 && upDownAmount2 > 0) ? '+' : '') + (upDownAmount2 || '- -')).css('color', color2)
		$('.upDownWidth2').text(((upDownWidth2 && upDownWidth2 > 0) ? '+' : '') + (upDownWidth2 || '- -') + '%').css('color', color2)

		var url = new URL(window.location.href);
		var utm_source = url.searchParams.get("utm_source")==null?'':url.searchParams.get("utm_source");
		var utm_medium = url.searchParams.get("utm_medium")==null?'':url.searchParams.get("utm_medium");
		var utm_term = url.searchParams.get("utm_term")==null?'':url.searchParams.get("utm_term");
		var utm_campaign = url.searchParams.get("utm_campaign")==null?'':url.searchParams.get("utm_campaign");
		var utm_content=url.searchParams.get("utm_content")==null?'':url.searchParams.get("utm_content");
		$('.sellBtn2')
			.css({
			background: sellColor2,
		})
			.attr('href', origin + '/JW666key/order/' + productId2 + '?direction=sell&utm_source='+utm_source+'&utm_medium='+utm_medium+'&utm_term='+utm_term+'&utm_campaign='+utm_campaign+'&utm_content='+utm_content+'&openbrowser=false&experience=true')
			.find('.sellPrice2').text(sellPrice2 ? (sellPrice2 * 1).toFixed(digits2) : '- -')

		$('.buyBtn2')
			.css({
			background: buyColor2,
		})
			.attr('href', origin + '/JW666key/order/' + productId2 + '?direction=buy&utm_source='+utm_source+'&utm_medium='+utm_medium+'&utm_term='+utm_term+'&utm_campaign='+utm_campaign+'&utm_content='+utm_content+'&openbrowser=false&experience=true')
			.find('.buyPrice2').text(buyPrice2 ? (buyPrice2 * 1).toFixed(digits2) : '- -')
	}
})()