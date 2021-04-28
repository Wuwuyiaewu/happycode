/**
 * var a= debounce(function(b){console.log('1',b)},400);a('ximing')
 * @param {*} t
 * @param {*} e
 * @param {*} i
 */
export function debounce (t, e, i) {
    var n
    var a
    var o
    var s
    var r
    var l = function () {
        var d = Date.now() - s
        d < e && d >= 0 ? (n = setTimeout(l, e - d)) : ((n = null), i || ((r = t.apply(o, a)), n || (o = a = null)))
    }
    return function () {
        ;(o = this), (a = arguments), (s = Date.now())
        var d = i && !n
        return n || (n = setTimeout(l, e)), d && ((r = t.apply(o, a)), (o = a = null)), r
    }
}
