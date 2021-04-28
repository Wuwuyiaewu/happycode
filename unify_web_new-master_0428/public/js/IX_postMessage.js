/**
 * postMessage API
 */
var IX_postMessage = (function (window) {
    function IX_postMessage () {
        this.domain = ''
        this.key = ''
        this.inIframe = false
    }

    const iframeParent = window.parent !== window.top ? window.parent : window.top
    /** 初始化调用
     */
    IX_postMessage.prototype.install = function (config) {
        this.domain = config.domain
        this.key = config.key
        iframeParent.postMessage({ type: 'IX_postMessage_install' }, '*')
    }
    /** 页面跳转(所有内嵌页面可用)
     * @param {String} urlPath  /home, /trade
     */
    IX_postMessage.prototype.toPage = function (urlPath) {
        if (!urlPath) return console.error(new Error('IX_postMessage.toPage 方法请传入urlPath'))
        if (urlPath.indexOf('/') !== 0) urlPath = '/' + urlPath
        if (this.inIframe) {
            iframeParent.postMessage({ type: 'toPage', data: urlPath }, '*')
        } else if (this.domain && this.key) {
            location.href = `${this.domain}/${this.key + urlPath}`
        } else {
            console.error(new Error('请先调用install方法'))
        }
    }

    /** 登录接口(只存在开户页面可用)
     * @param {Object} data  {accountNo:**，passWord:**}
     */
    IX_postMessage.prototype.login = function (data) {
        if (!data || !data.accountNo || !data.passWord) return console.error(new Error('IX_postMessage.login 方法请传入{accountNo:**，passWord:**}格式数据'))
        if (!this.inIframe) return
        iframeParent.postMessage({ type: 'autoLogin', data: data }, '*')
    }

    /** 跳转入金页面(首页可用)
     */
    IX_postMessage.prototype.toDeposit = function () {
        if (!this.inIframe) return
        iframeParent.postMessage({ type: 'toPage', data: { name: 'NestAccess', params: { id: 'deposit' } } }, '*')
    }

    var pm = new IX_postMessage()

    window.addEventListener(
        'message',
        function (evt) {
            var data = evt.data || {}
            if (data.type === 'installCallback') {
                pm.inIframe = true
                console.log(evt)
            }
        },
        false
    )

    return pm
})(window)
