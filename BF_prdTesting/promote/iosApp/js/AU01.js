wow = new WOW({
    animateClass: 'animated',
    offset: 100,
});
wow.init();



$(window).scroll(function() {

});

$(window).resize(function() {

});

$(document).ready(function() {
    remCompute(750, true);
});








function show_page(url_name, menu_id) {
    $("#main_menu li").removeClass("selected");
    $("#main_menu li.list" + menu_id).addClass("selected");

    if ($("#load_content").length) {

        $("#load_content").html("");
        $("#load_content").load(url_name, function() {

            if (menu_id == 1) {
                load_home();
            }
        });

    } else {
        window.location.replace(url_name);
    }

}



function information_menu(this_object) {
    var this_index = this_object.index();
    $(".information_menu a").removeClass("selected");
    $(".information_menu a:eq(" + this_index + ")").addClass("selected");
}

function price_menu(this_object) {
    var this_index = this_object.parents("li").index();
    $("#price_menu li").removeClass("selected");
    $("#price_menu li:eq(" + this_index + ")").addClass("selected");
}



//========================================== home ============================================