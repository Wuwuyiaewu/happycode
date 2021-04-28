<template>
    <div v-if='langList.length>1' class='languageDiv'>
        <div class='lang' @click='langShow=true'>
            {{ lang=="zh-CN"?$t('changeLang.chinese'):$t('changeLang.english') }}<i class='lang-icon' :class="{ 'cn':lang=='zh-CN','en':lang=='en-US' }"></i>
        </div>
        <van-dialog v-model='langShow' :confirm-button-text="$t('compLang.cancel')" :show-cancel-button='false' :show-confirm-button='true' :title="$t('changeLang.tips1')">
            <div class='content' @click='changeLang'>
                <i class='lang-icon' :class="{ 'cn':lang!='zh-CN','en':lang!='en-US' }"></i><span class='langText'>
                    {{ lang!="zh-CN"?$t('changeLang.chinese'):$t('changeLang.english') }}
                </span>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import { localSet, localGet, localRemove, removeLoginData, getLoginData } from '@/utils/index'
import { login } from '@/api/login'

export default {
    name: 'ChangeLang',
    data () {
        return {
            langShow: false,
        }
    },
    computed: {
        langList () {
            return JSON.parse(localStorage['langList'] || '[]')
        },
        lang () {
            return localStorage.getItem('lang')
        },
        loginData () {
            return JSON.parse(localStorage['loginData'] || '{}')
        }
    },
    created () {
        console.log('langList', this.langList)
    },
    methods: {
        changeLang () {
            let currentLang = localStorage["lang"]
            for(let i=0;i<this.langList.length;i++){
                if(this.langList[i].language!=currentLang){
                    localStorage.setItem('lang', this.langList[i].language)
                    localStorage.setItem('appKey', this.langList[i].appKey)
                }
            }
            localRemove('localLangPackage')
            localRemove('localLangUpdateTime')
            if (sessionStorage['userInfo']) {
                this.autoLogin()
            } else {
                window.location.href = window.location.href
            }
        },
        logout () {
            this.$mSocket
                .send('logout', {
                    company_id: this.$store.state.ix_user.userLoginInfo.company_id,
                    account_id: this.$store.state.ix_user.userLoginInfo.account_id,
                    account_no: this.$store.state.ix_user.userLoginInfo.account_no
                })
                .then(() => {
                    // removeLoginData()
                    console.log('this.loginData', this.loginData)
                    this.autoLogin()
                    // window.location.href = location.protocol+"//"+location.host+"/"+this.langList[0].appKey+"/home";
                })
                .catch(() => {
                    // this.autoLogin();
                })
        },
        // 自动登录
        autoLogin (callback) {
            console.log('123132', this.loginData)
            this.loading = this.$toast.loading({
                mask: true,
                duration: 0,
                message: ''
            })
            this.$store.dispatch('login', {
                accountNo: this.loginData.accountNo,
                passWord: this.loginData.passWord
            }).then(res => {
                if (this.loading) this.loading.clear()
                this.loading = null
                console.log('login', res)
                if (res.code === 1 && callback) callback()
                location.href = location.href
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.languageDiv{
    float:right;
    border: 1px solid #88888888;
    border-radius: 6px;
    padding: 0 8px;
    margin-right: 15px;
    .lang{
        font-size:14px;
        color:#888888;
    }
    .lang-icon{
            width:23px;
            height:15px;
            display:inline-block;
            background-repeat: no-repeat;
            background-size:100%;
            position: relative;
            top: 2px;
            margin-left: 6px;
        }
    .cn{
        background-image:url(~@public/images/cn.png);
    }
    .en{
        background-image:url(~@public/images/en.png);
    }
    .content{
        text-align:center;
        margin:20px;
        .langText{
            margin-left:10px;
        }
    }
}
</style>
