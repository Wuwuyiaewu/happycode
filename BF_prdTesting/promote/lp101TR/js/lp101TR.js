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



$(document).ready(function(){
	remCompute(750, true);
	setInterval(function(){ 
		banner_cash("cash_mov1");
		banner_cash("cash_mov2");
		
	}, 400);
	
	
	content1_msg();
});


function banner_cash( list_id ) {
	
	var ran_rotate = (Math.floor(Math.random() * 40) - 25) * 2 ;
	if(list_id == "cash_mov2") {
		ran_rotate = (Math.floor(Math.random() * 40) - 15) * 2 ;
	}
	
	var ran_time = (Math.floor(Math.random() * 120) / 100 ) + 0.5;
	var ran_size = (Math.floor(Math.random() * 6) / 10 ) + 0.6;
	
	var temp_html = "<li style='transform: rotate("+ran_rotate+"deg) scale("+ran_size+")'>";
		temp_html += "<p style='animation-duration: "+ran_time+"s'><span></span></p>";
		temp_html += "</li>";
	
	$("#"+list_id).append(temp_html);
	if( $("#"+list_id+" li").length > 8) {
		$("#"+list_id+" li:eq(0)").remove();
	}
}

function content1_msg() {
	var text_msg = $("#content1_msg").html();
		text_msg = text_msg+"<br>"+text_msg;	
	$("#content1_msg").html(text_msg);
	
	setInterval( content1_msg_run , 5000);
}

var row_id = 0;
function content1_msg_run() {
	var mask_h = $("#content1_msg_mask").height();
	var all_h = $("#content1_msg").height();
	var all_row = all_h / mask_h;
	
	if( all_row > 2 ) { 
		var msg_top = -(row_id * mask_h);
		$("#content1_msg").css({
			"margin-top" : msg_top+"px",
			"transition-duration" : "0.5s"
		})

		if(row_id == (all_row/2) ) {
			setTimeout(function(){
				$("#content1_msg").css({
					"margin-top" : "0px",
					"transition-duration" : "0s"
				})
			}, 500);
		}

		row_id++;
		if(row_id > (all_row/2) ) {
			row_id = 1;
		}
	}
}




