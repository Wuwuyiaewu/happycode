$(window).scroll(function(){

});	

$(window).resize(function() {
	
});

$(document).ready(function(){
	
	$('#suggest_data_all').click(function() {
		$(this).toggleClass("all");
		if ($(this).hasClass('all')) {
			for(var i = 0 ; i < 7; i++) {
				$("#suggest_popup_data input")[i].checked = true;
			}
		}
		else {
			$("#suggest_popup_data input").attr('checked', false);
		}
 	});
	
	$("#suggest_popup_data input").click(function() {
		suggest_checked_count();
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


var data_array = ["贵金属"];

function suggest_popup_close() {
	$("#suggest_select_popup").fadeOut();
	$("#suggest_popup_data input").attr('checked', false);
	
	$.each( data_array , function( i, this_val ) {	
		$("#suggest_popup_data input[value="+this_val+"]")[0].checked = true;
	});
	suggest_checked_count();
}

function suggest_checked_count() {
	var numberOfChecked = $("#suggest_popup_data input:checkbox:checked").length;
	if(numberOfChecked < 7) {
		$('#suggest_data_all').removeClass("all");
	}
	else {
		$('#suggest_data_all').addClass("all");
	}
}

function suggest_update_list() {
	
	var value_arr = $('#suggest_popup_data input:checked').map(function(){	
		  return $(this).val();
    });
	
	
	if( value_arr.get().length > 0) {
	
		data_array = value_arr.get();
		console.log(data_array);

		var temp_html = "";
		$.each( data_array , function( i, this_val ) {	
			temp_html += "<span>"+this_val+"</span>";
		});

		$("#show_data").html(temp_html);
		$("#suggest_select_popup").fadeOut();
	}
	else {
		$("#show_data").html("--");
		$("#suggest_select_popup").fadeOut();
	}
}



var tech_analysis_data = [];
tech_analysis_data[0] =	{
		"cat_name" : "美国TECH100",
		"form_data" : {
			"总结" : "强力卖出"
		}
	};
tech_analysis_data[1] =	{
		"cat_name" : "美国SP500",
	};

console.log(tech_analysis_data);


function load_tech_analysis() {
	var tech_analysis_menu_html = "";
	
	$.each( tech_analysis_data , function( i, this_val ) {
		tech_analysis_menu_html += "<li>"+this_val["cat_name"]+"</li>" ;
	});
	
	$("#tech_analysis_menu").html(tech_analysis_menu_html);
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



