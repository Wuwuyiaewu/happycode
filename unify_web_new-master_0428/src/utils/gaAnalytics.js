import loadScript from './loadScript'

function loadGaJs () {
    var _gaq = (window['_gaq'] = _gaq || [])
    const account = dataLayer[1][1]
    _gaq.push(['_setAccount', account])
    _gaq.push(['_trackPageview'])
    ; (function () {
        var ga = document.createElement('script')
        ga.type = 'text/javascript'
        ga.async = true
        ga.src = (document.location.protocol == 'https:' ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'
        var s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(ga, s)
    })()
}

// 内置的GTM统计代码
function defaultGTM () {
    if (window['isPRD']) {
        (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); var f = d.getElementsByTagName(s)[0]; var j = d.createElement(s); var dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f) })(window, document, 'script', 'dataLayer', 'GTM-MZKFTLN')
    } else {
        (function (w, d, s, l, i) { w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); var f = d.getElementsByTagName(s)[0]; var j = d.createElement(s); var dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f) })(window, document, 'script', 'dataLayer', 'GTM-KR8QMMS')
    }
}

// 初始化GA统计代码
export default function (str) {
    // str = `<!-- Global site tag (gtag.js) - Google Analytics -->
    // <script async src="https://www.googletagmanager.com/gtag/js?id=UA-123679424-1"></script>
    // <script>
    //   window.dataLayer = window.dataLayer || [];
    //   function gtag(){dataLayer.push(arguments);}
    //   gtag('js', new Date());
    //   gtag('config', 'UA-123679424-1');
    // </script>`
    if (window['InitedGTM']) return false
    if (process.env.NODE_ENV === 'production') defaultGTM()
    if (!str) return
    window['InitedGTM'] = true
    // 如果是ga代码，需要增加部分全局属性
    if (str.includes('/gtag/js')) {
        window.dataLayer = window.dataLayer || []
        window.gtag = function () {
            window.dataLayer.push(arguments)
        }
    }

    const tag = document.createDocumentFragment()
    tag.innerHTML = str
    document.head.appendChild(tag)
    const div = document.createElement('div')
    div.innerHTML = str
    const nodelist = Array.from(div.children)
    nodelist.forEach(el => {
        if (el.src) {
            loadScript(el.src)
        } else {
            eval(el.innerHTML)
        }
    })
    // loadGaJs()  // 03开户追踪开户来源使用的ga代码
}
