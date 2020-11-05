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
	
	
	var swiper = new Swiper('#content3_list', {                         
		slidesPerView: 1,
		spaceBetween: 0,
		speed: 600,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
        	clickable: true,
		},
		autoplay: {
			delay: 6000,
        	disableOnInteraction: false,
		}
	});	
	
	
	$('#video2').on('ended',function(){
       popup_video_close();
    });
	$('#video3').on('ended',function(){
       popup_video_close3();
    });
	
/*	
	setTimeout(function(){ 
		$('#video1').get(0).play();
	}, 1000);
*/
});	




function popup_video() {
	$("#popup_video").fadeIn();
	$('#video2').get(0).play();
}
	
function popup_video_close() {
	$("#popup_video").fadeOut();
	$('#video2').get(0).pause();
    $('#video2').get(0).currentTime = 0;
}



function popup_video3() {
	$("#popup_video3").fadeIn();
	$('#video3').get(0).play();
}
	
function popup_video_close3() {
	$("#popup_video3").fadeOut();
	$('#video3').get(0).pause();
    $('#video3').get(0).currentTime = 0;
}

