<template>
  <div class="Pic">
    <h1>This is an Pic page</h1>
    <div class="bigPic">{{$route.params.id}}</div>
  </div>
</template>
<style>
.bigPic {
  width: 600px;
  height: 400px;
  border: 5px solid;
  margin: 0;
}
</style>
