const APP_KEY = "yz352001";
let GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";
var code_1 = 573004;
var product_code_ids = [573004];
// ix 中間層 api 用
const WS_BASE_URL = "wss://api.mircoinfolab.com:1315/websocket";
const HTTP_BASE_URL = "https://api.mircoinfolab.com:1315";
// 技術分析用
const TECH_ANA_URL = "https://api.bingxuegirl.com/inv/currencies";
const H5_BASE_URL = "https://www.se6868w.com";
// register.js 用
const baseUrl = 'https://api.mircoinfolab.com'
console.log(product_code_ids)
// var code_1 = ""
// var code_2 = ""
// var code_3 = ""
// var product_code_ids = [];
// if(vm.stock_1_name ==""){
// 	product_code_ids.push()
// }else{
// 	code_1 = vm.stock_1_id
// 	product_code_ids.push(code_1)
// }
// if(vm.stock_2_name ==""){
// 	product_code_ids.push()
// }else{
// 	code_2 = vm.stock_2_id
// 	product_code_ids.push(code_2)
// }
// if(vm.stock_3_name ==""){
// 	product_code_ids.push()
// }else{
// 	code_3 = vm.stock_3_id
// 	product_code_ids.push(code_3)
// }

// 573160 那只100etf 573159道瓊etf 573161標普500etf
// var product_code_ids = [573095, 573100, 573106];
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

  init: function () { },

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
    ws_request.init();
  });
}

// var ws_callback = new Object({
//   ws_init_success: function (socket) {
//     ws_request.login(socket);
//   },
//   ws_message_event: function (event) {
//     message_event(event);
//   },
//   ws_binary_event: function (binary_data) {
//     message_binary(binary_data);
//   },
//   ws_text_event: function (text_data) {
//     message_text(text_data);
//   },
// });

var ws_request = new Object({
  init: function (cb) {
    ws = new WebSocket(WS_BASE_URL);
    ws.onopen = () => {
      console.log("open connection");
      this.login(ws)
      // cb.ws_init_success(ws);
    };
    ws.onclose = () => {
      console.log("close connection");
    };
    ws.onmessage = (event) => {
      //cb.ws_message_event(event);
      if (event.data instanceof Blob) {
        // cb.ws_binary_event(event);
        message_binary(event)
      } else {
        try {
          // cb.ws_message_event(event.data);
          message_event(event.data)
        } catch (e) {
          // cb.ws_text_event(event.data);
          message_text(event.data)
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
    console.log(`進入productSubscription`);
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
    console.log(`進入lastPrice`);
    
    var _content = {
      code_ids: codeIds,
    };
    var request = this.getWsRequest("lastPrice", _content);
    ws.send(JSON.stringify(request));
  },
  uptrend: function (codeIds) {
    var _content = {
      code_ids: codeIds,
    };
    var request = this.getWsRequest("uptrend", _content);
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
  var msg = JSON.parse(event);
  var msg_code = msg.msg_code;
  console.log("code:" + msg_code);
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
    message_event(decodeURI(result));
  };
  reader.readAsArrayBuffer(blob);
}

function message_text(data) {
  let newData = data.slice(2,data.length-1);
  let split = newData.split(",");  
//   if (data.startsWith("p(")) {
//     var substring = data.substring(2, data.length - 1);
//     var split = substring.split(",");
    if (split.length < 7) {
      console.log("报价有误  " + data);
    }
    // console.log(split[0],productionInfo,`進入 message_text`)
    var product = productionInfo.find(function (element) {
      return element.id == split[0]*1;
    });
    if (product == null) return;

    var last = lastPriceInfo.find(function (element) {
      return element.code_id == split[0]*1;
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
    window.onload = function(){
      update_Last_info_ui(product)
    }
    updateElementDiv(product, realtimePrice, data, lastPrice);
//   } else {
//   }
}

// function updateUI(obj, data, event, last) {
//   console.log(obj, data, event, last)
  // if (product_div == null) {
  //   addElementDiv(obj, data, event, last);
  // } else {
  //   updateElementDiv(obj, data, event, last);
  // }
// }
let curPriceA = [];
let curPriceB = [];


function colorJudge(product, realtimePrice, allStock) {
  for (let x = 0; x < allStock.length; x++) {
    let y = allStock[x].id;
    let z = product.id;
    if (`${y}` === `${z}`) {
      curPriceA[x] = realtimePrice.curPrice;
      let b = curPriceB[x]?curPriceB[x]:curPriceA[x]
      let gap =(curPriceA[x]-b).toFixed(2)
      $(`.stock${x}`).text(curPriceA[x]);
      
      if (curPriceA[x] >= curPriceB[x]) {
        $(`.gap${x}`).text(`+${gap}`); 
        $(`.gap${x}`).addClass("color-green").removeClass("color-red");
        $(`.stock${x}`).addClass("color-green").removeClass("color-red");
      } else {
        $(`.gap${x}`).text(`${gap}`); 
        $(`.gap${x}`).addClass("color-red").removeClass("color-green");
        $(`.stock${x}`).addClass("color-red").removeClass("color-green");
      }
      console.log(gap)

      curPriceB[x] = curPriceA[x];
    }
  }
}

function updateElementDiv(product, realtimePrice, data, lastPrice) {
  // console.log(product,realtimePrice,lastPrice)
  let allStock = document.querySelectorAll(".stockarr");
  for (let x = 0; x < allStock.length; x++) {
    let y = allStock[x].id;
    let z = product.id;
    if (`${y}` === `${z}`) {
      $(`.stock${x}`).empty();
      colorJudge(product, realtimePrice, allStock);
      $(`.stock${x}`).text(data.curPrice);
      $(`.Wave${x}`).empty();
      let judge = (realtimePrice.curPrice - lastPrice.lastPrice).toFixed(2);
      if (judge > 0) {
        $(`.Wave${x}`).text(`+${judge}`);
      } else {
        $(`.Wave${x}`).text(`${judge}`);
      }
      let yesterdarwave = judge / lastPrice.lastPrice;
      let percent = (Math.round(yesterdarwave * 10000) / 100).toFixed(2) + "%";

      $(`.Amplitude${x}`).empty();
      $(`.Amplitude${x}`).text(`(${percent})`);
    }
  }
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
function update_Last_info_ui(product,realtimePrice,lastPrice) {
  console.log(product,`最後一口`)
  let allStock = document.querySelectorAll(".stockarr");
  for (let x = 0; x < allStock.length; x++) {
    let y = allStock[x].id;
    let z = product[x].code_id;
    
    if (y === `${z}`) {

      $(`.stock${x}`).text(product[x].cur_price);
      let judge = (product[x].cur_price - product[x].yesterday_price).toFixed(2);
      if (judge > 0) {
        $(`.Wave${x}`).addClass("color-green").removeClass("color-red");
        $(`.Wave${x}`).text(`+${judge}`);
      } else {
        $(`.Wave${x}`).addClass("color-red").removeClass("color-green");
        $(`.Wave${x}`).text(`${judge}`);
      }
      let yesterdarwave = judge / product[x].yesterday_price;
      let percent = (Math.round(yesterdarwave * 10000) / 100).toFixed(2) + "%"; 
      $(`.Amplitude${x}`).text(`(${percent})`);
      if (judge > 0) {
        $(`.Amplitude${x}`).addClass("color-green").removeClass("color-red");
      } else {
        $(`.Amplitude${x}`).addClass("color-red").removeClass("color-green");
      }
    }
  }
}
var urlString = location.href;
var url = new URL(urlString);
$(document).ready(function () {
  if (url.searchParams.get("colorType") == 1) {
    $("color-green").attr("font-size", "30px");
    $("color-red").attr("font-size", "30px");
  } else if (url.searchParams.get("or") == 2) {
    $(".color-green").attr("color", "#00ad88");
    $(".color-red").attr("color", "#e95a5a");
  }
});



start();