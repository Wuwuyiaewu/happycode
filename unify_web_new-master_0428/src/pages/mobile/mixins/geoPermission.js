
import { localSet, localGet } from '@/utils/index'
import { mapState } from 'vuex'
const USRGEOPERMISSION = 'userGeoDisableNum'

export default {
    mounted () {
        // this.geoInit()
        if (!this.userRiskInfo.hasOwnProperty('geolocation')) {
            this.$store.dispatch('getGeolocation')
        }
    },
    computed: {
        ...mapState(['userRiskInfo'])
    },
    methods: {
        geoInit () {
            if (this.geoHasAuth()) {
                // 用户已允许
                this.$store.dispatch('getGeolocation')
            } else if (!this.geoHasRefuse()) {
                // 用户未允许的次数小于3
                this.$dialog.confirm({
                    title: '',
                    message: this.$t('geoPermission.requestMsg'),
                    confirmButtonText: this.$t('compLang.be'),
                    cancelButtonText: this.$t('compLang.deny'),
                })
                    .then(() => {
                        this.geoSetPermission()
                        this.$store.dispatch('getGeolocation')
                    })
                    .catch(() => {
                        this.georemovePermission()
                    })
            }
        },
        geoSetPermission () {
            localSet(USRGEOPERMISSION, true)
        },
        georemovePermission () {
            const localNum = localGet(USRGEOPERMISSION)
            if (localNum * 1 >= 3) {
                return
            }
            const num = ['1', '2'].includes(localNum) ? localNum * 1 : 0
            localSet(USRGEOPERMISSION, num + 1)
        },
        geoHasAuth () {
            return localGet(USRGEOPERMISSION) + '' === 'true'
        },
        geoHasRefuse () {
            // 用户拒绝过
            return ['1', '2', '3'].includes(localGet(USRGEOPERMISSION))
        },
        geoLessThanThreeTimes () {
            // 用户的拒绝次数小于三次
            return localGet(USRGEOPERMISSION) !== '3'
        }
    }
}
