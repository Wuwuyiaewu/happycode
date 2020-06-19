const APP_KEY = "JW666key";
const WS_BASE_URL = "wss://api.dragonfly8.com/websocket";
const HTTP_BASE_URL = "https://api.dragonfly8.com";
const GET_ACCOUNT_PROPERTIES = "/account/appProperties/getAccountProperties";

var wsUri = WS_BASE_URL;
var output;
function init() {
  output = document.getElementById("output");
  testWebSocket();
}
function testWebSocket() {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function (evt) {
    onOpen(evt);
  };
  websocket.onclose = function (evt) {
    onClose(evt);
  };
  websocket.onmessage = function (evt) {
    onMessage(evt);
  };
  websocket.onerror = function (evt) {
    onError(evt);
  };
}
function onOpen(evt) {
  writeToScreen("CONNECTED");
  doSend({"head":{"server":"yz","msgType":"login","sendTime":1592548680698,"Authorization":"Bearer e96da9c48300715d4de6f00c8f94c9f3","lang":"zh-CN"},"content":{"company_id":"332005","login_name":"Guest","password":"","user_type":1,"appKey":"JW666key","clientIp":"100.117.155.219"},"device":"h5","trace":"6133ee14-1562-4a41-97fe-e4a0b178aa5f","version_code":1});
}
function onClose(evt) {
  writeToScreen("DISCONNECTED");
}
function onMessage(evt) {
  writeToScreen("RESPONSE: " + evt.data + "");
  websocket.close();
}
function onError(evt) {
  writeToScreen("ERROR: " + evt.data);
}
function doSend(message) {
  writeToScreen("SENT: " + message);
  websocket.send(message);
}
function writeToScreen(message) {
  var pre = document.createElement("p");
  pre.style.wordWrap = "break-word";
  pre.innerHTML = message;
  output.appendChild(pre);
}
window.addEventListener("load", init, false);
