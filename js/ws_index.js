//const APP_KEY = "yzPre";
//const WS_BASE_URL = "wss://preapi.dragonfly8.com/v/websocket";
//const HTTP_BASE_URL = "https://preapi.dragonfly8.com";
//const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";

const APP_KEY = "JW666key";
const WS_BASE_URL = "wss://api.dragonfly8.com/websocket";
const HTTP_BASE_URL = "https://api.dragonfly8.com";
const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";

var product_code_ids = [573097, 573100, 573106];

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

  init: function () {},

  get_account_properties: function (cb) {
    var _data = {};
    var _head = {
      appKey: APP_KEY,
    };
    var account_properties_req = {
      head: _head,
      data: _data,
    };
    this.post_request(GET_ACCOUNT_PROPERTIES, account_properties_req, cb);
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
      }
    };

    http.send(JSON.stringify(object));
  },
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

function start() {
  account.accountNo = "";
  account.password = "";

  http_request.init();
  http_request.get_account_properties(function (response) {
    var accountProperties = JSON.parse(response).data;
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

function get_current_time() {
  var d = new Date();
  return d.getTime();
}

function message_event(event) {
  //console.log(event)
  var msg = JSON.parse(event);
  var msg_code = msg.msg_code;
  console.log("code:" + msg_code);
  if (msg_code == "UserLoginInfoRet") {
    ws_request.lastPrice(product_code_ids);
    ws_request.productSubscription(product_code_ids);
  }

  if (msg_code == "GroupSymbolListRet") {
    productionInfo = msg.content.data_list;
    console.log(msg);
  }

  if (msg_code == "LastPrice") {
    lastPriceInfo = msg.content;
    update_Last_info_ui(lastPriceInfo);
  }

  if (msg_code == "HeartBeatConf") {
    console.log("ping");
  }
}

function message_binary(binary_data) {
  var blob = binary_data.data;

  var reader = new FileReader();
  reader.onload = function (event) {
    console.log(event, "event");
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
      console.log("报价有误  " + data);
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
    console.log();
  }
}

function updateUI(obj, data, event, last) {
  var product_div = document.getElementById("product_" + obj.id);
  if (product_div == null) {
    addElementDiv(obj, data, event, last);
  } else {
    updateElementDiv(obj, data, event, last);
  }
  //   console.log(event);
}
let curPriceA = new Number();
let curPriceB = new Number();

function updateElementDiv(obj, data, event, last) {
  // $("#" + "event_" + obj.id).text(event);
  let allStock = document.querySelectorAll(".stockarr");
  for (let x = 0; x < allStock.length; x++) {
    let y = allStock[x].id;
    let z = obj.id;
    if (`${y}` === `product_${z}`) {
      $(`.stock${x}`).empty();
      $(`.stock${x}`).text(data.curPrice);
      $(`.Wave${x}`).empty();
      console.log(data.curPrice, last.lastPrice);
      let judge = data.curPrice - last.lastPrice;
      $(`.Wave${x}`).text(judge.toFixed(2));
      let yesterdarwave = (judge / last.lastPrice).toFixed(2);
      $(`.Amplitude${x}`).empty();
      $(`.Amplitude${x}`).text(`${yesterdarwave}%`);
    }
  }
  // $(`.stock-${obj.id}`).empty();
  // $(`.stock-${obj.id}`).text(data.curPrice);
  // curPriceB = data.curPrice;
  // if (curPriceB > curPriceA) {
  //   $(`.stock-${obj.id}`).addClass("color-green").removeClass("color-red");
  //   curPriceA = curPriceB;
  // } else if (curPriceB == curPriceA) {
  //   curPriceA = curPriceB;
  //   return;
  // } else if (curPriceB < curPriceA) {
  //   $(`.stock-${obj.id}`).addClass("color-red").removeClass("color-green");
  //   curPriceA = curPriceB;
  // }
  // $(`.left-${obj.id}`).empty();
  // $(`.left-${obj.id}`).text(data.changeAmount);
  // let lastpercent = (data.changeAmount / last.lastPrice).toFixed(2);
  // $(`.right-${obj.id}`).empty();
  // $(`.right-${obj.id}`).text(lastpercent);
}
function addElementDiv(obj, data, event, last) {
  // var parent = document.getElementById("parent");
  // var outter = document.createElement("div");
  // var company = document.createElement("h2");
  // var stock = document.createElement("p");
  // var log = document.createElement("p");
  // outter.setAttribute("id", "product_" + obj.id);
  // outter.className = `trade-${obj.id} f-1`;
  // company.className = "company fz-20 color-gray";
  // company.innerHTML = obj.simplified;
  //   stock.className = `fz-40 stock-${obj.id}`;
  //   stock.innerHTML = data.curPrice;
  //   curPriceA = data.curPrice;
  //   let lastpercent = (data.changeAmount / last.lastPrice).toFixed(2);
  //   log.className = "d-flex jcsb fz-24";
  //   if (data.changeAmount > 0) {
  //     log.innerHTML = `<span class="color-green left-${obj.id}">+${data.changeAmount}</span
  //  ><span class="color-green right-${obj.id}">+${lastpercent}</span>`;
  //   } else {
  //     log.innerHTML = `<span class="color-red left-${obj.id}">${data.changeAmount}</span
  //  ><span class="color-red right-${obj.id}">${lastpercent}</span>`;
  //   }
  //   parent.appendChild(outter);
  //   outter.appendChild(company);
  //   outter.appendChild(stock);
  //   outter.appendChild(log);
}
function update_Last_info_ui(param) {
  let allStock = document.querySelectorAll(".stockarr");
  for (let x = 0; x < allStock.length; x++) {
    let y = allStock[x].id;
    let z = param[x].code_id;

    if (y === `product_${z}`) {
      console.log(param[x]);
      $(`.stock${x}`).text(param[x].cur_price);
      let judge = param[x].cur_price - param[x].yesterday_price;
      $(`.Wave${x}`).text(
        (param[x].cur_price - param[x].yesterday_price).toFixed(2)
      );
      if (judge > 0) {
        $(`.Wave${x}`).addClass("color-green").removeClass("color-red");
        // $(`.Wave${x}`).text(
        //   `+`
        // );
      } else {
        $(`.Wave${x}`).addClass("color-red").removeClass("color-green");
        // $(`.Wave${x}`).text(
        //   `-`
        // );
      }
      $(`.Amplitude${x}`).text((judge / param[x].yesterday_price).toFixed(2));
      if (judge > 0) {
        $(`.Amplitude${x}`).addClass("color-green").removeClass("color-red");
      } else {
        $(`.Amplitude${x}`).addClass("color-red").removeClass("color-green");
      }
    }
  }
}

start();
