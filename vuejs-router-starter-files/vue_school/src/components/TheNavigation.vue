<template>
  <div id="nav">
      <p class="logo">The JF router</p>
    <ul class="nav-links">
        <li class="links">
            <router-link to="/">Home</router-link>
        </li>
        <li class="links" v-for="destination of destinations" :key="destination.name">
            <router-link :to="{name:'DestinationDetails',params:{id:destination.id}}">{{destination.name}}</router-link>
        </li>
    </ul>
  </div>
</template>
<script>
import store from '@/store'
export default {
    data(){
        return{
            destinationId:this.$route.params.id,
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
.link{
    padding-right: 20px;
    list-style: none;
}
.link:hover{
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
