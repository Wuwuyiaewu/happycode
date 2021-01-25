/* lp303 有兩個地址，所以在 app/promote/lp303/js/main.js 也有一樣的 main.js ，得一起修改*/
/* main.js 主掌所有老客活動資料傳送的功能 */

$(function() {
    activity.init();
});
/**
 * 获取提交域名
 */
function getUrl() {
    var h = window.location.host;
    if (h.indexOf("uat") >= 0 || h.indexOf("localhost") >= 0 || h.indexOf("172.29.") >= 0 || h.indexOf("172.20.") >= 0 || h.indexOf("192.168.0") >= 0) {
        h = "https://imsapi.mircoinfolab.com:1315/unify-activity";
    } else if (h.indexOf("testweb") >= 0 || h.indexOf("testm") >= 0) {
        h = "https://testgwactivity.gwfx.hk/unify-activity";
        /* https://testgwactivity.gwfx.hk/unify-activity 是連到 uat 的活動後台，若不是本地端就會連到 prd 正式場的活動後台 */
    } else {
        // h = "https://imsapi.dragonfly8.com/unify-activity";
        h = "https://imsapi.mircoinfolab.com:1315/unify-activity";
    }
    return h;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


function tip_alert(type, msg) {
    if (type == 0 && type == "0" || type == "20029") {
        $(".join-bombox").fadeOut();
        // $("#tip").html(msg);
        $(".success-bombox,.shadow").show();
    } else if (type == "10002" || type == "40013") {
        $(".join-bombox").fadeOut();
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
    init: function() {
        $("#submit_btn").on("click", this.checkUserLogin2);
    },
    //登录
    login: function(key) {
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
                        companyId: "352001",
                        activityPeriods: "ix03_qt_20210121090553"
                            /*companyId 352001 是 prd 真實場後台的 id 112010 是 uat 後台的 id*/
                            /*無論 prd 還是 uat 這次活動編號都是 ix03_qt_20200727114825*/
                    },
                    success: function(msg) {
                        if ("0" == msg["code"]) {
                            $("#login").fadeOut();
                            $("#done1").fadeIn();

                            /* 當回傳為 0 代表參加活動成功，使 login 畫面消失，成功畫面出來*/

                        } else if ("20029" == msg["code"]) {
                            $("#login").fadeOut();
                            $("#done2").fadeIn();

                            /* 當回傳為 20029 代表重複參加活動，使 login 畫面消失，重複參加畫面出來*/

                        } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                            $("#login").fadeOut();
                            $("#done3").fadeIn();

                            /* 當回傳為 10002 代表活動或帳號有異狀，使 login 畫面消失，洽詢客服畫面出來*/
                            /* 下面還有很多物件內容都是類似的格式，估計是 Terry 拿來應用在不同場合用的 */
                            /* 但目前 checkUserLogin2 是電腦使用端最常使用到的功能，其他的不確定 */
                            /* 通常每個月的 main.js 我還是會把他們一起做改動，例如活動編號，每個區塊的 activityPeriods 一起改掉 */
                            /* 大致上就是這樣了 */

                        } else {
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
    loginKey: function() {

        try {
            var url = getUrl() + "/act/seoldcustact/register";
            $.ajax({
                type: "POST",
                url: url,
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    key: key,
                    companyId: "352001",
                    activityPeriods: "ix03_qt_20210121090553"
                },
                success: function(msg) {
                    if ("0" == msg["code"]) {
                        $("#login").fadeOut();
                        $("#done1").fadeIn();
                    } else if ("20029" == msg["code"]) {
                        $("#login").fadeOut();
                        $("#done2").fadeIn();
                    } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                        $("#login").fadeOut();
                        $("#done3").fadeIn();
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
    validateData: function(key) {
        if (typeof(key) != 'undefined' && key != null && key != "" && key != "cd8b68f5b88f9eb660d38d6c12732a31" && key != "3e07687cb3d26791adcb5f58d20641ef" && key != "@encrypName@") {
            return true;
        }
        var account = $.trim($("#passwordRaw").val());
        var regAccount = /^(68)\d{6}$/;
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
    checkUserLogin: function() {
        try {
            if (typeof(key) == 'undefined' || key == null || key == "" || key == "cd8b68f5b88f9eb660d38d6c12732a31" || key == "3e07687cb3d26791adcb5f58d20641ef" || key == "@encrypName@") {
                $('.join').addClass("open");
                $("#login").show().find('form input').val('');
                $("#done1,#done2,#done3").fadeOut();
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
    checkUserLogin2: function() {
        //if($("#submit_btn").hasClass('loading')) return false;
        /* 暫時設 key 為空字串 */

        if (typeof(key) == 'undefined') {
            key = ""
        }
        try {
            if (typeof(key) == 'undefined' || key == null || key == "" || key == "cd8b68f5b88f9eb660d38d6c12732a31" || key == "3e07687cb3d26791adcb5f58d20641ef" || key == "@encrypName@") {
                if (activity.validateData(key)) {
                    var account = $.trim($("#passwordRaw").val());
                    var phoneNo = $.trim($("#mobilePhone_number").val());
                    var url = getUrl() + "/act/ix/oldcustact/register";
                    //$("#submit_btn").addClass('loading');
                    $.ajax({
                        type: "POST",
                        url: url,
                        dataType: "jsonp",
                        jsonp: "callback",
                        data: {
                            activityPeriods: "ix03_qt_20210121090553",
                            companyId: "352001",
                            accountNo: account,
                            mobile: phoneNo
                        },
                        success: function(msg) {
                            console.log(msg);
                            //$("#submit_btn").removeClass('loading');
                            if ("0" == msg["code"]) {
                                $("#bfh1").fadeOut();
                                $("#bfh2").fadeIn();
                                console.log('checkUserLogin2 - success')
                            } else if ("20029" == msg["code"]) {
                                $("#bfh1").fadeOut();
                                $("#bfh3").fadeIn();
                                console.log('checkUserLogin2 - registered')
                            } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                                $("#bfh1").fadeOut();
                                $("#bfh4").fadeIn();
                            } else {
                                tip_alert(msg["code"], msg["msg"]);
                            }
                        },
                        error: function() {
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
    checkUserLoginKey2: function() {
        try {
            if (typeof(key) != 'undefined' && key != null && key != "" && key != "cd8b68f5b88f9eb660d38d6c12732a31" && key != "3e07687cb3d26791adcb5f58d20641ef" && key != "@encrypName@") {
                var url = getUrl() + "/act/ix/oldcustact/register";
                $.ajax({
                    type: "POST",
                    url: url,
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: {
                        activityPeriods: "ix03_qt_20210121090553",
                        companyId: "352001",
                        key: key
                    },
                    success: function(msg) {
                        if ("0" == msg["code"]) {
                            $("#login").fadeOut();
                            $("#done1").fadeIn();
                        } else if ("20029" == msg["code"]) {
                            $("#login").fadeOut();
                            $("#done2").fadeIn();
                        } else if ("10002" == msg["code"] || "40013" == msg["code"]) {
                            $("#login").fadeOut();
                            $("#done3").fadeIn();
                        } else {
                            tip_alert(msg["code"], msg["msg"]);
                        }

                    }
                });
            } else {
                $(".join-bombox").fadeIn();
                $(".shadow").fadeIn();
            }

        } catch (e) {
            alert(e.message);
            return false;
        }
    }
};