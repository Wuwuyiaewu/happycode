const APP_KEY = "JW666key";
const WS_BASE_URL = "wss://api.dragonfly8.com/websocket";
const HTTP_BASE_URL = "https://api.dragonfly8.com";
const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";
var _data = {};
var _head = {
  appKey: APP_KEY,
};
var account_properties_req = {
  head: _head,
  data: _data,
};
console.log(JSON.stringify(account_properties_req));

var settings = {
  "url": "https://api.dragonfly8.com/account/appProperties/getAccountProperties",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Content-type": "application/json",
    "module": "uat-account",
    "rpcType": "http",
    "method": "/account/appProperties/getAccountProperties",
    "httpMethod": "post",
    "authorization":this.token,
  },
  "data": `{"head":{"appKey":"JW666key"},"data":{}}`,
};
var config = new Object({
  companyid: "",
  platform: "",
});
var account = new Object({
  accountNo: "",
  password: "",
  accountType: "",
  clientIp: "",
  authorization: "",
  userType: "",
});

$.ajax(settings).done(function (response,text,xhr) {
  var accountProperties = response.data;
  console.log(account,config,accountProperties);
  account.authorization = xhr.getResponseHeader('Authorization')
  var transBaseConfigVo = accountProperties.transBaseConfigVo;
  var toKenCompanyInfoVo = accountProperties.toKenCompanyInfoVo;
  config.companyid = transBaseConfigVo.companyId;
  config.platform = transBaseConfigVo.platform;
  account.clientIp = accountProperties.clientIp;
  account.accountType = toKenCompanyInfoVo.accountType;
  if (toKenCompanyInfoVo.accountType == "real") {
    account.accountNo = toKenCompanyInfoVo.mobilePhone;
    account.userType = 0;
  } else if (toKenCompanyInfoVo.accountType == "demo") {
    account.accountNo = toKenCompanyInfoVo.mobilePhone;
    account.userType = 1;
  } else {
    account.accountNo = "Guest";
    account.userType = 1;
  }
});


var ws_callback = new Object({
  ws_init_success: function (socket) {
    ws_request.login(socket);
  },
  ws_message_event: function (event) {
    message_event(event);
  },
  ws_binary_event: function (binary_data) {
    message_binary(binary_data);
  },
  ws_text_event: function (text_data) {
    message_text(text_data);
  },
});

var ws_request = new Object({
  init: function (cb) {
    ws = new WebSocket(WS_BASE_URL);
    ws.onopen = () => {
      console.log("open connection");
      cb.ws_init_success(ws);
    };

    ws.onclose = () => {
      console.log("close connection");
    };

    ws.onmessage = (event) => {
      //cb.ws_message_event(event);
      if (event.data instanceof Blob) {
        cb.ws_binary_event(event);
      } else {
        try {
          cb.ws_message_event(event.data);
        } catch (e) {
          cb.ws_text_event(event.data);
        }
      }
    };
  },

  login: function (ws) {
    var _content = {
      company_id: config.companyid,
      login_name: account.accountNo,
      password: account.password,
      user_type: account.userType,
      appKey: APP_KEY,
      clientIp: account.clientIp,
    };

    var request = this.getWsRequest("login", _content);
    ws.send(JSON.stringify(request));
  },

  productSubscription: function (codeIds) {
    var _content = {
      subscribeType: "reSubscribe",
      code_ids: codeIds,
      type: "yz",
    };
    var request = this.getWsRequest("productSubscription", _content);
    ws.send(JSON.stringify(request));
  },
  ping: function () {
    var _content = {
      beat: 1,
    };
    var request = this.getWsRequest("ping", _content);
    ws.send(JSON.stringify(request));
  },
  lastPrice: function (codeIds) {
    var _content = {
      code_ids: codeIds,
    };
    var request = this.getWsRequest("lastPrice", _content);
    ws.send(JSON.stringify(request));
  },
  getWsRequest: function (msg_type, content) {
    var ws_request = {
      trace: "h5_" + get_current_time(),
      platform: "h5",
      msg_code: msg_type,
      device: "h5",
      version_code: 1,
      head: this.getHead(msg_type),
      content: content,
    };
    return ws_request;
  },

  getHead: function (msg_type) {
    var _head = {
      server: config.platform,
      msgType: msg_type,
      isVisitor: "false",
      userNo: "userNo-d-20190710001111109876",
      lang: "zh-CN",
      sendTime: get_current_time(),
      Authorization: account.authorization,
    };
    return _head;
  },
});
