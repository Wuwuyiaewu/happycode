
const APP_KEY = "yzPre";
const WS_BASE_URL = "wss://preapi.dragonfly8.com/v/websocket";
const HTTP_BASE_URL = "https://preapi.dragonfly8.com";
const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";

var product_code_ids = [513006];

var config = new Object({
	companyid :"",
	platform : ""
});

var account = new Object({
	accountNo : "",
	password : "",
	accountType : "",
	clientIp  :  "" ,
	authorization : "",
	userType : ""
});

var http_request = new Object({

	http : new XMLHttpRequest(),
	token : "",

	init : function() {
		
	},

	get_account_properties : function(cb) {
		var _data = {};
		var _head = {
			appKey : APP_KEY
		}
		var account_properties_req = {
			head : _head,
			data : _data
		}
		this.post_request(GET_ACCOUNT_PROPERTIES, account_properties_req ,cb);
	},

	post_request : function ( url , object , cb) {
		var http = this.http;
		var request_url = HTTP_BASE_URL + url;
		console.log(request_url);
		http.open('POST', request_url, true);

		http.setRequestHeader('Content-type', 'application/json');
		http.setRequestHeader('module', 'uat-account');
		http.setRequestHeader('rpcType', 'http');
		http.setRequestHeader('httpMethod', 'post');
		http.setRequestHeader('method', url);
		http.setRequestHeader('authorization', this.token);

		http.onreadystatechange = function() {//Call a function when the state changes.
    		if(http.readyState == 4 && http.status == 200) {
        		account.authorization = http.getResponseHeader("Authorization");
        		cb(http.responseText);
    		}
		}

		http.send(JSON.stringify(object));
	}

});

var ws_callback = new Object({

	ws_init_success : function(socket) {
		ws_request.login(socket);
	} , 

	ws_message_event : function (event) {
		message_event(event);
	},
	ws_binary_event :function(binary_data) {
		message_binary(binary_data);
	},
	ws_text_event :function(text_data) {
		message_text(text_data);
	}
});


var ws_request = new Object({

	init : function(cb) {
		ws = new WebSocket(WS_BASE_URL)
		ws.onopen = () => {
    		console.log('open connection')
    		cb.ws_init_success(ws);
		}

		ws.onclose = () => {
    		console.log('close connection')
		}

		ws.onmessage = event => {
    		//cb.ws_message_event(event);
 			if(event.data instanceof Blob){
 				cb.ws_binary_event(event);
 			} else {
 				try {
					cb.ws_message_event(event.data);
 				} catch(e) {
 					cb.ws_text_event(event.data);
 				}
 				
 			}
    		
		}
	},

	login : function (ws) {

		var _content = {
			company_id 	: config.companyid,
			login_name	: account.accountNo,
			password 	: account.password,
			user_type	: account.userType,
			appKey 		: APP_KEY,
			clientIp	: account.clientIp
		}

		var request = this.getWsRequest('login',_content);
		ws.send(JSON.stringify(request));

	},

	productSubscription : function (codeIds) {
		
		var _content = {
			subscribeType 	: 'reSubscribe',
			code_ids		: codeIds,
			type 			: 'yz'
		}
		var request = this.getWsRequest('productSubscription',_content);
		console.log(JSON.stringify(request))
		ws.send(JSON.stringify(request));
	},
	getWsRequest : function (msg_type , content) {
		var ws_request = {
			trace : 'h5_' + get_current_time(),
			platform : 'h5',
			msg_code : msg_type,
			device : 'h5',
			version_code : 1,
			head : this.getHead(msg_type),
			content : content
		}
		console.log(JSON.stringify(ws_request))
		return ws_request;
	},

	getHead : function (msg_type) {

		var _head = {
			server 	: config.platform,
			msgType	: msg_type,
			isVisitor 	: 'false',
			userNo	: 'userNo-d-20190710001111109876',
			lang 		: 'zh-CN',
			sendTime	: get_current_time(),
			Authorization :  account.authorization
		}
		return _head;
	}


});

function start() {
	account.accountNo = '';
	account.password = '';

	http_request.init();
	http_request.get_account_properties(function(response){
		var accountProperties = JSON.parse(response).data;
		var transBaseConfigVo = accountProperties.transBaseConfigVo;
		var toKenCompanyInfoVo = accountProperties.toKenCompanyInfoVo;

		config.companyid = transBaseConfigVo.companyId;
		config.platform = transBaseConfigVo.platform;
		account.clientIp = accountProperties.clientIp;
		account.accountType = toKenCompanyInfoVo.accountType;
		if(toKenCompanyInfoVo.accountType == 'real') {
			account.accountNo = toKenCompanyInfoVo.mobilePhone;
			account.userType = 0;
		} else if(toKenCompanyInfoVo.accountType == 'demo') {
			account.accountNo = toKenCompanyInfoVo.mobilePhone;
			account.userType = 1;
		} else {
			account.accountNo = 'Guest';
			account.userType = 1;
		}

		ws_request.init(ws_callback);
	});
	
}

function get_current_time () {
	var d = new Date();
  	return d.getTime();
}

function message_event(event) {
	var msg = JSON.parse(event);
	var msg_code = msg.msg_code;
	console.log("msg code:"+msg_code);
	if(msg_code == 'InitProductInfo') {
		console.log("start login..");
		ws_request.productSubscription(product_code_ids);
	}
}

function message_binary(binary_data) {
	var blob = binary_data.data;
	var reader = new FileReader();
	reader.onload = function(event) {
    	var result = pako.inflate(event.target.result, { to: 'string' });
    	message_event(decodeURI(result))
	}
	reader.readAsArrayBuffer(blob);
}

function message_text (data) {
	//console.log(data);
	if(data.startsWith('p(')) {
		var substring = data.substring(2, data.length - 1);
		var split = substring.split(",");
        if (split.length < 7) {
            console.log("报价有误  " + data);
		}
		var params = {
			sym: split[0],
		}
		document.getElementById('test').innerHTML = data;
		console.log(params.sym)
	}
}

start();
