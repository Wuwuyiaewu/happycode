# ix_listenSocket.js 使用指南

> ix_listenSocket.js 是用来监听 websocket 的消息，并收集交易相关的依赖数据。它并不会维护 websocket 本身，需要业务自己发送心跳，处理断线重连等信息。

## 引入

```js
import Listen from '@/store/ix_listenSocket'
```

## 使用

```js
// 在创建websocket实例之后，立即调用Listen方法监听
// Listen监听到的websocket消息都管理在vuex里面，所以还需要传入store
const ws = new WebSocket('ws://****')
Listen(ws, store)
```

## ix_listenSocket.js 做与不做的事情

### ix_listenSocket.js 做的事情

-   会收集 websocket 里面所有与用户、产品、持仓相关的信息，所有的信息都存储在 store 下面的`ix_**`模块下面
-   会在用户退出`UserLogoutRet`或者被强制退出`UserForceLogoutRet`时，会自动清空 store 下面的`ix_**`模块中存储的数据
-   会在获取到交易时间列表`GroupTradeTimeListRet`时，判断到没有获取到完整数据时，自动发出请求下一页的数据，直到获取到所有的交易时间列表数据
-   会在获取到用户组类型列表`GroupSymbolListRet`时，判断到没有获取到完整数据时，自动发出请求下一页的数据，直到获取到所有的用户组类型列表数据
-   会在获取到持仓记录列表`PositionListRet`时，判断到没有获取到完整数据时，自动发出请求下一页的数据，直到获取到所有的持仓记录列表数据
-   会在用户信息、持仓信息更新时，自动拉取持仓列表
-   会在获取到用户组信息时，自动请求交易服务器信息

### ix_listenSocket.js 不做的事情

-   业务需要自己维护 websocket 心跳，在收到`HeartBeatConf`时，存储心跳配置，在登录成功`UserLoginInfoRet`时开始发送心跳；在用户退出后取消发送心跳，否则服务器会进行报错；
-   业务需要自己维护 websocket，在 websocket 异常或者关闭后进行重连，重连成功后需要再次调用`Listen(ws, store)`监听新的 websocket
-   业务在订阅产品时需要一起订阅持仓的产品、基础产品(见解释 1)
-   业务需要自己判断持仓记录列表`PositionListRet`拉取成功(见解释 2)后订阅持仓的产品

解释 1：基础产品
`/account/appProperties/getAccountProperties`接口返回的`data.transBaseConfigVo`下面的`usdcnyCodeid`和`usdhkdCodeid`;
解释 2：持仓记录列表拉取成功
收到`PositionListRet`命令是，判断 `if (content.total === content.offset)` 则已经拉取到完整的持仓列表数据；
