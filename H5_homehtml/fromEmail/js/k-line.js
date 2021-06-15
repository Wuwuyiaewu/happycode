var bgColor = "#F7F8FC";//背景
var ma5Color = "#39afe6";
var ma10Color = "#da6ee8";

/**
 * 不同类型的股票的交易时间会不同  
 * @param {Object} type   hs=沪深  us=美股  hk=港股
 */
var time_arr = function (data) {
	var timeArr = [];
	$.each(data, function (i, v) {
		timeArr.push(data[i][0]);
	})
	return timeArr

}


var get_m_data = function (m_data) {
	var priceArr = [];
	var avgPrice = [];
	var vol = [];
	var times = time_arr(m_data.data);
	$.each(m_data.data, function (i, v) {
		priceArr.push(v[1]);
		avgPrice.push(v[2]);
		vol.push(v[3]);
	})
	return {
		priceArr: priceArr,
		avgPrice: avgPrice,
		vol: vol,
		times: times
	}
}



//==========================================分时表 option

/**
 * 生成分时option 
 * @param {Object} m_data 分时数据
 * @param {Object} type 股票类型  us-美股  hs-沪深  hk-港股
 */
function initMOption(m_data, type) {
	var m_datas = get_m_data(m_data, type);
	return {
		tooltip: { //弹框指示器
			// trigger: 'axis',
			// axisPointer: {
			// 	type: 'cross'
			// },
			// formatter: function (params, ticket, callback) {
			// 	var i = params[0].dataIndex;

			// 	var color;
			// 	if (m_datas.priceArr[i] > m_data.yestclose) {
			// 		color = 'style="color:#ff4242"';
			// 	} else {
			// 		color = 'style="color:#26bf66"';
			// 	}

			// 	// var html = '<div class="commColor" style="width:100px;"><div>当前价 <span  '+color+' >' + m_datas.priceArr[i] + '</span></div>';
			// 	// html += '<div>均价 <span  '+color+' >' + m_datas.avgPrice[i] + '</span></div>';
			// 	// html += '<div>涨幅 <span  '+color+' >' + ratioCalculate(m_datas.priceArr[i],m_data.yestclose)+ '%</span></div>';
			// 	// html += '<div>成交量 <span  '+color+' >' + m_datas.vol[i] + '</span></div></div>'
			// 	return html;
			// }
		},
		legend: { //图例控件,点击图例控制哪些系列不显示
			icon: 'rect',
			type: 'scroll',
			itemWidth: 14,
			itemHeight: 2,
			left: 0,
			top: '-1%',
			textStyle: {
				fontSize: 12,
				color: '#0e99e2'
			}
		},
		axisPointer: {
			// show: true
		},
		color: [ma5Color, ma10Color],
		grid: [{
			id: 'gd1',
			left: '0%',
			right: '1%',
			height: '67.5%', //主K线的高度,
			top: '5%'
		},
		{
			id: 'gd2',
			left: '0%',
			right: '1%',
			height: '67.5%', //主K线的高度,
			top: '5%'
		}, {
			id: 'gd3',
			left: '0%',
			right: '1%',
			top: '75%',
			height: '19%' //交易量图的高度
		}
		],
		xAxis: [ //==== x轴
			{ //主图 
				gridIndex: 0,
				data: m_datas.times,
				axisLabel: { //label文字设置
					show: false
				},
				splitLine: {
					show: false,
				},
				show:false,
			},
			{
				show: false,
				gridIndex: 1,
				data: m_datas.times,
				axisLabel: { //label文字设置
					show: false
				},
				splitLine: {
					show: false,
				},
				show:false,
			},
			{ //交易量图
				splitNumber: 2,
				type: 'category',
				gridIndex: 2,
				data: m_datas.times,
				axisLabel: { //label文字设置
					color: '#9b9da9',
					fontSize: 10
				},
				show:false,
			}
		],
		yAxis: [ //y轴
			{
				gridIndex: 0,
				scale: true,
				splitNumber: 3,
				axisTick: {
					show: false,
				},
				show:false,
				axisLabel: { //label文字设置 
					// inside: true, //label文字朝内对齐 
					// fontWeight: 'bold',
					// color: function (val) {
					// 	if (val == m_data.yestclose) {
					// 		return '#aaa'
					// 	}
					// 	return val > m_data.yestclose ? upColor : downColor;
					// }
				}, z: 4, splitLine: { //分割线设置
					show: false,
					lineStyle: {
						color: '#181a23'
					}
				},
			},
			{
				scale: true, gridIndex: 1, splitNumber: 3,
				position: 'right', z: 4,
				axisTick: {
					show: false,
				},
				show:false,
				axisLabel: { //label文字设置
					// color: function (val) {
					// 	if (val == m_data.yestclose) {
					// 		return '#aaa'
					// 	}
					// 	return val > m_data.yestclose ? upColor : downColor;
					// },
					// inside: true, //label文字朝内对齐 
					// fontWeight: 'bold',
					// formatter: function (val) {
					// 	var resul = ratioCalculate(val, m_data.yestclose);
					// 	return Number(resul).toFixed(2) + ' %'
					// }
				},
				splitLine: { //分割线设置
					show: false,
					lineStyle: {
						color: '#181a23'
					}
				},
				show:false,
				axisPointer: {
					// show: true,
					label: {
						// formatter: function (params) { //计算右边Y轴对应的当前价的涨幅比例
						// 	return ratioCalculate(params.value, m_data.yestclose) + '%';
						// }
					}
				}
			},
			{ //交易图
				gridIndex: 2, z: 4,
				splitNumber: 3,
				show:false,
				axisLine: {
					onZero: false,
				},
				axisTick: {
					show: false,
				},
				splitLine: {
					show: false
				},
				// axisLabel: { //label文字设置
				// 	color: '#c7c7c7',
				// 	inside: true, //label文字朝内对齐 
				// 	fontSize: 8
				// },
			}
		],
		dataZoom: [

		],
		//animation:false,//禁止动画效果
		backgroundColor: bgColor,
		blendMode: 'source-over',
		series: [{
			// name: '当前价',
			type: 'line',
			data: m_datas.priceArr,
			smooth: true,
			symbol: "none", //中时有小圆点 
			lineStyle: {
				normal: {
					opacity: 0.8,
					color: '#39afe6',
					width: 1
				}
			},
			areaStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: 'rgba(0, 136, 212, 0.7)'
					}, {
						offset: 0.8,
						color: 'rgba(0, 136, 212, 0.02)'
					}], false),
					shadowColor: 'rgba(0, 0, 0, 0.1)',
					shadowBlur: 10
				}
			}
		},
		{
			// name: '均价',
			type: 'line',
			data: m_datas.avgPrice,
			smooth: true,
			symbol: "circle",
			lineStyle: { //标线的样式
				normal: {
					opacity: 0.8,
					color: '#da6ee8',
					width: 1
				}
			}
		},
		{
			type: 'line',
			data: m_datas.priceArr,
			smooth: true,
			symbol: "none",
			gridIndex: 1,
			xAxisIndex: 1,
			yAxisIndex: 1,
			lineStyle: { //标线的样式 
				normal: {
					width: 0
				}
			}
		}
		]
	};
}
