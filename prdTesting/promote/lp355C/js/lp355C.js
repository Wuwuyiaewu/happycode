$(window).scroll(function() {
    var window_now_top = $(window).scrollTop();
    if (window_now_top > 80) {
        $(".news_header").addClass("show_bg");
    } else {
        $(".news_header").removeClass("show_bg");
    }
});

$(window).resize(function() {

});

wow = new WOW({
    animateClass: 'animated',
    offset: 100,
});
wow.init();


$(document).ready(function() {

    remCompute(750, true);

    var content2_swiper = new Swiper('#content2_swiper_m', {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        }
    });

    candy_box_show();
    setInterval(candy_box_show, 1000);
});


function popup_show(div_name) {
    $("#" + div_name).fadeIn();
    return false;
}

function popup_close(div_name) {
    $("#" + div_name).fadeOut();
    return false;
}



function login_done() {
    popup_close('login');
    popup_show('done1');
}


function candy_box_popup(popup_cat, popup_text) {
    if (popup_cat == 1) {
        $(".li_shi_price").text(popup_text);
        $("#li_shi_popup").fadeIn();
    } else {
        $("#iphone_popup").fadeIn();
    }
}

var candy_box_show_id = 0;

function candy_box_show() {
    $("#candy_box p ").removeClass("show");
    $("#candy_box p:eq(" + candy_box_show_id + ")").addClass("show");
    candy_box_show_id++;
    if (candy_box_show_id >= 4) {
        candy_box_show_id = 0;
    }
}