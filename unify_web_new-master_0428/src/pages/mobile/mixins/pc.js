export default {
    computed: {
        isPC () {
            return window['isPC']
        },
    },
    methods: {
        goBackHome () {
            if (this.isPC) {
                this.$router.replace({ name: 'Layout' })
            } else {
                this.$router.back()
            }
        },
        goBack () {
            this.$router.back()
        }
    }
}
