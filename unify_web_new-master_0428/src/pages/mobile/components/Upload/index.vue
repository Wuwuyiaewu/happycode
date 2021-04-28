<template>
    <!--用于单张上传的-->
    <div class='upload'>
        <van-uploader
            v-show='!disabled'
            :accept='accept'
            :after-read='afterRead'
            :before-read='beforeRead'
            :name='name'
        />
        <div class='upload-area'>
            <van-icon
                v-if='!disabled && imgSrc'
                class='delete-icon'
                name='clear'
                @click='removeImg'
            />
        </div>
        <template v-if='!imgSrc'>
            <img class='img' :src='defaultImg' />
        </template>
        <div
            v-else
            class='img-src'
            :style="{
                'backgroundImage': `url(${changeImgUrl(imgSrc)})`,
                'backgroundPosition': 'center center',
                'backgroundRepeat': 'no-repeat',
                'backgroundSize': 'cover'
            }"
        ></div>
        <p v-if='isEditor && !disabled' class='re-upload'>
            <span>{{ $t('other.reUpload') }}</span>
        </p>
        <p class='name'>
            <slot></slot>
        </p>
    </div>
</template>

<script>
import img from './img/card-img.png'
import { uploadError } from '@/utils/funds/index'
import { uploadUrl } from '@/api/upload'
import { Toast, Uploader } from 'vant'

export default {
    name: 'Upload',
    components: {
        [Uploader.name]: Uploader
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        imgSrc: { // 图片路径
            type: String,
            default: ''
        },
        accept: {
            type: String,
            default: 'image/png,image/jpeg'
        },
        isEditor: {
            type: Boolean,
            default: false
        },
        defaultImg: {
            type: String,
            default: img
        },
        disabled: {
            type: Boolean,
            default: false // 是否可以继续上传
        }
    },
    data () {
        return {
            token: ''
        }
    },
    computed: {
        accountInfo () {
            return this.$store.state.ix_user.info ? this.$store.state.ix_user.info.transBaseConfigVo : {}
        },
        platform () {
            return this.accountInfo.platform
        }
    },
    created () {
        this.token = sessionStorage.getItem('authorization__' + window.htmlKey).slice(7)
    },
    methods: {
        beforeRead (file) {
            this.$toast.loading(this.$t('other.uploading') + '...', 10000)
            return true
        },
        removeImg () {
            this.$emit('onComplete', {
                url: '',
                name: this.name,
                success: true
            })
        },
        afterRead ({ file }) {
            console.log(file)
            // 限制智能上传图片
            const name = this.name
            const imgTypeList = ['jpg', 'jpeg', 'png']
            console.log(file.name.substr(file.name.lastIndexOf('.') + 1))
            if (imgTypeList.indexOf(file.name.substr(file.name.lastIndexOf('.') + 1)) < 0) {
                this.$toast(this.$t('other.imgTypeError'))
                return
            }
            if (file.size / 1024 / 1024 > 10) {
                this.$toast(this.$t('other.imgSizeError'))
                return
            }
            const formData = new FormData() // 创建form对象
            formData.append('file', file)
            formData.append('token', this.token)
            formData.append('platform', this.platform)
            console.log('uploadUrl', uploadUrl)
            uploadUrl(formData).then(res => {
                this.$toast.clear()
                if (res.code === this.$fundsCode) {
                    this.$emit('onComplete', {
                        url: res.data.url,
                        name,
                        success: true
                    })
                } else {
                    if (res.msgCode === 'A_OTHER_ERRER') {
                        this.$toast(this.$t('other.uploadFail'))
                    } else {
                        this.$toast({
                            duration: 1000,
                            message: this.$te('retMsg.' + res.msgCode)
                                ? this.$t('retMsg.' + res.msgCode)
                                : res.msg
                        })
                    }
                    this.$emit('onComplete', {
                        url: this.defaultImg,
                        name,
                        success: false
                    })
                }
            }).catch((res) => {
                this.$toast(this.$t('other.uploadFail'))
                this.$emit('onComplete', {
                    url: this.defaultImg,
                    name,
                    success: false
                })
            }).finally(() => {
            })
        },
        onReaderSelect (name, { files }) {
            this.$toast.loading(this.$t('other.uploading') + '...', 10000)
        },
        onReaderComplete (name, { dataUrl, blob, file }) {
            const formData = new FormData() // 创建form对象
            formData.append('file', file)

            uploadUrl(formData).then(res => {
                this.$toast.clear()
                if (res.code === this.$fundsCode) {
                    this.$emit('onComplete', {
                        url: res.data.url,
                        name,
                        success: true
                    })
                } else {
                    this.$toast(res.msg)
                    this.$emit('onComplete', {
                        url: this.defaultImg,
                        name,
                        success: false
                    })
                }
            }).catch((res) => {
                this.$toast(this.$t('other.uploadFail'))
                this.$emit('onComplete', {
                    url: this.defaultImg,
                    name,
                    success: false
                })
            }).finally(() => {
            })
        },
        onReaderError (name, { msg, code }) {
            this.$toast(uploadError(code))
        },
        changeImgUrl (url) {
            if (url.indexOf('http://img.fxpm-trade.com') > -1) {
                return url.replace(/^http/, 'https')
            }
            return url
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@m/sass/mixin.scss";

.upload {
    position: relative;
    height: rem(432px);

    .upload-area {
        position: absolute;
        width: rem(542px);
        height: rem(334px);
        left: 50%;
        top: 50%;
        margin-left: rem(-271px);
        margin-top: rem(-167px);
        background: #eef5ff url(./img/scan.png) no-repeat center center;
        background-size: rem(452px) rem(271px);
        .delete-icon{
            position: absolute;
            top: 0;
            right: 0;
            z-index: 101;
            transform: translate(50%, -50%);
            color: $muted;
            font-size: rem(50px);
        }
    }
    .re-upload {
        font-size: rem(26px);
        line-height: rem(36px);
        color: #497fd3;
        text-align: center;
        position: absolute;
        width: 100%;
        bottom: rem(56px);
    }
    ::v-deep {
        .van-uploader,
        .van-uploader__wrapper,
        .van-uploader__upload {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            background-color: transparent;
        }
        .van-uploader__preview-delete {
            font-size: rem(45px);
            right: 0;
            top: 0;
            transform: translate(50%, -50%);
            z-index: 101;
            color: #bdbdbd;
        }
        .van-uploader {
            position: relative;
            z-index: 100;
            opacity: 0;

            .van-uploader__upload {
                margin: 0;
                .van-icon {
                    display: none;
                }
            }
            .van-uploader__wrapper {
                width: rem(542px);
                left: 50%;
                top: 50%;
                margin-left: rem(-271px);
                margin-top: rem(-167px);
            }
        }
    }
    .img {
        width: rem(428px);
        height: rem(246px);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(rem(-218px), rem(-123px));
        z-index: 98;
    }
    .img-photo {
        width: rem(100px);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        display: none;
    }
    .img-src {
        width: rem(428px);
        height: rem(246px);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(rem(-218px), rem(-123px));
        z-index: 3;
    }
    .name {
        position: absolute;
        bottom: rem(-22px);
        left: 50%;
        transform: translateX(-50%);
        font-size: rem(24px);
        line-height: rem(36px);
        z-index: 100;
        color: $text;
        font-weight: bold;
    }
}
</style>
