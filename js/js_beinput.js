function main(require) {
    var obj = require('./utils')
    console.log(obj.cal(30))
    console.log(obj.name)
}

function utils(module) {
    function calculate(n) {
        return ((n * 100 + 20 - 4)) % 10 + 3
    }

    module.exports = {
        cal: calculate,
        name: 'hello'
    }
}

var m = {}
utils(m)

// 加入底下這幾行
function r() {
    // 回傳我們所需要的 m.exports
    return m.exports
}
main(r)