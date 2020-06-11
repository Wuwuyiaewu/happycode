//使用 WebSocket 的網址向 Server 開啟連結
// let ws = new WebSocket('wss://api.dragonfly8.com/v/websocket')

//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
// ws.onopen = () => {
//     console.log('open connection')
// ws.send(
//   '{"head":{"server":"yz","msgType":"login","sendTime":1591764739841,"Authorization":"Bearer ac289cb6cbd7531a75e4588c9aba8a45","lang":"zh-CN"},"content":{"company_id":"332005","login_name":"Guest","password":"","user_type":1,"appKey":"JW666key","clientIp":"100.117.155.246"},"device":"h5","trace":"7d0f5fc8-02a8-4b75-bcde-e66f60f5531e","version_code":1}'
// );
//     ws.send('{"head":{"server":"yz","msgType":"lastPrice","sendTime":1591764740088},"content":{"code_ids":[573153,573044]},"device":"h5","trace":"27ffe164-20f7-4a26-8dda-bcfb970e396e","version_code":1}')
//     ws.send('{"head":{"server":"yz","msgType":"productSubscription","sendTime":1591764740088},"content":{"subscribeType":"reSubscribe","code_ids":[573153,573044],"type":"yz"},"device":"h5","trace":"e72a45f3-b506-42c6-b721-08a2f36d0e45","version_code":1}')
// }
let ws = new WebSocket("wss://api.dragonfly8.com/i/websocket");
let data = "";
ws.onopen = () => {
  console.log("open connection");
  ws.send(
    '{"head":{"server":"yz","msgType":"login","sendTime":1591866642699,"Authorization":"Bearer a0318d1d10b71f90c60971725704d049","lang":"zh-CN"},"content":{"company_id":"332005","login_name":"Guest","password":"","user_type":1,"appKey":"JW666key","clientIp":"100.117.155.190"},"device":"h5","trace":"d7815c8b-6fe8-4734-8a7d-2b5fdf20eb1d","version_code":1}'
  );
  ws.send(
    '{"head":{"server":"yz","msgType":"ping","sendTime":1591866745729},"content":{"beat":1},"device":"h5","trace":"cb8f03e8-8906-497c-a063-d26b12158ede","version_code":1}'
  );
  ws.send(
    '{"head":{"server":"yz","msgType":"lastPrice","sendTime":1591866643926},"content":{"code_ids":[573097,573106,573100],"company_id":"332005"},"device":"h5","trace":"1ec2bad4-e28b-4abc-8100-233173dd1981","version_code":1}'
  );
};

//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
  console.log("close connection");
};

//接收 Server 發送的訊息
ws.onmessage = (event) => {
  let position = event.data.indexOf("msg_code");
  console.log(position);
  data = event.data.slice("26", "566");
  let detail = data.split();
  let hk = document.getElementById("hk");
  let yb = document.getElementById("yb");
  let tx = document.getElementById("tx");
  console.log(detail, typeof data);
  // switch (data[0] * 1) {
  //   case 573097:
  //     hk.innerHTML = `香港交易所${data[1]}`;
  //     break;
  //   case 573106:
  //     yb.innerHTML = `友邦${data[1]}`;
  //     break;
  //   case 573100:
  //     tx.innerHTML = `騰訊${data[1]}`;
  //     break;
  //   default:
  //     break;
  // }
};
