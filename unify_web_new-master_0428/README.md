# 公版客户端 H5 版

> `unify_web` 是一个轻量级 C 端交易平台，它基于 `vue` + `vant` + `webpack` 实现。它使用了最新的前端技术栈，实现了异步路由，按需加载，缓存优化，提炼了精简的前端架构，使用`ESLint+VSCode`效验代码并统一风格，目前只支持移动端访问。  
> 目前编译后前端架构部分的体积占 `72KB`，为保持页面的轻量和快速响应，如无必要不允许在框架部分引入新的插件；

## 技术栈

-   webpack
-   vue
-   axios
-   vuex
-   vue-router
-   sass
-   ES6/7+

## 特性

-   轻量灵活
-   模块化
-   自定义换肤
-   扩展性强
-   标准规范
-   链接设计更符合常理

## 路由

### 链接设计

页面路由采用`mode: 'history'`模式；  
基路径设置为`base: '/' + location.pathname.split('/')[1]`，其实也就是公司 id；

所以比如登录页面的访问地址实际上是 `localhost:8085/aaa/login`， 路径的第一层 `aaa` 实际上是公司名称，后面的`/login`才是真正的路由地址；这样设计的原因是每个页面的地址都有可能暴露出去(登录页，注册页，首页，交易页等)，公司 id 以参数的形式跟在链接后面可能会造成参数丢失。  
比起`https://www.kyqymp.com/static/trade.html#/deal/trade?company=TkU`， 这种链接也更容易让人接受。

### 路由切换

路由切换使用 `keep-alive`，所以在定义路由的时候必须为每个路由设置 `name`；

```js
{
    path: '/login',
    name: 'Login',     // 必须设置name
    component: () => import('./views/login.vue')
}
```

```html
<keep-alive :include="cachedViews">
    <router-view class="pageRouter" :key="key" />
</keep-alive>
```

不是所有的页面都需要`keep-alive`缓存，在特定的场景下也需要重新创建页面，所以`clearCacheView`是你需要的：

```js
clearCacheView() {
    this.$store.dispatch('tagsView/delView', { name: 'Login' })         // 对应路由里面的name值
}
```

## 开发

```
npm install
```

### 运行开发模式

```
npm run serve
```

### 构建生产环境代码

```
npm run build
```

### Lints and fixes files

```
npm run lint
```
