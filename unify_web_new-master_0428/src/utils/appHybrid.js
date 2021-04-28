// APP打开浏览器
export function openAdUrl (url, $event) {
    if (!url) return
    if (url.indexOf('appOpenBrower=true') >= 0) {
        appOpenBrower(url)
        $event.preventDefault()
        $event.stopPropagation()
        return false
    }
}
export function appOpenBrower (dlUrl) {
    if (!dlUrl) return alert('plase inupt download url')
    try {
        if (window.UIObject && UIObject.appOpenBrower) {
            // 站点的方法
            UIObject.appOpenBrower(dlUrl)
        } else if (window.JsHook && JsHook.appOpenBrower) {
            // 万年历的方法
            JsHook.appOpenBrower(dlUrl)
        } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.appOpenBrower) {
            window.webkit.messageHandlers.appOpenBrower.postMessage({
                url: dlUrl
            })
        } else {
            window.location.href = dlUrl
            // https://m.se6868x.com/common/03-app-h5.html
        }
    } catch (err) {
        console.log('appOpenBrower', err.message)
    }
}
