var channeles = {"g01":{"master":"g01","name":"App Store"},"g02":{"master":"g02","name":"App Store"},"g06":{"master":"g06","name":"vivo"},"g07":{"master":"g07","name":"魅族"},"g08":{"master":"g08","name":"百度"},"g09":{"master":"g09","name":"华为"},"g10":{"master":"g10","name":"360"},"g11":{"master":"g11","name":"应用宝"},"g12":{"master":"g12","name":"小米"},"g13":{"master":"g13","name":"OPPO"},"g14":{"master":"g14","name":"智鑫cpa  APP"},"g15":{"master":"g15","name":"努比亚"},"g20":{"master":"g20","name":"百度信息流"},"g21":{"master":"g21","name":"百度搜索"},"g22":{"master":"g22","name":"360搜索2"},"g23":{"master":"g23","name":"360搜索"},"g24":{"master":"g24","name":"360搜索"},"g25":{"master":"g25","name":"广点通"},"g26":{"master":"g26","name":"今日头条"},"g27":{"master":"g27","name":"爱奇艺信息流"},"g28":{"master":"g28","name":"股票资源"},"g29":{"master":"g29","name":"统一下载"},"g30":{"master":"g30","name":"客服专用"},"g31":{"master":"g31","name":"客服注册"},"g32":{"master":"g32","name":"格隆汇"},"g33":{"master":"g33","name":"交叉营销"},"g34":{"master":"g34","name":"美股之家"},"g341":{"master":"g341","name":"美股之家微信"},"g35":{"master":"g35","name":"移动端开户"},"g36":{"master":"g36","name":"APP banner"},"g37":{"master":"g37","name":"搜狗搜索"},"g38":{"master":"g38","name":"360信息流-阿松"},"g39":{"master":"g39","name":"神马搜索"},"g391":{"master":"g391","name":"神马搜索"},"g40":{"master":"g40","name":"小米信息流"},"g41":{"master":"g41","name":"PC官网Banner"},"g42":{"master":"g42","name":"移动官网Banner"},"g43":{"master":"g43","name":"凤凰港股APP"},"g44":{"master":"g44","name":"凤凰港股PC"},"g45":{"master":"g45","name":"开户之家"},"g46":{"master":"g46","name":"软文"},"g47":{"master":"g47","name":"贴吧"},"g48":{"master":"g48","name":"美股研究社"},"g481":{"master":"g481","name":"美股研究社微信"},"g49":{"master":"g49","name":"亚汇网"},"g50":{"master":"g50","name":"A结算"},"g51":{"master":"g51","name":"美股指南"},"21a0d0e4a4918f06a7b34dbdba19897738c125bd":{"master":"21a0d0e4a4918f06a7b34dbdba19897738c125bd","name":"指股网"},"461dc18b6f5f686998491c72e0d6e41a2785c3fd":{"master":"461dc18b6f5f686998491c72e0d6e41a2785c3fd","name":"美股指南代理"},"7107aa8a3ac214d38ca2df42441faf36e8628af7":{"master":"7107aa8a3ac214d38ca2df42441faf36e8628af7","name":"05引流"},"g52":{"master":"g52","name":"智鑫传媒后台"},"g53":{"master":"g53","name":"牛吧云播"},"g54":{"master":"g54","name":"智通财经"},"T04":{"master":"T04","name":"IOS腾通"},"g55":{"master":"g55","name":"OPPO信息流"},"g56":{"master":"g56","name":"PC客服弹窗免费开户按钮"},g57: { master: 'g57', name: '引流05首笔充值按钮' },g58: { master: 'g58', name: '引流05每日交易按钮' },g59: { master: 'g59', name: '引流05一键开户' },g60: { master: 'g60', name: '汇率Banner' },g61: { master: 'g61', name: '港股之家Banner' },g62: { master: 'g62', name: '金十财经' },g63: { master: 'g63', name: '美股之家' },g64: { master: 'g64', name: '港股美股通' },g65: { master: 'g65', name: '港股之家门户' },g66: { master: 'g66', name: '侃股大师' },b01: { master: 'b01', name: '百裕股票' },b02: { master: 'b02', name: '百裕港股美股' }};
var isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var urlParams = getUrlParam();
var utm_source  = urlParams.utm_source || '';
var matchSource = utm_source.match(/^(g\d+)_\w+/);
var defaultSource = isMobile ? 'g42' : 'g41';
if(matchSource && matchSource.length===2){
	utm_source = matchSource[1]
}
if(!channeles[utm_source]){
    utm_source = defaultSource
}
var channel = encodeURIComponent(channeles[utm_source]['name']);
var link = 'https://im.bofu210.com:8188/?utm_source=1&company_id=210&utm_medium=1&utm_campaign=1&utm_term=1&utm_content=1&chat_type=1&uagent=1000&lang=zh-CN&%20lastPageDesc=&account_no=&reffer='
var fragment = document.createDocumentFragment();
var dom = document.createElement('div');
var inner = document.createElement('div');

if(isMobile){
    var span =document.createElement('a');
    var a = document.createElement('a');
    dom.setAttribute('class',"m-customer-service")
    inner.setAttribute('class',"m-customer-inner")

	inner.innerHTML = `<a href="https://h5.bofu210.com/JW666key/register/openRealAccount/1` + location.search + `" target="_self"><i class="icon-open-account"></i><span>开立账户</span></a><a href="https://www.bofu210.com/common/app_qr.html" target="_blank" class="right_btn"><i class="icon-download"></i><span>立即下载</span></a><a href="https://im.bofu210.com:8188/?utm_source=1&company_id=210&utm_medium=1&utm_campaign=1&utm_term=1&utm_content=1&chat_type=1&uagent=1000&lang=zh-CN&lastPageDesc=&account_no=&reffer= " target="_self"><i class="icon-consult"></i><span>立即咨询</span></a>`
	
    dom.appendChild(inner);
    fragment.appendChild(dom);
    document.body.appendChild(fragment);
    fragment = null;dom = null;inner = null;
}else{
    var span =document.createElement('span');
  /*  var a = document.createElement('a');
	var em = document.createElement('em');
		var iTop = (window.screen.availHeight - 30 - 520) / 2; //获得窗口的垂直位置;
	var iLeft = (window.screen.availWidth - 10 - 740) / 2; //获得窗口的水平位置;
    dom.setAttribute('class',"customer-service")
    inner.setAttribute('class',"customer-inner")
    span.setAttribute('class',"close")
    span.setAttribute('id',"close-customer-service")
    // a.setAttribute('target',"_blank")
    a.setAttribute('href','javascript:void(0)')
	a.setAttribute('onclick',"window.open('" + link + "', 'Live800Chatindow', 'height=520,width=740,top=" + iTop + ",left=" + iLeft + ",toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')")
	em.setAttribute('id',"scan-code-download")
    inner.appendChild(span);
    inner.appendChild(a);
	inner.appendChild(em);
    dom.appendChild(inner);
    fragment.appendChild(dom);
    document.body.appendChild(fragment);
    fragment = null;dom = null;inner = null;span = null;a = null;
    document.getElementById("close-customer-service").onclick=function(){this.parentElement.parentElement.style.cssText='display:none;'}
var scanCodeDownload = document.getElementById("scan-code-download"),
	scanCodeIndex = 0,
	scanCodeTimer = 0,
	scanCodeText = '手机浏览器扫码下载';
	function floatrightTyping () {
		if (scanCodeIndex <= scanCodeText.length) {
			scanCodeDownload.innerText = scanCodeText.slice(0, scanCodeIndex++)
			scanCodeTimer = setTimeout('floatrightTyping()', 200)
		}
		else {
			scanCodeDownload.innerText = ''; //循环
		scanCodeIndex=0;
		scanCodeTimer = setTimeout('floatrightTyping()', 200)
		}
	}
	floatrightTyping()**/
}

function getUrlParam(){
    var return_json = {};
    var url = location.href
    if (typeof url !== 'string' || url.match(/\?/g) === null) {
            return return_json;
    }
    var query_array = url.split('?')[1].split('&');

    query_array.forEach((item)=>{
        const key = item.split('=')[0];
        const value = item.split('=')[1];
        if (key.match(/\[\]/g) !== null) {
            // const insert_destination = return_json[key];
            if (typeof return_json[key] !== 'object') {
                return_json[key] = [];
            }
            return_json[key].push(value);
        } else {
            return_json[key] = value;
        }
    });

    return return_json;
}