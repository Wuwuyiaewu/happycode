//导航菜单
$('.m-nav .navbtn').click(function() {

    if ($('.m-nav').hasClass('on')) {
        $('.m-nav .navcont').slideUp(300, function() {
            $('.m-nav').removeClass('on');
            $('.m-nav-mask').hide();
            $('#app_float_top').css('z-index', 250);
        })
    } else {
        $('.m-nav').addClass('on');
        $('.m-nav-mask').show();
        $('#app_float_top').css('z-index', 80);
        $('.m-nav .navcont').slideDown(300, function() {})
    }

});

$('.m-nav-mask').click(function() {
    $('.m-nav .navcont').slideUp(300, function() {
        $('.m-nav').removeClass('on');
        $('.m-nav-mask').hide();
        $('#app_float_top').css('z-index', 250);
    })
})