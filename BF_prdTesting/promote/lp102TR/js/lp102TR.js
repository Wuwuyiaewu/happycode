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
    remCompute(750, true);



    $("#tech_analysis_time_menu>span").click(function() {
        $(this).parents("#tech_analysis_time_menu").find("span").removeClass("selected");
        $(this).addClass("selected");
    });

    $("#tech_analysis_other_menu p span").click(function() {
        $(this).parents("#tech_analysis_other_menu").removeClass("show");
        var show_text = $(this).text();

        $(this).parents("#tech_analysis_time_menu").find("span").removeClass("selected");
        $(this).parents("#tech_analysis_time_menu").find("span.tech_analysis_other_text").text(show_text).addClass("selected");
    });
    content1_msg();


    setInterval(banner_cash, 750);
});





function load_tech_analysis() {
    var tech_analysis_menu_html = "";

    $.each(tech_analysis_data, function(i, this_val) {
        tech_analysis_menu_html += "<li>" + this_val["cat_name"] + "</li>";
    });

    $("#tech_analysis_menu").html(tech_analysis_menu_html);
}


function tech_analysis_other_menu(this_object) {
    this_object.parents("#tech_analysis_other_menu").toggleClass("show");
}


function tech_analysis_change(page_id) {
    $("#tech_analysis_menu li ").removeClass("selected");
    $("#tech_analysis_menu li[page=" + page_id + "] ").addClass("selected");

    $("#tech_analysis_data li ").removeClass("selected");
    $("#tech_analysis_data li[page=" + page_id + "] ").addClass("selected");
}




function content1_msg() {
    var text_msg = $("#content1_msg").html();
    text_msg = text_msg + "<br>" + text_msg;
    $("#content1_msg").html(text_msg);

    content1_msg_run();
    setInterval(content1_msg_run, 5000);
}

var row_id = 0;

function content1_msg_run() {
    var mask_h = $("#content1_msg_mask").height();
    var all_h = $("#content1_msg").height();
    var all_row = Math.round(all_h / mask_h);

    if (all_row > 2) {
        var msg_top = -(row_id * mask_h);
        $("#content1_msg").css({
            "margin-top": msg_top + "px",
            "transition-duration": "0.5s"
        })

        if (row_id == (all_row / 2)) {
            setTimeout(function() {
                $("#content1_msg").css({
                    "margin-top": "0px",
                    "transition-duration": "0s"
                })
            }, 500);
        }

        row_id++;
        if (row_id > (all_row / 2)) {
            row_id = 1;
        }
    }
}



function banner_cash() {

    var ran_left = Math.floor(Math.random() * 25) * 4;
    var ran_time = (Math.floor(Math.random() * 50) / 10) + 5;
    var ran_img = Math.floor(Math.random() * 3) + 1;
    var temp_html = "<li style='left:" + ran_left + "%; animation-duration: " + ran_time + "s'>";
    temp_html += "<p><img src='promote/lp102TR/images/banner_bg_cash" + ran_img + ".png'></p>";
    temp_html += "</li>";

    $("#banner_bg_cash").append(temp_html);
    if ($("#banner_bg_cash li").length > 15) {
        $("#banner_bg_cash  li:eq(0)").remove();
    }
}