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
	
	$("#form_list li input").click(function(){
	  	$(this).parent("li").removeClass("error");
		$(".error_msg").fadeOut();
	});
	
	 $("#form_list li input").keyup(function(){
		$(this).parent("li").addClass("show_clear");
	 });
	
	$("#form_list li .clear_btn").click(function(){
	  	$(this).parent("li").removeClass("show_clear");
		$(this).parent("li").find("input").val("");
	});
	
	$("#form_list li .pw_btn").click(function(){
	  	$(this).parent("li").toggleClass("show_pw");
		
		if($(this).parent("li").hasClass("show_pw") ) {
			$('#password').prop('type', 'text');
		}
		else {
			$('#password').prop('type', 'password');
		}
		
	});
	
//	mobile_screen();
//	mobile_screen_go = setInterval( mobile_screen , 3000);
	content2_change(1);
	
	
	setInterval( content4_list_run , 3000);
	
});	



var mobile_screen_go;
var mobile_screen_id = 0;
function mobile_screen() {
	//console.log(mobile_screen_id);
	$("#mobile_screen li").removeClass("show");
	$("#mobile_screen li:eq("+mobile_screen_id+")").addClass("show");
	
	mobile_screen_id++;
	if(mobile_screen_id >= $("#mobile_screen li").length) {
		mobile_screen_id = 0;
	}
}


function content2_change(page_id) {
	clearInterval(mobile_screen_go);
	$("#content2 li").removeClass("show");
	$("#content2 li[page="+page_id+"]").addClass("show");
	
	
	if(page_id == 1) {
		mobile_screen_id = 0;
		mobile_screen();
		mobile_screen_go = setInterval( mobile_screen , 4000);
	}
}





var verification_count = 60;
function verification() {
	if (!$("#code_btn").hasClass("hide")) {
		verification_run();
	}
}
function verification_run() {
	$("#code_btn").addClass("hide");
	var code_text = verification_count+"秒";
	$("#code_btn").text(code_text);
	verification_count--;
	if(verification_count >= 0 ) {
		setTimeout( verification_run , 1000);
	}
	if(verification_count < 0 ) {
		verification_count = 60;
		$("#code_btn").removeClass("hide");
		$("#code_btn").text("获取验证码");
	}
}

function form_submit() {
	
	var form_check = 0;
	var error_msg = "";
	 if ( $("#form_list li.list1 input").val() == '' ||  $("#form_list li.list1 input").val().match(/\D+/) ) {
		 $("#form_list li.list1").addClass("error");
		 error_msg += "<span>手机号不正确</span>";
	 } 
	 else {
		 form_check++;
	 }
	 
	 
	 if ( $("#form_list li.list2 input").val() == '' ||
	 !$("#form_list li.list2 input").val().match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)
	 ) {
		 $("#form_list li.list2").addClass("error");
		 error_msg += "<span>邮箱格式不正确</span>";
	 } 
	 else {
		 form_check++;
	 }
	 
	 if ( $("#form_list li.list3 input").val() == '') {
		 $("#form_list li.list3").addClass("error");
		 error_msg += "<span>验证码错误</span>";
	 } 
	 else {
		 form_check++;
	 }
	 
	 if ( $("#form_list li.list4 input").val() == '') {
		 $("#form_list li.list4").addClass("error");
		 error_msg += "<span>密码不符合要求</span>";
	 } 
	 else {
		 form_check++;
	 }
	 
	 
	 
	 if(error_msg != "") {
		 $(".error_msg").html(error_msg).fadeIn();
		 setTimeout(function(){
			 	$(".error_msg").fadeOut();
		 }, 3000);
	 }
	 else if(form_check == 4 ) {
		 
		 $("#popup1").fadeIn();
		// alert("done");
	 }
}


function content4_list_run() {
	$("#content4_list").animate({"margin-left":"-6.24rem"}, 700);
	
	
	var temp_html = "<li>"+$("#content4_list li:eq(0)").html()+"</li>";
		temp_html += "<li>"+$("#content4_list li:eq(1)").html()+"</li>";
		temp_html += "<li>"+$("#content4_list li:eq(2)").html()+"</li>";
	
	
	setTimeout(function(){ 
		
		$("#content4_list li:lt(3)").remove();
		$("#content4_list").append(temp_html);
		
		$("#content4_list").css({
			"margin-left" : 0
		});	
	}, 800);
}







