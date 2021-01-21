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
	let htmlObjectPop = null;
	let techAnalyInfo = {};
	let defaultTechAnalyInfo = {
		conclusion: '中性',
		suggestion: '高抛低吸',
		conclusionBg: 'bg_normal', //bg_green,bg_red,bg_normal
		conclusionMAText: '---',
		conclusionMATextColor: 'text_normal', //text_green,text_red,text_normal
		conclusionMABuyText: '---',
		conclusionMASellText: '---',
		conclusionTechIndiText: '---',
		conclusionTechIndiTextColor: 'text_normal', //text_green,text_red,text_normal
		conclusionTechIndiBuyText: '---',
		conclusionTechIndiSellText: '---',
	};

	let products = {
		573004: { pid: 68 },
		573010: { pid: 8849 },
		573014: { pid: 8874 },
	}

	function parseHTML(str) {
		let tmp = document.implementation.createHTMLDocument();
		tmp.body.innerHTML = str;
		return tmp.body.children;
	}
	// 傳入產品技術分析所需 peid、pid
	function ajaxTech_Url(peid, pid) {
		$.ajax({
			method: 'post',
			url: TECH_ANA_URL,
			data: { pid: pid, peid: peid },
			success: function(msg) {
				let htmlObject = parseHTML(msg);
				let htmlObject2 = parseHTML(msg.substring(msg.indexOf('<h3'), msg.length));
				//console.log(TECH_ANA_URL);
				//console.log(htmlObject);
				htmlObjectPop = htmlObject2[2]
				let newTechAnalyInfo = {};
				// Pivot point
				// _this.getPivotpoint(htmlObjectPop)
				//conclusion
				newTechAnalyInfo.conclusion = htmlObject[0].querySelector('div:nth-child(1) span').innerHTML;
				//newTechAnalyInfo.conclusionBg = _this.setTechConclusionBgColor(newTechAnalyInfo.conclusion);
				newTechAnalyInfo.conclusionMAText = htmlObject[0].querySelector('div:nth-child(2) span:nth-child(2)').innerHTML;
				//newTechAnalyInfo.conclusionMATextColor = _this.setTechConclusionTextColor(newTechAnalyInfo.conclusionMAText);
				newTechAnalyInfo.conclusionMABuyText = htmlObject[0].querySelector('div:nth-child(2) span:nth-child(3)').innerHTML;
				newTechAnalyInfo.conclusionMASellText = htmlObject[0].querySelector('div:nth-child(2) span:nth-child(4)').innerHTML;
				newTechAnalyInfo.conclusionTechIndiText = htmlObject[0].querySelector('div:nth-child(3) span:nth-child(2)').innerHTML;
				//newTechAnalyInfo.conclusionTechIndiTextColor = _this.setTechConclusionTextColor(newTechAnalyInfo.conclusionTechIndiText);
				newTechAnalyInfo.conclusionTechIndiBuyText = htmlObject[0].querySelector('div:nth-child(3) span:nth-child(3)').innerHTML;
				newTechAnalyInfo.conclusionTechIndiSellText = htmlObject[0].querySelector('div:nth-child(3) span:nth-child(4)').innerHTML;
				if (newTechAnalyInfo.conclusion == '强力买入') {
					newTechAnalyInfo.suggestion = '现价买入';
					newTechAnalyInfo.conclusionMATextColor = "#b90405";
				} else if (newTechAnalyInfo.conclusion == '买入') {
					newTechAnalyInfo.suggestion = '逢低买入';
					newTechAnalyInfo.conclusionMATextColor = "#b90405";
				} else if (newTechAnalyInfo.conclusion == '中性') {
					newTechAnalyInfo.suggestion = '高抛低吸';
					newTechAnalyInfo.conclusionMATextColor = "#000";
				} else if (newTechAnalyInfo.conclusion == '卖出') {
					newTechAnalyInfo.suggestion = '逢高卖出';
					newTechAnalyInfo.conclusionMATextColor = "#0a7700";
				} else if (newTechAnalyInfo.conclusion == '强力卖出') {
					newTechAnalyInfo.suggestion = '现价卖出';
					newTechAnalyInfo.conclusionMATextColor = "#0a7700";
				}
				techAnalyInfo = newTechAnalyInfo;
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//searchTechLock = false;
				console.log(errorThrown);
			}
		});
	}

	function getTechnicalAnalysisInfo(index, productId) {
		techAnalyInfo = defaultTechAnalyInfo;

		if (index === undefined) {
			console.log('未傳入 index')
			setTimeout(function() {
				let peid = 900;
				let pid = 68;
				ajaxTech_Url(peid, pid)
			}, 0);
		} else {
			console.log('有傳入 index 為' + index, 'pid is:' + products[productId].pid)
			setTimeout(function() {
				let peid = 900;
				let pid = products[productId].pid;
				ajaxTech_Url(peid, pid)
			}, 1);
		}
	}

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

			$('.btnProduct').removeClass('active');
			$(e.target).addClass('active');
			//console.log(productId);
			mountedData()

			init()
		})
	})

	$('.btnProduct').eq(0).click()

	$('.tag-wrap').children("[data-type='" + tagType + "']").addClass('active')

	$('.tag-wrap').on('click', 'div', function(e) {
		var $elm = $(e.target)
		if (!$elm.hasClass('tag')) {
			$elm = $elm.parent()
		}
		if (!$elm.hasClass('active')) {
			tagType = $elm[0].dataset.type
			$elm.addClass('active')
				.siblings().removeClass('active')

			init()
		}
	})

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

		//get TechnicalAnalysisInfo
		getTechnicalAnalysisInfo(900, productId);

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
			buyPrice = data[2]
			sellPrice = data[1]
			upDownAmount = (cur - lastPrice.yesterday_price).toFixed(digits) // 涨跌额
			upDownWidth = (upDownAmount / lastPrice.yesterday_price * 100).toFixed(2) // 涨跌幅
			color = upDownAmount > 0 ? riseColor : (upDownAmount < 0 ? fallColor : '')
			mountedData()
			var times = klineDataList.times

			if (times && times.length) {
				var kdata = klineDataList.datas
				var tickTime = data[4] * 1
				var tickTimeStr = getTimeStr(tickTime * 1000)
				var oldTimeStr = getTimeStr(times[times.length - 1] * 1000)
				var last = kdata[kdata.length - 1]
				var oldTime = last[5]

				var tickMin = new Date(tickTime).getMinutes()
				var oldMin = new Date(tickTime).getMinutes()
				var isMatch = false

				// 有历史数据的前提下
				if (tagType === 'timeSharing') {
					var list = kdata.map(function(item) { return item[1] })
					isMatch = tickTime - oldTime <= 60 || (tickTime - oldTime < 120 && (Math.abs(tickMin - oldMin) <= 1 || Math.abs(tickMin - oldMin) >= 59))
					if (isMatch) {
						if (tickTimeStr !== oldTimeStr && oldTime < tickTime) {
							times.push(tickTime)
							list.push(cur)
							kdata.push(['', cur, '', '', '', tickTime])
						} else {
							list[list.length - 1] = cur
						}
					} else {
						handleKLineRequest()
					}

					myChart.setOption({
						xAxis: [{
							data: times,
						}],
						series: [{
							data: list,
						}],
					})
				} else {
				}
			}
		})

		myChart.setOption(chartOption);
		myChart.showLoading(null, {
			color: '#477fd3',
			lineWidth: 1,
			text: ''
		})
		myChart.dispatchAction({ type: 'restore' })
		handleKLineRequest()
		// 获取历史k线
		function handleKLineRequest() {
			var func = function() {}
			if (tagType === 'timeSharing') {
				func = getTimeSharing
			} else {
				func = getKline.bind(null, tagType)
			}
			func(function(list) {
				myChart.hideLoading()

				if (!list.content.data.kdata) {
					return
				}

				var firstUTCDay = null // 最近交易日(UTC)
				var resDigits = null
				klineDataList = splitData(
					list.content.data.kdata
					.reverse()
					.map(function(item, i, arr) {
						!resDigits && (resDigits = arr[0].digits)
						return [item.time, item.price_open, (item.price_close / Math.pow(10, resDigits)), item.price_low, item.price_high, 10000, item.time]
					}))

				resetChart()
			})
		}

		function getTimeStr(time, format) {
			var date = new Date(time)
			var obj = {
				YYYY: ('0' + (date.getFullYear())).substr(-4),
				MM: ('0' + (date.getMonth() + 1)).substr(-2),
				DD: ('0' + date.getDate()).substr(-2),
				hh: ('0' + (date.getHours())).substr(-2),
				mm: ('0' + (date.getMinutes())).substr(-2),
			}
			if (!format) {
				if (tagType === 'day') {
					format = "MM/DD"
				} else if (tagType === 'timeSharing') {
					format = "MM/DD hh:mm"
				} else {
					format = "MM/DD hh:mm"
				}
			}

			for (const key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					const value = obj[key];
					format = format.replace(key, value)
				}
			}
			return format
		}

		function resetChart() {
			var len = (lastPrice.cur_price + '').replace(/\..+/, '').length + (digits * 1 + 1)
			var times = klineDataList.times
			var datas = []
			var zoomNum = 50
			var series = []

			if (tagType === 'timeSharing') {
				datas = klineDataList.datas.map(function(item) { return item[1] })
				zoomNum = 80
				series = [{
					data: datas,
					type: 'line',
					smooth: true,
					symbol: 'none',
					sampling: 'average',
					itemStyle: {
						color: '#477fd3'
					},
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
							offset: 0,
							color: 'rgba(71,127,211,0.3)'
						}, {
							offset: 1,
							color: 'rgba(71,127,211,0.1)'
						}])
					},
				}]
			} else {
				datas = klineDataList.datas
				zoomNum = 50
				series = [{
					data: datas,
					type: "candlestick",
					xAxisIndex: 0,
					yAxisIndex: 0,
					itemStyle: {
						color: riseColor,
						color0: fallColor,
						borderColor: riseColor,
						borderColor0: fallColor
					}
				}]
			}
			myChart.setOption({
				dataZoom: {
					startValue: klineDataList.datas.length > zoomNum ? klineDataList.datas.length - zoomNum : 0,
					endValue: klineDataList.datas.length
				},
				xAxis: [{
					data: times,
					axisLabel: {
						formatter (value, index) {
							if (value === 0) {
								return ''
							}
							return getTimeStr(value * 1000)
						}
					},
					axisPointer: {
						label: {
							formatter(params) {
								if (params && params.value === 0) {
									return ''
								}
								return getTimeStr(params.value * 1000)
							}
						}
					}
				}],
				series: series,
				yAxis: [{
					axisLabel: {
						formatter (value, index) {
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
						if (tagType === 'timeSharing') {
							var timeStr = getTimeStr(name * 1000)
							return '\
<div>' + timeStr + '</div>\
<div>价格: ' + data.toFixed(digits) + '</div>\
'
						} else {
							var timeStr = getTimeStr(data[6] * 1000, 'YYYY/MM/DD')
							return '\
<div>' + timeStr + '</div>\
<div>开: ' + data[1].toFixed(digits) + '</div>\
<div>收: ' + data[2].toFixed(digits) + '</div>\
<div>低: ' + data[3].toFixed(digits) + '</div>\
<div>高: ' + data[4].toFixed(digits) + '</div>\
'
						}
					}
				},
				grid: [{
					left: len * 6 + 10,
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
				if (typeof data.content === 'string' || !data.content.length) {
					return
				}

				if (data.content[0].code_id !== productId) {
					return
				}

				cb(data)
				console.log('LastPrice: ', data)
			})
		}

		function getTimeSharing(cb) {
			ws.send({
				head: {
					server: "yz",
					msgType: "SharingTick",
					sendTime: Date.now()
				},
				content: {
					dayCount: 1,
					symbol_id: productId
				},
				timestamp: Date.now(),
				execute: "vsids",
				sign: "8b8c7efa5c4a021b9ee52699aad08b47",
				device: "h5",
				trace: guid(),
				version_code: 1
			})

			ws.subscribe({
				msgType: "SharingTickRet",
			}, function(data) {
				if (data && data.content && data.content.data.symbol_id !== productId) {
					return
				}
				cb(data)
			})
		}

		function getKline(type, cb) {
            var num = 500
            if (['1min', '5min', '15min', '30min'].indexOf(tagType) !== -1) {
                num = 1500
            }
            ws.send({
                head: {
                    server: "yz",
                    msgType: "klineHistoryData",
                    sendTime: new Date().getTime()
                },
                content: {
                    code_id: productId,
                    ktype: type,
                    msg_id: new Date().getTime(),
                    num: num,
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

                Object.assign(data.content, {
                    data: {
                        kdata: data.content.kline_data_list.map(item => ({
                            price_open: item.open_price,
                            price_close: item.close_price,
                            price_low: item.low_price,
                            price_high: item.high_price,
                            time: item.time,
                            digits: 0
                        }))
                    }
                })
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
		$('#conclusionText').text(techAnalyInfo.conclusion ? techAnalyInfo.conclusion : '中性').css('color', techAnalyInfo.conclusionMATextColor);
		$('#suggestionText').text(techAnalyInfo.suggestion ? techAnalyInfo.suggestion : '高抛低吸').css('color', techAnalyInfo.conclusionMATextColor);
		$('.buyArrow').css('display', 'none')
		$('.sellArrow').css('display', 'none')
		if ($('#conclusionText').text() == '买入' || $('#conclusionText').text() == '强力买入') {
			$('.buyArrow').css('display', 'block')
		} else if ($('#conclusionText').text() == '卖出' || $('#conclusionText').text() == '强力卖出') {
			$('.sellArrow').css('display', 'block')
		} else {
			$('.buyArrow').css('display', 'none')
			$('.sellArrow').css('display', 'none')
		}

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
			.attr('onclick', `h5toExp('/order/${productId}?direction=sell&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true')`)
			.find('.sellPrice').text(sellPrice ? (sellPrice * 1).toFixed(digits) : '- -')

		$('.buyBtn')
			.css({
			background: buyColor,
		})
			.attr('onclick', `h5toExp('/order/${productId}?direction=buy&utm_source=${utm_source}&utm_medium=${utm_medium}&utm_term=${utm_term}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&openbrowser=false&experience=true')`)
			.find('.buyPrice').text(buyPrice ? (buyPrice * 1).toFixed(digits) : '- -')
	}
})()