<template>
  <div class="PicList">
    <h1>This is an PicList page</h1>
    <router-link to="/pic/1" class="pic">1</router-link>
    <router-link to="/pic/2" class="pic">2</router-link>
  </div>
</template>
<style>
.pic{
  display: inline-block;
  width: 150px;
  height: 100px;
  border: 1px solid #000;
  margin: 10px;
}
</style>
