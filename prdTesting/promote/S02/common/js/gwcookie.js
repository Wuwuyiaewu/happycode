var protocol = document.location.protocol;

function UUID() {
    this.id = this.createUUID()
}
UUID.prototype.valueOf = function() {
    return this.id
};
UUID.prototype.toString = function() {
    return this.id
};
UUID.prototype.createUUID = function() {
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t, 0, 31);
    var tm = UUID.getIntegerBits(t, 32, 47);
    var thv = UUID.getIntegerBits(t, 48, 59) + '1';
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
        UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
        UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
        UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
        UUID.getIntegerBits(UUID.rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n
};
UUID.getIntegerBits = function(val, start, end) {
    var base16 = UUID.returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1))
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '')
            quadString += '0';
        else
            quadString += quadArray[i]
    }
    return quadString
};
UUID.returnBase = function(number, base) {
    return (number).toString(base).toUpperCase()
};
UUID.rand = function(max) {
    return Math.floor(Math.random() * (max + 1))
};
var href = window.location.href;
var getUserTrack = "";

//适应多个域名
var domains = "se6868.com";

var gwcookie = {
    COOKIE_NAME: 'GWAFLGPHONECOOIKETRACK',
    REP_REFERER_NAME: 'REP_REFERER_GWFX_NAME',
    setCookie: function(cval) {
        this.setHC(this.COOKIE_NAME, cval)
    },
    getCookie: function() {
        cval = this.getHC(this.COOKIE_NAME);
        if (typeof(cval) != 'undefined' && cval != null && cval != '') {
            this.setCookie(cval)
        }
        return cval
    },
    setReq_refererCookie: function(cval) {
        if (typeof(cval) != "undefined") {
            var exp = new Date(); //获得当前时间   
            exp.setTime(exp.getTime() + 30 * 60 * 1000); //换成毫秒 (半小时) 
            document.cookie = this.REP_REFERER_NAME +
                '=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/;domain=.' + domains;
            document.cookie = this.REP_REFERER_NAME +
                '=' +
                escape(cval) +
                '; expires=' + exp.toGMTString() + '; path=/;domain=.' + domains;
        }
    },
    getReq_refererCookie: function() {
        return this.getHC(this.REP_REFERER_NAME);
    },
    setHC: function(cname, cval) {
        if (typeof(cval) != "undefined") {
            document.cookie = cname +
                '=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/;domain=.' + domains;
            document.cookie = cname +
                '=' +
                escape(cval) +
                '; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/;domain=.' + domains;
        }
    },
    getHC: function(cname) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split(/[;&]/);
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if ($.trim(arr[0]) == $.trim(cname)) {
                return arr[1]
            }
        }
    }
};

//返回唯一值
function userId(nowCval) {
    var c = null;
    c = gwcookie.getCookie();
    if (c == null || typeof(c) == "undefined" || $.trim(c) == "") {
        gwcookie.setCookie(nowCval);
        c = nowCval;
    }
    return c;

}

/**
 * 设置GA cookie值并录入值
 * behaviorType 行为类型 访问(1)、咨询(2)
 * advisoryType 咨询类型 qq或者live800 1表示qq 2表示live800
 */
function getGacookiesTrack(options) {
    try {
        var _options = options || {};
        var nowCval = _options.nowCval;
        var behaviorType = _options.behaviorType;
        var advisoryType = _options.advisoryType;

        var c = null;
        c = gwcookie.getCookie();
        if (c == null || typeof(c) == "undefined" || $.trim(c) == "") {
            gwcookie.setCookie(nowCval);
            c = nowCval
        }
        $("#falshcookiesTrack").val(c);
        _gaq.push(function() {
            var tracker = _gat._getTrackerByName();
            var linkerUrl = tracker._getLinkerUrl('https://funds.' + getGacookiesTrack + '/LoginForex');
            linkerUrl = linkerUrl.substring(linkerUrl.indexOf("?"), linkerUrl.length);
            var link = linkerUrl.substring(linkerUrl.indexOf("?"), linkerUrl.length);
            linkerUrl = linkerUrl.substring(linkerUrl.indexOf("__utmz"));
            linkerUrl = linkerUrl.substring(0, linkerUrl.indexOf("&"));
            var gacookiesTrack = linkerUrl;
            $("#gacookiesTrack").val(gacookiesTrack);
            $("#gacookiesTrackDemo").val(link);
            $("#demohref").val(href);
            var behavior_type = behaviorType; //行为包括：访问(1)、咨询(2)、模拟开户(3)、真实开户(4)、首次入金(5) advisoryType：咨询类型 qq或者live800 1表示qq 2表示live800
            var data = null;
            //标识是手机还是pc访问，0和空代表pc访问，1代表手机访问（默认为0）
            var platformType = "1";
            //判断是否LP访问
            if (href.indexOf("//testweb.gwfx.") != -1 ||
                href.indexOf("//www.gwfx.") != -1 ||
                href.indexOf("//testweboa.gwfx.") != -1 ||
                href.indexOf("//oa.gwfx.") != -1) {
                platformType = "0";
            }
            var myDate = new Date();
            //解析ga代码
            var gaData = dealGa(gacookiesTrack);
            var referrer = document.referrer;
            var browser = navigator.userAgent || "";
            //chaxun 接口不能使用，全部使用oa接口
            var url = commons.dynamicDomainByCommonjs() + '/ajax/getIps?callback=ip';
            //获取ip和sessionId
            var ips = "";
            var sessionId = "";
            var data = null;
            //标识是手机还是pc访问，0和空代表pc访问，1代表手机访问（默认为0）
            var platformType = "0";
            var myDate = new Date();
            //解析ga代码
            var gaData = commons.dealGaNew(gacookiesTrack);
            var referrer = document.referrer;
            var browser = navigator.userAgent || "";
            var obj = eval('(' + gaData + ')');
            var deviceId = _options.deviceId || "";
            $.getJSON(url, function(datas) {
                ips = datas.ips;
                sessionId = datas.sessionId;
                var _maq = _maq || [];
                //session->
                _maq.push(['_setSessionId', sessionId]);
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
                _maq.push(['_setlogType', '1']); //1网站，2直播间
                _maq.push(['_setAdvisoryType', advisoryType]);
                _maq.push(['_setUrl', href]);
                _maq.push(['_setIp', ips]);
                _maq.push(['_setBrowser', browser]);
                _maq.push(['_setPrevUrl', referrer]);
                _maq.push(['_setUtmctr', obj.utmctr || "(direct)"]);
                _maq.push(['_setUtmccn', obj.utmccn || "(direct)"]);
                _maq.push(['_setUtmcct', obj.utmcct || ""]);
                _maq.push(['_setUtmcmd', obj.utmcmd || "(none)"]);
                _maq.push(['_setUtmcsr', obj.utmcsr || "(direct)"]);
                _maq.push(['_setUtmctr2', _options.utmctr2 || "(direct)"]);
                _maq.push(['_setUtmccn2', _options.utmccn2 || "(direct)"]);
                _maq.push(['_setUtmcct2', _options.utmcct2 || " "]);
                _maq.push(['_setUtmcmd2', _options.utmcmd2 || "(none)"]);
                _maq.push(['_setUtmcsr2', _options.utmcsr2 || "(direct)"]);
                var eventCategory = _options.eventCategory || "";
                var eventAction = _options.eventAction || "";
                var eventLabel = _options.eventLabel || "";
                var behaviorDetail = _options.behaviorDetail || "";
                _maq.push(['_setEventCategory', eventCategory]);
                _maq.push(['_setEventAction', eventAction]);
                _maq.push(['_setEventLabel', eventLabel]);
                _maq.push(['_setBehaviorDetail', behaviorDetail]);
                setGWAnalysisParams(_maq);
            });

        });
    } catch (e) {}
}

function send(data, getUserTrack) {
    if (typeof(getUserTrack) == 'undefined' ||
        getUserTrack.indexOf('http:') == -1) {
        getUserTrack = "http://testweb.gwfx.com:8088/GwUserTrackingManager_NEW/put/insert";
        if (href.indexOf("//m.gwfx.") != -1 ||
            href.indexOf("//www.gwfx.") != -1 ||
            href.indexOf("//oa.gwfx.") != -1) {
            getUserTrack = "http://das.gwfx.com/put/insert"
        }
    }
    if (protocol.indexOf("https") != -1 && null != getUserTrack) {
        getUserTrack = getUserTrack.replace('http://', 'https://').replace('8088', '7088');
    }
    $.ajax({
        async: true,
        url: getUserTrack,
        cache: false,
        dataType: "jsonp",
        data: {
            data: data
        },
        success: function(t) {},
        error: function(t) {}
    });
}
//生成追踪数据
$(function() {
    var req_referer = $("#req_referer").val();
    var referrer = document.referrer;
    if (IsNullorUndefined(referrer) && !IsNullorUndefined(req_referer) && returnOagwfx(href, "1")) {
        $("#req_referer").val(referrer);
    } else {
        var refererCookie = gwcookie.getReq_refererCookie();
        if (IsNullorUndefined(refererCookie) && !IsNullorUndefined(req_referer) && returnOagwfx(href, "1")) {
            $("#req_referer").val(refererCookie);
        }
    }
    if (!returnOagwfx(href, "2")) {
        gwcookie.setReq_refererCookie(href)
    }
});
/**
 * 判断是否为开户第一个页面
 * type 1为开户第一个页面 ,2 为开户页面，
 */
function returnOagwfx(v, type) {
    if ("1" == type && v.indexOf("oa.gwfx.") != -1 && (v.indexOf("Account.html") != -1 || v.indexOf("demo-account") != -1 || v.indexOf("account-open") != -1)) {
        return true;
    } else if ("2" == type && v.indexOf("oa.gwfx.") != -1 && v.indexOf("ccount") != -1 && v.indexOf("Accout-types") == -1) {
        return true;
    }
    return false;
}

/**
 * 判断是否为null或空字符串
 */
function IsNullorUndefined(v) {
    if ((v != null && typeof(v) != "undefined" && $.trim(v) != "")) {
        return true;
    }
    return false;
}
/**
 * 是否是成功页面
 * @param href
 */
function isSuccess(href) {
    var isSu = ["Success.html", "Sucess-2.html", "ibclientperAccount", "succ.html"];
    var flag = false;

    if (href != null && href != "") {

        for (var i = 0; i < isSu.length; i++) {

            if (href.indexOf(isSu[i]) != -1) {
                flag = true;
            }
        }

    }
    return flag;

}


function dealGa(gaStr) {
    var _c_json = '';
    try {
        gaStr = gaStr.substring(gaStr.indexOf("utmcsr"), gaStr.length);
        _c_json = ',';
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
        _c_json = "";
    }

    return _c_json;
}