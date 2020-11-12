var lang = "zh";
var pleaseInputTheCorrectEmail = "请输入正确格式的电子邮箱";
var cancelTheSuccess = "取消成功";
var emailHasBeenCancelTheSubscription="该邮箱已经取消订阅"
if(lang == "tw"){
	pleaseInputTheCorrectEmail = "請輸入正確格式的電子郵箱";
	cancelTheSuccess = "取消成功";
	emailHasBeenCancelTheSubscription="該郵箱已經取消訂閱"

}
//订阅邮件 start
function subscribeEmailValidateData (email){
	try{
		if(typeof(email)=='undefined' || $.trim(email)==""){
			alert(pleaseInputTheCorrectEmail);
			return false;
		}
		else{
			var reg = new RegExp("^['_A-Za-z0-9-]+(\\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\\.[A-Za-z0-9-]+)*((\\.[A-Za-z0-9]{2,})|(\\.[A-Za-z0-9]{2,}\\.[A-Za-z0-9]{2,}))$");
			if(!reg.test($.trim(email))){
				alert(pleaseInputTheCorrectEmail);
				return false;
			}
		}
		
		 intoCancelSubscribeEmail(email);
		return true;
		
	}
	catch(e){
		alert(e.message);
		return false;
	}
}
/**
 * 根据参数名称获取参数值
 * @param name 参数名称
 * @returns 返回参数值
 */
function getQueryStringByName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) 
		return unescape(r[2]); 
	
	return "";
}
//取消邮箱订阅 https://misapi.jdwil.com/emailapi/cannelEmail.do?name=82067130@qq.com
function intoCancelSubscribeEmail(email){
	console.log(email);
	//ajax
	$.ajax({
		type:'POST',
		url:'https://misapi.nb210.com/emailapi/cannelEmail.do',
		cache: false,
		dataType:'jsonp',
		jsonp:'callback',
		data:{"name":$.trim(email)},
		success:function(msg){
			var infoNo=msg['infoNo'];
			if(infoNo == 0){
				alert(cancelTheSuccess);
				$("#buton").attr("disabled","disabled");
			}else if(infoNo== 2){
				alert(emailHasBeenCancelTheSubscription);
			}else {
				alert(msg['infoMsg']);
			}
			
			
		}
	});		
	
	return;
}
//订阅邮件 end