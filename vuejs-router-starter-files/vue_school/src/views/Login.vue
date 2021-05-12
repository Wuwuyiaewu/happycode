<template>
  <div class="login">
    <h1>Login</h1>
    <div class="form">
      <label for="username">Username</label
      ><input type="text" name="username" class="input" v-model="username"/><label for="password"
        >Password</label
      ><input type="text" class="input" v-model="password"/><button class="btn" @click="login">Login</button>
    </div>
  </div>
</template>
<script>
import store from '@/store'
export default {
    data(){
        return{
            username:null,
            password:null
        }
    },
    methods:{
        login(){
            store.user = this.username
            const redirectPath = this.$route.query.redirect || '/';
            this.$router.push(redirectPath)
        }
    }
}
</script>
<style scoped>
.form{
    display: flex;
    flex-direction: column;
    max-width: 400px;
    margin: 0 auto;
}
</style>