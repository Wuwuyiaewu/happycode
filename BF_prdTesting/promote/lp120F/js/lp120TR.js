wow = new WOW({
    animateClass: 'animated',
    offset: 100,
});
wow.init();


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



$(document).ready(function() {


    table1_change(1);
    table2_change(1);
    table_change_both(1)
    remCompute(750, true);

});


function table_change_both(table_id) {
    $("#tab_table1 li").removeClass("show");
    $("#tab_table1 li[page=" + table_id + "]").addClass("show");
    $("#tab_table2 li").removeClass("show");
    $("#tab_table2 li[page=" + table_id + "]").addClass("show");
}

function table1_change(table_id) {
    $("#tab_table1 li").removeClass("show");
    $("#tab_table1 li[page=" + table_id + "]").addClass("show");
}

function table2_change(table_id) {
    $("#tab_table2 li").removeClass("show");
    $("#tab_table2 li[page=" + table_id + "]").addClass("show");
}