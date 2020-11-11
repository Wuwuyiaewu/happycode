$(window).scroll(function() {

});

$(window).resize(function() {

});
var STATIC_MOBILE_URL = "";
var downFlag = true,
    upFlag = true;
var app_url = "";
if (getQueryString('app') && location.search) {
    app_url = 'app=' + getQueryString('app');
}
$(document).ready(function() {


    $(".level_select p").click(function() {
        $(".level_select").toggleClass("show_list");
    });

    $(".filter_list ul li").click(function() {
        $(".filter_list ul li").removeClass("selected");
        $(this).addClass("selected");
        if ($(this).attr("id") == "ALL") {
            //$(this).addClass("all-font-s");
        }
        var currency = $(this).attr("livalue");
        $("#currencyTypeHid").val(currency);
        // refreashData("list");
    });


    $("#importanceQueryHid").val("");
    $(".level_select li").click(function() {
        if ($(this).hasClass("li-on")) {
            $(this).removeClass("li-on")
        } else {
            $(this).addClass("li-on");
        }
        $("#importanceQueryHid").val("");
        $(".level_select li").each(function() {
            var trta = $(this).attr("ta");
            if ($(this).hasClass("li-on")) {
                $("#star_" + trta).attr("dis", "yes");
                $("#importanceQueryHid").val("yes");
            } else {
                $("#star_" + trta).attr("dis", "");
            }


        });

    });
    //$("ul#week_list li").click(function () {
    //	$("ul#week_list li").removeClass("selected");
    //	$(this).addClass("selected");
    //	var this_data = new Date($(this).attr("data"));
    //	var dataStr = this_data.Format("yyyy-MM-dd");
    //	window.location.href = '/zh/calendar/index.html?date=' + dataStr + "&" + app_url + "#" + $("#changeDateValue").val();
    //});
    $("ul#week_list li").click(function() {
        $("ul#week_list li").removeClass("selected");
        $(this).addClass("selected");
        var this_data = new Date($(this).attr("data"));
        var dataStr = this_data.Format("yyyy-MM-dd");

        queryInfo.date = dataStr; //Str
        queryInfo.tab = $("#changeDateValue").val();
        delete queryInfo.consulting
        delete queryInfo.pm_frompage
        var queryInfoStringArr = [];
        $.each(queryInfo, function(index, value) {
            if (index != 'symbol') {
                queryInfoStringArr.push(index + '=' + value);
            }
        })


        //window.location.href = STATIC_MOBILE_URL + '/zh/calendar/' + dataStr + ".html" + (app_url.replace("consulting=1", "")) + "#" + $("#changeDateValue").val();
        window.location.href = 'P5_index.html?' + queryInfoStringArr.join('&')
    });

    //重置
    $("#rest").click(function() {
        $("#selectCon1").removeClass("sp-on");
        $("#selectCon2").addClass("sp-on").siblings("span").removeClass("sp-on");
        $("#selectCon3").addClass("sp-on").siblings("span").removeClass("sp-on");
        $("#selectCon4").addClass("sp-on").siblings("span").removeClass("sp-on");

    });
    $(".data-nocon-box").click(function() {
        $(".shuanx-layer-box").show();
        $(".shadow").show();

    });

});
//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var date = new Date(href_html)
var today = new Date()
today.setDate(date.getDate() + 1)
var yesterday = new Date()
yesterday.setDate(date.getDate() - 1)
date = date.Format("yyyy-MM-dd")
today = today.Format("yyyy-MM-dd")
yesterday = yesterday.Format("yyyy-MM-dd")
    /*$(function(){*/


var queryInfo = {};
var queryArr = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
if (queryArr) {
    $.each(queryArr, function(index, item) {
        item = item.substring(1);
        queryInfo[item.split('=')[0]] = item.split('=')[1]
    })
}


function refreashDataNew(types, href, isAll) {
    //$("#sureF").click(function(){
    var nowDate = $("#nowDate").val();
    //国家
    var currencyTypeHid = "";
    //星级
    var starHou = "";
    //公布
    var status = "";
    if (href == " ") {
        href = href_html;
    }
    if (isAll != null && isAll == "select") {
        $("#currencyTypeQuery span").each(function() {
            console.log($(this).attr("class"));
            if ($(this).hasClass("sp-on")) {
                console.log(11);
                currencyTypeHid += $(this).attr("livalue") + ",";
            }
        });
        currencyTypeHid = currencyTypeHid.substring(0, currencyTypeHid.length - 1);

        $("#imports span").each(function() {
            console.log($(this).attr("class"));
            if ($(this).hasClass("sp-on") && $(this).attr("id") != "selectCon1") {
                console.log(11);
                starHou += $(this).attr("livalue") + ",";
            }
        });
        starHou = starHou.substring(0, starHou.length - 1);

        $("#status span").each(function() {
            if ($(this).hasClass("sp-on")) {
                console.log(11);
                status += $(this).attr("livalue") + ",";
            }
        });
        status = status.substring(0, status.length - 1);
    } else {
        currencyTypeHid = "ALL";
        starHou = "ALL";
        status = "ALL";
    }

    console.log("ajaxCalendarNew===status=" + status + "  starHou=" + starHou + " href_html=" + href_html + "=-=-=" + currencyTypeHid);

    // var url = oaPath+"/"+lang+"/ajaxCalendarNew.html";

    /*舊API*/
    // var url = 'https://appapi.pmsun.net/website/calendar/ajaxCalendarNew'

    /*新API*/
    var url = 'https://news.chongontrading.com/news/'


    var catra = "list";
    console.log(queryInfo.dateStr + ">>>查询日期")
        //console.log(queryInfo);
    $.ajax({
        type: "get",
        url: url + 'date_event',
        data: {
            /* 新 */
            language: 'zh',
            event_type: 3,
            is_import: 0,
            begin_date: href_html ? href_html : new Date().Format("yyyy-MM-dd"),
            end_date: href_html ? href_html : new Date().Format("yyyy-MM-dd"),

            /*舊*/
            //companyId: '14',
            //type: catra,
            //dateStr: href_html?href_html:new Date().Format("yyyy-MM-dd"),
            //country: currencyTypeHid,
            //importStar: starHou,
            //status: status

        },
        success: function(data) {
            data = data.data
            $("#PullDown").removeClass("db")
            downFlag = true
            console.log("测试日期格式：" + href_html);
            /*
             * 财经事件
             *
             * */
            var _eventData = data || [];
            console.log(_eventData);
            var _eventHtml = '';
            if (_eventData.length > 0) {
                $.each(_eventData, function() {
                    var _startHtml = '';
                    for (var i = 0; i < 3; i++) {
                        if (i < this.event_import) {
                            _startHtml += '<span></span>'
                        } else {
                            _startHtml += '<span class="qian"></span>'
                        }
                    }
                    //<img class="gq-pfon" src="' + STATIC_URL + '/public/images/Calenda/country/' + this.countryCode + '.png" alt="" width="100%"></span>
                    _eventHtml += '<li><div class="data-sj-item">' +
                        '<div class="data-time"><span></span><span> ' + (this.event_time.substring(5, 11)).replace('-', '.') + '</span></div>' +
                        '<div class="data-miaos"><div class="xin-box"><p>' + _startHtml + '</p>' +
                        '</div> <h3 class="data-sj-tt">' + this.event_desc + '</h3></div></div></li>'

                })
            } else {
                _eventHtml = '<p class="cen-nodata-fon">今日无财经事件公布！</p>'
            }
            $('#pageEvent').html(_eventHtml)
        }
    });
    $.ajax({
        type: "get",
        url: url + 'date_event',
        data: {
            /* 新 */
            language: 'zh',
            event_type: 1,
            is_import: 0,
            begin_date: href_html ? href_html : new Date().Format("yyyy-MM-dd"),
            end_date: href_html ? href_html : new Date().Format("yyyy-MM-dd"),
        },
        success: function(data) {
            data = data.data
                /*
                 * 假期
                 *
                 *
                 * */
            var _holidayData = data || [];
            console.log(_holidayData);
            var _holidayHtml = '';
            if (_holidayData.length > 0) {
                $.each(_holidayData, function() { //<img src="' + STATIC_URL + '/public/images/Calenda/country/' + this.externalId + '.png" alt="" width="100%">
                    _holidayHtml += '<li><div class="data-sj-item"> <div class="data-time"> </div>' +
                        '<div class="data-miaos"> <t class="f24 gray">' + (this.event_time.substring(5, 11)).replace('-', '.') + '</t> <h3 class="data-sj-tt">' + this.event_desc + '</h3> </div> </div> </li>'


                })
            } else {
                _holidayHtml = '<p class="cen-nodata-fon">未来四日无假期！</p>'
            }
            $('#pageHoliday').html(_holidayHtml)
        }
    });
    $.ajax({
        type: "get",
        url: url + 'dailyfx',
        data: {
            /* 新 */
            language: 'zh',
            is_import: 0,
            begin_date: href_html ? href_html : new Date().Format("yyyy-MM-dd"),
            end_date: href_html ? href_html : new Date().Format("yyyy-MM-dd"),
        },
        success: function(data) {
            var result = data.msg;
            data = data.data
            console.log(data);
            //	var finaanceDataTopList = data["finaanceDataTopList"];
            //	var finaanceDataListJiGongbu = data["finaanceDataListJiGongbu"];
            //	var finaanceDataListGongbu = data["finaanceDataListGongbu"];
            //	var finaanceDataListNoGongbu = data["finaanceDataListNoGongbu"];
            //	if ((finaanceDataTopList == null || finaanceDataTopList == "") && (finaanceDataListJiGongbu == null || finaanceDataListJiGongbu == "") && (finaanceDataListGongbu == null || finaanceDataListGongbu == "") && (finaanceDataListNoGongbu == null || finaanceDataListNoGongbu == "")) {
            if (data == null || data == '' || data.length == 0) {
                //maxwell
                $('.get-bot-info').hide()
                $("#PullDown").removeClass("db")
                $("#PullUp").removeClass("db")
                var dataNone = '<div class="data-nocon-box tc"> <i></i><p class="f30 m30"><span>' + href + '无重要经济数据</span></p><a  href="javascript://" class="f34 m20">更改筛选设置</a></div>'
                if (new Date(href).getDay() == 0) {
                    if (new Date(href_html).getDay() == 1) {
                        $("#dataListYi .yesterday").append(dataNone)
                    }
                    if (new Date(href_html).getDay() == 0) {
                        if (new Date(href_html).valueOf() >= new Date().valueOf()) {
                            $("#dataListWei .nows").append(dataNone)
                        } else {
                            $("#dataListYi .nows").append(dataNone)
                        }

                    }
                    if (new Date(href_html).getDay() == 6) {
                        $("#dataListWei .today").append(dataNone)
                    }
                    $(".data-nocon-box").css({
                        position: 'relative',
                        'border-top': '1px solid #F2F2F2',
                        'border-bottom': '1px solid #F2F2F2'
                    })
                    $(".data-nocon-box a").click(function() {
                        $(".rili-layer-box").show()
                        $(".datepicker_div").show()
                        $('.shadow2').show()
                    })
                }
                $(".shuanx-layer-box").hide();
                $(".shadow").hide();
                return false;
            }
            var carHtml = [];

            if (result == "成功") {

                var j = 0;
                var finaanceDataTopList = null;
                var finaanceDataListJiGongbu = null;
                var finaanceDataListGongbu = [];
                var finaanceDataListNoGongbu = [];

                for (let i = 0; i < data.length; i++) {
                    if (data[i].actual_price == null || data[i].actual_price == '') {
                        finaanceDataListNoGongbu.push(data[i]);
                    } else {
                        finaanceDataListGongbu.push(data[i]);
                    }
                }
                console.log(finaanceDataListGongbu);
                console.log(finaanceDataListNoGongbu);

                var carHtmlTop = [];
                carHtmlTop = publicDisCa(finaanceDataTopList, "3");

                var carHtmlYi = [];
                //已公布
                carHtmlYi = publicDisCa(finaanceDataListGongbu, "0");
                var carHtmlWei = [];
                //未公布
                carHtmlWei = publicDisCa(finaanceDataListNoGongbu, "2");
                $("#dataListTop").html(carHtmlTop.join(''))
                if ($("#dataListTop").children().length == 0) {
                    $("#dataListTop").parent('.shuj-future-fon').remove()
                }
                if (!$('#PullDown').hasClass("db") && !$('#PullUp').hasClass("db") && new Date(href_html).getDay() != 0) {
                    // console.log(carHtmlYi);
                    $("#dataListYi .nows").html("");
                    $("#dataListWei .nows").html("");
                    $("#dataListYi .nows").append(carHtmlYi.join(''))
                    $("#dataListWei .nows").append(carHtmlWei.join(''))
                    if (new Date().Format("yyyy-MM-dd") == href) {
                        $("body,html").animate({ scrollTop: $(".shuj-done-fon").outerHeight() - $("#dataListTop").outerHeight() }, 1000);
                    }
                }
                if (href == yesterday) {
                    findTop()
                    $("#PullDown").removeClass("db")
                    $("#dataListYi .yesterday").html("");
                    $("#dataListWei .yesterday").html("");
                    $("#dataListYi .yesterday").prepend(carHtmlYi.join(''));
                    $("#dataListWei .yesterday").prepend(carHtmlWei.join(''));
                    downFlag = false
                }
                if (href == today) {
                    $("#PullUp").removeClass("db")
                    $("#dataListYi .today").html("");
                    $("#dataListWei .today").html("");
                    $("#dataListYi .today").append(carHtmlYi.join(''));
                    $("#dataListWei .today").append(carHtmlWei.join(''));
                    upFlag = false
                }
                //maxwell

                $(".get-bot-info").fadeIn()


                $(".app-del-btn").click(function() {

                    $(".app-tips-box").fadeOut();
                });
                //时间切换逻辑处理
                $(".set-time-ucon li").click(function() {
                    $(this).children("i").show().parent().siblings().children("i").hide();
                    var dates = $("#app_re_time").val();
                    var finDatesb = dates.replace(/-/g, "/");
                    finDatesb = new Date(finDatesb);
                    var val = $(this).attr("val");
                    var jianMinusSN = jianMinus(finDatesb, val).Format("yyyy-MM-dd HH:mm:ss");
                    $("#tiTime").val(val);
                    $("#tixing").html(jianMinusSN);
                    //关闭层
                    var e = window.event || event;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                });
                $(".set-time-btn,.app-tips-box").click(function(event) {
                    var setTimeName = $(this).attr("class");
                    if (setTimeName == "set-time-btn") {
                        $(this).addClass("set-time-off");
                    } else {
                        $(this).removeClass("set-time-off");
                    }
                });
                $("#qux,.app-tips-box").click(function() {
                    //$("#tiTime").val("10");
                    //$("#disTimes").show();
                    $(".app-tips-box").fadeOut();
                });
                $(".app-tips-szitem").click(function(event) {
                    var e = window.event || event;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                });

                // $("#dataListWei").html(carHtmlWei.join(''));
                // console.log(4444444444);
                // // 即将公布位置&自动加载到未公布位置
                // var cenHei1 = $("#header,#head2,#head3").height(),
                //     cenHei2 = $(".chart-header-box").innerHeight(),
                //     cenHei3 = $(".shuj-future-fon").innerHeight(),
                //     cenHei4 = $(".shuj-done-fon").innerHeight(),
                //     cenHei5 = $(".data-shuj-box li").innerHeight(),
                //     cenHeightAll = cenHei1+cenHei2+cenHei3-30,
                //     cenHeightAll2 = cenHei1+cenHei2+cenHei4-cenHei5-50,
                //     blankHeight = cenHei3-2,
                //     liLenght = $(".data-shuj-atop > ul").length,
                //     cenHeightTop = cenHei1+cenHei2-3;
                // if(liLenght <= 1){
                //     $("body,html").animate({scrollTop:cenHeightAll2},1000);
                //     $(".app-top-h3").hide();
                // }else{
                //     $("body,html").animate({scrollTop:cenHeightAll},1000);
                //     $(".app-top-h3").css("height",blankHeight);
                //     $(".shuj-future-fon").css("top",cenHeightTop);
                // }

                $(".shuanx-layer-box").hide();
                $(".shadow").hide();
                $(".data-nocon-box").hide();

                /**app提醒层 弹出框*/
                /*$(".data-time-ic").click(function(){
                   // $("#appSetCon").fadeIn();
                    var e=window.event || event;
                    if(e.stopPropagation){
                       e.stopPropagation();
                    }else{
                       e.cancelBubble = true;
                    }
                });*/
            }

        },
    });
}


function refreashDataNew_bak(types, href, isAll) {
    //$("#sureF").click(function(){
    var nowDate = $("#nowDate").val();
    //国家
    var currencyTypeHid = "";
    //星级
    var starHou = "";
    //公布
    var status = "";
    if (href == "") {
        href = href_html;
    }
    if (isAll != null && isAll == "select") {
        $("#currencyTypeQuery span").each(function() {
            if ($(this).hasClass("sp-on")) {
                currencyTypeHid += $(this).attr("livalue") + ",";
            }
        });
        currencyTypeHid = currencyTypeHid.substring(0, currencyTypeHid.length - 1);

        $("#imports span").each(function() {
            if ($(this).hasClass("sp-on")) {
                starHou += $(this).attr("livalue") + ",";
            }
        });
        starHou = starHou.substring(0, starHou.length - 1);

        $("#status span").each(function() {
            if ($(this).hasClass("sp-on")) {
                status += $(this).attr("livalue") + ",";
            }
        });
        status = status.substring(0, status.length - 1);
    } else {
        currencyTypeHid = "ALL";
        starHou = "ALL";
        status = "ALL";
    }


    var lang = "zh";
    var url = oaPath + "/" + lang + "/ajaxCalendarNew.html";
    var catra = "list";
    $.ajax({
        type: "POST",
        url: url,
        dataType: "jsonp",
        data: {
            type: catra,
            dateStr: href_html,
            country: currencyTypeHid,
            importStar: starHou,
            status: status

        },
        success: function(data) {

            var finaanceDataTopList = data["finaanceDataTopList"];
            var finaanceDataListJiGongbu = data["finaanceDataListJiGongbu"];
            var finaanceDataListGongbu = data["finaanceDataListGongbu"];
            var finaanceDataListNoGongbu = data["finaanceDataListNoGongbu"];
            $(".shuanx-layer-box").hide();
            $(".shadow").hide();

            if ((finaanceDataListJiGongbu == null || finaanceDataListJiGongbu == "" || finaanceDataListJiGongbu.length == 0) && (finaanceDataListGongbu == null || finaanceDataListGongbu == "" || finaanceDataListGongbu.length == 0) && (finaanceDataListNoGongbu == null || finaanceDataListNoGongbu == "" || finaanceDataListNoGongbu.length == 0)) {
                var dataNone = '<div class="data-nocon-box tc"> <i></i><p class="f30 m30"><span>' + href + '无重要经济数据</span></p><a  href="javascript://" class="f34 m20">更改筛选设置</a></div>'
                $("#PullDown").removeClass("db")
                $("#PullUp").removeClass("db")
                $("#dataListWei .yesterday").html('');
                $("#dataListYi .yesterday").html('');
                $("#dataListWei .today").html('');
                $("#dataListYi .today").html('');
                $("#dataListWei .nows").html('');
                $('#dataListYi').css({
                    'min-height': '8rem'
                });
                var isYi = false;
                if (new Date(href).getDay() == 1) {
                    $("#dataListYi .nows").html('');
                    $("#dataListYi .nows").append(dataNone);
                }
                $("#dataListWei .nows").html('');
                if (new Date(href).getDay() == 0) {
                    if (new Date(href_html).getDay() == 1) {
                        $("#dataListYi .yesterday").append(dataNone)
                    }
                    if (new Date(href_html).getDay() == 0) {
                        if (new Date(href_html).valueOf() >= new Date().valueOf()) {
                            $("#dataListWei .nows").append(dataNone)
                        } else {
                            $("#dataListYi .nows").append(dataNone)
                        }

                    }
                    if (new Date(href_html).getDay() == 6) {
                        $("#dataListWei .today").append(dataNone)
                    }
                    $(".data-nocon-box").css({
                        position: 'relative',
                        'border-top': '1px solid #F2F2F2',
                        'border-bottom': '1px solid #F2F2F2'
                    })

                }
                $(".data-nocon-box a").click(function() {
                    $(".rili-layer-box").show()
                    $(".datepicker_div").show()
                    $('.shadow2').show()
                })
                return false;
            }
            var carHtml = [];
            var result = data["result"];
            if (result == "ok") {

                var j = 0;
                // $("#dataListTop").html("");
                // $("#dataListYi").html("");
                // $("#dataListJi").html("");
                // $("#dataListWei").html("");
                var carHtmlTop = [];
                carHtmlTop = publicDisCa(finaanceDataTopList, "3");
                // $("#dataListTop").append(carHtmlTop.join(''));
                var carHtmlYi = [];
                //已公布  
                carHtmlYi = publicDisCa(finaanceDataListGongbu, "0");
                // $("#dataListYi").append(carHtmlYi.join(''));

                /*	var carHtmlJi = [];
                		   //即将公布  
                	 carHtmlJi = publicDisCa(finaanceDataListJiGongbu,"1");
                   $("#dataListJi").html(carHtmlJi.join(''));
                  */

                var carHtmlWei = [];
                //未公布  

                carHtmlWei = publicDisCa(finaanceDataListNoGongbu, "2");
                $("#dataListTop").html(carHtmlTop.join(''))
                if ($("#dataListTop").children().length == 0) {
                    $("#dataListTop").parent('.shuj-future-fon').remove()
                }
                if (!$('#PullDown').hasClass("db") && !$('#PullUp').hasClass("db") && new Date(href_html).getDay() != 0) {
                    $("#dataListYi .nows").html("");
                    $("#dataListWei .nows").html("");
                    $("#dataListYi .nows").append(carHtmlYi.join(''))
                    $("#dataListWei .nows").append(carHtmlWei.join(''))
                    if (new Date().Format("yyyy-MM-dd") == href) {
                        $("body,html").animate({
                            scrollTop: $(".shuj-done-fon").height() + 20
                        }, 1000);
                    }
                }
                if (href == yesterday) {
                    $("#PullDown").removeClass("db")
                    $("#dataListYi .yesterday").prepend(carHtmlYi.join(''));
                    $("#dataListWei .yesterday").prepend(carHtmlWei.join(''));
                    downFlag = false
                }
                if (href == today) {
                    $("#PullUp").removeClass("db")
                    $("#dataListYi .today").append(carHtmlYi.join(''));
                    $("#dataListWei .today").append(carHtmlWei.join(''));
                    upFlag = false
                }
                $(".get-bot-info").fadeIn()



                $(".app-del-btn").click(function() {

                    $(".app-tips-box").fadeOut();
                });
                //时间切换逻辑处理
                $(".set-time-ucon li").click(function() {
                    $(this).children("i").show().parent().siblings().children("i").hide();
                    var dates = $("#app_re_time").val();
                    var finDatesb = dates.replace(/-/g, "/");
                    finDatesb = new Date(finDatesb);
                    var val = $(this).attr("val");
                    var jianMinusSN = jianMinus(finDatesb, val).Format("yyyy-MM-dd HH:mm:ss");
                    $("#tiTime").val(val);
                    $("#tixing").html(jianMinusSN);
                    //关闭层
                    var e = window.event || event;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                });
                $(".set-time-btn,.app-tips-box").click(function(event) {
                    var setTimeName = $(this).attr("class");
                    if (setTimeName == "set-time-btn") {
                        $(this).addClass("set-time-off");
                    } else {
                        $(this).removeClass("set-time-off");
                    }
                });
                $(".set-time-btn a,.app-tips-box").click(function() {
                    //$("#tiTime").val("10");
                    //$("#disTimes").show();
                    $(".app-tips-box").fadeOut();
                });
                $(".app-tips-szitem").click(function(event) {
                    var e = window.event || event;
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    } else {
                        e.cancelBubble = true;
                    }
                });
                /*  $(".data-time-ic").click(function(event){
                	   var e=window.event || event;
                	   if(e.stopPropagation){
                		  e.stopPropagation();
                	   }else{
                		  e.cancelBubble = true;
                	   } 
                   });*/
                var datess = new Date().Format('yyyy-MM-dd');
                if (href_html == datess) {
                    // dataPosTop();
                }

            }

        },
    });
}

//滚动
$(function() {
    //判断是否当天的前后三天显示datalistTOP

    //置顶样式
    $(".app-top-h2").hide()
    $(".app-top-mh2").hide()
    $(".app-top-h").hide()
    $(".header-top").css({
        position: 'fixed',
        'z-index': 999,
        top: $("#header").height(),
    })
    $(".chart-mheader-box,.shuj-future-fon").css({
        position: 'relative',
        top: 0,
    })
    $(".app-gts").css({
        overflow: "hidden"
    })
    $(".swiper-wrapper").css({
        'margin-top': $(".header-top").outerHeight() + $("#header").outerHeight()
    })
    $(".datepicker_div").css({
            top: 0
        })
        //置顶样式


    if (href_html != today && href_html != date && href_html != yesterday) {
        $("#dataListTop").html('')
    }
    refreashDataNew("list", href_html);
    document.addEventListener('touchmove', function(event) {
        var yesterdayLength = Object.keys($(".yesterday ul")).some(function(item, index) {
                return length == 0
            }) //判断yesterday的长度

        var todayLength = Object.keys($(".today ul")).some(function(item, index) {
                return length == 0
            }) //判断明天的长度

        var pageY = $(document).scrollTop(); //浏览器滚动距离
        if ($(document).scrollTop() <= 0) { //如果为0 触顶
            if (downFlag) {
                $("#PullDown").addClass("db")
                downFlag = false
                if (yesterdayLength) {
                    refreashDataNew("list", yesterday);
                }
            }
        }
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) { //触底
            if (upFlag) {
                $("#PullUp").addClass("db")
                upFlag = false
                if (todayLength) {
                    refreashDataNew("list", today);
                }
            }
        }

        var selectLi, selectLiIndex;
        var selected = $("#week_list").find("li");
        var weiToday = $("#dataListWei .today"),
            yiToday = $("#dataListYi .today"),
            yiYesterday = $("#dataListYi .yesterday"),
            weiYesterday = $("#dataListWei .yesterday");
        for (var i = 0; i < selected.length; i++) {
            if (new Date($(selected[i]).attr('data')).Format("yyyy-MM-dd") == href_html) {
                selectLi = $(selected[i])
                selectLiIndex = i
            }
        } //获取时间当前的li位置
        if ((pageY >= weiToday.offset().top && pageY <= weiToday.offset().top + weiToday.outerHeight()) || (pageY >= yiToday.offset().top && pageY <= yiToday.offset().top + yiToday.outerHeight())) {
            //判断是否滑动到明天的div
            if (selectLi) { //判断当天设置是否生效
                if (selectLi.next().get(0) == undefined) {
                    week_change('next')
                    var weekPrev = $("#week_list").find("li");
                    weekPrev.first().addClass("selected")
                } else { //否则weeklist翻页
                    $(".shuj-future-fon").show();
                    $("ul#week_list li").removeClass("selected");
                    selectLi.next().addClass("selected");
                }
            }
        } else if (((pageY >= yiYesterday.offset().top - 184 && pageY <= yiYesterday.offset().top + yiYesterday.outerHeight()) || (pageY >= weiYesterday.offset().top - 184 && pageY <= weiYesterday.offset().top + weiYesterday.outerHeight())) && $(".yesterday ul").length != 0 || pageY == 0) { //判断是否滑动到昨天天的div
            if (selectLi) { //判断当天设置是否生效
                if (selectLi.prev().get(0) == undefined) {
                    week_change('back')
                    var weekPrev = $("#week_list").find("li");
                    weekPrev.last().addClass("selected")
                } else { //否则weeklist翻页
                    $(".shuj-future-fon").hide()
                    $(".swiper-wrapper").css({
                        'margin-top': $(".chart-mheader-box").outerHeight() + $("#header").outerHeight()
                    })
                    $("ul#week_list li").removeClass("selected");
                    selectLi.prev().addClass("selected")
                }
            }
        } else {
            if (selectLi) { //判断当天设置是否生效
                $(".shuj-future-fon").show();
                $("ul#week_list li").removeClass("selected");
                selectLi.addClass("selected");
            } else if (new Date(href_html).valueOf() > new Date($("ul#week_list .selected").attr('data')).valueOf()) { //如果时间小于当前时间向后翻页
                week_change('next')
                var weekPrev = $("#week_list").find("li");
                weekPrev.first().addClass("selected")
            } else { //如果时间大于当前时间向前翻页
                week_change('back')
                var weekPrev = $("#week_list").find("li");
                weekPrev.last().addClass("selected")
            }
        }
    }, false);
})

//
/**	  
 * 当前日期加上分钟
 * @param date
 * @param value
 * @returns
 */
function addHours(date, value) {
    date.setMinutes(date.getMinutes() + value);
    return date;
}

/**
 * 公用显示list数据
 */
function publicDisCa(finaanceDataList, status) {
    var carHtml = [];
    var countT = 0;
    var lang = "zh";

    if (finaanceDataList != null && finaanceDataList.length > 0) {
        if (status == "3") {
            carHtml.push('<div class="data-atop-icon"></div>');
        }
        carHtml.push('<ul>');
        var hrefs = window.location.href;
        for (var i = 0; i < finaanceDataList.length; i++) {

            var msg = finaanceDataList[i];
            //遍历所有数据 设置了data-time-on
            carHtml.push('<li>');
            carHtml.push('<div class="data-rh-icon">');
            //var effect = msg.amplitudeFactValue;
            var effect = "";
            if (hrefs.indexOf("gts2_app_orig") != -1) {
                var app_no_s = getCookie("app_no_" + msg.id) || "";
                var dis = "";
                if (app_no_s != null && app_no_s != "") {
                    dis = "data-time-on";
                }
                if (msg.actual_price == null || msg.actual_price == "") {
                    carHtml.push(' <div class="data-time-ic apptip ' + dis + '" id="' + msg.id + '" onclick="apptick(\'' + msg.id + '\',\'' + msg.fx_title + '\',\'' + new Date(msg.publish_time.replace(/-/g, "/")).Format("yyyy/MM/dd HH:mm:ss") + '\')">');
                    carHtml.push('<s><i></i>' + app_no_s + '</s>');
                    carHtml.push('</div>');
                }
                if (effect != null && effect != "") {
                    carHtml.push('<a href="' + STATIC_MOBILE_URL + '/zh/calendar/cont_effect_' + msg.id + '.html?app=gts2_app_orig" class="data-chart-link">');
                }

            } else {
                carHtml.push(' <div class="data-time-ic mtip"  onclick="mtick()">');
                carHtml.push('<s><i></i>11:20</s>');
                carHtml.push('</div>');
            }
            //carHtml.push('<a href="' + STATIC_MOBILE_URL + '/zh/calendar/detail.html?key=' + msg.id + '&' + app_url + '" class="data-cont-link">');
            carHtml.push('<a href="javascript:void(0)" class="data-cont-link">');
            carHtml.push(' </div>');
            carHtml.push('<div class="data-sj-item">');
            var reverTime = "";
            if (msg.publish_time != null && msg.publish_time != "") {
                if (status == "3") {
                    reverTime = new Date(msg.publish_time.replace(/-/g, "/")).Format('MM.dd HH:mm');
                } else {
                    reverTime = new Date(msg.publish_time.replace(/-/g, "/")).Format('HH:mm');
                }

            }
            //			carHtml.push('<div class="data-time"><span><img class="gq-pfon" src="' + STATIC_URL + '/public/images/Calenda/country/' + msg.countryCode + '.png" alt="" width="100%"></span><span>' + reverTime + '</span></div>');

            carHtml.push('<div class="data-time"><span></span><span>' + reverTime + '</span></div>');
            carHtml.push('<div class="data-miaos">');
            carHtml.push('<div class="xin-box">');
            carHtml.push('<p>');
            var importance = "0";
            //	var importance = msg.importance;
            if (importance == "5") {
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
            }
            if (importance == "4") {
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span class="qian"></span>');
            }
            if (importance == "3") {
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span class="qian"></span>');
                carHtml.push('<span class="qian"></span>');
            }
            if (importance == "2") {
                carHtml.push('<span></span>');
                carHtml.push('<span></span>');
                carHtml.push('<span class="qian"></span>');
                carHtml.push('<span class="qian"></span>');
                carHtml.push('<span class="qian"></span>');
            }
            if (importance == "1") {
                carHtml.push('<span></span>');
                carHtml.push('<span class="qian"></span>');
                carHtml.push('<span class="qian"></span>');
                carHtml.push('<span class="qian"></span>');
                carHtml.push('<span class="qian"></span>');
            }
            carHtml.push('</p>');

            if (msg.actual_price != null && msg.actual_price != "") {
                carHtml.push('<i class="announce-stadus announce-ac3">已公布</i>');
            } else {
                var fiveDate = addHours(new Date(), 15);
                var nowD = new Date();
                if (new Date(msg.publish_time).getTime() >= nowD.getTime() && new Date(msg.publish_time).getTime() <= new Date(fiveDate).getTime()) {
                    carHtml.push('<i class="announce-stadus announce-ac1">即将公布</i>');
                } else {
                    carHtml.push('<i class="announce-stadus announce-ac2">未公布</i>');
                }

            }


            carHtml.push('</div>');
            var predictedValue = msg.survey_price;
            carHtml.push('<h3 class="data-sj-tt">' + msg.fx_title + '</h3>');
            let pp_message = msg.previous_price;
            let pv_message = predictedValue;
            let ap_message = msg.actual_price;
            if (pp_message == null) { pp_message = '--'; }
            if (pv_message == null) { pv_message = '--'; }
            if (ap_message == null) { ap_message = '--'; }

            carHtml.push('<p>前值: <span>' + pp_message + '</span> 　预测值: <span>' + pv_message + '</span> &nbsp;&nbsp 公布值: <span>' + ap_message + '</span></p>');
            //var descitionArr = msg.descition.split(',');
            var descitionArr = [];
            //判断是否显示实际影响
            if (msg.actual_price != null && msg.actual_price != "") {
                //"previous_price": "17147", "survey_price": null, "actual_price": null
                var count2 = "";
                var color2 = "sp-ld";
                if (msg.fx_unit == 'Greece') {
                    count2 = "no";
                }
                for (var arr = 0; arr < descitionArr.length; arr++) {
                    var splitArr = descitionArr[arr].split('_');
                    for (var k = 0; k < splitArr.length; k++) {
                        if (k == 3) {
                            if (splitArr[k] == 'GOOD') {
                                carHtml.push('利多');

                            } else if (splitArr[k] == 'BAD') {
                                carHtml.push('利空');
                                color2 = "sp-lk";

                            } else if (splitArr[k] == 'FLAT') {
                                carHtml.push('持平');
                                count2 = "no";
                                color2 = "sp-cp";

                            } else if (splitArr[k] == 'U') {
                                carHtml.push('');
                                count2 = "no";
                            }
                        }
                    }
                }

                if (count2 != "no") {
                    carHtml.push('<p class="data-sj-yuq data-no-text" style="display:none">');
                    carHtml.push('<span class="' + color2 + '">');
                }
                if (count2 != "no") {
                    for (var arr = 0; arr < descitionArr.length; arr++) {
                        var splitArr = descitionArr[arr].split('_');
                        for (var k = 0; k < splitArr.length; k++) {
                            if (k == 3) {
                                if (splitArr[k] == 'GOOD') {
                                    carHtml.push('利多');

                                } else if (splitArr[k] == 'BAD') {
                                    carHtml.push('利空');

                                } else if (splitArr[k] == 'FLAT') {
                                    carHtml.push('持平');

                                } else if (splitArr[k] == 'U') {
                                    carHtml.push('');

                                }
                            }

                        }
                    }

                    //carHtml.push('<s>|</s>');
                    carHtml.push('');
                    for (var arr = 0; arr < descitionArr.length; arr++) {
                        var splitArr = descitionArr[arr].split('_');
                        for (var k = 0; k < splitArr.length; k++) {
                            if (k == 0) {

                                if (splitArr[k] == 'WH') {
                                    if (msg.publish_org.indexOf("德国") != -1 || msg.publish_org.indexOf("法国") != -1) {
                                        carHtml.push('欧元 ');
                                    } else {

                                        carHtml.push(msg.fx_unit);
                                    }
                                } else if (splitArr[k] == 'PM') {
                                    carHtml.push('金银');

                                } else if (splitArr[k] == 'YY') {
                                    carHtml.push('原油');

                                }

                            }


                        }
                    }
                } else {
                    carHtml.push('---');
                }
                if (count2 != "no") {
                    carHtml.push('</span>');
                    carHtml.push('</p>');
                }
            } else {

                //预期影响
                var count = "";
                var color = "sp-ld";
                if (msg.fx_unit == 'Greece') {
                    count = "no";
                }
                for (var arr = 0; arr < descitionArr.length; arr++) {
                    var splitArr = descitionArr[arr].split('_');
                    for (var k = 0; k < splitArr.length; k++) {
                        if (k == 2) {
                            if (splitArr[k] == 'GOOD') {
                                carHtml.push('利多');

                            } else if (splitArr[k] == 'BAD') {
                                carHtml.push('利空');
                                color = "sp-lk";

                            } else if (splitArr[k] == 'FLAT') {
                                carHtml.push('持平');
                                color = "sp-cp";
                                count = "no";

                            } else if (splitArr[k] == 'U') {
                                carHtml.push('');
                                count = "no";
                            }
                        }

                    }
                }
                if (count != "no") {
                    carHtml.push('<p class="data-sj-yuq" style="display:none">预期');
                    carHtml.push('<span class="' + color + '">');
                }
                if (count != "no") {
                    for (var arr = 0; arr < descitionArr.length; arr++) {
                        var splitArr = descitionArr[arr].split('_');
                        for (var k = 0; k < splitArr.length; k++) {
                            if (k == 2) {
                                if (splitArr[k] == 'GOOD') {
                                    carHtml.push('利多');

                                } else if (splitArr[k] == 'BAD') {
                                    carHtml.push('利空');

                                } else if (splitArr[k] == 'FLAT') {
                                    carHtml.push('持平');

                                } else if (splitArr[k] == 'U') {
                                    carHtml.push('');
                                    // count = "no";
                                }
                            }

                        }
                    }

                    //carHtml.push('<s>|</s>');
                    carHtml.push('');
                    for (var arr = 0; arr < descitionArr.length; arr++) {
                        var splitArr = descitionArr[arr].split('_');
                        for (var k = 0; k < splitArr.length; k++) {
                            if (k == 0) {
                                if (predictedValue != "" && predictedValue != null && predictedValue != "---") {
                                    if (splitArr[k] == 'WH') {
                                        if (msg.publish_org.indexOf("德国") != -1 || msg.publish_org.indexOf("法国") != -1) {
                                            carHtml.push('欧元区 ');
                                        } else {

                                            carHtml.push(msg.fx_unit);
                                        }
                                    } else if (splitArr[k] == 'PM') {
                                        carHtml.push('金银');

                                    } else if (splitArr[k] == 'YY') {
                                        carHtml.push('原油');

                                    }
                                } else {
                                    carHtml.push('---');
                                }
                            }


                        }
                    }
                } else {
                    carHtml.push('---');
                }
                if (count != "no") {
                    carHtml.push('</span>');
                    carHtml.push('</p>');
                }
            }




            carHtml.push('</div>');
            carHtml.push('</div>');
            carHtml.push('</a>');
            carHtml.push('</li>');

        }
        carHtml.push('</ul>');
    } else {
        carHtml.push('');
    }

    return carHtml;
}









$.datepicker.regional['zh-TW'] = {
    dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    prevText: "上月",
    nextText: "次月",
    weekHeader: "週"
};
$.datepicker.setDefaults($.datepicker.regional["zh-TW"]);

$(function() {

    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        minDate: -60,
        maxDate: 15,
        onSelect: function() {
            var dateObject = new Date($(this).datepicker('getDate'));
            var dataStr = dateObject.Format("yyyy-MM-dd");
            window.location.href = '/zh/calendar/index.html?date=' + dataStr + "&" + app_url + "#" + $("#changeDateValue").val();
            // window.location.href = STATIC_MOBILE_URL + '/zh/calendar/' + dataStr + ".html" + app_url + "#" + $("#changeDateValue").val();
            $(".cat_menu_icon span.l_icon").click();
        }

    });

    var time = href_html.split("-");
    var year = time[0];
    var mou = time[1];
    var day = time[2];
    $("#datepicker").datepicker("setDate", mou + '/' + day + '/' + year);
    $(".ui-state-active").css({
        background: "#007fff"
    })
});


$(function() {
    $(".data_list").on("swipeleft", swipeleftHandler);

    function swipeleftHandler(event) {
        //alert("left");
        var menu_index = $(".cat_menu ul li.selected").index();
        menu_index++;
        $(".cat_menu ul li:eq(" + menu_index + ")").click();
    }

    $(".data_list").on("swiperight", swiperightHandler);

    function swiperightHandler(event) {
        //alert("right");
        var menu_index = $(".cat_menu ul li.selected").index();
        menu_index--;
        $(".cat_menu ul li:eq(" + menu_index + ")").click();
    }
});


$(function() {
    $("#week_list").on("swipeleft", swipeleftHandler);

    function swipeleftHandler(event) {
        week_change('next');
    }

    $("#week_list").on("swiperight", swiperightHandler);

    function swiperightHandler(event) {
        week_change('back');
    }
});



function show_filter(this_class, this_object) {
    $(".filter_popup").fadeOut();
    $(".cat_menu_icon span").not(this_object).removeClass('selected');
    if (!this_object.hasClass('selected')) {

        this_object.addClass('selected');
        $("." + this_class).fadeIn();
        $(".cat-date-today").attr("href", "/zh/calendar/index.html" + app_url + "#" + $("#changeDateValue").val());
        //$(".shadow2").show();
        // $(".shadow").removeClass("dn");
    } else {
        this_object.removeClass('selected');
        $("." + this_class).fadeOut();
        //$(".shadow2").hide();
    }

}


function cat_change(cat_data) {
    $(".cat_menu ul li").removeClass('selected');
    $(".cat_menu ul li[data=" + cat_data + "]").addClass('selected');
    $("#changeDateValue").val(cat_data);
    if (cat_data == "event") {
        // dataPosTop();
        //$("body,html").animate({scrollTop:0},1000);
    }

    $(".data_list article[data=" + cat_data + "]").removeClass().addClass("data_list_content swiper-slide").siblings("article").removeClass().addClass("data_list_content swiper-slide dn");
}



var now_week = 0;
var backCount = 0;
var backCount1 = 0;
var nextCount = 0;
var nextCount1 = 0;

function week_change(show_week, dates) {

    var this_class = "";
    if (show_week == "back") {
        now_week--;
        this_class = "left_fadeIn";
        backCount1++;
        if (backCount < 1) {
            backCount++;
        } else {
            $(".l_btn").attr("onClick", "").hide();
        }
    }
    if (show_week == "next") {
        this_class = "right_fadeIn";
        now_week++;
        nextCount1++;
        if (nextCount < 1) {
            nextCount++;
        } else {
            $(".r_btn").attr("onClick", "").hide();
        }
    }
    var curr = "";
    var dt_to = $.datepicker.formatDate('yy-mm-dd', new Date());
    if (dates === undefined || dates == "") {
        //curr = new Date();
        curr = new Date(href_html.replace(/-/g, "/"));
    } else {
        curr = new Date(dates.replace(/-/g, "/"));
        //curr = new Date(dates);
    }

    var new_day_1 = 0;
    var new_day_7 = 0;
    var day_set = curr.getDate() - curr.getDay();
    day_set = parseInt(day_set + (now_week * 7));
    var new_day1 = new Date(curr.setDate(day_set));


    //alert(new_day1);
    new_day_1 = new Date(curr.setDate(day_set));
    var new_day2 = new Date(new_day1);
    new_day2.setDate(new_day2.getDate() + 1);
    var new_day3 = new Date(new_day1);
    new_day3.setDate(new_day3.getDate() + 2);
    var new_day4 = new Date(new_day1);
    new_day4.setDate(new_day4.getDate() + 3);
    var new_day5 = new Date(new_day1);
    new_day5.setDate(new_day5.getDate() + 4);
    var new_day6 = new Date(new_day1);
    new_day6.setDate(new_day6.getDate() + 5);
    var new_day7 = new Date(new_day1);
    new_day7.setDate(new_day7.getDate() + 6);
    new_day_7 = new Date(new_day_1);
    new_day_7.setDate(new_day_7.getDate() + 6);
    var add_day = {};
    add_day[0] = new_day1;
    add_day[1] = new_day2;
    add_day[2] = new_day3;
    add_day[3] = new_day4;
    add_day[4] = new_day5;
    add_day[5] = new_day6;
    add_day[6] = new_day7;


    var dates1 = new_day_1.setDate(new_day_1.getDate() - 7);
    var dates2 = new_day_7.setDate(new_day_7.getDate() + 7);
    var datesback = 0;
    var datesnext = 0;
    var datesback2 = 0;
    var datesnext2 = 0;

    if (show_week == "back") {
        datesback = new_day_1.setDate(new_day_1.getDate() - 7);
        datesnext = new_day_7.setDate(new_day_7.getDate() - 7);
    }
    if (show_week == "next") {
        datesback2 = new_day_1.setDate(new_day_1.getDate() + 7);
        datesnext2 = new_day_7.setDate(new_day_7.getDate() + 7);
    }
    if (new_day_1 <= new Date() && new Date() <= new_day_7) {
        backCount = 0;
        nextCount = 0;
        $(".l_btn").attr("onClick", "week_change('back')").show();
        $(".r_btn").attr("onClick", "week_change('next')").show();
    } else if (dates1 >= datesback && dates1 <= datesnext) {
        nextCount = 0;
        $(".r_btn").attr("onClick", "week_change('next')").show();
    } else if (dates2 >= datesback2 && dates2 <= datesnext2) {
        backCount = 0;
        $(".l_btn").attr("onClick", "week_change('back')").show();
    }

    var month_list = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

    var this_month = add_day[3].getMonth();
    $("#month_list p:eq(0) span").text(month_list[this_month]);
    $("#month_list p:eq(1) span").text(month_list[this_month + 1]);

    $("#month_list").attr("class", "");
    $("#week_list li").hide().attr("class", "");
    $("#week_list li").addClass(this_class);
    jQuery.each(add_day, function(i, this_val) {
        var this_day = this_val.getDate();
        if (this_day < 10) {
            this_day = '0' + this_day;
        }

        $("#week_list li:eq(" + i + ") b").text((this_val.Format('MM')) + "." + this_day);
        $("#week_list li:eq(" + i + ")").attr("data", this_val).fadeIn();
        if (this_day < 2) {
            $("#month_list").addClass("new_month" + i);
        }
        var dataStr = this_val.Format("yyyy-MM-dd");
        console.log(dataStr + ";" + href_html);
        //后退和向前选中
        if (dataStr == href_html) {
            $("#week_list li:eq(" + i + ")").attr("class", "selected");
        }
        console.log(this_day);
        if (this_day < 2) {
            $("#month_list").addClass("new_month" + i);
        }
    });
}


function dataPosTop() {
    /*    var cenHei1 = $("#header,#head2,#head3").height(),
    		cenHei2 = $(".chart-header-box").innerHeight(),
    		cenHei3 = $(".data-shuj-atop").height(),
    		cenHei4 = $(".shuj-done-fon").innerHeight(),
    		cenHei5 = $(".data-shuj-box li").innerHeight(),
    		cenHeightAll = cenHei1+cenHei2+cenHei3+cenHei3-35,
    		cenHeightAll2 = cenHei1+cenHei2+cenHei4-cenHei5-50,
    		blankHeight = cenHei3-2,
    		liLenght = $(".data-shuj-atop > ul").length,
    		cenHeightTop = cenHei1+cenHei2-3;
    	console.log(cenHeightAll+"===="+liLenght);
    	if(liLenght < 1){
    		$("body,html").animate({scrollTop:cenHeightAll2},1000);
    		$(".app-top-h3").hide();
    	}else{
    		$("body,html").animate({scrollTop:cenHeightAll},1000);
    		$(".app-top-h3").css("height",blankHeight);
    		$(".shuj-future-fon").css("top",cenHeightTop);
    	}
    	*/
    console.log(345435);
    var cenHei1 = $("#header,#head2,#head3").height(),
        cenHei2 = $(".chart-header-box,.chart-mheader-box").innerHeight(),
        cenHei3 = $(".shuj-future-fon").innerHeight(),
        cenHei4 = $(".shuj-done-fon").innerHeight(),
        cenHei5 = $(".data-shuj-box li").innerHeight(),
        cenHeightAll = cenHei1 + cenHei2 + cenHei4 - 30,
        cenHeightAll2 = cenHei1 + cenHei2 + cenHei4 - cenHei5 - 50,
        blankHeight = cenHei3 - 2,
        liLenght = $(".data-shuj-atop > ul").length,
        cenHeightTop = cenHei1 + cenHei2 - 3;
    if (liLenght < 1) {
        //		$("body,html").animate({ scrollTop: cenHeightAll2 }, 1000);
        $(".app-top-h3").hide();
    } else {
        //		$("body,html").animate({ scrollTop: cenHeightAll }, 1000);
        $(".app-top-h3").css("height", blankHeight);
        $(".shuj-future-fon").css("top", cenHeightTop);
    }
}
/**	  
 * 当前日期加上分钟
 * @param date
 * @param value
 * @returns
 */
function jianMinus(date, value) {
    date.setMinutes(date.getMinutes() - value);
    return date;
}
//app提醒层
function apptick(id, title, dates) {
    console.log(id + "," + title + "," + dates);
    $(".app-tips-box2").fadeIn();
    $("#app_no").val(id);
    $("#app_title").val(title);
    $("#app_time").val(dates);
    $("#app_re_time").val(dates);
    var tiTime = $("#tiTime").val();
    var finDates = dates.replace(/-/g, "/");
    finDates = new Date(finDates);
    var jianMinusS = jianMinus(finDates, tiTime).Format("yyyy-MM-dd HH:mm:ss");
    //界面上展示时间
    $("#tixing").html(jianMinusS);
    //提前多少分钟
    // $("#tiTime").val(jianMinusS);
}

//m提醒层
function mtick() {
    $(".app-tips-box1").fadeIn();
}



//获取id cookie
function setCookie_index(name, value) {
    //s20是代表20秒
    //h是指小时，如12小时则是：h12
    //d是天数，30天则：d30 
    var strsec = setNickExpiryTime("m1440");
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    if (typeof(value) != "undefined") {
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    }
}

//获取Cookie，获取cookie状态
function getCookie(name) {

    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }


}

//cookie失效时间
function setNickExpiryTime(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    } else if (str2 == "m") {
        return str1 * 60 * 1000;
    } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}

//删除cookies 
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
//处理查询条件
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}