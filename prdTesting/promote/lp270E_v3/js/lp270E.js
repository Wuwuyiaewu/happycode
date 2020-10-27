wow = new WOW(
  {
	animateClass: 'animated',
	offset:       100,
  }
);
wow.init();	


$(window).scroll(function(){
	var window_now_top = $(window).scrollTop();
	if(window_now_top > 80) {
		$(".news_header").addClass("show_bg");
	}
	else {
		$(".news_header").removeClass("show_bg");
	}
});	

$(window).resize(function() {
	
});

$('body').hide();
$(document).ready(function(){
	remCompute(750, true);
	$('body').show();
	
	content1_list();
	setInterval(content1_list , 5000);
	
	
	$('#video1').on('ended',function(){
		popup_video_close();
    });
	
	
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
});


function popup_video() {
	$("#popup_video").fadeIn();
	$('#video1').get(0).play();
}
	
function popup_video_close() {
	$("#popup_video").fadeOut();
	$('#video1').get(0).pause();
    $('#video1').get(0).currentTime = 0;
}


var content1_page_id = 1;
function content1_list() {
	$("#content1_list li").removeClass("show").removeClass("hide");
	$("#content1_list li[page="+content1_page_id+"]").addClass("show");
	$("#content1_list li:not([page="+content1_page_id+"])").addClass("hide");
	content1_page_id++;
	if(content1_page_id > 2) {
		content1_page_id = 1;
	}
	setTimeout(function(){ 
		$("#content1_list li").removeClass("hide");
	 }, 1000);
}


function change_vs(val1, val2 ) {
	$("#popup").fadeIn();
	
	var left_val = parseInt($("#left_val").text())+val1;
	var right_val = parseInt($("#right_val").text())+val2;
	
	var bar_width = (left_val/ (right_val+left_val))*100;
	$("#left_val").text(left_val);
	$("#right_val").text(right_val);
	$("#vs_bar div span").width(bar_width+"%");
	
}

function tech_analysis_other_menu(this_object) {
	this_object.parents("#tech_analysis_other_menu").toggleClass("show");
}


function tech_analysis_change(page_id) {
	$("#tech_analysis_menu li ").removeClass("selected");
	$("#tech_analysis_menu li[page="+page_id+"] ").addClass("selected");
	
	$("#tech_analysis_data li ").removeClass("selected");
	$("#tech_analysis_data li[page="+page_id+"] ").addClass("selected");
}



