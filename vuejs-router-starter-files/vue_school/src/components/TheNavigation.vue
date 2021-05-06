<template>
  <div id="nav">
      <p class="logo">The JF router</p>
    <ul class="nav-links">
        <li class="links">
            <router-link to="/">Home</router-link>
        </li>
        <li class="links" v-for="destination of destinations" :key="destination.name">
            <router-link :to="{name:'DestinationDetails',params:{sl:destination.slug}}">{{destination.name}}</router-link>
        </li>
    </ul>
  </div>
</template>
<script>
import store from '@/store'
export default {
    data(){
        return{
            destinations:store.destinations
        }
    }
}
</script>
<style scoped>
#nav {
  display: flex;
  justify-content: center;
  padding: 30px;
}
.nav-links{
    display: flex;
}
.links{
    padding-right: 20px;
    list-style: none;
}
.links:hover{
    text-decoration: none;
}
.logo{
    font-size: 20px;
    color:purple;
    font-weight: bold;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 0 10px;
}

#nav a.router-act {
  color: #ab26ab;
}
</style>
