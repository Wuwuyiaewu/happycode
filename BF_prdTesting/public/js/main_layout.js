var main_banner_show_num = 0;
var banner_run;
var banner_speed = 6000;

$(document).scroll(function() {
	
	if($(window).scrollTop() > 50) {
		$(".header").addClass('header_fixed');
	}
	else {
		$(".header").removeClass('header_fixed');
	}

/*	var window_height_center = 600-(($(window).height()/2)-280);
	if($(window).scrollTop() > window_height_center) {
		$(".right_menu").addClass('right_menu_fixed');
	}
	else {
		$(".right_menu").removeClass('right_menu_fixed');
	}*/
	
	
});	

$(document).ready(function(){
	banner_page_btn();
	banner_auto_run();
	banner_run = setInterval( banner_auto_run , banner_speed);
	
	index_banner_check();
	
	
	$("li.sub_title>a").click(function() {
		$(this).parent("li").toggleClass("show_sub_menu");
	});
	
});


$(window).resize(function() {
	index_banner_check();
	//$("#app_download p ").text($(window).outerHeight());
});


function index_banner_check() {
	var window_w = $(window).width();
	if(window_w <= 750 ) {
		$('#main_banner li img').each(function () {
			var src = $(this).attr('src');
			$(this).attr('src', src.replace("/desktop", "/mobile"));
		});
	}
	else {
		$('#main_banner li img').each(function () {
			var src = $(this).attr('src');
			$(this).attr('src', src.replace("/mobile", "/desktop"));
		});
	}
	
}


function banner_page_btn() {
	var this_max = $("#main_banner li").length;	
	
	var page_html = "";
	for(var i = 0; i < this_max; i++) {
		if(i == main_banner_show_num) {
			page_html += "<li onClick='banner_change("+i+")' class='selected'><span></span></li>";
		} 
		else {
			page_html += "<li onClick='banner_change("+i+")'><span></span></li>";
		}
	}	
	if(this_max > 1) {
		$(".banner_btn").append(page_html);
	}
}
function banner_change(this_page) {	
	clearInterval(banner_run);
	main_banner_show(this_page);
	banner_run = setInterval( banner_auto_run , banner_speed);
}
function banner_auto_run() {
	var this_max = $("#main_banner li").length;	
	if(main_banner_show_num >= this_max) {
		main_banner_show_num = 0;
	}
	if(this_max > 1) {
		main_banner_show(main_banner_show_num);
		main_banner_show_num++;	
	} else {
		$("#main_banner li:eq(0)").addClass('show');
	}
}
function main_banner_show(this_show) {
	var hide_index = this_show-1;
	if(hide_index < 0) {
		hide_index = $("#main_banner li").length-1;	
	}	
	$("#main_banner li").not('.show');
	$("#main_banner li").removeClass('show').removeClass('hide');	
	$("#main_banner li:eq("+hide_index+")").addClass('hide');
	$("#main_banner li:eq("+this_show+")").addClass('show');
	
	$(".banner_btn li").removeClass('selected');
	$(".banner_btn li:eq("+this_show+")").addClass('selected');
	main_banner_show_num = this_show;	
}




function mobile_menu() {
  $("body").toggleClass("menu_show");
}

function app_download() {
	var window_w = $(window).width();
	if(window_w <= 750 ) {
		var url_link = $("#download_app").attr('href');
		window.location.href = url_link;
		
	}
}

function menu_select(li_index) {
	$(".menu_list>li").removeClass('selected');
	$(".menu_list>li:eq("+li_index+")").addClass('selected');
}


function popup_show(div_name) {
	$("#"+div_name).fadeIn();
    return false;
}

function popup_close(div_name) {
	$("#"+div_name).fadeOut();
    return false;
}









