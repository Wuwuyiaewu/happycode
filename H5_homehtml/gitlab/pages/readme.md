## 内嵌首页代码包使用说明

#### 使用到的JS代码库
---
base.js文件包含了Seajs,jquery,artTemplate,Fastclick,Dialog 代码库
---
* [seajs-cmd模块加载器](https://seajs.github.io/seajs/docs/)
* [jquery-dom操作库](https://jquery.com/download/)
* [artTemplate-模板引擎](https://aui.github.io/art-template/zh-cn/)
* [swiper-轮播](https://www.swiper.com.cn/)
* [fastclick-去掉click 300ms延时](https://github.com/ftlabs/fastclick)
* [弹窗反馈组件](http://sufangyu.github.io/project/dialog2/dist/demos/)

---
#### js目录结构说明
* 公用的第三方代码库存储在js的目录下
* module存放模块相关的js代码(main为入口文件)
* 页面html模板存放在index.html 



#### 开发规范
* module暴露出init的方法，留给main模块初始化(在main里边插入了承载页面模块的元素，并把dom的id传入给模块代码)
* 需要绑定事件的元素加上[evt-xxx]的class，并在改class上不要添加任何样式，请不要轻易移除元素上的这个class
* html里边的 ts变量使用来给静态文件防止缓存使用的，发布生产环境的时候需要修改改成固定的字符串
* 关于GA埋点，目前还没有处理，给出的方案是给需要埋点的元素加上私有属性 data-ga='test'，然后代理body的点击事件统一处理
* 关于页面跳转：1、出入金包含了单点登录需要有固定的写法 入金【/toDepositDrawings?id=deposit】，出金【/toDepositDrawings?id=drawings】 2、需要跳转方式当前是代理统一处理，规则如下：（1）必须是a元素，并且a元素包含私有属性【data-src】,当【data-target】，属性值为_self时，在中间层的iframe打开，当为_blank时为浏览器新开窗口打开
* 首页会合并所有模块的行情请求，3秒轮询一次行情获取的数据保存在localstorage里边。当前方案：1、首页500ms轮询localstorage的codeIds，当codeIds内容发生变化以后结束前一次轮询，使用新的codeIds重新开启新的轮询

#### 代码部署
任意一个静态资源服务器部署就可以了，然后把地址填入appAdmin后台首页地址栏即可
