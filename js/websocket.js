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
    "httpMethod": "post"
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

$.ajax(settings).done(function (response) {
  var accountProperties = response.data;
  // console.log(accountProperties);
  var transBaseConfigVo = accountProperties.transBaseConfigVo;
  var toKenCompanyInfoVo = accountProperties.toKenCompanyInfoVo;
  config.companyid = transBaseConfigVo.companyId;
  config.platform = transBaseConfigVo.platform;
  account.clientIp = accountProperties.clientIp;
  account.accountType = toKenCompanyInfoVo.accountType;
});