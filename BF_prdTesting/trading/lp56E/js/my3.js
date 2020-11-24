
//判断是否是pc
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * 解析URL
 * @param url
 * @returns {Array}
 */
function parseUrl(url){
    var result = {};
    var query = url.split("?")[1];
    if(query){
        var queryArr = query.split("&");
        queryArr.forEach(function(item){
            result[item.split("=")[0]] = item.split("=")[1];
        });
    }
    return result;
}

//验证手机号码准确性
function checkTel(tel) {
    var myreg = /^1\d{10}$/;
    if (!myreg.test(tel)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 保存数据
 * @param name
 * @param tel
 * @param code
 */
function saveData(name, tel, code, conversion){
    //=============浏览器相关数据===================//
    var equipment = IsPC()?"PC":"YD";//设置登录类型
    var urltemp = location.href;//当前页面
    var beforurl = document.referrer;//入口页面
    var sourceparam = "";//来源类型 后台计划
    var planparam = "";//计划 后台计划
    var unitparam = "";//单元 后台计划
    var typevar = "";//推广平台
    var key = "";//推广关键字
    var lp = "";//上一个页面的搜索关键词
    if(urltemp){
        var urltempres = parseUrl(urltemp);
        sourceparam = urltempres.pid;//推广来源 又后台推广计划传递过来
        planparam = urltempres.plan;//推广计划
        unitparam = urltempres.unit;//推广单元
        key = urltempres.key;//推广关键词
    }

    if (beforurl) {
        var result = parseUrl(beforurl);
        if ((beforurl.indexOf("www.so.com") != -1) || (beforurl.indexOf("m.so.com") != -1)) {
            typevar = "360";
            lp = result.q;
        } else if ((beforurl.indexOf("www.sogou.com") != -1)) {
            typevar = "搜狗";
            lp = result.query;
        } else if ((beforurl.indexOf("wap.sogou.com") != -1) || (beforurl.indexOf("m.sogou.com") != -1)) {
            typevar = "搜狗";
            lp = result.keyword;
        } else if((beforurl.indexOf("www.uc.cn") != -1)){
            typevar = "神马";
            lp = result.keyword;
        } else if((beforurl.indexOf("m.sm.cn") != -1)){
            typevar = "神马";
            lp = result.q;
        }else if((beforurl.indexOf("www.baidu.com") != -1)){
            typevar = "百度";
            lp = result.wd;
        } else if((beforurl.indexOf("m.baidu.com") != -1) || (beforurl.indexOf("wap.baidu.com") != -1)){
            typevar = "百度";
            lp = result.word;
        } else {
            typevar = "未知平台";
        }
    }
    //=============浏览器相关数据===================//
    $.ajax({
        url: ctx + "wx3/savezc",
        data : {
            isOpenAccount : 2,
            isRecharge: 2,
            intention: 1,
            username: name,
            telNum: tel,
            code: code,
            type: sourceparam,
            cip: lc,
            from: typevar,
            lp: lp,
            key: key,
            unit: unitparam,
            plan: planparam,
            equipment: equipment,
            conversion: conversion,
            url: urltemp
        }
        , success: function (resp) {
            if (resp.code == 0) {
                alert(resp.msg);
                if(IsPC()){
                    $("#code").css("display", "block");
                    $(".close-btn").click(function () {
                        $("#code").css("display","none");
                        location.reload();//注册成功之后刷新当前页面
                    })
                }else{
                    location.href="https://global.tigerwit.live/cndownload";
                }
            } else {
                alert(resp.msg);
            }
        }
        , error: function () {
            alert("服务器异常");
            $("input").val("");//清空所有的input
        }
    });
}

var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?7a8b8e92a3739274ac4533da3ec13f55";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

