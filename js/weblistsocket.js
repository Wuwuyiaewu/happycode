//const APP_KEY = "yzPre";
//const WS_BASE_URL = "wss://preapi.dragonfly8.com/v/websocket";
//const HTTP_BASE_URL = "https://preapi.dragonfly8.com";
//const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";

const APP_KEY = "JW666key";
const WS_BASE_URL = "wss://api.dragonfly8.com/websocket";
const HTTP_BASE_URL = "https://api.dragonfly8.com";
const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";

var product_code_ids = [573097, 573100, 573106, 573102, 573112, 573105, 573094];
// 0: 573102
// 1: 573112
// 2: 573105
// 3: 573106
// 4: 573094
// 5: 573109
// 6: 573108
// 7: 573100
// 8: 573107
// 9: 573097
// 10: 573111
// 11: 573110
// 12: 573121
// 13: 573119
// 14: 573123
// 15: 573122
// 16: 573125
// 17: 573133
// 18: 573130
// 19: 573134
// 20: 573132
// 21: 573136
// 22: 573147
// 23: 573148
// 24: 573153
// 25: 573044
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

var productionInfo = [];
var lastPriceInfo = [];

var http_request = new Object({
  http: new XMLHttpRequest(),
  token: "",

  init: function () {
    console.log(this.token)
  },

  get_account_properties: function (es) {
    console.log(`${es}----第64行`)
    var _data = {};
    var _head = {
      appKey: APP_KEY,
    };
    var account_properties_req = {
      head: _head,
      data: _data,
    };
    this.post_request(GET_ACCOUNT_PROPERTIES, account_properties_req, es);
  },

  post_request: function (url, object, cb) {
    var http = this.http;
    var request_url = HTTP_BASE_URL + url;
    http.open("POST", request_url, true);

    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("module", "uat-account");
    http.setRequestHeader("rpcType", "http");
    http.setRequestHeader("httpMethod", "post");
    http.setRequestHeader("method", url);
    http.setRequestHeader("authorization", this.token);

    http.onreadystatechange = function () {
      //Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {
        account.authorization = http.getResponseHeader("Authorization");
        cb(http.responseText);
        console.log(`${http.responseText}----第93行`)
      }
    };
    http.send(JSON.stringify(object));
  },
});

function start() {
  account.accountNo = "";
  account.password = "";

  http_request.init();
  http_request.get_account_properties(function (response) {
    var accountProperties = JSON.parse(response).data;
    console.log(`${response}---第107行`)
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
    ws_request.init(ws_callback);
  });
}

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

function get_current_time() {
  var d = new Date();
  return d.getTime();
}

function message_event(event) {
  //console.log(event)
  var msg = JSON.parse(event);
  var msg_code = msg.msg_code;
  if (msg_code == "UserLoginInfoRet") {
    ws_request.lastPrice(product_code_ids);
    ws_request.productSubscription(product_code_ids);
  }

  if (msg_code == "GroupSymbolListRet") {
    productionInfo = msg.content.data_list;
  }

  if (msg_code == "LastPrice") {
    lastPriceInfo = msg.content;
    update_Last_info_ui(lastPriceInfo);
  }

  if (msg_code == "HeartBeatConf") {
  }
}

// beat
setInterval(() => {
  ws_request.ping();
}, 30000);

function message_binary(binary_data) {
  var blob = binary_data.data;

  var reader = new FileReader();
  reader.onload = function (event) {
    var result = pako.inflate(event.target.result, { to: "string" });
    //console.log(result, "result = pako");
    message_event(decodeURI(result));
  };
  reader.readAsArrayBuffer(blob);
}

function message_text(data) {
  // console.log(JSON.stringify(productionInfo));
  if (data.startsWith("p(")) {
    var substring = data.substring(2, data.length - 1);
    var split = substring.split(",");
    if (split.length < 7) {
    }
    var product = productionInfo.find(function (element) {
      return element.id == split[0];
    });
    if (product == null) return;

    var last = lastPriceInfo.find(function (element) {
      return element.code_id == split[0];
    });

    let last_percent = 0.0;
    if (last.yesterday_price > 0.0) {
      last_percent =
        (last.cur_price - last.yesterday_price) / last.yesterday_price;
    } else {
      last_percent = 0.0;
    }

    var lastPrice = {
      sellRiseStatus: last.sell_price,
      buyRiseStatus: last.buy_price,
      buyPrice: last.buy_price,
      sellPrice: last.sell_price,
      lastPrice: last.yesterday_price,
      curPrice: last.cur_price,
      changeAmount: last.cur_price - last.yesterday_price,
      percent: last_percent,
    };

    let real_percent = 0.0;
    if (lastPrice.lastPrice > 0) {
      real_percent = (split[3] - lastPrice.lastPrice) / lastPrice.lastPrice;
    } else {
      real_percent = 0.0;
    }

    var realtimePrice = {
      sellRiseStatus: split[2],
      buyRiseStatus: split[1],
      buyPrice: split[1],
      sellPrice: split[2],
      curPrice: split[3],
      changeAmount: (split[3] - lastPrice.lastPrice).toFixed(2),
      time: split[4],
      highPrice: split[5],
      lowPrice: split[6],
      percent: real_percent,
    };

    product["realtime"] = realtimePrice;
    updateUI(product, realtimePrice, data, lastPrice);
  } else {
  }
}

function updateUI(obj, data, event, last) {
    updateElementDiv(obj, data, event, last);
}

function colorJudge(obj, data, allStock) {
 
}

function updateElementDiv(obj, data, event, last) {
  
}
function update_Last_info_ui(param) {
    let all = document.getElementById('stockList')
    for (let x = 0; x < param.length; x++) {
    }

}

start();
