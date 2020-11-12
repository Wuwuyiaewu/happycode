
$(document).ready(function(){
	
/*	menber_list();
	setInterval(menber_list , 4000);
*/	
	mobile_screen();
	setInterval(mobile_screen , 2000);
	
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

var mobile_screen_id = 0;
function mobile_screen() {
	$("#mobile_screen li").removeClass("show");
	$("#mobile_screen li:eq("+mobile_screen_id+")").addClass("show");
	mobile_screen_id++;
	if(mobile_screen_id >= $("#mobile_screen li").length) {
		mobile_screen_id = 0;
	}
}


var cs_change = 0;
function cs_show() {
	if(cs_change == 0) {
		$(".cs_btn").addClass("show");
		cs_change = 1;

		setTimeout(function(){ 
			$(".cs_btn").removeClass("show");
			cs_change = 0;
		}, 3000);
	}
}

