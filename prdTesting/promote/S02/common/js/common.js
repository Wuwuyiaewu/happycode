var commons = {
    //获取当前url
    href: function() {
        return window.location.href;
    },
    splitUTM: function(sourec) {
        //utm_source2字符串转json字符串
        var arrLast = "";
        if (sourec != null && sourec != "") {
            var utmzStr = sourec;
            utmzStr = utmzStr.replace("utm_source2", "utmcsr2").replace("utm_medium2", "utmcmd2").replace("utm_campaign2", "utmccn2").replace("utm_content2", "utmcct2").replace("utm_term2", "utmctr2");
            var arr1 = "";
            var arr4 = "{";
            var arrLast = "";
            var arr0 = utmzStr.split("&");
            for (var i = 0; i < arr0.length; i++) {
                arr1 = arr0[i].split("=");
                arr4 = arr4 + (arr1[0] + ":'" + arr1[1]) + "',";
            }
            arrLast = arr4.substring(0, arr4.lastIndexOf(',')) + "}";
            return arrLast;
        }
    },
    //js获取域名
    dynamicDomainByCommonjs: function() {
        var h = pub_oa;
        /*if(h.indexOf("testweb.gwfx.com")>=0 || h.indexOf("testm.gwfx.com")>=0  || h.indexOf("testweboa.gwfx.com")>=0 || h.indexOf("test3g.gwfx.com")>=0){
            h=document.location.protocol+"//testweboa.gwfx.com";
        }else if(h.indexOf("oa.gwfx.com")>=0 || h.indexOf(".gwfx.co.uk")>=0 || h.indexOf("www.gwfx.com")>=0 || h.indexOf("m.gwfx.com")>=0 || h.indexOf("huagu.gwfx.com")>=0 ){
            h=document.location.protocol+"//oa.gwfx.com";
        }
        else if(h.indexOf("172.30.5.")>=0){
            h="http://172.30.5.21:9000";
            //h=document.location.protocol+"//testweboa.gwfx.com";
        }
        else{
            h="";
        }*/
        return h;
    },
    //适应多个域名  
    redomain: function(type) {
        var domains = "se6868.com";
        var accounts = "UA-119986524-1";
        var temp = "";
        var doHref = window.location.host;

        if (doHref.indexOf("se6868.com") != -1) {
            domains = "se6868.com";
            accounts = "UA-119986524-1";
        } else if (doHref.indexOf("se6868.cn") != -1) {
            domains = "se6868.cn";
            accounts = "UA-119986524-2";
        } else if (doHref.indexOf("se6868.co") != -1) {
            domains = "se6868.co";
            accounts = "UA-119986524-3";
        } else if (doHref.indexOf("se6868.org.cn") != -1) {
            domains = "se6868.org.cn";
            accounts = "UA-119986524-4";
        } else if (doHref.indexOf("se6868.net") != -1) {
            domains = "se6868.net";
            accounts = "UA-119986524-5";
        } else if (doHref.indexOf("se6868.top ") != -1) {
            domains = "se6868.top ";
            accounts = "UA-119986524-6";
        } else if (doHref.indexOf("se6868.online") != -1) {
            domains = "se6868.online";
            accounts = "UA-119986524-7";
        } else if (doHref.indexOf("se6868.site") != -1) {
            domains = "se6868.site";
            accounts = "UA-119986524-8";
        }
        //传入1，返回域名，传入2，返回唯一标识符
        if (type == "1") {
            temp = domains;
        } else if (type == "2") {
            temp = accounts;
        }
        return temp;
    },
    /**
     * 处理ga字符串，返回解析后的数字
     * @param gaStr
     */
    dealGaNew: function(gaStr) {
        var _c_json = '{';
        try {
            gaStr = gaStr.substring(gaStr.indexOf("utmcsr"), gaStr.length);
            var _c_length = gaStr.split("\|").length;
            for (i = 0; i < _c_length; i++) {
                var _temp = gaStr.split("\|")[i];
                var _temp_index = _temp.split("=")[0];
                var _tempCsr = _temp.split("=")[1];
                if (_temp_index == "utmcsr" && _tempCsr == "") {
                    _tempCsr = "not set";
                }
                if (_temp_index == "utmcmd" && _tempCsr == "") {
                    _tempCsr = "not set";
                }
                _c_json = _c_json + '"' + _temp_index + '":' + '"' + _tempCsr + '"';
                if (i != _c_length - 1) {
                    _c_json += ","
                }
            }

        } catch (e) {
            _c_json = "}";
        }

        return _c_json + "}";
    },
    /**
     * 是否是成功页面
     * @param href
     */
    isSuccess: function(href) {
        var isSu = ["Success.html", "Sucess-2.html", "ibclientperAccount", "succ.html", "success.html"];
        var flag = false;

        if (href != null && href != "") {
            for (var i = 0; i < isSu.length; i++) {

                if (href.indexOf(isSu[i]) != -1) {
                    flag = true;
                }
            }
        }
        return flag;

    },
    /**
     * 通用ajax方法
     * @param url
     * @param params
     * @param callback
     * @param async
     * @returns
     */
    getJson: function(url, params, callback, async, failCallBack) {
        var result = null;
        $.ajax({
            url: url,
            type: "POST",
            timeout: 100000, //超时时间设置，单位毫秒
            cache: false,
            async: (async != undefined ? async : (callback ? true : false)), //默认为异步(true),false则为同步
            dataType: 'jsonp',
            jsonp: "callbackFun",
            data: params,
            success: typeof(callback) == "function" ? callback : function(data) {
                result = data;
            },
            error: function(obj, textStatus) {
                if (typeof(failCallBack) == "function") {
                    failCallBack(textStatus);
                } else {
                    if (login.isValid(obj.responseText) && obj.statusText != "OK") {
                        console.error(obj.responseText);
                    } else {
                        console.error("请求超时,请重试:url[%s]", url);
                    }
                }
            }
        });
        return result;
    },
    /**
     * 判断是否为null或空字符串
     */
    IsNullorUndefined: function(v) {
        if ((v != null && typeof(v) != "undefined" && $.trim(v) != "")) {
            return true;
        }
        return false;
    },
    /**
     * 设置GA cookie值并录入值
     * behaviorType 行为类型 访问(1)、咨询(2)
     * advisoryType 咨询类型 qq或者live800 1表示qq 2表示live800
     */
    getGacookiesTrack: function(options) {
        try {

            var _options = options || {};
            var nowCval = _options.nowCval;
            var behaviorType = _options.behaviorType;
            var advisoryType = _options.advisoryType;

            var explorer = window.navigator.userAgent;
            var deviceId = "";
            try {
                setMobileDeviceAppRequestCookie();
                var shebeiCookieVals = deviceId_getCookie("deviceId");
                if (commons.IsNullorUndefined(shebeiCookieVals)) {
                    deviceId = shebeiCookieVals;
                }
            } catch (e) {
                console.log("get deviceId error!!!");
            }

            //user_id设置放入到ga.js外面，则不需要依赖于google analytics的加载
            var c = userId(nowCval);
            $("#falshcookiesTrack").val(c);
            _gaq.push(function() {
                var tracker = _gat._getTrackerByName();
                var linkerUrl = tracker._getLinkerUrl('https://gts2admin.' + commons.redomain("1") + '/LoginForex');
                linkerUrl = linkerUrl.substring(linkerUrl.indexOf("?"), linkerUrl.length);
                if (null != $("#gacookies") && "" == $("#gacookies").val()) {
                    $("#gacookies").val(linkerUrl);
                }

                $("#gacookiesTrack").val(linkerUrl);
                $("#gacookiesTrackDemo").val(linkerUrl);
                linkerUrl = linkerUrl.substring(linkerUrl.indexOf("__utmz"));
                linkerUrl = linkerUrl.substring(0, linkerUrl.indexOf("&"));
                var gacookiesTrack = linkerUrl;
                var behavior_type = behaviorType; //行为包括：访问(1)、咨询(2)、模拟开户(3)、真实开户(4)、首次入金(5) advisoryType：咨询类型 qq或者live800 1表示qq 2表示live800
                //得到IP链接
                var url = commons.dynamicDomainByCommonjs() + '/ajax/getIps?callback=ip';
                //获取ip和sessionId
                var ips = "";
                var sessionId = "";
                var data = null;
                //标识是手机还是pc访问，0和空代表pc访问，1代表手机访问（默认为0）
                var platformType = "1";
                //判断是否LP访问
                if (commons.href().indexOf(pub_pc) != -1 ||
                    href.indexOf(pub_oa) != -1) {
                    platformType = "0";
                }

                var myDate = new Date();
                //解析ga代码
                var gaData = commons.dealGaNew(gacookiesTrack);
                var referrer = document.referrer;
                var browser = navigator.userAgent || "";

                var obj = eval('(' + gaData + ')');


                /*  $.getJSON(url, function(datas){ 
                     ips = datas.ips;
                     sessionId = datas.sessionId;
                   var _maq = _maq || [];
                     //session->
                   _maq.push(['_setSessionId',sessionId]); 
                   //事业部-->
                   _maq.push(['_setBusinessPlatform', '1']);
                   //用户唯一标识（有状态）-->
                   _maq.push(['_setUserId', c]);  
                   //平台版本-->
                   _maq.push(['_setPlatformVersion', 'V2.1.1']);
                   //用户标识-->
                   _maq.push(['_setDeviceId', deviceId]);
                   //事件类型-->
                   _maq.push(['_setBehaviorType', behavior_type]);
                   //业务平台-->
                   _maq.push(['_setPlatformName', '外汇网站']);
                   _maq.push(['_setPlatformType', platformType]);
                   _maq.push(['_setlogType', '1']);//1网站，2直播间
                   _maq.push(['_setAdvisoryType',advisoryType]);
                   _maq.push(['_setUrl',commons.href()]);
                   _maq.push(['_setIp',ips]);
                   _maq.push(['_setBrowser',browser]);
                   _maq.push(['_setPrevUrl',referrer]);
                   _maq.push(['_setUtmctr',obj.utmctr || "(direct)"]);
                   _maq.push(['_setUtmccn',obj.utmccn || "(direct)"]);
                   _maq.push(['_setUtmcct',obj.utmcct || ""]);
                   _maq.push(['_setUtmcmd',obj.utmcmd || "(none)"]);
                   _maq.push(['_setUtmcsr',obj.utmcsr || "(direct)"]);
                   _maq.push(['_setUtmctr2',_options.utmctr2 || "(direct)"]);
                   _maq.push(['_setUtmccn2',_options.utmccn2 || "(direct)"]);
                   _maq.push(['_setUtmcct2',_options.utmcct2 || ""]);
                   _maq.push(['_setUtmcmd2',_options.utmcmd2 || "(none)"]);
                   _maq.push(['_setUtmcsr2',_options.utmcsr2 || "(direct)"]);
                   var eventCategory = _options.eventCategory || "";
                   var eventAction = _options.eventAction || "";
                   var eventLabel = _options.eventLabel || "";
                   var behaviorDetail = _options.behaviorDetail || "";
                   _maq.push(['_setEventCategory',eventCategory]);
                   _maq.push(['_setEventAction',eventAction]);
                   _maq.push(['_setEventLabel',eventLabel]);
                   _maq.push(['_setBehaviorDetail',behaviorDetail]);
                   setGWAnalysisParams(_maq);
                 });*/

            });

        } catch (e) {

        }
    }
};

/**
 * 判断浏览器访问属于什么访问
 */
var browser = {
    versions: function() {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核 
            presto: u.indexOf('Presto') > -1, //opera内核 
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端 
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器 
            iPad: u.indexOf('iPad') > -1, //是否iPad 
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
        };
    }()
};
$(function() {
    var requestParams = $("#requestParams").val();
    var ssd = "";
    var objUtm = "";
    if (commons.IsNullorUndefined(requestParams)) {
        ssd = commons.splitUTM(requestParams);
        objUtm = eval('(' + ssd + ')');
    }
    var myuuids = UUID.prototype.createUUID();
    var accountNo = $("#accountNo").val();
    var behaviorDetail = "";
    var behaviorType = "1"; //代表访问/^8[0-9]+$/g.test(accountNo) && /^(90|92|95)[0-9]+$/g.test(accountNo)
    if (commons.isSuccess(href) || commons.IsNullorUndefined(accountNo)) {
        behaviorType = "4";
        behaviorDetail = accountNo;
    }
    if (commons.isSuccess(href) && href.indexOf("demoAccountSuccess") != -1 || href.indexOf("accountSuccess") != -1) {
        behaviorType = "3";
    }
    //真实场需要去掉下面代码
    var h = window.location.href;
    //if(h.indexOf("www.gwfx.com")>=0 || h.indexOf("m.gwfx.site")>=0  || h.indexOf("www.gwfx.site")>=0 || h.indexOf("m.gwfx.hk")>=0  || h.indexOf("oa.gwfx.com")>=0 || h.indexOf("m.gwfx.com")>=0 || h.indexOf("oa.gwfx.hk")>=0  || h.indexOf("m.gwfx.online")>=0){
    console.log("real");
    commons.getGacookiesTrack({ nowCval: myuuids, advisoryType: "", behaviorType: behaviorType, behaviorDetail: behaviorDetail, utmcsr2: objUtm.utmcsr2, utmcmd2: objUtm.utmcmd2, utmccn2: objUtm.utmccn2, utmcct2: objUtm.utmcct2, utmctr2: objUtm.utmctr2 });
    //}


});
//////////////////今日头条//////////////////
/*
 *获取cookie中的__utmz参数
 **/
function get_utmz() {
    var name = '__utmz';
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    var _utmz = '';
    if (arr != null) {
        var _utmz = unescape(arr[0]);
    }
    return _utmz;
}

//头条代码
try {
    //只加入nzMobileAccount*.html
    var get_utm = get_utmz();
    console.log(get_utm + ":");
    if (get_utm.indexOf('mf33') !== -1 && (window.location.href.indexOf('nzMobileAccount') > -1)) {
        console.log("jinri into");
        (function(root) {
            root._tt_config = true;
            var ta = document.createElement('script');
            ta.type = 'text/javascript';
            ta.async = true;
            ta.src = document.location.protocol + '//' + 's1.pstatp.com/bytecom/resource/track_log/src/toutiao-track-log.js';
            ta.onerror = function() {
                var request = new XMLHttpRequest();
                var web_url = window.encodeURIComponent(window.location.href);
                var js_url = ta.src;
                var url = '//ad.toutiao.com/link_monitor/cdn_failed?web_url=' + web_url + '&js_url=' + js_url + '&convert_id=93627063624';
                request.open('GET', url, true);
                request.send(null);
            }
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ta, s);
        })(window);

        (function(root) {
            root._tt_config = true;
            var ta = document.createElement('script');
            ta.type = 'text/javascript';
            ta.async = true;
            ta.src = document.location.protocol + '//' + 's1.pstatp.com/bytecom/resource/track_log/src/toutiao-track-log.js';
            ta.onerror = function() {
                var request = new XMLHttpRequest();
                var web_url = window.encodeURIComponent(window.location.href);
                var js_url = ta.src;
                var url = '//ad.toutiao.com/link_monitor/cdn_failed?web_url=' + web_url + '&js_url=' + js_url + '&convert_id=1601056979269694';
                request.open('GET', url, true);
                request.send(null);
            }
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ta, s);
        })(window);

    }

} catch (i) {
    console.log("set toutiao error" + i);
}