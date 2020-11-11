//如果是移动设备自动跳转移动首页
$(function(e) {
    //setMobileDeviceRequestCookie();

});

function live800Prompt(type, position) {
    window.onbeforeunload = null;
    var qqPrompt = "http://wpa.b.qq.com/cgi/wpa.php?ln=2&uin=800806834";
    //http://www.onlineservice-hk.com/k800/chatClient/chatbox.jsp?companyID=284&configID=55&jid=
    var live800Prompt = "http://www.onlineservice-hk.com/k800/chatClient/chatbox.jsp?companyID=284&configID=55&jid=";
    // 设置参数
    var accountNo = '';
    var realCompanyId = '';
    var params =
        "company_id=14" +
        "&utm_source=1" +
        "&utm_medium=1" +
        "&utm_campaign=1" +
        "&utm_term=1" +
        "&utm_content=1" +
        "&chat_type=1" +
        "&lang=" + window.navigator.language +
        "&uagent=" + encodeURIComponent(window.navigator.userAgent) +
        "&reffer=" + encodeURIComponent(window.location.href) +
        "&lastPageDesc=" + encodeURIComponent(document.title) +
        "&account_no=" + accountNo +
        "&real_co_id=" + realCompanyId;

    var liveUrl = "https://cs.se6868w.com:8188?" + params;

    if (type == 2) {
        try {
            window.open(qqPrompt, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        } catch (e) {
            window.open(qqPrompt, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        }


    } else {
        try {
            /*	var myuuids = UUID.prototype.createUUID();
            	commons.getGacookiesTrack({nowCval:myuuids,behaviorType:"2",advisoryType:"2"});
            	var live800_enterurl=live800_getCookie('live800_enterurl');
            	var urlPrex = location.href.indexOf('test') > 0 ? 'http://testweb.gwfx.com/' : 'https://www.gwfx.com/';
            	if(position && 'place_PC_bottom' === position && (location.href.indexOf('m.') > 0 || location.href.indexOf('testm.') > 0)){
            		position = 'place_wap_bottom';
            	}	
            	var live800_pagereferrer= position ? urlPrex.concat(position) : live800_getCookie('live800_pagereferrer');
            	live800Prompt=live800Prompt+"&enterurl="+live800_enterurl+"&pagereferrer="+live800_pagereferrer;
            	window.open(live800Prompt,'Live800Chatindow','height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'); 
            */
            window.open(liveUrl, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        } catch (e) {
            window.open(liveUrl);
        }
    }
}


function qqPrompt(type) {
    //注意：下面的注释不能删除
    //dynamic content: contact info edm content
    var qqPrompt = "http://wpa.b.qq.com/cgi/wpa.php?ln=2&uin=800806834";
    var live800Prompt = "http://www.onlineservice-hk.com/k800/chatClient/chatbox.jsp?companyID=284&configID=55&jid=";
    window.onbeforeunload = null;
    try {
        //追踪代码录入数据库
        var myuuids = UUID.prototype.createUUID();
        commons.getGacookiesTrack(myuuids, "2", "1");
        window.open(qqPrompt, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
    } catch (e) {
        window.open(qqPrompt, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
    }
}
//适应多个域名
var domains = "se6868.com";
var accounts = "UA-119986524-1";
var doHref = window.location.host;
if (doHref.indexOf("se6868.com") != -1) {
    domains = "se6868.com";
    accounts = "UA-119986524-1";
} else if (doHref.indexOf("se6868.cn") != -1) {
    domains = "se6868.cn";
    accounts = "UA-119986524-2";
} else if (doHref.indexOf("se6868.co") != -1) {
    domains = "se6868.co";
    accounts = "UA-119986524-1";
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
} else if (doHref.indexOf("se6868.org") != -1) {
    domains = "se6868.org";
} else if (doHref.indexOf("se6868w.com") != -1) {
    domains = "se6868w.com";
} else if (doHref.indexOf("se6868w.com") != -1) {
    domains = "se6868w.com";
} else if (doHref.indexOf("se6868b.com") != -1) {
    domains = "se6868b.com";
}

_gaq.push(['_setAccount', accounts]);
_gaq.push(['_setDomainName', domains]);
_gaq.push(['_addIgnoredRef', domains]);
_gaq.push(['_setAllowLinker', true]);
_gaq.push(['_addOrganic', 'soso', 'w']);
_gaq.push(['_addOrganic', 'sogou', 'query']);
_gaq.push(['_addOrganic', 'youdao', 'q']);
_gaq.push(['_addOrganic', 'baidu', 'word']);
_gaq.push(['_addOrganic', 'baidu', 'q1']);
_gaq.push(['_addOrganic', 'ucweb', 'keyword']);
_gaq.push(['_addOrganic', 'ucweb', 'word']);
_gaq.push(['_addOrganic', '114so', 'kw']);
_gaq.push(['_addOrganic', '360', 'q']);
_gaq.push(['_addOrganic', 'so', 'q']);
_gaq.push(['_trackPageview']);
(function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', accounts, domains);
ga('send', 'pageview');
(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' :
            'http://www') +
        '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s)
})();
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?8b810effa6d72a2a2d34467cfeed76ac";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s)
})();
/**(function(d) {
	window.bd_cpro_rtid = "rjbzn1D";
	var s = d.createElement("script");
	s.type = "text/javascript";
	s.async = true;
	s.src = location.protocol + "//cpro.baidu.com/cpro/ui/rt.js";
	var s0 = d.getElementsByTagName("script")[0];
	s0.parentNode.insertBefore(s, s0)
})(document); */
var google_conversion_id = 954627753;
if (doHref.indexOf("gwfx.hk") != -1) {
    google_conversion_id = 823288199;
}
var google_conversion_label = "M0CKCPLT0AMQjs6azgM";
var google_custom_params = window.google_tag_params;
var google_remarketing_only = true;
document.write('<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">');
document.write('</script>');
document.write('<noscript>');
document.write('<div style="display:inline;">');
document.write('<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/' + google_conversion_id + '/?value=0&amp;label=M0CKCPLT0AMQjs6azgM&amp;guid=ON&amp;script=0"/>');
document.write('</div>');
document.write('</noscript>');

function GaqPush(type, position) {
    var fileName = location.href.split("/");
    fileName = fileName.slice(fileName.length - 1, fileName.length).toString(
        String).split(".").slice(0, 1);
    _gaq.push(['_trackEvent', fileName, type, position, 1, true])
}

/**
 * Google 再营销代码的内容第二套
 */
/*
var google_conversion_id_two = 845796554;
if(doHref.indexOf("gwfx.hk")!=-1){ 
	google_conversion_id_two = 823288199;
}
var google_custom_params_two = window.google_tag_params;
var google_remarketing_only_two = true;
document.write('<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">');
document.write('</script>');
document.write('<noscript>');
document.write('<div style="display:inline;">');
document.write('<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/'+google_conversion_id_two+'/?guid=ON&amp;script=0"/>');
document.write('</div>');
document.write('</noscript>');

*/

var google_conversion_id = 823265616;
var google_custom_params = window.google_tag_params;
var google_remarketing_only = true;
document.write('<script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">');
document.write('</script>');
document.write('<noscript>');
document.write('<div style="display:inline;">');
document.write('<img height="1" width="1" style="border-style:none;" alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/' + google_conversion_id + '/?guid=ON&amp;script=0"/>');
document.write('</div>');
document.write('</noscript>');


function openWindow(link) {
    _gaq.push(function() {
        var tracker = _gat._getTrackerByName(); //add name param if needed
        if (link.target == "_blank") {
            window.open(tracker._getLinkerUrl(link.href));
        } else {
            window.location = tracker._getLinkerUrl(link.href);
        }
    });
    return false;
}

$(document).ready(function() {

    if (doHref.indexOf("gwfx.com") != -1) {
        $.expr[':'].external = function(obj) {
            return !obj.href.match(/^mailto\:/) && !obj.href.match(/^javascript\:/) && (obj.hostname != location.hostname);
        };

        $('a:external').addClass('external');
        $('a:external').click(function() {
            return openWindow(this);
        });

        $("form").submit(function() {
            if (this.action.match(location.hostname) != null && this.action.match(/^http|https\:/)) {
                _gaq.push(['_linkByPost', this]);
            }
        });
    }


});

/**
 * 保存移动设备访问时的标示cookie
 */
function setMobileDeviceRequestCookie() {
    try {
        //获取参数
        var shebeiVal = getQueryStringByName("shebei");
        //从cookie获取参数值
        var shebeiCookieVal = getCookie("shebei");
        //alert("shebeiVal:"+shebeiVal+",shebeiCookieVal:"+shebeiCookieVal);
        if (typeof(shebeiCookieVal) != 'undefined' || shebeiCookieVal != "") {
            if (typeof(shebeiVal) != 'undefined' && shebeiVal != null && shebeiVal != '') {
                setCookie("shebei", shebeiVal, 0.37); //大概1个小时
            }
        }
    } catch (e) {
        alert(e.message);
    }
}
/**
 * 设置(保存)cookie
 * @param name cookie名称
 * @param value cookie值
 * @param expDays 有效期天数
 */
function setCookie(name, value, expDays) {
    var exp = new Date(); //获得当前时间   
    exp.setTime(exp.getTime() + expDays * 24 * 60 * 60 * 1000); //换成毫秒  
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
/**
 * 获取cookie值
 * @param name cookie名称
 * @returns 返回cookie值
 */
function getCookie(name) {
    //取出cookie   
    var strCookie = document.cookie;
    //cookie的保存格式是 分号加空格 "; "  
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            return arr[1];
        }
    }
    return "";
}
/**
 * 根据参数名称获取参数值
 * @param name 参数名称
 * @returns 返回参数值
 */
function getQueryStringByName(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);

    return "";
}

function live800_getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1)
                c_end = document.cookie.length;
            return document.cookie.substring(c_start, c_end);
        }
    } else {
        return "";
    }
}

function live800_setCookie(c_name, value) {
    document.cookie = c_name + "=" + encodeURIComponent(value) + ";path=/";
}
/**
 * 设备ID get缓存
 * @param c_name
 * @param value
 */
function deviceId_getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1)
                c_end = document.cookie.length;
            return document.cookie.substring(c_start, c_end);
        }
    } else {
        return "";
    }
}

/**
 * 设备ID set缓存
 * @param c_name
 * @param value
 */
function deviceId_setCookie(c_name, value) {
    document.cookie = c_name + "=" + encodeURIComponent(value) + ";path=/";
}


/* 保存移动设备访问时的标示cookie
 */
function setMobileDeviceAppRequestCookie() {
    try {
        //获取参数
        var shebeiVal = getQueryStringByName("deviceId");
        //从cookie获取参数值
        var shebeiCookieVal = deviceId_getCookie("deviceId");
        if (typeof(shebeiCookieVal) != 'undefined' || shebeiCookieVal != "") {
            if (typeof(shebeiVal) != 'undefined' && shebeiVal != null && shebeiVal != '') {
                deviceId_setCookie("deviceId", shebeiVal);
            }
        }
    } catch (e) {
        alert(e.message);
    }
}

function live800_checkCookie() {

    var live800_enterurl = live800_getCookie('live800_enterurl');
    var live800_pagereferrer = live800_getCookie('live800_pagereferrer');
    if (live800_enterurl == null || live800_enterurl == "")

    {
        live800_enterurl = document.URL;
        live800_pagereferrer = document.referrer;
    } else {
        live800_enterurl = document.URL;
    }
    live800_setCookie('live800_enterurl', live800_enterurl);
    live800_setCookie('live800_pagereferrer', live800_pagereferrer);
}

function openLive800Window(chatUrl) {
    var live800_enterurl = live800_getCookie('live800_enterurl');
    var live800_pagereferrer = live800_getCookie('live800_pagereferrer');
    var chatURL = chatUrl + "&enterurl=" + live800_enterurl + "&pagereferrer=" + live800_pagereferrer;
    var width = "700";
    var height = "550";
    var top = (window.screen.availHeight - height) / 2;
    var left = (window.screen.availWidth - width) / 2
    try {
        window.open(chatURL, "对话窗口", "toolbar=0,scrollbars=0,location=0,menubar=0,resizable=0,left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ",titlebar=0,directories=0,status=0");
    } catch (e) {
        alert(e);
    }
}
window.onload = live800_checkCookie;