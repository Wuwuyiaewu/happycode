<template>
    <div class='layer-module-container'>
        <div v-if='showTitle' class='module-title'>
            <a v-if="$route.name==='AddBank'" href="javascript:void(0)" @click="bankCallback" class="left"><i class="icon_icon_back"></i></a>
            <!-- <router-link v-if="$route.name==='AddBank'" :to="{name:'BankList'}" class="left"><i class='icon_icon_back'></i></router-link> -->
            <router-link v-else-if="$route.name==='CapitalFlow' && $route.params.type * 1 === 2" :to="{name:'WithAmount'}" class="left"><i class='icon_icon_back'></i></router-link>
            <router-link v-else-if="['PayInfo'].indexOf($route.name)>-1" :to="{name:'DepositFunds'}" class="left"><i class='icon_icon_back'></i></router-link> 
            {{ title }}
            <i class='icon_icon_close_big' @click='closeRouter'></i>
        </div>
        <div class='module-content'>
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            showTitle: false,
        }
    },
    watch: {
        $route (to, from) {
            this.title = this.$t(`${to.meta.title}`)
            this.showTitle = to.meta.showTitle
            // console.log('to.meta', to.meta);
        },
        '$route.meta.showTitle' (val) {
            this.showTitle = val
        }
    },
    created () {
        this.title = this.$t(`${this.$route.meta.title}`)
        this.showTitle = this.$route.meta.showTitle
    },
    activated () {
        this.showTitle = this.$route.meta.showTitle
    },
    methods: {
        bankCallback(){
           this.$router.back()
        },
        closeRouter () {
            this.$router.replace({name:'Layout'})
           // this.$router.back()
        },
    },
}
</script>

<style lang="scss" scoped>
.layer-module-container {
    .module-title {
        font-size: 20px;
        text-align: center;
        line-height: 28px;
        position: relative;
        padding-top: 10px;
        .left{
            position: absolute;
            left:10px;
            color: #666;
        }
       & > i {
            position: absolute;
            right: 20px;
            cursor: pointer;
        }
    }
    .module-content {
        height: fit-content;
        overflow: auto;
        border-radius: 6px;
        overflow: hidden;
    }
}
</style>
