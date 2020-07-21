$(function(){
	activity.init();	
});
/**
 * 获取提交域名
 */
function getUrl() {
    var h = window.location.host;
    if (h.indexOf("localhost") >= 0 || h.indexOf("172.29.") >= 0 || h.indexOf("172.20.") >= 0 || h.indexOf("192.168.0") >= 0) {
        h = "https://testgwactivity.gwfx.hk/unify-activity";
    } else if (h.indexOf("testweb") >= 0 || h.indexOf("testm") >= 0) {
        h = "https://testgwactivity.gwfx.hk/unify-activity";
    }
    else {
        h = "https://gwactivity.gwfx.site/unify-activity";
    }
    return h;
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function tip_alert(type, msg) {
    if (type == 0 && type == "0" || type == "20029") {
        $(".join-bombox").hide();
        // $("#tip").html(msg);
        $(".success-bombox,.shadow").show();
    } else if (type == "10002" || type == "40013") {
        $(".join-bombox").hide();
        $(".wrong-bombox,.shadow").show();
    } else {
        $(".join-bombox").show();
        $("#error_text").html(msg);
        $("#error_text").show();
        // $(".wrong-bombox,.shadow").show();
    }

}

function tip_alert2() {
    $("#error_text").html("");
    $("#error_text").hide();
}

var activity = {
    /***绑定事件***/
    init: function () { 
        $("#submit_btn").on("click", this.checkUserLogin2);
        $(".gotrade").click(function () {
            if (window.location.href.indexOf("app=gts2_app_orig") > 0) {
                if (typeof (key) != 'undefined' && key != null && key != "" && key != "cd8b68f5b88f9eb660d38d6c12732a31" && key != "3e07687cb3d26791adcb5f58d20641ef" && key != "@encrypName@") {
                    // _gaq.push(['_trackEvent', $GA_NAME, 'cunkuan_btn','mobile', 1,true]);
                    // window.location.href = "https://cunkuan";
                    _gaq.push(['_trackEvent', $GA_NAME, 'hangqing_btn', 'mobile', 1, true]);
                    // window.location.href = "https://gts2hangqing";
                    window.location.href = "https://cunkuan";
                } else {
                    _gaq.push(['_trackEvent', $GA_NAME, 'gologin', 'mobile', 1, true]);
                    window.location.href = "https://gologin";
                }
            } else {
                _gaq.push(['_trackEvent', $GA_NAME, 'rujin', 'pc_mobile', 1, true]);
                window.location.href = "https://admin.se6868a.com";
            }
        });
    },
    //登录
    login: function (key) {
        try {
            if (activity.validateData(key)) {
                var account = $.trim($("#passwordRaw").val());
                var phoneNo = $.trim($("#mobilePhone_number").val());
                var url = getUrl() + "/act/seoldcustact/register";
                $.ajax({
                    type: "POST",
                    url: url,
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: {
                        accountNo: account,
                        mobile: phoneNo,
                        companyId: "14",
                        activityPeriods: "se_qt_20200522162905"
                    },
                    success: function (msg) {
                        if ("0" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s2").show();
                        } else if ("20029" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s3").show();
                        } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s4").show();
                        } else {
                            // console.log("123");
                            tip_alert(msg["code"], msg["msg"]);
                        }
                    }
                });

            }
        } catch (e) {
            alert(e.message);
            return false;
        }
    },
    //key登录
    loginKey: function () {
        try {
            var url = getUrl() + "/act/seoldcustact/register";
            $.ajax({
                type: "POST",
                url: url,
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    key: key,
                    companyId: "14",
                    activityPeriods: "se_qt_20200522162905"
                },
                success: function (msg) {
                    if ("0" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s2").show();
                    } else if ("20029" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s3").show();
                    } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s4").show();
                    } else {
                        tip_alert(msg["code"], msg["msg"]);
                    }
                }
            });
        } catch (e) {
            alert(e.message);
            return false;
        }
    },
    //验证 数据
    validateData: function (key) {
        if (typeof (key) != 'undefined' && key != null && key != "" && key != "cd8b68f5b88f9eb660d38d6c12732a31" && key != "3e07687cb3d26791adcb5f58d20641ef" && key != "@encrypName@") {
            return true;
        }
        var account = $.trim($("#passwordRaw").val());
        var regAccount = /^680\d{5}$/;
        if (account == '' || account.length < 8 || account.length > 11 || !regAccount.test(account)) {
            tip_alert(1, "请输入正确的账号");
            return false;
        } else {
            tip_alert2();
        }
        var phoneNo = $.trim($("#mobilePhone_number").val());
        var regPhone = /^(13|14|15|17|18|16|19)\d{9}$/;
        if (!regPhone.test(phoneNo)) {
            tip_alert(1, "请输入开户登记手机号码");
            return false;
        } else {
            tip_alert2();
        }
	console.log('帳號與手機正確')
        return true;
    }, // 检查登录1
    checkUserLogin: function () {
        try {
			    if (typeof (key) == 'undefined' || key == null || key == "" || key == "cd8b68f5b88f9eb660d38d6c12732a31" || key == "3e07687cb3d26791adcb5f58d20641ef" || key == "@encrypName@") {
                $('.join').addClass("open");
                $(".join-s1").show().find('form input').val('');
                $(".join-s2,.join-s3,.join-s4").hide();
				$("#submit_btn").removeClass('loading');
                tip_alert2()
            } else {
                activity.checkUserLoginKey2();
            }
        } catch (e) {
            alert(e.message);
            return false;
        }
    },
    //检查登录2
    checkUserLogin2: function () {
        //if($("#submit_btn").hasClass('loading')) return false;
        /* 暫時設 key 為空字串 */
        if (typeof (key) == 'undefined'){
            key = ""
        }
        try {
            if (typeof (key) == 'undefined' || key == null || key == "" || key == "cd8b68f5b88f9eb660d38d6c12732a31" || key == "3e07687cb3d26791adcb5f58d20641ef" || key == "@encrypName@") {
                if (activity.validateData(key)) {
                    var account = $.trim($("#passwordRaw").val());
                    var phoneNo = $.trim($("#mobilePhone_number").val());
                    var url = getUrl() + "/act/seoldcustact/register";
                    //$("#submit_btn").addClass('loading');
                    $.ajax({
                        type: "POST",
                        url: url,
                        dataType: "jsonp",
                        jsonp: "callback",
                        data: {
                            activityPeriods: "se_qt_20200522162905",
                            companyId: "14",
                            accountNo: account,
                            mobile: phoneNo
                        },
                        success: function (msg) {
                            //$("#submit_btn").removeClass('loading');
                            if ("0" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s2").show();
								console.log('checkUserLogin2 - success')
                            } else if ("20029" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s3").show();
								console.log('checkUserLogin2 - registered')
                            } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s4").show();
                            } else {
                                tip_alert(msg["code"], msg["msg"]);
                            }
                        },
                        error: function(){
                            $("#submit_btn").removeClass('loading');
                        }

                    });
                }
            } else {
                activity.checkUserLoginKey2();
            }
        } catch (e) {
            alert(e.message);
            return false;
        }
    },
    //检查登录2  key
    checkUserLoginKey2: function () {
        try {
            if (typeof (key) != 'undefined' && key != null && key != "" && key != "cd8b68f5b88f9eb660d38d6c12732a31" && key != "3e07687cb3d26791adcb5f58d20641ef" && key != "@encrypName@") {
                var url = getUrl() + "/act/seoldcustact/register";
                $.ajax({
                    type: "POST",
                    url: url,
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: {
                        activityPeriods: "se_qt_20200522162905",
                        companyId: "14",
                        key: key
                    },
                    success: function (msg) {
                        if ("0" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s2").show();
                        } else if ("20029" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s3").show();
                        } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                                $(".join-s1").hide();
                                $(".join-s4").show();
                        } else {
                            console.log("123");
                            tip_alert(msg["code"], msg["msg"]);
                        }

                    }
                });
            } else {
                $(".join-bombox").show();
                $(".shadow").show();
            }

        } catch (e) {
            alert(e.message);
            return false;
        }
    }
};