function live800Prompt(type,position) {
	window.onbeforeunload = null;
	

	let url = new URL(window.location.href);
	let utm_source = url.searchParams.get("utm_source")==null?'':url.searchParams.get("utm_source");
	let utm_medium = url.searchParams.get("utm_medium")==null?'':url.searchParams.get("utm_medium");
	let utm_campaign = url.searchParams.get("utm_campaign")==null?'':url.searchParams.get("utm_campaign");
	let utm_term = url.searchParams.get("utm_term")==null?'':url.searchParams.get("utm_term");
	let utm_content = url.searchParams.get("utm_content")==null?'':url.searchParams.get("utm_content");

	
	// 设置参数
	var accountNo = '';
	var realCompanyId = '';
	var params =
		"company_id=210" +
		"&utm_source="+ utm_source+
		"&utm_medium="+utm_medium+
		"&utm_campaign="+utm_campaign+
		"&utm_term="+utm_term+
		"&utm_content="+utm_content+
		"&chat_type=1"+
		"&lang="+ window.navigator.language +
		"&uagent=" + encodeURIComponent(window.navigator.userAgent) +
		"&reffer=" + encodeURIComponent(window.location.href) +
		"&lastPageDesc=" + encodeURIComponent(document.title) +
		"&account_no=" + accountNo +
		"&real_co_id=" + realCompanyId;

	// 真实地址
	var liveUrl = "https://im.bofu210.com:8188/?" + params;	
	
	if (type == 2) {
		try {
			window.open(qqPrompt,'Live800Chatindow','height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'); 
		} catch (e) {
			window.open(qqPrompt,'Live800Chatindow','height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'); 
		}
		
		
	} else {
		try {
			window.open(liveUrl,'Live800Chatindow','height=645,width=740,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no'); 
		} catch (e) {
			window.open(liveUrl);
		}
	}
}