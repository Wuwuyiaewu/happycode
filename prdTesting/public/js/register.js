var authorization = "";
var appKey = 'yz352001'
    // var appKey = 'yzkey'
    // var appKey = "yzPre";

// var baseUrl = 'https://testapi.ixmiddle.com'
// var baseUrl = "https://preapi.mircoinfolab.com";

var mobileReg = /^(13|14|15|16|17|18|19)\d{9}$/;
var registerForm = document.forms["register"];
var formElements = registerForm.elements;
var requestHeaders = {
    "Content-Type": "application/json;charset=UTF-8",
    httpMethod: "post",
    rpcType: "http",
    module: "uat-account",
    method: "/account/appProperties/getAccountProperties"
};
var urlParams = getURLQueryObject();

var defaultParams = {
    mobilePhonePrefix: "86",
    gaCookies: "?__utmc=57589994&__utmz=57589994.1577693628.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)&__utma=57589994.2015188273.1564986937.1577699484.1577772209.3",
    protocol: true,
    openFrom: "WEBSITE",
    chineseName: "",
    idCardNo: "",
    email: "",
    utmcsr: "",
    utmcmd: "",
    utmccn: "",
    utmcct: "",
    utmctr: ""
};
var imLink = renderImLink();

function getSourceParams() {
    if (urlParams.utm_source.indexOf("tr") > -1) {
        defaultParams.utmcsr = "e11";
    } else {
        defaultParams.utmcsr = urlParams.utm_source
    }
    if (urlParams.utm_medium) {
        defaultParams.utmcmd = urlParams.utm_medium
    }
    if (urlParams.utm_campaign) {
        defaultParams.utmccn = urlParams.utm_campaign
    }
    if (urlParams.utm_content) {
        defaultParams.utmcct = urlParams.utm_content
    }
    if (urlParams.utm_term) {
        defaultParams.utmctr = urlParams.utm_term
    }
}

function openRealAccount() {
    getSourceParams();
    var mobilePhone = formElements["mobilePhone"].value;
    var checkCode = formElements["checkCode"].value;
    var passWord = formElements["passWord"].value;
    var email = formElements["email"].value;
    if (!checkRuleMobile(mobilePhone)) {
        return;
    }
    if (!checkRulePassword(passWord)) {
        return;
    }
    if (!checkEmail(email)) {
        return;
    }
    if (checkCode === "" || checkCode === undefined) {
        layer.open({ content: "请输入短信验证码", skin: "msg", time: 2 });
        return;
    }

    if (requestHeaders.method != "/account/open/openRealAccount") {
        requestHeaders.method = "/account/open/openRealAccount";
    }
    var registerParams = {
        mobilePhone: mobilePhone,
        checkCode: checkCode,
        passWord: passWord,
        email: email
    };
    var reqParams = Object.assign(defaultParams, registerParams);
    $.ajax({
        headers: requestHeaders,
        data: JSON.stringify({
            head: { appKey: appKey },
            data: reqParams
        }),
        type: "POST",
        url: baseUrl + "/account/open/openRealAccount",
        dataType: "json",
        success: function(result, textStatus, jqXHR) {
            if (!result || result.code !== 1) {
                //console.log('result.code ===' + result.code + ' ,result.msg ===' + result.msg)
                if (result.msg == "field = email, errorMsg = 邮箱格式错误") {
                    layer.open({
                        content: "邮箱格式错误",
                        skin: "msg",
                        time: 2
                    });
                } else {
                    layer.open({ content: result.msg, skin: "msg", time: 2 });
                }
            } else {
                // console.log(result);
                //console.log(result.data.account.customerNumber);
                $("#customerId").text(result.data.account.customerNumber);
                $("#popup_form").fadeOut();
                $("#done_msg").fadeIn();
                clearInterval(timeRun);
                countDownTime(1);
                // console.log(jqXHR)
            }
        }
    });
}

function getAuthorization() {
    $.ajax({
        headers: requestHeaders,
        data: JSON.stringify({ head: { appKey: appKey }, data: {} }), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
        type: "POST",
        url: baseUrl + "/account/appProperties/getAccountProperties",
        dataType: "json",
        success: function(data, textStatus, jqXHR) {
            // console.log(data)
            // console.log(jqXHR)

            authorization = jqXHR.getResponseHeader("authorization");
            requestHeaders.authorization = authorization;
            requestHeaders.method = "/account/appProperties/getAppProperties";
            // console.log(requestHeaders)
            // checkRealMobileIsExit()
        }
    });
}

function checkRuleMobile(value) {
    if (value === "" || value === undefined) {
        layer.open({ content: "请输入手机号码", skin: "msg", time: 2 });
        return false;
    }
    if (!mobileReg.test(value)) {
        layer.open({ content: "手机号码格式不正确", skin: "msg", time: 2 });
        return false;
    }
    return true;
}

function isEnglishAndChinese(str) {
    // 包含字母和数字
    var reg = /^[A-Za-z0-9]+$/;
    var reg2 = /^[0-9]*$/;
    var reg3 = /^[A-Za-z]+$/;
    if (reg.test(str) && !reg2.test(str) && !reg3.test(str)) {
        return false;
    } else {
        return true;
    }
}

function checkEmail(value) {
    let regEmail = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/; //正则表达式
    if (!regEmail.test(value)) {
        //正则验证不通过，格式不对
        layer.open({ content: "请输入正确电邮地址", skin: "msg", time: 2 });
        return false;
    } else {
        return true;
    }
}

// function checkAcceptAgree(){
// 	var isAccept =  formElements['agree'].checked
// 		if(!isAccept){
// 			layer.open({content: '请仔细阅读并同意 《客户隐私保护政策》、《投资风险披露》、《免责声明》',skin: 'msg',time: 2})
// 			return false
// 		}
// 	    return true
// }

function checkRulePassword(value) {
    if (value === "" || value === undefined) {
        layer.open({ content: "请输入密码", skin: "msg", time: 2 });
        return false;
    }
    if (!value ||
        value.length < 6 ||
        value.length > 16 ||
        isEnglishAndChinese(value)
    ) {
        layer.open({
            content: "请正确输入密码格式(字母＋数字，5-16位)",
            skin: "msg",
            time: 2
        });
        return false;
    }
    return true;
}

function checkRealMobileIsExit() {
    var mobilePhone = formElements["mobilePhone"].value;
    if (checkRuleMobile(mobilePhone)) {
        if (requestHeaders.method != "/account/open/checkRealMobileIsExit") {
            requestHeaders.method = "/account/open/checkRealMobileIsExit";
        }
        $.ajax({
            headers: requestHeaders,
            data: JSON.stringify({
                head: { appKey: appKey },
                data: {
                    mobilePhone: mobilePhone,
                    mobilePhonePrefix: "86"
                },
            }), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
            type: "POST",
            url: baseUrl + "/account/open/checkRealMobileIsExit",
            dataType: "json",
            success: function(result, textStatus, jqXHR) {
                if (!result || result.code !== 1 || result.data) {
                    layer.open({ content: "手机号码已注册", skin: "msg", time: 2 });
                } else {
                    requestHeaders.method = "/account/open/sendVerifyRealCode";
                    sendVerifyRealCode(mobilePhone);
                }
            }
        });
    }
}

function sendVerifyRealCode(value) {
    $.ajax({
        headers: requestHeaders,
        data: JSON.stringify({
            head: { appKey: appKey },
            data: {
                mobilePhone: value,
                mobilePhonePrefix: "86"
            },
        }), // {"accountNo":"15986639372","passWord":"p123456","accountType":"real"}
        type: "POST",
        url: baseUrl + "/account/open/sendVerifyRealCode",
        dataType: "json",
        success: function(result, textStatus, jqXHR) {
            authorization = jqXHR.getResponseHeader("authorization");
            if (!result || result.code !== 1) {
                layer.open({ content: result.msg, skin: "msg", time: 2 });
            } else {
                requestHeaders.method = "/account/open/openRealAccount";
                // 倒计时
                layer.open({ content: "短信验证码已发送", skin: "msg", time: 2 });
                formElements["sendSMS"].disabled = true;
                countDownTime(60);
            }
        }
    });
}
/**
 * getURLQueryObject
 * @param {any} url  获取参数的url
 * @returns {Object}
 * @use getURLQueryObject()
 */
function getURLQueryObject(url) {
    if (url === null || url === undefined) {
        url = window.location.href;
    }

    var search = decodeURIComponent(url.substring(url.lastIndexOf("?") + 1));
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;

    search.replace(reg, (rs, $1, $2) => {
        var name = decodeURIComponent($1);
        var val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });

    return obj;
}

/**
 * is
 * @param {any} type 期望的数据类型的值
 * @param {any} val  需要校验的值
 * @returns {Boolean}
 */
function is(type, val) {
    var toString = {}.toString;
    return toString.call(type) === toString.call(val);
}

/**
 * buildURLQueryString
 * @param {Object} params
 * @returns {String}
 * @use buildURLQueryString({callbackurl:'https://ixmiddle.se6868b.com/htmlKeySetl/home?'})
 */
function buildURLQueryString(params, flag) {
    if (is({}, params)) {
        var arr = [];
        for (var key in params) {
            var value = params[key];
            if (is([], value)) {
                for (var i = 0, length = value.length; i < length; i += 1) {
                    if (is([], value[i]) || is({}, value[i])) {
                        var tmp = {};
                        tmp[key + "[" + i + "]"] = value[i];
                        arr.push(buildURLQueryString(tmp, true));
                    } else {
                        arr.push(key + "[]=" + encodeURIComponent(value[i]));
                    }
                }
            } else if (is({}, value)) {
                for (var k in value) {
                    if (is([], value[k]) || is({}, value[k])) {
                        var tmp = {};
                        tmp[key + "[" + k + "]"] = value[k];
                        arr.push(buildURLQueryString(tmp, true));
                    } else {
                        arr.push(key + "[" + k + "]=" + encodeURIComponent(value[k]));
                    }
                }
            } else {
                if (flag) {
                    arr.push("[" + key + "]=" + encodeURIComponent(value));
                } else {
                    arr.push(key + "=" + encodeURIComponent(value));
                }
            }
        }
        return arr.join("&");
    } else {
        return "";
    }
}

function renderImLink() {
    var utm_source = urlParams.utm_source || "1";
    return (
        "https://im.HH128.com:8188/?utm_source=" +
        utm_source +
        "&company_id=128&utm_medium=1&utm_campaign=1&utm_term=1&utm_content=1&chat_type=1&uagent=1000&lang=zh-CN&%20lastPageDesc=&account_no=&reffer=" +
        utm_source
    );
}
/**
 * 注册表单
 */
getAuthorization();

var timeRun;

registerForm.onsubmit = function() {
    return false;
};

function countDownTime(time) {
    let i = time;
    timeRun = window.setInterval(() => {
        if (i == 0) {
            formElements["sendSMS"].innerText = "获取验证码";
            formElements["sendSMS"].disabled = false;
            clearInterval(timeRun);
            return;
        }
        i--;
        formElements["sendSMS"].innerText = "重新获取" + i + "s";
    }, 1000);
}
formElements["sendSMS"].onclick = checkRealMobileIsExit;
formElements["submit"].onclick = openRealAccount;