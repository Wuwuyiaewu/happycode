<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/pic">PicList</router-link> |
      <router-link to="/pic/1">Pic 1</router-link> |
      <router-link to="/pic/2">Pic 2</router-link> |
    </div>
    <router-view/>
    <div class="lightbox" v-show="$route.meta.lightbox">
      <div class="content">
        <router-view name="lightbox"></router-view>
      </div>
    </div>
  </div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
  border: 0;
}
.lightbox{
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.lightbox .content{
  width: 800px;
  height: 600px;
  background: #fff;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
