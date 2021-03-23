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


$(document).ready(function(){	
	
	remCompute(750, true);
	
	var content2_swiper = new Swiper('#content2_swiper_m', {     
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 600,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		autoplay: {
			delay: 5000
		}
	});
	
	$("#price_select").change(function() {
		 var this_val  = $(this).val();
		$("#content3_table").attr({"class" : "content3_table show"+this_val});
	});
});	


function popup_show(div_name) {
	$("#"+div_name).fadeIn();
    return false;
}

function popup_close(div_name) {
	$("#"+div_name).fadeOut();
    return false;
}


function content3_table(show_id) {
	$("#content3_table").attr({"class" : "content3_table show"+show_id});
}




