var activityPeriods="ix03_qt_20200825101915";
var companyId="352001";
var captchaFlag="0";

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
	
	$(".share_list li:gt(0) a").click(function(){
		$("#share_QR").removeClass('show_qr');
	});
	$(".share_list li:lt(4) a").click(function(){
		$("#copy_link").removeClass('show_link');
	});
	
	let code=new URL(window.location.href).searchParams.get("code");
	if (code!=='' && code!==null){
		$("#mobile_invite_btn").html("立即开户");
		$("#pc_invite_btn").html("立即开户");
		$("#pc_invite_btn2").html("立即开户");
		$(".index_content2").css("display","none");
		$(".index_content3").css("display","none");
		
	}
});



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









function show_qr() {
	$("#share_QR").toggleClass('show_qr');
}
function show_link() {
	//$("#copy_link_input").val(window.location.href);
	$("#copy_link").toggleClass('show_link');
	/*
	if($(window).width() > 750 ) {
		$("#copy_link").toggleClass('show_link');
	}
	else {
		popup_show('copy_link');
		popup_close('share_popup');
	}
	*/
}
function copy_link() {
	if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {	
		var el = $(".share_link_text").get(0);
		var editable = el.contentEditable;
		var readOnly = el.readOnly;
		el.contentEditable = 'true';
		el.readOnly = 'false';
		var range = document.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		el.setSelectionRange(0, 999999);
		el.contentEditable = editable;
		el.readOnly = readOnly;
	}
	else {
		var copyText = document.getElementsByClassName('share_link_text');
		copyText[0].select();
		//copyText.setSelectionRange(0, 99999); 
	}

	document.execCommand("copy");		
	$("#copy_link").removeClass('show_link');
} 


function login_done() {
	
	let account=$("#member_id").val();
	let mobile=$("#member_mobile").val();
	//console.log(account);
	//console.log(mobile);
	if (lock){
		return;
	}
	
	if (account==''){
		$(".error_text").html('请输入帐户号码');
		return;
	}
	if (mobile==''){
		$(".error_text").html('请输入手机号码');
		return;
	}
	if (!validateAccount(account)){
		$(".error_text").html('请输入68开头8位数字的账户号码');
		return;
	}
	if (!validateMobile(mobile)){
		$(".error_text").html('请输入正确的手机号码');
		return;
	}
	
	$(".error_text").html('');
	lock=true;
	login_ajax({activityPeriods:activityPeriods,accountNo:account,phone:mobile,captchaFlag:captchaFlag,companyId:companyId},true,account,mobile);

}

function member_record(record_page) {
	$(".member_record_menu li").removeClass('selected');
	$(".member_record_menu li[page="+record_page+"]").addClass('selected');
	
	$(".member_record_data li").hide();
	$(".member_record_data li[page="+record_page+"]").fadeIn();
	
}

var lock=false;

function getOAByActivity(){
	var h=window.location.host;
	if(h.indexOf("localhost")>=0 || h.indexOf("172.29.")>=0 ){
		h = "https://testgwactivity.gwfx.hk/unify-activity";
	}else if(h.indexOf("testweb")>=0 || h.indexOf("testm")>=0){
		h = "https://testgwactivity.gwfx.hk/unify-activity";
	}
	else{
		h="https://imsapi.mircoinfolab.com:1315/unify-activity";
	}
	return h;
}


function validateMobile(mob){
	const re= /^(13|14|15|16|17|18|19)\d{9}$/;	
	return re.test(String(mob));
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateAccount(acc){
	//return true;
	const re= /^(68)\d{6}$/;	
	return re.test(String(acc));
}

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
} 

function recommend_checking(){
	if (lock){
		return;
	}
	
	if(typeof(key)!='undefined' && key!=null && key!="" && key!="cd8b68f5b88f9eb660d38d6c12732a31" && key!="@encrypName@"){
		//has key (app)
		lock=true;
		recommend_ajax({activityPeriods:activityPeriods,key:key,companyId:companyId},false);
	}
	else {
		if (saveLogin=='' && savePhone==''){
			popup_show('login');
		}
		else {
			recommend_ajax({activityPeriods:activityPeriods,accountNo:saveLogin,phone:savePhone,companyId:companyId},true);
		}
	}
	
}

function login_checking(){
	if (lock){
		return;
	}
	let code=new URL(window.location.href).searchParams.get("code");
	if (code!=='' && code!==null){
		openNewAccount();
		return;
	}
	
	if(typeof(key)!='undefined' && key!=null && key!="" && key!="cd8b68f5b88f9eb660d38d6c12732a31" && key!="@encrypName@"){
		//has key (app)
		lock=true;
		login_ajax({activityPeriods:activityPeriods,key:key,captchaFlag:captchaFlag,companyId:companyId},false,'','')
	}
	else {
		if (saveLogin=='' || savePhone==''){
			popup_show('login');
		}
		else {
			login_ajax({activityPeriods:activityPeriods,accountNo:saveLogin,phone:savePhone,captchaFlag:captchaFlag,companyId:companyId},true,saveLogin,savePhone);
		}
	}	
	
}


function login_ajax(data,isWeb,account,mobile){
	
					//ajax
	$.ajax({
		type:"POST",
		url: getOAByActivity()+"/act/ext/login",
		dataType:"jsonp",
		jsonp:"callback",
		data:data,
		success:function(msg){
			console.log(msg);
			lock=false;
			//if (isWeb){
			//	popup_close('login');
			//	popup_show('share_popup');
			//	$(".login_false").hide();
			//	$(".login_true").show();
			//}
			if("0"==msg["code"]){//成功
				saveLogin=account;
				savePhone=mobile;

				recommend_checking();
			//	$("#mobile_invite_btn").css("display","none");
			//	$("#pc_invite_btn").css("display","none");
			//	$("#member_login").hide();
			//	recommend.getRecommendedList(1);
			//	$("#login_false1").hide();
			//	$("#login_false2").hide();
			}else if (msg["code"] == '20063'){
				saveLogin=account;
				savePhone=mobile;
				popup_close('login');
				popup_show('new_member');
			}else{
				$(".error_text").html(msg["msg"]);
				//alert(msg["msg"]);
			//	return false;
			}
		}
	});
	
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
							
						// console.log(tradeQian);					
						//$("#noSendAmount").html(currency+'<b>'+historyZong+'</b>');
						//$("#sendAmount").html(currency+'<b>'+tradeZong+'</b>');
							
						//$("#amountTotel").html(totalBouns);
						//$("#sendNumber").html(validRecommendNum);
					}
					$("#contentHtml2").html(contentHtml2.join(''));
					$("#contentHtml1").html(contentHtml1.join(''));
					//$(".login_false").hide();
					//$(".login_true").show();
						//$("#login_false2").hide();
					$("#invite_count_total").html(validRecommendNum);
					$("#total_reward_count").html(currency+totalBouns);	
					
					//$("#copy_link_input").val(window.location.href);
					//console.log(share_url+"?code="+msg["extendData"]);
					//获取数据
					
					var locationSearch=location.search;
					var extendData='';
					if (locationSearch==''){
						extendData="?code="+msg["extendData"];
					}
					else {
						extendData=locationSearch+'&code='+msg["extendData"];
						
					}
					$("#copy_link_input").val(share_url+extendData);
					baiduShare();
					if (isWeb){
						popup_close('login');
						popup_show('share_popup');
						$(".login_false").hide();
						$(".login_true").show();
					}
					else {
						popup_show('share_popup');
						$(".login_false").hide();
						$(".login_true").show();					
					}
					//var gwacurl = fx_gwactivity;
					//if(typeof(gwacurl)=='undefined' ||  gwacurl==null){
					//	gwacurl = "https://gwactivity.gwfx.hk";
					//}
					//$("#fe_image2").attr("src",gwacurl+"/unify-activity/api/qrCode?width=100&heigth=100&content="+share_url+"?code="+msg["extendData"]);
				}
				else{
					alert('系统出错，请稍候再试');
				}
				
			}
		});
	}
	catch(e){
		alert(e.message);
	}
	
}

//分享


/* 
* 动态设置百度分享URL的函数,具体参数
* cmd为分享目标id,此id指的是插件中分析按钮的ID
*，我们自己的文章ID要通过全局变量获取
* config为当前设置，返回值为更新后的设置。
*/
function SetShareUrl(cmd, config) {            
  if (ShareURL) {
      config.bdUrl = ShareURL;    
  }
  return config;
}

function baiduShare(){
	let title = "邀请好友送您高达1000美元";
	let description = "好友诚邀，开户送1000美元，您交易越多送越多，有钱一起赚！";
	let bdUrl = $("#copy_link_input").val();
	let picurl = pub_pc + "/promote/lp306/images/banner_bg.jpg";
	  	
	
	  //插件的配置部分，注意要记得设置onBeforeClick事件，主要用于获取动态的文章ID
	  console.log("baidu share");
	   window._bd_share_config = {
	     "common": {
	         onBeforeClick: SetShareUrl, "bdSnsKey": {}, "bdText": title,"bdDesc":description
	         , "bdMini": "2", "bdMiniList": false, "bdPic": picurl, "bdUrl":bdUrl,"bdStyle": "0", "bdSize": "24"
	     }, "share": {}
	 };
	 //插件的JS加载部分
	 with (document) 0[(getElementsByTagName('head')[0] || body)
	     .appendChild(createElement('script'))
	     .src = '/common/baiduShare/api/js/share.js?v=89860593.js?cdnversion='
	     + ~(-new Date() / 36e5)];
}

function shareUrl(){
	

	let title = "邀请好友送您高达1000美元";
	let description = "好友诚邀，开户送1000美元，您交易越多送越多，有钱一起赚！";
	let bdUrl = $("#copy_link_input").val();
	let picurl = pub_pc + "/promote/lp306/images/banner_bg.jpg";
	 

	window.open('http://service.weibo.com/share/share.php?title='+title+'&url='+bdUrl+'&pic='+picurl);
	

	
}


function openNewAccount(){
	gotoRegister();
}