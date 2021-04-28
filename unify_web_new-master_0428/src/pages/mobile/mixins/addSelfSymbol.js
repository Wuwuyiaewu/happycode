export default {
    data () {
        return {
            fakeNavVisible: '',
            isAnimation: [],
            animationed: [],
            SelfSymbolIndex: -1
        }
    },
    mounted () {
        const fakeNav = this.$refs.fakeNav
        fakeNav.navList.forEach((el, i) => {
            if (el.name === 'SelfSymbolIndex') fakeNav.active = this.SelfSymbolIndex = i
        })
    },
    methods: {
        /* 添加自选动画 start */
        // 添加自选动画
        addSelfSymbolAnimation (collectRect, collect) {
            if (this.SelfSymbolIndex === -1) return false
            const { x, y } = this.getSelfSymbolPosition()
            const yLen = y - collectRect.top // Y轴动画距离
            const animateTime = Math.max(0.5, 0.6 / 400 * yLen)
            const collectStyle = getComputedStyle(collect)
            const animatWrapper = document.createElement('span')
            const animatWrapperCss = `position: absolute;
                            left: 0px;
                            top: ${collectRect.top}px; 
                            transition: all ${animateTime}s linear;
                            z-index: 99;`
            animatWrapper.style.cssText = animatWrapperCss
            const animatIcon = collect.cloneNode()
            animatIcon.setAttribute('class', 'icon_zixuan2 collected')
            animatWrapper.appendChild(animatIcon)
            document.body.appendChild(animatWrapper)
            this.animatIconEvent(animatWrapper)
            console.log(y - collectRect.top)
            const animatIconCss = `position: absolute; top:0;
                            left: ${collectRect.left}px;
                            font-size: ${collectStyle.fontSize};
                            transition: all ${animateTime}s cubic-bezier(.03,.12,.29,.98);
                            color: #fc822f;`
            animatIcon.style.cssText = animatIconCss
            this.fakeNavVisible = 'upIn'
            this.isAnimation.push(true)
            // return false;
            setTimeout(() => {
                animatWrapper.style.top = `${y}px`
                animatIcon.style.left = `${x}px`
            }, 300)
            setTimeout(() => {
                animatIcon.style.opacity = 0
            }, 800)
        },
        // 获取自选导航的位置
        getSelfSymbolPosition () {
            const fakeNav = this.$refs.fakeNav
            if (!fakeNav) return null
            const selfSymbolEl = fakeNav.$el.querySelector('.van-tabbar-item--active')
            const rect = selfSymbolEl.getBoundingClientRect()
            const y = rect.top
            const x = rect.left + rect.width / 2
            return { x, y }
        },
        // animatIcon动画结束后删除DOM元素
        animatIconEvent (el) {
            let flag = true
            const fakeNavEl = this.$refs.fakeNav.$el
            el.addEventListener('transitionend', () => {
                if (!flag) return false
                flag = false
                this.animationed.push(true)
                if (this.animationed.length === this.isAnimation.length) this.fakeNavVisible = 'downOut' // 所有动画结束后隐藏底部导航
                document.body.removeChild(el)
            }, false)

            fakeNavEl.addEventListener('webkitAnimationEnd', () => {
                if (this.fakeNavVisible === 'downOut') {
                    setTimeout(() => {
                        this.fakeNavVisible = ''
                    }, 500)
                };
            }, false)
        }
        /* 添加自选动画 end */
    },
}
