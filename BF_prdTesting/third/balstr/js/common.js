$(function() {
    //header
    // $(".header .main-menu li a").click(function(){
    //     $(this).parent().find("a").toggleClass("head-icon").siblings('.header .main-menu li a').removeClass("head-icon");//切换图标
    //
    // });
    //临时紧急处理
    $(".noicon-btntxt-m,.btn-real.btn-all-box").attr("href", "https://admin.se6868w.com");




    //header 子菜单
    $("li.elder").hover(
        function() {
            $(this).find(".submenu").addClass('spread');
            $(this).find(".submenu").fadeIn();
        },
        function() {
            $(this).find(".submenu").removeClass('spread');
            $(this).find(".submenu").fadeOut();
        }
    )

    //首页活动弹框
    setTimeout(function() {
        $(".popup-service-box").show();
    }, 5000);


    $(window).scroll(function() {
            if ($(window).scrollTop() >= 200) {
                $(".header").addClass('header-inverted');
                $(".sidebar").fadeIn();
            } else {
                $(".header").removeClass('header-inverted');
            }
        })
        //header

    // 动画加载
    if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
        new WOW().init();
    } else {
        $(".wow").css({ "visibility": "visible" })
    }

})

function live800Prompt(type) {
    window.onbeforeunload = null;
    var qqPrompt = "http://wpa.b.qq.com/cgi/wpa.php?ln=2&uin=800806834";
    //http://www.onlineservice-hk.com/k800/chatClient/chatbox.jsp?companyID=284&configID=55&jid=
    var live800Prompt = "http://www.onlineservice-hk.com/k800/chatClient/chatbox.jsp?companyID=284&configID=55&jid=";
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
            window.open(liveUrl, 'Live800Chatindow', 'height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
        } catch (e) {
            window.open(liveUrl);
        }
    }
}

$(function() {

    // /*tab标签切换*/
    // function tabs(tabTit,on,tabCon){
    //     $(tabCon).each(function(){
    //         $(this).children().eq(0).show();
    //
    //     });
    //     $(tabTit).each(function(){
    //         $(this).children().eq(0).addClass(on);
    //     });
    //     $(tabTit).children().click(function(){
    //         $(this).addClass(on).siblings().removeClass(on);
    //         var index = $(tabTit).children().index(this);
    //         $(tabCon).children().eq(index).show().siblings().hide();
    //     });
    // }
    // tabs(".investment_title","on",".investment_con");

})


function menu_select(li_index) {
    $(".main-menu>li").children("a").removeClass('head-icon');
    $(".main-menu>li:eq(" + li_index + ")").children("a").addClass('head-icon');
}