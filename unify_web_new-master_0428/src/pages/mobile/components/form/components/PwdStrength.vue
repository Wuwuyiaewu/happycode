<template>
    <div class='pwd-strength-wrap'>
        <div class='tip'>
            {{ $t('resetPwd.pwdTip') }}
        </div>
        <div class='flgs'>
            <div class='flg' :class="{ 'statusA':pwdStatus==='statusA' }">
                {{ $t('resetPwd.pwdStatusA') }}
            </div>
            <div class='flg' :class="{ 'statusB':pwdStatus==='statusB' }">
                {{ $t('resetPwd.pwdStatusB') }}
            </div>
            <div class='flg' :class="{ 'statusC':pwdStatus==='statusC' }">
                {{ $t('resetPwd.pwdStatusC') }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PwdStrength',
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    computed: {
        pwdStatus () {
            return this.inputpwd(this.value)
        }
    },
    methods: {
        inputpwd (val) {
            // 密码强度规则：
            // 单字符（大写字母或小写字母或数字），6<=长度<=16———低；
            // 双字符（大写字母、小写字母、数字两两组合），
            // 6<=长度<=16———中；三字符（大写字母+小写字母+数字），6<=长度<=16———高
            let result = ''
            if (/^[0-9]{6,16}$/.test(val) || /^[a-z]{6,16}$/.test(val) || /^[A-Z]{6,16}$/.test(val)) {
                result = 'statusA'
            } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(val)) {
                if (/^[0-9a-z]{6,16}$/.test(val) || /^[0-9A-Z]{6,16}$/.test(val) || /^[A-Za-z]{6,16}$/.test(val)) {
                    result = 'statusB'
                } else {
                    result = 'statusC'
                }
            }

            return result
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@m/sass/mixin.scss";
.pwd-strength-wrap {
    .flgs {
        display: inline-flex;
        width: rem(220px);
        margin: rem(14px) rem(20px) rem(20px) 0;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        .flg {
            flex: 0 0 32%;
            height: rem(30px);
            line-height: rem(30px);
            text-align: center;
            border-radius: rem(4px);
            font-size: rem(20px);
            color: #c4c4c4;
            margin: rem(2px);
            background-color: #fff;
            display: inline-block;
            &.statusA {
                background-color: #e3525c;
                color: #fff;
            }
            &.statusB {
                background-color: #f39800;
                color: #fff;
            }
            &.statusC {
                background-color: #11b873;
                color: #fff;
            }
        }
    }

    .tip {
        font-size: rem(18px);
        line-height: rem(20px);
        color: #848484;
        margin-top: rem(12px);
        white-space: nowrap;
    }
}
</style>
