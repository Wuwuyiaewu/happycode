define(function(require, exports, module) {
    var utils = require('utils/utils')
    var queryString = utils.queryToJson()
    var langType = queryString.lang || 'zh-CN'
    var lang = {
        zh:{
            tip:'温馨提示',
            getError:'获取页面配置信息失败，请重试！',
            retry:'重试',
            netError:'网络连接失败，请重试！'
        },
        en:{
            tip:'Tip',
            getError:'Failed to get page config, Please try again.',
            retry:'Retry',
            netError:'Network connection failed, Please try again.'
        },
    }
    module.exports = langType === 'zh-CN'?lang.zh:lang.en
})