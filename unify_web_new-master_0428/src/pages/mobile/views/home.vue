<template>
  <div>
    <!-- edit by Ezey -->
    <ul>
      <li>
        <router-link :to="{ name: 'HomeProduct', params: { id: 573004 } }">
          573004
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'HomeProduct', params: { id: 513015 } }">
          513015
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'HomeProduct', params: { id: 573005 } }">
          573005
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'HomeProduct', params: { id: 573010 } }">
          573010
        </router-link>
      </li>
    </ul>
    <div class="box">
      <router-view v-if="showProduct" />
      <router-view v-if="showOrder" :key="showOrder" name="order" v-on:orderSuccess="orderSuccess"/>
      <router-view v-if="showSuccess" name="orderSuccess" />
    </div>
  </div>
</template>

<script>
import geoPermission from "@/pages/mobile/mixins/geoPermission.js";
export default {
  name: "Home",
  components: {},
  mixins: [geoPermission],
  data() {
    return {
      currentProductId: 573004,
      showProduct:true,
      showOrder: false,
      showSuccess:false
    };
  },
  watch: {
    $route({ query , name}) {
        // console.log(name);
      if (query && query.direction) {
        this.showProduct =false
        this.showOrder = query.direction;
        return;
      }else{
          this.showProduct = true
          this.showOrder = true
          this.showSuccess = true
      }
      this.showOrder = null;
    },
  },
  methods:{
      orderSuccess(value){
          console.log('showSuccess', value);
          let vm = this
          vm.showOrder = false
          vm.showSuccess = value
      }
  }
};
</script>

<style lang="scss" scoped>
// .productDetail{
//     width: 3rem;
//     height: 5rem;
//     border: 1px solid red;
// }
.box{
    position: relative;
    width: 9rem;
    height: 10rem;
    margin: 0 auto;
    border: 1px solid red;
}
#topNav .left{
    display: none !important;
}
</style>
