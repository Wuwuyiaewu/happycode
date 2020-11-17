var activityPeriods="ix03_qt_20200825101915";
var companyId="352001";
var captchaFlag="0";
var key = getQueryString("key");

var saveLogin="";
var savePhone="";

$(window).scroll(function(){
});	

$(window).resize(function() {
	
});

$('body').hide();
$(document).ready(function(){
	$('body').show();
	
	member_record(1);
	saveLogin = new URL(window.location.href).searchParams.get("login");
	recommend_checking();
	
});


function getOAByActivity(){
	var h=window.location.host;
	if(h.indexOf("localhost")>=0 || h.indexOf("172.29.")>=0 ){
		h = "https://testgwactivity.gwfx.hk/unify-activity";
	}else if(h.indexOf("testweb")>=0 || h.indexOf("testm")>=0){
		h = "https://testgwactivity.gwfx.hk/unify-activity";
	}
	else{
		h="https://imsapi.mircoinfolab.com/unify-activity";
	}
	return h;
}

function popup_show(div_name) {
	$("#"+div_name).fadeIn();
    return false;
}

function popup_close(div_name) {
	$("#"+div_name).fadeOut();
	$("#share_QR").removeClass('show_qr');
	$("#copy_link").removeClass('show_link');
    return false;
}



function member_record(record_page) {
	$(".member_record_menu li").removeClass('selected');
	$(".member_record_menu li[page="+record_page+"]").addClass('selected');
	
	$(".member_record_data li").hide();
	$(".member_record_data li[page="+record_page+"]").fadeIn();
	
}

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

function recommend_checking(){
	if(typeof(key)!='undefined' && key!=null && key!="" && key!="cd8b68f5b88f9eb660d38d6c12732a31" && key!="@encrypName@"){
		//has key (app)
		recommend_ajax({activityPeriods:activityPeriods,key:key,companyId:companyId},false);
	}
	else {
		if (saveLogin=='' && savePhone==''){
			popup_show('login');
		}
		else {
			recommend_ajax({activityPeriods:activityPeriods,accountNo:saveLogin,companyId:companyId},true);
		}
	}
	
}


function recommend_ajax(data,isWeb){
	try{
		$.ajax({
			url:getOAByActivity()+"/act/ix/recommend/my/recommendlist",
			dataType:"jsonp",
			jsonp:"callback",
			data:data,
			success:function(msg){
				console.log(msg);
				var code=msg["code"];	
				if("0"==code){								
					var totalBouns = msg["data"].totalBonus;//累计总奖励
					var validRecommendNum = msg["data"].effectiveCount;//有效邀请人数
					var data = msg["data"].listRecommendRelation; //邀请奖励
					var historyZong = 0,tradeZong = 0;		
					var contentHtml2=[];
					var contentHtml1=[];
					var currency = msg["data"].currency   //货币单位USD,CNY
					if(currency == "CNY"){
						currency="￥";
					}else{
						currency="$";
					}
					
					if(data != null && data.length >0){			 													
						for(var i=0; i<data.length; i++){
							var effective = data[i].effective;								
							var historyQian = data[i].recommendBonus;				
							var tradeQian = data[i].tradeBonus;
							historyZong += historyQian;					
							tradeZong += tradeQian;		
							if(effective){
								effective="是";
							}else{
								effective="否";
							}							
						
							contentHtml2.push('<tr>');
							//contentHtml2.push('<td>'+data[i].recommmendedName+'</td>');//被推荐人名称
							contentHtml2.push('<td>'+data[i].recommmendedAccountNo+'</td>');//被推荐人名称
						    contentHtml2.push('<td>'+data[i].activateDate+'</td>');//激活时间
							if(parseInt(data[i].tradeLot)>=15){
								contentHtml2.push('<td>'+data[i].tradeLot+'</td>');//交易手数
							}else{
								contentHtml2.push('<td>'+data[i].tradeLot+'</td>');//交易手数
							}
							contentHtml2.push('<td>'+currency+data[i].tradeBonus+'</td>');//返赠金额
							contentHtml2.push('<td>'+currency+data[i].recommendBonus+'</td>');//邀请金额							
							//contentHtml2.push('<td>'+effective+'</td>');//是否有效								
							contentHtml2.push('</tr>');
							
							contentHtml1.push('<tr>');
						    contentHtml1.push('<td>'+data[i].recommmendedAccountNo+'</td>');//被推荐人名称
						    contentHtml1.push('<td>'+data[i].activateDate+'</td>');//激活时间

									   
							//contentHtml1.push('<td>'+currency+data[i].tradeBonus+'</td>');//返赠金额
							contentHtml1.push('<td>'+currency+data[i].recommendBonus+'</td>');//邀请金额
							contentHtml1.push('</tr>');							
							
							
						}
							
					}
					$("#contentHtml2").html(contentHtml2.join(''));
					$("#contentHtml1").html(contentHtml1.join(''));
					$("#invite_count_total").html(validRecommendNum);
					$("#total_reward_count").html(currency+totalBouns);	

				}
				
			}
		});
	}
	catch(e){
		alert(e.message);
	}
	
}



