$(function(){
    //header
    // $(".header .main-menu li a").click(function(){
    //     $(this).parent().find("a").toggleClass("head-icon").siblings('.header .main-menu li a').removeClass("head-icon");//切换图标
    //
    // });
	//临时紧急处理
	$(".noicon-btntxt-m,.btn-real.btn-all-box").attr("href","https://admin.se6868x.com");




    //header 子菜单
    $("li.elder").hover(
        function(){
            $(this).find(".submenu").addClass('spread');
            $(this).find(".submenu").fadeIn();
        },function(){
            $(this).find(".submenu").removeClass('spread');
            $(this).find(".submenu").fadeOut();
        }
    )

    //首页活动弹框
    setTimeout(function(){
        $(".popup-service-box").show();
    },5000);


    $(window).scroll(function () {
        if ($(window).scrollTop() >= 500) {
            $(".header").addClass('header-inverted');
            $(".sidebar").fadeIn();
        }
        else {
            $(".header").removeClass('header-inverted');
        }
    })
    //header

    // 动画加载
    if (!(/msie [6|7|8|9]/i.test(navigator.userAgent))) {
        new WOW().init();
    }
    else {
        $(".wow").css({"visibility": "visible"})
    }

})




$(function(){

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
    $(".main-menu>li:eq("+li_index+")").children("a").addClass('head-icon');
}


