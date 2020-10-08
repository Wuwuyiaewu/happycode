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

wow = new WOW(
  {
	animateClass: 'animated',
	offset:       100,
  }
);
wow.init();	

	
var content2_autoplay;

$(document).ready(function(){	
	remCompute(750, true);
	content2_run();
//	content2_autoplay = setInterval( content2_run , 6000);

});	


var content2_id = 1;

function content2_click(page_id) {
	clearInterval(content2_autoplay);
	content2_id = page_id;
	content2_run();
//	content2_autoplay = setInterval( content2_run , 6000);
}
function content2_run() {
	content2_page();
	content2_id++;
	if(content2_id > 4 ) {
		content2_id = 1;
	}
}

function content2_page(page_id) {
	$("#content2_list li ").removeClass("show");
	$("#content2_list li[page="+content2_id+"] ").addClass("show");
}