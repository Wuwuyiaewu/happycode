$(window).scroll(function(){
	var window_now_top = $(window).scrollTop();
	if(window_now_top > 80) {
		$(".news_header").addClass("show_bg");
	}
	else {
		$(".news_header").removeClass("show_bg");
	}
});	


wow = new WOW(
  {
	animateClass: 'animated',
	offset:       100,
  }
);
wow.init();	


$(window).resize(function() {
	
});

$(document).ready(function(){
	
	remCompute(750, true);
	
//	menber_list();
//	setInterval(menber_list , 4000);
	
	
	setTimeout(function(){ 
	//	$('#video1').get(0).play();
	}, 1000);
	
});


var menber_list_id = 0;
function menber_list() {
	$("#menber_list li").removeClass("show");
	$("#menber_list li:eq("+menber_list_id+")").addClass("show");
	menber_list_id++;
	if(menber_list_id >= $("#menber_list li").length) {
		menber_list_id = 0;
	}
}


function content2_chart(page_id) {
	$("#content2_chart li").removeClass("selected");
	$("#content2_chart li[page="+page_id+"]").addClass("selected");
}

