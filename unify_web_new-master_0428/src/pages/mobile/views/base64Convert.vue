<template>
    <div class='page'>
        <h2>base64转字符串</h2>
        <div class='messageBox'>
            <van-field v-model='message' :autosize='autosize' placeholder='请输入Base64字符' rows='1' type='textarea' />
            <van-button block class='mtop20' type='primary' @click='convert'>
                转换
            </van-button>
        </div>
        <div class='result'>
            {{ result }}
        </div>
    </div>
</template>

<script>
import { Field } from 'vant'
import { ungzip } from '@/utils/index'
import pako from 'pako'
import { Base64 } from '@/utils/base64'
export default {
    components: {
        [Field.name]: Field,
    },
    data () {
        return {
            message: '',
            result: '',
            autosize: { maxHeight: 450, minHeight: 200 }
        }
    },
    methods: {
        convert () {
            if (this.message.length === 0) return
            const charData = atob(this.message).split('').map(x => x.charCodeAt(0))
            const data = pako.inflate(new Uint8Array(charData))
            let strData = ''
            /**
             * String.fromCharCode.apply(null, array) 显示 Maximum call stack size exceeded
             * 超过最大调用堆栈大小
             *
             */
            const chunk = 8 * 1024
            let i
            const uint16Arr = new Uint16Array(data)
            for (i = 0; i < uint16Arr.length / chunk; i++) {
                strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk, (i + 1) * chunk))
            }
            strData += String.fromCharCode.apply(null, uint16Arr.slice(i * chunk))
            // const result = decodeURIComponent(String.fromCharCode.apply(null, new Uint16Array(data)))
            console.log(JSON.parse(Base64.decode(strData)))
        }
    },

}
</script>

<style lang="scss" scoped>
.page {
    padding: 20px;
}
.mtop20 {
    margin-top: 20px;
}
.messageBox {
    padding-top: 20px;
}
</style>
