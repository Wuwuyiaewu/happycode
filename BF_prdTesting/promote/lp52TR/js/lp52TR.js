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

	setInterval( banner_count , 50);
	
	content1_chart_label();
	setInterval( content1_chart_label, 3000);
});



function content1_chart_label() {
	$(".content1_chart_label li ").removeClass("show");
		
	setTimeout(function(){ 
		$(".content1_chart_label li ").addClass("show");
	}, 100);
}


var count_start = 1680294;
var count_end = 1830234;
var show_text = count_start;
var chnage_time = 59;

var time_count = 0 ;

function banner_count() {
	var add_count = Math.round((count_end - count_start) / ( 20 * chnage_time));
	
	if(show_text < count_end) {
		show_text = show_text + add_count;
	}
	if(show_text >= count_end) {
		show_text = count_end;
	}
	$("#banner_count").text( addCommas(show_text) );
	time_count++;
	
	if(time_count > (60 * 20) ) {
	//	time_count = 0
	//	show_text = count_start;
	}
}


function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

