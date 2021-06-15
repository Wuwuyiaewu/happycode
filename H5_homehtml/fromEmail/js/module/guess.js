define(function (require, exports, module) {
    var base = require('utils/base')
    var utils = require('utils/utils')
    var qs = utils.queryToJson()
    var parentElement = null;
    var data = null;
    var initData = null
    var viewIsShow = true;
    var timer = null;
    var timers = null;
    var that = base();
    var direction = "";
    var guessData = {};
    var prizeResultData = null;
    var leftPercentage = 0;   //左边的百分比
    var rightPercentage = 0;  //右边的百分比
    var totalCount = 0;
    var mdata = { "data": [] };
    var tourist = false;  //是否是游客
    var hasKline = true;  //是否是有分时图
    var quizEndTime = 0;
    var openTime = 0;
    var quizStartTime = 0;
    var openTimeFlag = false;
    var isTimer = true;
    var offset = 0;
    var qouteInfo = {}

    var bgColor = "#F7F8FC";//背景
    var ma5Color = "#39afe6";
    var ma10Color = "#da6ee8";
    // 事件响应声明
    var evtFuncs = {

        showView: function (type) {
            if (hasKline && !guessData.currentUserIsJoined && viewIsShow) {
                if (type === 'up' && !tourist) {
                    direction = "RISE";  //猜涨
                    if (!openTimeFlag) {  //如果是开奖时间  则不能参加猜涨活动
                        custFuncs.getJoinGuessData()  //猜涨参加活动
                    }
                } else if (type === 'down' && !tourist) {
                    direction = "FALL";  //猜跌
                    if (!openTimeFlag) {
                        custFuncs.getJoinGuessData()  //猜涨参加活动
                    }
                } else {
                    //跳转到登录页面
                    IX_postMessage.toPage('/login');
                }
                viewIsShow = false;
            }
        },
        hideView: function () {
            if (!viewIsShow) {
                viewIsShow = true;
            }
            $('.shadow').css("display", "none");
        },
        showRecord: function () {
            if (tourist) {
                //跳转到登录页面
                custFuncs.percentage(true);   //参数传true  是为了将百分比还原到50%对50%
                IX_postMessage.toPage('/login');
                return
            }
            $('.record').css("display", "block");
            custFuncs.getPrizeResultData()  //获取中奖记录数据

        },
        hideRecord: function () {
            $('.record').css("display", "none");
            $('.content').remove();
        }
    }
    //自定义函数
    var custFuncs = {
        time_arr:function (data) {
            var timeArr = [];
            $.each(data, function (i, v) {
                timeArr.push(data[i][0]);
            })
            return timeArr
        },
        get_m_data:function (m_data) {
            var priceArr = [];
            var avgPrice = [];
            var vol = [];
            var times = custFuncs.time_arr(m_data.data);
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
        },
        initMOption:function(m_data, type) {
            var m_datas = custFuncs.get_m_data(m_data, type);
            return {
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
                        show:false,
                        boundaryGap: false
                    },
                    {
                        gridIndex: 1,
                        boundaryGap: false,
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
                        boundaryGap: false,
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
        },
        percentage:function(timeOut) {   //多空占比
            if (timeOut) {
                //开奖时间之后  占比还原到50%
                $('.leftPercentage').text("50%");
                $('.rightPercentage').text("50%");
                $('.leftBar').width("50%")
                $('.rightBar').width("50%")
            } else {
                totalCount = guessData.riseCount + guessData.fallCount;
                var leftWidth = 0;
                var rightWidth = 0;
                leftPercentage = parseInt((guessData.riseCount / totalCount).toFixed(2) * 100);
                rightPercentage = 100 - leftPercentage;
                leftWidth = parseInt(((guessData.riseCount / totalCount).toFixed(2) * 100));
                rightWidth = 100 - leftWidth;
                $('.leftPercentage').text(leftPercentage + '%');
                $('.rightPercentage').text(rightPercentage + '%');
                $('.leftBar').width(leftWidth + '%')
                $('.rightBar').width(rightWidth + '%')
            }
            percentageColor()

        },
        getCountdownTime:function(flag) {
            if (!hasKline) {
                $('.m-guess_time').css("opacity", "0");
                custFuncs.percentage(true);
                setColor()
                return
            }
            if (guessData.currentUserIsJoined) {   //已经参与了竞猜
                if (guessData.currentUserQuizDirect == 'RISE') {
                    //猜涨
                    if (window.PAGECONFIG.orColorType == '1') { //绿涨红跌
                        $('.guess-up').css("background", "#00AD88");
                        $('.guess-down').css("background", "#F9D6D6")
                    } else {
                        $('.guess-up').css("background", "#E95A5A");
                        $('.guess-down').css("background", "#B6E2DA")
                    }
                    $('.guess-up').find("i").addClass("check");
                    $('.up-already').text("已猜涨");
                } else {
                    //猜跌
                    if (window.PAGECONFIG.orColorType == '1') {//绿涨红跌
                        $('.guess-down').css("background", "#E95A5A");
                        $('.guess-up').css("background", "#B6E2DA")
                    } else {
                        $('.guess-down').css("background", "#00AD88");
                        $('.guess-up').css("background", "#F9D6D6")
                    }
                    $('.guess-down').find("i").addClass("check");
                    $('.down-already').text("已猜跌");
                }
            }
            percentageColor()
            //判断竞猜开始倒计时还有多久
            quizStartTime = new Date(format(guessData.quizStartTime)).getTime();
            //当前时间
            var nowDate = new Date().getTime();
            quizEndTime = new Date(format(guessData.quizEndTime)).getTime();
            openTime = new Date(format(guessData.openTime)).getTime();
            if (quizStartTime - nowDate < 0 && quizEndTime - nowDate > 0 && !guessData.currentUserIsJoined) {
                isTimer = true;
                $('.gountdown').text("截止竞猜倒计时，还有");
                if (window.PAGECONFIG.orColorType == '1') {   //1 绿涨红跌，2 红涨绿跌
                    $('.guess-up').css("background", "#00AD88")
                    $('.guess-down').css("background", "#E95A5A")
                } else {
                    $('.guess-up').css("background", "#E95A5A")
                    $('.guess-down').css("background", "#00AD88")
                }
                if (flag) {
                    TimeDown(quizEndTime, "quizEndTime")
                }
                return
            }
            if (openTime - nowDate > 0 && quizStartTime - nowDate < 0) {
                isTimer = true;
                $('.gountdown').text("开奖倒计时，还有");
                openTimeFlag = true; //控制不能猜奖了
                if (flag) {
                    TimeDown(openTime, "openTime")
                }
                setColor(true)
            } else {
                openTimeFlag = true;  //控制不能猜奖了
                isTimer = false;
                $('.m-guess_time').css("opacity", "0")   //当开奖时间结束之后  隐藏倒计时
                setColor(false)
                $('.check').css("display", "none");
                $('.down-already').text("猜跌");
                $('.up-already').text("猜涨");
                custFuncs.percentage(true);   //参数传true  是为了将百分比还原到50%对50%
            }
        },
        countData:function(res) {
            if (!$.isEmptyObject(guessData)) {  //参加竞猜活动时   显示竞猜页面
                //生成页面
                render()
                // 绑定事件
                bindEvt()
            }
        },
        kLine: function (data) {
            if (document.getElementById('kLine')) {
                var mChart = echarts.init(document.getElementById('kLine'));
                mChart.setOption(custFuncs.initMOption(data));
            }
        },
        getData: function (params) {
            var nowTime = new Date();
            offset = Math.abs(nowTime.getTimezoneOffset() / 60);
            var startTime = new Date(format(guessData.quizStartTime)).getTime() - (offset * 60 * 60 * 1000);
            startTime = new Date(startTime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(startTime).toTimeString().substr(0, 8)
            return utils.ajax(
                utils.createMiddleAjaxParams({
                    head: {
                        url: '/account/market/klineHistoryData',
                        authorization: params.authorization,
                        method: 'POST',
                        appKey: params.appKey,
                        companyId: params.companyId
                    },
                    data: {
                        code_id: guessData.symbolId,
                        ktype: "1min",
                        msg_id: new Date().getTime(),
                        num: 400,
                        flag: 1,
                        startTime: startTime,
                    }
                })
            )
        },
        //获取竞猜活动详情
        getGuessData: function () {
            clearTimeout(timer);
            clearTimeout(timers);
            utils.ims_ajax({
                url: 'https://' + window.imsDomain + "/unify-activity/act/ix/quiz/actInfo",
                type: 'post',
                data: utils.createGuessAjaxParams({
                    data: {
                        companyId: sessionStorage['parentTokenInfo'] ? JSON.parse(sessionStorage['parentTokenInfo']).companyId : qs.companyId,
                        accountNo: sessionStorage['parentTokenInfo'] ? JSON.parse(sessionStorage['parentTokenInfo']).userId : qs.accountNo,
                    }
                }),
                dataType: 'json',
                timeout: 10000,
                contentType: "application/json",
                success: function (data) {
                    guessData = JSON.parse(data).data;    
                    var isNewGuess = {};
                    isNewGuess.actNo = guessData.actNo;
                    isNewGuess.symbolId = guessData.symbolId;
                    if (localStorage.getItem("isNewGuess") == null) {
                        localStorage.setItem("isNewGuess", JSON.stringify(isNewGuess))
                    }
                    custFuncs.countData() //加载页面和绑定事件  
                    if (isTimer) {  //是否是竞猜时间
                        custFuncs.getData(initData).done(res => {
                            mdata = { "data": [] };
                            var data = res.data.kline_data_list;
                            var befoerKlineTime = new Date(data[0].time.replace(/-/g, '/')).getTime();
                            var nowKlineTime = new Date(format(guessData.quizStartTime)).getTime() - (offset * 60 * 60 * 1000);
                            if (befoerKlineTime < nowKlineTime) {
                                hasKline = false;
                                custFuncs.countData() //加载页面和绑定事件
                                if (JSON.parse(localStorage.getItem("isNewGuess")).actNo == guessData.actNo && JSON.parse(localStorage.getItem("isNewGuess")).symbolId == guessData.symbolId) {
                                    if (localStorage['mdata']) {
                                        custFuncs.kLine(JSON.parse(localStorage['mdata']));
                                    }
                                } else {
                                    localStorage['mdata'] = "";
                                    custFuncs.kLine({ "data": [] });
                                    localStorage.setItem("isNewGuess", JSON.stringify(isNewGuess))
                                }
                                $('.m-guess_time').css("opacity", "0")   //没有分时图  隐藏倒计时
                                custFuncs.percentage(true);   //参数传true  是为了将百分比还原到50%对50%
                            }
                            if (data === null) {
                                //没有分时图
                                hasKline = false;
                                custFuncs.countData() //加载页面和绑定事件
                                if (JSON.parse(localStorage.getItem("isNewGuess")).actNo == guessData.actNo && JSON.parse(localStorage.getItem("isNewGuess")).symbolId == guessData.symbolId) {
                                    if (localStorage['mdata']) {
                                        custFuncs.kLine(JSON.parse(localStorage['mdata']));
                                    }
                                } else {
                                    localStorage['mdata'] = "";
                                    custFuncs.kLine({ "data": [] });
                                    localStorage.setItem("isNewGuess", JSON.stringify(isNewGuess))
                                }
                                $('.m-guess_time').css("opacity", "0")   //没有分时图  隐藏倒计时
                                custFuncs.percentage(true);   //参数传true  是为了将百分比还原到50%对50%
                            } else if (hasKline) {
                                $.each(data, function (key, value) {
                                    var Ktime = new Date(value.time.replace(/-/g, '/')).getTime() + (offset * 60 * 60 * 1000);
                                    Ktime = new Date(Ktime).toLocaleDateString().replace(/\//g, "-") + " " + new Date(Ktime).toTimeString().substr(0, 8);
                                    let list = [];
                                    list[0] = Ktime.split(" ")[1].split(':')[0] + ":" + Ktime.split(" ")[1].split(':')[1];
                                    list[1] = value.close_price;
                                    mdata.data.push(list)
                                })
                                custFuncs.countData() //加载页面和绑定事件
                                mdata.data.reverse();
                                localStorage['mdata'] = JSON.stringify(mdata);
                                localStorage.setItem("isNewGuess", JSON.stringify(isNewGuess));
                                custFuncs.kLine(mdata);
                            }
                            timers = window.setTimeout(function () {
                                custFuncs.getGuessData()  //竞猜活动详情数据
                            }, 60000)
                        })
                            .fail(function (error) {
                                if (JSON.parse(localStorage.getItem("isNewGuess")).actNo == guessData.actNo && JSON.parse(localStorage.getItem("isNewGuess")).symbolId == guessData.symbolId) {
                                    if (localStorage['mdata']) {
                                        custFuncs.kLine(JSON.parse(localStorage['mdata']));
                                    }
                                } else {
                                    localStorage['mdata'] = "";
                                    custFuncs.kLine({ "data": [] });
                                    localStorage.setItem("isNewGuess", JSON.stringify(isNewGuess))
                                }
                            })
                    } else {
                        //不在活动范围之内
                        if (JSON.parse(localStorage.getItem("isNewGuess")).actNo == guessData.actNo && JSON.parse(localStorage.getItem("isNewGuess")).symbolId == guessData.symbolId) {
                            if (localStorage['mdata']) {
                                custFuncs.kLine(JSON.parse(localStorage['mdata']));
                            }
                        } else {
                            localStorage['mdata'] = "";
                            custFuncs.kLine({ "data": [] });
                            localStorage.setItem("isNewGuess", JSON.stringify(isNewGuess))
                        }
                    }
                    if (initData.updateSubSymbolCode) {
                        initData.updateSubSymbolCode(guessData.symbolId)
                    }           
                    
                },
                //异常处理
                error: function (e) {
                    console.log(e);
                }
            })
        },
        //参加竞猜活动
        getJoinGuessData: function (data) {
            utils.ims_ajax({
                url: 'https://' + window.imsDomain + "/unify-activity/act/ix/quiz/join",
                type: 'post',
                data: utils.createGuessAjaxParams({
                    data: {
                        companyId: sessionStorage['parentTokenInfo'] ? JSON.parse(sessionStorage['parentTokenInfo']).companyId : qs.companyId,
                        accountNo: sessionStorage['parentTokenInfo'] ? JSON.parse(sessionStorage['parentTokenInfo']).userId : qs.accountNo,
                        actNo: guessData.actNo,
                        direction: direction,    //涨跌方向 FALL RISE
                        symbolId: guessData.symbolId,
                        symbolName: guessData.symbolName,
                        symbolEnName: guessData.symbolEnName,
                    }
                }),
                dataType: 'json',
                timeout: 10000,
                contentType: "application/json",
                success: function (data) {
                    let result = JSON.parse(data);
                    if (result.code != '0') {
                        $(document).dialog({
                            // titleText: '我是自定义标题',
                            autoClose: 2500,
                            content: result.msg
                        });
                    } else {
                        $('.shadow').css("display", "block");   //弹框的显示
                        if (direction == "RISE") {
                            if (window.PAGECONFIG.orColorType == '1') {   //1 绿涨红跌，2 红涨绿跌
                                $('.guess-down').css("background", "#F9D6D6");
                            } else {
                                $('.guess-down').css("background", "#B6E2DA");
                            }
                            $('.guess-up').find("i").addClass("check");
                            $('.up-already').text("已猜涨");
                        } else {
                            if (window.PAGECONFIG.orColorType == '1') {   //1 绿涨红跌，2 红涨绿跌
                                $('.guess-up').css("background", "#B6E2DA");
                            } else {
                                $('.guess-up').css("background", "#F9D6D6");
                            }
                            $('.guess-down').find("i").addClass("check");
                            $('.up-already').text("已猜跌");
                        }
                        custFuncs.getGuessData()  //竞猜活动详情数据
                    }
                },
                //异常处理
                error: function (e) {
                    console.log(e);
                }
            })
        },
        //获取中奖记录列表
        getPrizeResultData: function (data) {
            utils.ims_ajax({
                url: 'https://' + window.imsDomain + "/unify-activity/act/ix/quiz/getPrizeResult",
                type: 'post',
                data: utils.createGuessAjaxParams({
                    data: {
                        actNo: guessData.actNo,
                        companyId: sessionStorage['parentTokenInfo'] ? JSON.parse(sessionStorage['parentTokenInfo']).companyId : qs.companyId,
                        accountNo: sessionStorage['parentTokenInfo'] ? JSON.parse(sessionStorage['parentTokenInfo']).userId : qs.accountNo,
                        pageSize: 1000,
                        pageNum: 1
                    }
                }),
                dataType: 'json',
                timeout: 10000,
                contentType: "application/json",
                success: function (data) {
                    prizeResultData = [];
                    prizeResultData = JSON.parse(data).data.pageData;
                    appendDom(prizeResultData);
                    if (prizeResultData.length == 0) {  //如果没有中奖记录  则显示没有
                        $('.no-data').css("display", 'block')
                    } else {
                        $('.no-data').css("display", 'none')
                    }
                },
                //异常处理
                error: function (e) {
                    console.log(e);
                }
            })
        },
    }
    var render = function () {
        // DOM渲染
        parentElement.html(template.render($('#tpl_guess').text(), data))
        $('.money').text("$" + guessData.awardPoolAmount)   //填写奖金的金额
        if(qouteInfo.yesterday_price !=0) {
            $('.m-guess_title').html("<span class='yesterday'>" + guessData.symbolName + "</span>" + " " + '较于昨日收盘价' + " " + "<span class='yesterday'>" + (qouteInfo.yesterday_price?qouteInfo.yesterday_price:'--') + "</span>,会涨还是跌？")  
            $('.rise').text(qouteInfo.cur_price);
            $('.fall').text(qouteInfo.cur_price);
        }
        if (sessionStorage['parentTokenInfo']) {
            if (!JSON.parse(sessionStorage['parentTokenInfo']).userId) {
                //游客
                if (isTimer) {
                    custFuncs.percentage(false);   //参数传true  是为了将百分比还原到50%对50%
                } else {
                    custFuncs.percentage(true);   //参数传true  是为了将百分比还原到50%对50%
                }
                tourist = true;
                custFuncs.getCountdownTime(true);
                return
            }
        }

        custFuncs.percentage(false);
        custFuncs.getCountdownTime(true);
    }

    var bindEvt = function () {
        // 绑定事件
        $(".guess-up").on('click', function(){evtFuncs.showView('up')});
        $(".guess-down").on('click', function(){evtFuncs.showView('down')});    
        $(".btn").on('click', evtFuncs.hideView);
        $(".m-guess_record").on('click', evtFuncs.showRecord);   //绑定显示中奖记录的事件
        $(".closeRecode").on('click', evtFuncs.hideRecord);      //绑定隐藏中奖记录的事件
        that.bind('quote', function (evt) {
            $.each(evt.data, function (key, value) {
                if (value.code_id == guessData.symbolId) {
                    qouteInfo = value;
                    $('.m-guess_title').html("<span class='yesterday'>" + guessData.symbolName + "</span>" + " " + '较于昨日收盘价' + " " + "<span class='yesterday'>" + (qouteInfo.yesterday_price?qouteInfo.yesterday_price:'--') + "</span>,会涨还是跌？")
                    custFuncs.getCountdownTime(false);
                    $('.rise').text(value.cur_price);
                    $('.fall').text(value.cur_price);
                }
            })
        })
    }
    var format = function (data) {
        var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = change(date.getDate()) + ' ';
        h = change(data.split('-')[0] * 1) + ':';
        m = change(data.split('-')[1] * 1) + ':';
        s = change(data.split('-')[2] * 1);
        var result = Y + M + D + h + m + s;
        result = result.replace(/-/g, '/')
        return result;
    }
    var change = function (t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }
    var TimeDown = function (endDateStr, val) {
        if(timer) {
            window.clearInterval(timer)
            timer = null
        }
        //结束时间
        var endDate = new Date(endDateStr).getTime();
        //当前时间
        var nowDate = new Date().getTime();
        if (endDate < nowDate) return
        //相差的总秒数
        var totalSeconds = parseInt((endDate - nowDate) / 1000);
        //取模（余数）
        var modulo = totalSeconds % (60 * 60 * 24);
        //小时数
        var hours = Math.floor(modulo / (60 * 60)) >= 10 ? Math.floor(modulo / (60 * 60)) : "0" + Math.floor(modulo / (60 * 60));
        modulo = modulo % (60 * 60);
        //分钟
        var minutes = Math.floor(modulo / 60) >= 10 ? Math.floor(modulo / 60) : "0" + Math.floor(modulo / 60);
        //秒
        var seconds = modulo % 60 >= 10 ? modulo % 60 : "0" + modulo % 60;
        $(".hours").text(hours);
        $(".minutes").text(minutes);
        $(".seconds").text(seconds);
        //延迟一秒执行自己
        timer = window.setInterval(function () {
            if (totalSeconds > 0) {
                if (val == "quizEndTime") {
                    TimeDown(quizEndTime, val);
                } else {
                    TimeDown(openTime, val);
                }
            } else if (totalSeconds <= 0) {
                if(val == "openTime") {
                    $('.m-guess_time').css("opacity", "0")   //当开奖时间结束之后  隐藏倒计时
                }
                custFuncs.getGuessData()
            }
        }, 1000)
    }
    var setColor = function (type) {
        if (guessData.currentUserIsJoined && type) return
        if (window.PAGECONFIG.orColorType == "1") {   //绿涨红跌
            $('.guess-down').css("background", "#F9D6D6");   //猜跌样式遮挡效果
            $('.guess-up').css("background", "#B6E2DA");
        } else {      //红涨绿跌
            $('.guess-down').css("background", "#B6E2DA");   //猜跌样式遮挡效果
            $('.guess-up').css("background", "#F9D6D6");
        }
    }
    var percentageColor = function () {
        if (window.PAGECONFIG.orColorType == "1") {
            $('.leftPercentage').css("color", '#00AE88');
            $('.rightPercentage').css("color", '#E95A5A');
            $('.leftBar').css("background", '#00AE88');
            $('.rightBar').css("background", '#E95A5A');
        } else {
            $('.leftPercentage').css("color", '#E95A5A');
            $('.rightPercentage').css("color", '#00AE88');
            $('.leftBar').css("background", '#E95A5A');
            $('.rightBar').css("background", '#00AE88');
        }
    }
    var appendDom = function (list) {
        $.each(list, function (key, value) {
            if (value.direction == 'RISE') {
                value.direction = "看涨"
            } else {
                value.direction = "看跌"
            }
        })
        var dom, parentDom
        $.each(list, function (key, value) {
            parentDom = $(`<div class='content content${key}'></div>`)
            dom = $(`<span>${value.giveDate}</span>
                <span>${value.symbolName}</span>
                <span>${value.direction}</span>
                <span class="status">${"+$" + value.amount}</span>`); //创建一个节点
            $(".meg").append(parentDom);
            $(`.content${key}`).append(dom);
        })
    }
    // 页面初始化
    var init = function (_data, id) {
        if (APPFUNCTION.inApp()) {
            return
        }
        parentElement = $('#' + id)
        initData = _data;
        custFuncs.getGuessData()  //竞猜活动详情数据
        // eruda.init();
        window.addEventListener('message', function (evt) {
            var data = evt.data || {}
            if (data.type === 'configChange') {
                window.PAGECONFIG = data.data
                custFuncs.getCountdownTime(false);
            }
        })
    }

    that.init = init;
    module.exports = that
})
