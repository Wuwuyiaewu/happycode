$(".navbtns").hide()
$(".navbtn").click(function(e) {
    var navClass = $(this).parent().attr("class");
    if (navClass == "m-nav") {
        $(this).parent().addClass("on");
        $(".navcont").slideDown();
        $(".menu-shadow").show();
    } else {
        $(".menu-shadow").hide();
        $(".navcont").slideUp();
        $(this).parent().removeClass("on");
    }
    e.stopPropagation();
})

$(document).click(function(e){
    $(".navcont").slideUp();
    $(".m-nav").removeClass("on");
    $(".menu-shadow").hide();
})

